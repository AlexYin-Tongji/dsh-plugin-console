import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
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
    capabilities: async () => ({ profileName: 'test', profileWritable: true, dshAvailable: true, pnpmAvailable: true, busy, message: null }),
    list: async () => [],
    setPluginPaused: async (packageName: string) => [{ id: 'demo', name: packageName }],
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

  it('does not erase node_modules when pnpm rejects before metadata changes', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-policy-failure-'))
    try {
      await writeFile(join(root, 'package.json'), '{"dependencies":{}}\n')
      await writeFile(join(root, 'pnpm-workspace.yaml'), 'packages:\n  - .\n')
      await mkdir(join(root, 'node_modules'), { recursive: true })
      await writeFile(join(root, 'node_modules', 'keep.txt'), 'keep\n')
      const profile = profileStub(root)
      const manager = new ProfileOperations({
        profile,
        catalog: catalogStub(),
        dshBin: 'dsh',
        runCommand: async () => ({ code: 1, unavailable: false, timedOut: false, output: 'minimum release age policy' }),
      })
      const plan = await manager.plan({ action: 'install', catalogId: 'acme/demo-plugin' })
      const result = await manager.execute(plan.planId as string)
      expect(result).toMatchObject({ status: 'failed', code: 'dsh-command-failed', rollback: 'not-needed' })
      expect(await readFile(join(root, 'node_modules', 'keep.txt'), 'utf8')).toBe('keep\n')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
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

  it('rejects a stale lockfile snapshot not selected by the root importer', async () => {
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
              'importers:',
              '  .:',
              '    dependencies:',
              '      demo-plugin:',
              '        specifier: 9.9.9',
              '        version: 9.9.9',
              'packages:',
              '  demo-plugin@1.2.0:',
              '    resolution: {integrity: sha512-expected}',
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

  it('validates integrity through the root importer with a peer-suffixed resolution', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-integrity-success-'))
    try {
      await writeFile(join(root, 'package.json'), '{"dependencies":{}}\n')
      await writeFile(join(root, 'pnpm-workspace.yaml'), 'packages:\n  - .\n')
      const profile = profileStub(root)
      const manager = new ProfileOperations({
        profile,
        catalog: catalogStub('sha512-expected'),
        dshBin: 'dsh',
        runCommand: async args => {
          if (args[3] === 'add') {
            await writeFile(join(root, 'pnpm-lock.yaml'), [
              "lockfileVersion: '9.0'",
              'importers:',
              '  .:',
              '    dependencies:',
              '      demo-plugin:',
              '        specifier: 1.2.0',
              '        version: 1.2.0(react@18.3.1)',
              'packages:',
              '  demo-plugin@1.2.0:',
              '    resolution: {integrity: sha512-expected}',
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
      expect((await manager.execute(plan.planId as string)).status).toBe('succeeded')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('accepts a successful removal that remains visible until restart', async () => {
    const profile = profileStub()
    const calls: string[][] = []
    let removed = false
    const active = {
      packageName: 'demo-plugin', requestedSpec: '1.0.0', version: '1.0.0', description: 'Demo',
      author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
      system: false, directDependency: true, bundle: true, client: false,
      activeAtLaunch: true, activeAfterRestart: true, state: 'active', runtimeEntries: [],
      latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
    } as const
    profile.list = async () => removed
      ? [{ ...active, requestedSpec: null, directDependency: false, system: true, activeAfterRestart: false, state: 'pending-removal' }]
      : [active]
    const manager = new ProfileOperations({
      profile,
      catalog: catalogStub(),
      dshBin: 'dsh',
      runCommand: async args => {
        calls.push([...args])
        if (args[3] === 'remove') removed = true
        return { code: 0, unavailable: false, timedOut: false, output: null }
      },
    })
    const plan = await manager.plan({ action: 'remove', packageName: 'demo-plugin' })
    const result = await manager.execute(plan.planId as string)
    expect(result.status).toBe('succeeded')
    expect(calls[0]).toEqual(['plugin', '--profile', 'test', 'remove', 'demo-plugin'])
    expect(calls[1]).toEqual(['--profile', 'test', '--dump-config'])
  })

  it('allows removing a pending install before restart', async () => {
    const profile = profileStub()
    let removed = false
    profile.list = async () => removed ? [] : [{
      packageName: 'demo-plugin', requestedSpec: '1.0.0', version: '1.0.0', description: 'Demo',
      author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
      system: false, directDependency: true, bundle: true, client: false,
      activeAtLaunch: false, activeAfterRestart: true, state: 'pending-install', runtimeEntries: [],
      latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
    }]
    const manager = new ProfileOperations({
      profile,
      catalog: catalogStub(),
      dshBin: 'dsh',
      runCommand: async args => {
        if (args[3] === 'remove') removed = true
        return { code: 0, unavailable: false, timedOut: false, output: null }
      },
    })
    const plan = await manager.plan({ action: 'remove', packageName: 'demo-plugin' })
    expect(plan.status).toBe('ready')
    expect((await manager.execute(plan.planId as string)).status).toBe('succeeded')
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

  it('fails and rolls back when the composed pause target does not match', async () => {
    const profile = profileStub()
    let paused = false
    profile.list = async () => [{
      packageName: 'demo-plugin', requestedSpec: '1.0.0', version: '1.0.0', description: 'Demo',
      author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
      system: false, directDependency: true, bundle: true, client: true,
      activeAtLaunch: true, activeAfterRestart: true, state: paused ? 'paused' : 'active',
      runtimeEntries: [{ entryId: 'demo', enabled: !paused, phase: paused ? null : 'active' }],
      latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
    }]
    profile.setPluginPaused = async (packageName: string, value: boolean) => {
      paused = value
      return [{ id: 'demo', name: packageName }]
    }
    const manager = new ProfileOperations({
      profile,
      catalog: catalogStub(),
      dshBin: 'dsh',
      runCommand: async () => ({
        code: 0,
        unavailable: false,
        timedOut: false,
        output: '- id: other\n  name: demo-plugin\n  disabled: true\n',
      }),
    })
    const plan = await manager.plan({ action: 'pause', packageName: 'demo-plugin' })
    expect(await manager.execute(plan.planId as string)).toMatchObject({
      status: 'failed',
      code: 'activation-validation-failed',
      rollback: 'succeeded',
    })
  })

  it('pauses and resumes Loader entries without invoking the package manager', async () => {
    const profile = profileStub()
    let paused = false
    const calls: string[][] = []
    profile.list = async () => [{
      packageName: 'demo-plugin', requestedSpec: '1.0.0', version: '1.0.0', description: 'Demo',
      author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
      system: false, directDependency: true, bundle: true, client: true,
      activeAtLaunch: true, activeAfterRestart: true, state: paused ? 'paused' : 'active',
      runtimeEntries: [{ entryId: 'demo', enabled: !paused, phase: paused ? null : 'active' }],
      latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
    }]
    profile.setPluginPaused = async (packageName: string, value: boolean) => {
      paused = value
      return [{ id: 'demo', name: packageName }]
    }
    const manager = new ProfileOperations({
      profile,
      catalog: catalogStub(),
      dshBin: 'dsh',
      runCommand: async args => {
        calls.push([...args])
        return {
          code: 0,
          unavailable: false,
          timedOut: false,
          output: `- id: demo\n  name: demo-plugin\n  disabled: ${String(paused)}\n`,
        }
      },
    })

    const pausePlan = await manager.plan({ action: 'pause', packageName: 'demo-plugin' })
    expect(pausePlan).toMatchObject({ status: 'ready', action: 'pause', warnings: ['restart-required'] })
    expect((await manager.execute(pausePlan.planId as string))).toMatchObject({ status: 'succeeded', action: 'pause' })
    expect(paused).toBe(true)

    const resumePlan = await manager.plan({ action: 'resume', packageName: 'demo-plugin' })
    expect(resumePlan).toMatchObject({ status: 'ready', action: 'resume' })
    expect((await manager.execute(resumePlan.planId as string))).toMatchObject({ status: 'succeeded', action: 'resume' })
    expect(paused).toBe(false)
    expect(calls).toEqual([
      ['--profile', 'test', '--dump-config'],
      ['--profile', 'test', '--dump-config'],
    ])
  })
})
