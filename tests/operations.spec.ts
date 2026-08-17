import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import { ProfileOperations } from '../src/operations.ts'
import type { OperationResult } from '../src/types.ts'

function profileStub(dir = '/tmp/test-profile'): any {
  let busy = false
  return {
    runtime: { profileName: 'test', dir, launchDependencies: {}, launchBundles: [] },
    get isBusy() { return busy },
    setBusy(value: boolean) { busy = value },
    fingerprint: () => 'stable',
    capabilities: async () => ({ profileName: 'test', profileWritable: true, dshAvailable: true, busy, message: null }),
    list: async () => [],
  }
}

function catalogStub(integrity: string | null = null): any {
  return {
    findByPackage: () => 'acme/demo-plugin',
    detail: async () => ({
      id: 'acme/demo-plugin', name: 'Demo', owner: 'acme', repositoryUrl: 'https://github.com/acme/demo-plugin',
      pageUrl: null, category: 'tools', description: { zh: '演示', en: 'Demo' }, packageName: 'demo-plugin', stars: 1,
      addedAt: null, artifactKind: 'npm', verification: 'verified', verificationMessage: null,
      installSpec: 'demo-plugin@1.2.0', commitSha: null, integrity,
      manifest: {
        packageName: 'demo-plugin', version: '1.2.0', description: 'Demo', author: null, license: 'MIT',
        homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin', bundle: true, client: false,
        lifecycleScripts: [], deprecated: null,
      }, readme: null, readmeSource: null, warnings: [],
    }),
  }
}

describe('profile operations', () => {
  it('creates a short-lived plan and forwards only allowlisted official CLI args', async () => {
    const calls: string[][] = []
    const profile = profileStub()
    const manager = new ProfileOperations({
      profile,
      catalog: catalogStub(),
      dshBin: 'dsh',
      runCommand: async (args) => {
        calls.push([...args])
        profile.list = async () => [{
          packageName: 'demo-plugin', requestedSpec: '1.2.0', version: '1.2.0', description: 'Demo',
          author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
          system: false, directDependency: true, bundle: true, client: false,
          activeAtLaunch: false, activeAfterRestart: true, state: 'pending-install', runtimeEntries: [],
          latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
        }]
        return { code: 0, unavailable: false, timedOut: false, output: 'ok' }
      },
    })
    const plan = await manager.plan({ action: 'install', catalogId: 'acme/demo-plugin' })
    expect(plan.status).toBe('ready')
    expect(plan.sourceSpec).toBe('demo-plugin@1.2.0')
    expect(plan.warnings).toContain('trusted-code')
    const result: OperationResult = await manager.execute(plan.planId as string)
    expect(result.status).toBe('succeeded')
    expect(calls[0]).toEqual([
      'plugin', '--profile', 'test', 'add', '--save-exact', '--ignore-scripts', 'demo-plugin@1.2.0',
    ])
    expect(calls[1]).toEqual(['--profile', 'test', '--dump-config'])
    expect(result.capabilities.busy).toBe(false)
  })

  it('admits only one concurrent execution before the first await', async () => {
    const profile = profileStub()
    const calls: string[][] = []
    let release!: () => void
    const gate = new Promise<void>(resolve => { release = resolve })
    const manager = new ProfileOperations({
      profile,
      catalog: catalogStub(),
      dshBin: 'dsh',
      runCommand: async (args) => {
        calls.push([...args])
        if (args[3] === 'add') {
          await gate
          profile.list = async () => [{
            packageName: 'demo-plugin', requestedSpec: '1.2.0', version: '1.2.0', description: 'Demo',
            author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
            system: false, directDependency: true, bundle: true, client: false,
            activeAtLaunch: false, activeAfterRestart: true, state: 'pending-install', runtimeEntries: [],
            latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
          }]
        }
        return { code: 0, unavailable: false, timedOut: false, output: null }
      },
    })
    const firstPlan = await manager.plan({ action: 'install', catalogId: 'acme/demo-plugin' })
    const secondPlan = await manager.plan({ action: 'install', catalogId: 'acme/demo-plugin' })
    const first = manager.execute(firstPlan.planId as string)
    const second = await manager.execute(secondPlan.planId as string)
    expect(second.code).toBe('operation-busy')
    release()
    expect((await first).status).toBe('succeeded')
    expect(calls.filter(args => args[3] === 'add')).toHaveLength(1)
  })

  it('blocks equal versions and downgrades', async () => {
    const profile = profileStub()
    profile.list = async () => [{
      packageName: 'demo-plugin', requestedSpec: '2.0.0', version: '2.0.0', description: 'Demo',
      author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
      system: false, directDependency: true, bundle: true, client: false,
      activeAtLaunch: true, activeAfterRestart: true, state: 'active', runtimeEntries: [],
      latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
    }]
    const manager = new ProfileOperations({ profile, catalog: catalogStub(), dshBin: 'dsh' })
    const plan = await manager.plan({ action: 'update', catalogId: 'acme/demo-plugin', packageName: 'demo-plugin' })
    expect(plan.status).toBe('blocked')
    expect(plan.blockReason).toBe('already-up-to-date')
  })

  it('allows a GitHub commit update even when the package version is unchanged', async () => {
    const profile = profileStub()
    profile.list = async () => [{
      packageName: 'demo-plugin', requestedSpec: `github:acme/demo-plugin#${'a'.repeat(40)}`, version: '1.2.0', description: 'Demo',
      author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
      system: false, directDependency: true, bundle: true, client: false,
      activeAtLaunch: true, activeAfterRestart: true, state: 'active', runtimeEntries: [],
      latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
    }]
    const npmDetail = await catalogStub().detail()
    const catalog = {
      findByPackage: () => ({ id: 'acme/demo-plugin' }),
      detail: async () => ({
        ...npmDetail,
        artifactKind: 'github',
        installSpec: `github:acme/demo-plugin#${'b'.repeat(40)}`,
        commitSha: 'b'.repeat(40),
      }),
    } as any
    const manager = new ProfileOperations({ profile, catalog, dshBin: 'dsh' })
    const plan = await manager.plan({ action: 'update', catalogId: 'acme/demo-plugin', packageName: 'demo-plugin' })
    expect(plan.status).toBe('ready')
    expect(plan.sourceSpec).toBe(`github:acme/demo-plugin#${'b'.repeat(40)}`)
  })

  it('rejects a lockfile integrity mismatch and performs frozen clean repair', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-operation-'))
    try {
      await writeFile(join(root, 'package.json'), '{"dependencies":{}}\n')
      await writeFile(join(root, 'pnpm-lock.yaml'), "lockfileVersion: '9.0'\npackages: {}\n")
      await writeFile(join(root, 'pnpm-workspace.yaml'), 'packages:\n  - .\n')
      const profile = profileStub(root)
      const calls: string[][] = []
      const manager = new ProfileOperations({
        profile,
        catalog: catalogStub('sha512-expected'),
        dshBin: 'dsh',
        runCommand: async (args) => {
          calls.push([...args])
          if (args[3] === 'add') {
            await writeFile(join(root, 'pnpm-lock.yaml'), [
              "lockfileVersion: '9.0'",
              'packages:',
              '  demo-plugin@1.2.0:',
              '    resolution: {integrity: sha512-different}',
              '',
            ].join('\n'))
            profile.list = async () => [{
              packageName: 'demo-plugin', requestedSpec: '1.2.0', version: '1.2.0', description: 'Demo',
              author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
              system: false, directDependency: true, bundle: true, client: false,
              activeAtLaunch: false, activeAfterRestart: true, state: 'pending-install', runtimeEntries: [],
              latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
            }]
          }
          return { code: 0, unavailable: false, timedOut: false, output: null }
        },
      })
      const plan = await manager.plan({ action: 'install', catalogId: 'acme/demo-plugin' })
      const result = await manager.execute(plan.planId as string)
      expect(result.code).toBe('post-install-validation-failed')
      expect(result.rollback).toBe('succeeded')
      expect(calls.at(-1)).toEqual([
        'plugin', '--profile', 'test', 'install', '--frozen-lockfile', '--ignore-scripts',
      ])
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('blocks removal of a non-direct system row', async () => {
    const profile = profileStub()
    profile.list = async () => [{
      packageName: '@deepseek-ai/dsh-base', requestedSpec: null, version: '1.0.0', description: null,
      author: null, license: null, homepage: null, repositoryUrl: null, system: true, directDependency: false,
      bundle: true, client: false, activeAtLaunch: true, activeAfterRestart: true, state: 'active',
      runtimeEntries: [], latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: null,
    }]
    const manager = new ProfileOperations({ profile, catalog: catalogStub(), dshBin: 'dsh' })
    const plan = await manager.plan({ action: 'remove', packageName: '@deepseek-ai/dsh-base' })
    expect(plan.status).toBe('blocked')
    expect(plan.blockReason).toBe('system-package-protected')
  })
})
