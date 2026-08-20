import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HarnessManager, HARNESS_PACKAGE } from '../src/harness.ts'

const roots: string[] = []

afterEach(async () => {
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

/** POSIX npm-global layout: `<prefix>/lib/node_modules/@deepseek-ai/dsh`. */
async function fixtureInstallation(version = '0.1.0-rc.6'): Promise<{ prefix: string; installRoot: string; executable: string }> {
  const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-harness-fixture-'))
  roots.push(root)
  const prefix = join(root, 'prefix')
  const installRoot = join(prefix, 'lib', 'node_modules', '@deepseek-ai', 'dsh')
  const executable = join(installRoot, 'lib', 'bin.js')
  await mkdir(join(installRoot, 'lib'), { recursive: true })
  await mkdir(join(prefix, 'bin'), { recursive: true })
  await writeFile(executable, '#!/usr/bin/env node\n', { encoding: 'utf8' })
  await writeFile(join(prefix, 'bin', 'dsh'), '#!/usr/bin/env sh\n', { encoding: 'utf8' })
  await writeFile(join(installRoot, 'package.json'), `${JSON.stringify({ name: HARNESS_PACKAGE, version })}\n`, { encoding: 'utf8' })
  return { prefix, installRoot, executable }
}

function registryStub(channels: Record<string, string> | null, ok = true): typeof fetch {
  return vi.fn(async () => (ok && channels !== null
    ? new Response(JSON.stringify(channels), { status: 200 })
    : new Response('missing', { status: 404 }))) as unknown as typeof fetch
}

describe('harness manager', () => {
  it('resolves a managed npm-global installation and reports the highest dist-tag as the update', async () => {
    const { prefix, installRoot, executable } = await fixtureInstallation()
    const manager = new HarnessManager({ dshBin: executable, fetchImpl: registryStub({ latest: '0.1.0-rc.7', next: '0.1.0-rc.8' }) })
    const status = await manager.status('0.1.0-rc.6')
    expect(status).toMatchObject({
      currentVersion: '0.1.0-rc.6',
      installedVersion: '0.1.0-rc.6',
      latestVersion: '0.1.0-rc.8',
      updateTag: 'next',
      channels: [{ tag: 'latest', version: '0.1.0-rc.7' }, { tag: 'next', version: '0.1.0-rc.8' }],
      updateAvailable: true,
      pendingRestart: false,
      managed: true,
      installRoot,
      prefix,
      executablePath: executable,
    })
  })

  it('flips to pending-restart once the installed package moves ahead of the running host', async () => {
    const { executable } = await fixtureInstallation('0.1.0-rc.7')
    const manager = new HarnessManager({ dshBin: executable, fetchImpl: registryStub({ latest: '0.1.0-rc.7', next: '0.1.0-rc.8' }) })
    const pending = await manager.status('0.1.0-rc.6')
    expect(pending.pendingRestart).toBe(true)
    expect(pending.updateAvailable).toBe(false)
    const current = await manager.status('0.1.0-rc.7')
    expect(current.pendingRestart).toBe(false)
    expect(current.updateAvailable).toBe(true)
    expect(current.latestVersion).toBe('0.1.0-rc.8')
  })

  it('reports up-to-date when no dist-tag exceeds the installed version', async () => {
    const { executable } = await fixtureInstallation('0.1.0-rc.8')
    const manager = new HarnessManager({ dshBin: executable, fetchImpl: registryStub({ latest: '0.1.0-rc.7', next: '0.1.0-rc.8' }) })
    const status = await manager.status('0.1.0-rc.8')
    expect(status.updateAvailable).toBe(false)
    expect(status.updateCheckError).toBeNull()
  })

  it('keeps updateCheckError when the registry lookup fails and does not offer updates', async () => {
    const { executable } = await fixtureInstallation()
    const manager = new HarnessManager({ dshBin: executable, fetchImpl: registryStub(null, false) })
    const status = await manager.status('0.1.0-rc.6')
    expect(status.updateAvailable).toBe(false)
    expect(status.latestVersion).toBeNull()
    expect(status.channels).toEqual([])
    expect(status.updateCheckError).toContain('404')
  })

  it('caches the dist-tags lookup, and a forced refresh bypasses the cache', async () => {
    const { executable } = await fixtureInstallation()
    const fetchImpl = registryStub({ latest: '0.1.0-rc.7', next: '0.1.0-rc.8' })
    const manager = new HarnessManager({ dshBin: executable, fetchImpl })
    await manager.status('0.1.0-rc.6')
    await manager.status('0.1.0-rc.6')
    expect(fetchImpl).toHaveBeenCalledTimes(1)
    await manager.status('0.1.0-rc.6', true)
    expect(fetchImpl).toHaveBeenCalledTimes(2)
  })

  it('marks a non-prefix package tree as unmanaged with a message', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-harness-standalone-'))
    roots.push(root)
    const installRoot = join(root, 'opt', 'node_modules', '@deepseek-ai', 'dsh')
    const executable = join(installRoot, 'lib', 'bin.js')
    await mkdir(join(installRoot, 'lib'), { recursive: true })
    await writeFile(executable, '', { encoding: 'utf8' })
    await writeFile(join(installRoot, 'package.json'), `${JSON.stringify({ name: HARNESS_PACKAGE, version: '0.1.0-rc.6' })}\n`, { encoding: 'utf8' })
    const manager = new HarnessManager({ dshBin: executable, fetchImpl: registryStub({ latest: '0.1.0-rc.7' }) })
    const status = await manager.status('0.1.0-rc.6')
    expect(status.managed).toBe(false)
    expect(status.updateAvailable).toBe(false)
    expect(status.installMessage).toContain('not managed')
  })

  it('reports unresolved when the configured binary cannot be found', async () => {
    const manager = new HarnessManager({ dshBin: '/definitely/missing/dsh-bin', fetchImpl: registryStub({ latest: '0.1.0-rc.7' }) })
    const status = await manager.status('0.1.0-rc.6')
    expect(status.managed).toBe(false)
    expect(status.installMessage).toContain('Cannot resolve')
  })

  it('resolves through the PATH when the binary is a plain name', async () => {
    const { prefix, executable } = await fixtureInstallation()
    await symlink(executable, join(prefix, 'bin', 'dsh-path'))
    const original = process.env.PATH
    process.env.PATH = `${join(prefix, 'bin')}:${original ?? ''}`
    try {
      const manager = new HarnessManager({ dshBin: 'dsh-path', fetchImpl: registryStub({ latest: '0.1.0-rc.7' }) })
      const status = await manager.status('0.1.0-rc.6')
      expect(status.managed).toBe(true)
      expect(status.executablePath).toBe(executable)
    } finally {
      process.env.PATH = original
    }
  })
})
