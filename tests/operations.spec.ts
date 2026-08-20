import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it, vi } from 'vitest'
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
    activationDescriptor: async (packageName: string) => ({ targets: [{ id: 'demo', name: packageName }], configurationTargets: [], configurationOnly: false }),
    activationTargets: async (packageName: string) => [{ id: 'demo', name: packageName }],
    setPluginPaused: async (packageName: string) => [{ id: 'demo', name: packageName }],
  }
}

const passedCanary = async () => ({ status: 'passed', code: 'canary-passed', detail: null } as const)

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
      probeActivation: passedCanary,
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
    expect(plan.warnings).toContain('canary-validation')
    const result: OperationResult = await manager.execute(plan.planId as string)
    expect(result.status).toBe('succeeded')
    expect(result.canary).toBe('passed')
    expect(calls[0]).toEqual([
      'plugin', '--profile', 'test', 'add', '--save-exact', '--ignore-scripts', 'demo-plugin@1.2.0',
    ])
    expect(calls[1]).toEqual(['--profile', 'test', '--dump-config'])
    expect(result.capabilities.busy).toBe(false)
  })

  it('rolls back an installed version when the isolated activation canary fails', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-canary-rollback-'))
    try {
      const originalPackage = '{"dependencies":{}}\n'
      const originalWorkspace = 'packages:\n  - .\n'
      await writeFile(join(root, 'package.json'), originalPackage)
      await writeFile(join(root, 'pnpm-workspace.yaml'), originalWorkspace)
      const profile = profileStub(root)
      const installedRow = {
        packageName: 'demo-plugin', requestedSpec: '1.2.0', version: '1.2.0', description: 'Demo',
        author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
        system: false, directDependency: true, bundle: true, client: false,
        activeAtLaunch: false, activeAfterRestart: true, state: 'pending-install', runtimeEntries: [],
        latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
      }
      profile.list = async () => JSON.parse(await readFile(join(root, 'package.json'), 'utf8')).dependencies?.['demo-plugin'] ? [installedRow] : []
      const calls: string[][] = []
      const manager = new ProfileOperations({
        profile,
        catalog: catalogStub(),
        dshBin: 'dsh',
        probeActivation: async () => ({ status: 'failed', code: 'canary-target-failed', detail: 'entry failed' }),
        runCommand: async args => {
          calls.push([...args])
          if (args[3] === 'add') {
            await writeFile(join(root, 'package.json'), '{"dependencies":{"demo-plugin":"1.2.0"}}\n')
            await writeFile(join(root, 'pnpm-lock.yaml'), [
              "lockfileVersion: '9.0'",
              'importers:',
              '  .:',
              '    dependencies:',
              '      demo-plugin:',
              '        specifier: 1.2.0',
              '        version: 1.2.0',
              'packages:',
              '  demo-plugin@1.2.0:',
              '    resolution: {}',
              '',
            ].join('\n'))
          }
          return { code: 0, unavailable: false, timedOut: false, output: null }
        },
      })
      const plan = await manager.plan({ action: 'install', catalogId: 'acme/demo-plugin' })
      const result = await manager.execute(plan.planId as string)
      expect(result).toMatchObject({
        status: 'failed',
        code: 'canary-target-failed',
        canary: 'failed',
        rollback: 'succeeded',
        detail: 'entry failed',
      })
      expect(await readFile(join(root, 'package.json'), 'utf8')).toBe(originalPackage)
      expect(calls.some(args => args[3] === 'install')).toBe(false)
      expect(calls.at(-1)).toEqual(['--profile', 'test', '--dump-config'])
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('does not overwrite an external profile change made while the canary is running', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-canary-cas-'))
    try {
      await writeFile(join(root, 'package.json'), '{"dependencies":{}}\n')
      await writeFile(join(root, 'pnpm-workspace.yaml'), 'packages:\n  - .\n')
      const profile = profileStub(root)
      const manager = new ProfileOperations({
        profile,
        catalog: catalogStub(),
        dshBin: 'dsh',
        probeActivation: async () => {
          await writeFile(join(root, 'package.json'), '{"dependencies":{"demo-plugin":"1.2.0"},"external":true}\n')
          return { status: 'failed', code: 'canary-target-failed', detail: 'entry failed' }
        },
        runCommand: async args => {
          if (args[3] === 'add') {
            await writeFile(join(root, 'package.json'), '{"dependencies":{"demo-plugin":"1.2.0"}}\n')
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
      expect(result.rollback).toBe('failed')
      expect(await readFile(join(root, 'package.json'), 'utf8')).toContain('"external":true')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('rejects a reviewed update when its installed source changes at the same version', async () => {
    const profile = profileStub()
    let requestedSpec = `github:acme/demo-plugin#${'a'.repeat(40)}`
    profile.list = async () => [{
      packageName: 'demo-plugin', requestedSpec, version: '1.2.0', description: 'Demo',
      author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
      system: false, directDependency: true, bundle: true, client: false,
      activeAtLaunch: true, activeAfterRestart: true, state: 'active', runtimeEntries: [],
      latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
    }]
    const detail = await catalogStub().detail()
    const catalog = {
      findByPackage: () => ({ id: 'acme/demo-plugin' }),
      findByRepository: () => undefined,
      detail: async () => ({
        ...detail,
        artifactKind: 'github',
        installSpec: `github:acme/demo-plugin#${'b'.repeat(40)}`,
        commitSha: 'b'.repeat(40),
      }),
    } as any
    const calls: string[][] = []
    const manager = new ProfileOperations({
      profile,
      catalog,
      dshBin: 'dsh',
      runCommand: async args => {
        calls.push([...args])
        return { code: 0, unavailable: false, timedOut: false, output: null }
      },
    })

    const plan = await manager.plan({ action: 'update', catalogId: 'acme/demo-plugin', packageName: 'demo-plugin' })
    expect(plan.status).toBe('ready')
    requestedSpec = `github:acme/demo-plugin#${'c'.repeat(40)}`

    expect(await manager.execute(plan.planId as string)).toMatchObject({
      status: 'failed',
      code: 'plan-state-changed',
    })
    expect(calls).toEqual([])
  })

  it('does not accept a tested snapshot when the profile changes during a passing canary', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-canary-final-cas-'))
    try {
      await writeFile(join(root, 'package.json'), '{"dependencies":{}}\n')
      await writeFile(join(root, 'pnpm-workspace.yaml'), 'packages:\n  - .\n')
      const profile = profileStub(root)
      const installedRow = {
        packageName: 'demo-plugin', requestedSpec: '1.2.0', version: '1.2.0', description: 'Demo',
        author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
        system: false, directDependency: true, bundle: true, client: false,
        activeAtLaunch: false, activeAfterRestart: true, state: 'pending-install', runtimeEntries: [],
        latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
      }
      profile.list = async () => JSON.parse(await readFile(join(root, 'package.json'), 'utf8')).dependencies?.['demo-plugin'] ? [installedRow] : []
      const manager = new ProfileOperations({
        profile,
        catalog: catalogStub(),
        dshBin: 'dsh',
        probeActivation: async () => {
          await writeFile(join(root, 'package.json'), '{"dependencies":{"demo-plugin":"1.2.0"},"external":true}\n')
          return { status: 'passed', code: 'canary-passed', detail: null }
        },
        runCommand: async args => {
          if (args[3] === 'add') await writeFile(join(root, 'package.json'), '{"dependencies":{"demo-plugin":"1.2.0"}}\n')
          return { code: 0, unavailable: false, timedOut: false, output: null }
        },
      })
      const plan = await manager.plan({ action: 'install', catalogId: 'acme/demo-plugin' })
      const result = await manager.execute(plan.planId as string)
      expect(result).toMatchObject({ status: 'failed', code: 'profile-changed-during-canary', activation: 'unknown', rollback: 'failed' })
      expect(await readFile(join(root, 'package.json'), 'utf8')).toContain('"external":true')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
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
        runCommand: async () => ({ code: 1, unavailable: false, timedOut: false, output: '[ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION] minimum release age policy' }),
      })
      const plan = await manager.plan({ action: 'install', catalogId: 'acme/demo-plugin' })
      const result = await manager.execute(plan.planId as string)
      expect(result).toMatchObject({ status: 'failed', code: 'dsh-command-failed', rollback: 'not-needed' })
      expect(await readFile(join(root, 'node_modules', 'keep.txt'), 'utf8')).toBe('keep\n')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('repairs a partially changed dependency tree even when metadata did not change', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-partial-tree-'))
    try {
      await writeFile(join(root, 'package.json'), '{"dependencies":{}}\n')
      await writeFile(join(root, 'pnpm-workspace.yaml'), 'packages:\n  - .\n')
      const profile = profileStub(root)
      const calls: string[][] = []
      const partial = join(root, 'node_modules', 'demo-plugin')
      const manager = new ProfileOperations({
        profile,
        catalog: catalogStub(),
        dshBin: 'dsh',
        runCommand: async args => {
          calls.push([...args])
          if (args[3] === 'add') {
            await mkdir(partial, { recursive: true })
            await writeFile(join(partial, 'partial.txt'), 'partial')
            return { code: 1, unavailable: false, timedOut: false, output: 'generic package extraction failure' }
          }
          if (args[3] === 'install') {
            await rm(partial, { recursive: true, force: true })
            profile.list = async () => []
          }
          return { code: 0, unavailable: false, timedOut: false, output: null }
        },
      })
      const plan = await manager.plan({ action: 'install', catalogId: 'acme/demo-plugin' })
      const result = await manager.execute(plan.planId as string)
      expect(result).toMatchObject({ status: 'failed', code: 'dsh-command-failed', rollback: 'succeeded' })
      await expect(access(join(partial, 'partial.txt'))).rejects.toMatchObject({ code: 'ENOENT' })
      expect(calls.some(args => args[3] === 'install')).toBe(false)
      expect(calls.at(-1)).toEqual(['--profile', 'test', '--dump-config'])
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
      probeActivation: passedCanary,
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
      const installedRow = {
        packageName: 'demo-plugin', requestedSpec: '1.2.0', version: '1.2.0', description: 'Demo',
        author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
        system: false, directDependency: true, bundle: true, client: false,
        activeAtLaunch: false, activeAfterRestart: true, state: 'pending-install', runtimeEntries: [],
        latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
      }
      profile.list = async () => JSON.parse(await readFile(join(root, 'package.json'), 'utf8')).dependencies?.['demo-plugin'] ? [installedRow] : []
      const calls: string[][] = []
      const manager = new ProfileOperations({
        profile,
        catalog: catalogStub('sha512-expected'),
        dshBin: 'dsh',
        runCommand: async (args) => {
          calls.push([...args])
          if (args[3] === 'add') {
            await writeFile(join(root, 'package.json'), '{"dependencies":{"demo-plugin":"1.2.0"}}\n')
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
          }
          return { code: 0, unavailable: false, timedOut: false, output: null }
        },
      })
      const plan = await manager.plan({ action: 'install', catalogId: 'acme/demo-plugin' })
      const result = await manager.execute(plan.planId as string)
      expect(result.code).toBe('post-install-validation-failed')
      expect(result.rollback).toBe('succeeded')
      expect(calls.at(-1)).toEqual(['--profile', 'test', '--dump-config'])
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
        probeActivation: passedCanary,
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
    const removedPauseTargets: { id: string; name: string }[][] = []
    profile.removePluginPauseOverrides = async (targets: readonly { id: string; name: string }[]) => {
      removedPauseTargets.push([...targets])
    }
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
    expect(removedPauseTargets).toEqual([[{ id: 'demo', name: 'demo-plugin' }]])
    expect(calls[0]).toEqual(['plugin', '--profile', 'test', 'remove', 'demo-plugin'])
    expect(calls[1]).toEqual(['--profile', 'test', '--dump-config'])
  })

  it('removes a stale bundle layer when an older dsh command leaves it behind', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-remove-bundle-'))
    try {
      const manifest = {
        name: 'test-profile',
        dependencies: { 'demo-plugin': '1.0.0' },
        dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', 'demo-plugin', 'keep-plugin', 'demo-plugin'] } },
        custom: { preserved: true },
      }
      await writeFile(join(root, 'package.json'), `${JSON.stringify(manifest)}\n`)
      await writeFile(join(root, 'pnpm-workspace.yaml'), [
        'packages:',
        '  - .',
        'minimumReleaseAgeExclude:',
        '  - demo-plugin@0.9.0',
        '  - demo-plugin@1.0.0',
        '  - demo-plugin@1.0.0',
        '  - keep-plugin@1.0.0',
        '',
      ].join('\n'))
      const active = {
        packageName: 'demo-plugin', requestedSpec: '1.0.0', version: '1.0.0', description: 'Demo',
        author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
        system: false, directDependency: true, bundle: true,
        client: false, activeAtLaunch: true, activeAfterRestart: true, state: 'active', runtimeEntries: [],
        latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
      } as const
      const profile = profileStub(root)
      profile.list = async () => {
        const current = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')) as typeof manifest
        return current.dependencies?.['demo-plugin'] === undefined ? [] : [active]
      }
      const calls: string[][] = []
      const manager = new ProfileOperations({
        profile,
        catalog: catalogStub(),
        dshBin: 'dsh',
        runCommand: async args => {
          calls.push([...args])
          if (args[3] === 'remove') {
            await writeFile(join(root, 'package.json'), JSON.stringify({ ...manifest, dependencies: {} }) + '\n')
            await writeFile(join(root, 'pnpm-workspace.yaml'), [
              'packages:',
              '  - .',
              'minimumReleaseAgeExclude:',
              '  - demo-plugin@0.9.0',
              '  - demo-plugin@1.0.0',
              '  - demo-plugin@1.0.0',
              '  - demo-plugin@1.1.0',
              '  - keep-plugin@1.0.0',
              '',
            ].join('\n'))
          }
          return { code: 0, unavailable: false, timedOut: false, output: null }
        },
      })
      const plan = await manager.plan({ action: 'remove', packageName: 'demo-plugin' })
      const result = await manager.execute(plan.planId as string)
      expect(result).toMatchObject({ status: 'succeeded', code: 'succeeded' })
      const after = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')) as typeof manifest
      expect(after.dependencies).toEqual({})
      expect(after.dsh.profile.bundles).toEqual(['@deepseek-ai/dsh-base', 'keep-plugin'])
      expect(after.custom).toEqual({ preserved: true })
      const workspace = await readFile(join(root, 'pnpm-workspace.yaml'), 'utf8')
      expect(workspace).toContain('keep-plugin@1.0.0')
      expect(workspace).toContain('demo-plugin@0.9.0')
      expect(workspace.match(/demo-plugin@1\.0\.0/g)).toHaveLength(2)
      expect(workspace).not.toContain('demo-plugin@1.1.0')
      expect(calls).toEqual([
        ['plugin', '--profile', 'test', 'remove', 'demo-plugin'],
        ['--profile', 'test', '--dump-config'],
      ])
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('preserves an existing unversioned release-age exception while removing a newly added duplicate', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-remove-policy-'))
    try {
      const manifest = {
        name: 'test-profile',
        dependencies: { 'demo-plugin': 'file:../demo.tgz' },
        dsh: { profile: { bundles: ['demo-plugin'] } },
      }
      await writeFile(join(root, 'package.json'), `${JSON.stringify(manifest)}\n`)
      await writeFile(join(root, 'pnpm-workspace.yaml'), [
        'packages:',
        '  - .',
        'minimumReleaseAgeExclude:',
        '  - demo-plugin',
        '  - keep-plugin@1.0.0',
        '',
      ].join('\n'))
      const active = {
        packageName: 'demo-plugin', requestedSpec: 'file:../demo.tgz', version: null, description: 'Demo',
        author: null, license: 'MIT', homepage: null, repositoryUrl: null,
        system: false, directDependency: true, bundle: true,
        client: false, activeAtLaunch: true, activeAfterRestart: true, state: 'active', runtimeEntries: [],
        latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: null,
      } as const
      const profile = profileStub(root)
      profile.list = async () => {
        const current = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')) as typeof manifest
        return current.dependencies?.['demo-plugin'] === undefined ? [] : [active]
      }
      const manager = new ProfileOperations({
        profile,
        catalog: catalogStub(),
        dshBin: 'dsh',
        runCommand: async args => {
          if (args[3] === 'remove') {
            await writeFile(join(root, 'package.json'), `${JSON.stringify({ ...manifest, dependencies: {} })}\n`)
            await writeFile(join(root, 'pnpm-workspace.yaml'), [
              'packages:',
              '  - .',
              'minimumReleaseAgeExclude:',
              '  - demo-plugin',
              '  - demo-plugin',
              '  - keep-plugin@1.0.0',
              '',
            ].join('\n'))
          }
          return { code: 0, unavailable: false, timedOut: false, output: null }
        },
      })
      const plan = await manager.plan({ action: 'remove', packageName: 'demo-plugin' })
      const result = await manager.execute(plan.planId as string)
      expect(result).toMatchObject({ status: 'succeeded', code: 'succeeded' })
      const workspace = await readFile(join(root, 'pnpm-workspace.yaml'), 'utf8')
      expect(workspace).toContain('keep-plugin@1.0.0')
      expect(workspace.match(/demo-plugin/g)).toHaveLength(1)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('restores the removed dependency and bundle when post-remove composition fails', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-remove-rollback-'))
    try {
      const original = `${JSON.stringify({
        name: 'test-profile',
        dependencies: { 'demo-plugin': '1.0.0' },
        dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', 'demo-plugin'] } },
      })}\n`
      await writeFile(join(root, 'package.json'), original)
      const active = {
        packageName: 'demo-plugin', requestedSpec: '1.0.0', version: '1.0.0', description: 'Demo',
        author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
        system: false, directDependency: true, bundle: true,
        client: false, activeAtLaunch: true, activeAfterRestart: true, state: 'active', runtimeEntries: [],
        latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
      } as const
      const profile = profileStub(root)
      profile.list = async () => {
        const current = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')) as { dependencies?: Record<string, string> }
        return current.dependencies?.['demo-plugin'] === undefined ? [] : [active]
      }
      let compositionAttempts = 0
      const manager = new ProfileOperations({
        profile,
        catalog: catalogStub(),
        dshBin: 'dsh',
        probeActivation: passedCanary,
        runCommand: async args => {
          if (args[3] === 'remove') {
            await writeFile(join(root, 'package.json'), JSON.stringify({
              name: 'test-profile', dependencies: {}, dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', 'demo-plugin'] } },
            }) + '\n')
            return { code: 0, unavailable: false, timedOut: false, output: null }
          }
          if (args[2] === '--dump-config' && compositionAttempts++ === 0) {
            return { code: 1, unavailable: false, timedOut: false, output: 'stale bundle composition failed' }
          }
          return { code: 0, unavailable: false, timedOut: false, output: null }
        },
      })
      const plan = await manager.plan({ action: 'remove', packageName: 'demo-plugin' })
      const result = await manager.execute(plan.planId as string)
      expect(result).toMatchObject({ status: 'failed', code: 'composition-validation-failed', rollback: 'succeeded' })
      expect(await readFile(join(root, 'package.json'), 'utf8')).toBe(original)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('rolls back when the stale bundle manifest cannot be repaired safely', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-remove-repair-'))
    try {
      const original = `${JSON.stringify({
        name: 'test-profile',
        dependencies: { 'demo-plugin': '1.0.0' },
        dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', 'demo-plugin'] } },
      })}\n`
      await writeFile(join(root, 'package.json'), original)
      const active = {
        packageName: 'demo-plugin', requestedSpec: '1.0.0', version: '1.0.0', description: 'Demo',
        author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
        system: false, directDependency: true, bundle: true,
        client: false, activeAtLaunch: true, activeAfterRestart: true, state: 'active', runtimeEntries: [],
        latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
      } as const
      const profile = profileStub(root)
      profile.list = async () => {
        const current = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')) as { dependencies?: Record<string, string> }
        return current.dependencies?.['demo-plugin'] === undefined ? [] : [active]
      }
      const manager = new ProfileOperations({
        profile,
        catalog: catalogStub(),
        dshBin: 'dsh',
        probeActivation: passedCanary,
        runCommand: async args => {
          if (args[3] === 'remove') {
            await writeFile(join(root, 'package.json'), JSON.stringify({
              name: 'test-profile', dependencies: {}, dsh: { profile: { bundles: 'demo-plugin' } },
            }) + '\n')
          }
          return { code: 0, unavailable: false, timedOut: false, output: null }
        },
      })
      const plan = await manager.plan({ action: 'remove', packageName: 'demo-plugin' })
      const result = await manager.execute(plan.planId as string)
      expect(result).toMatchObject({ status: 'failed', code: 'profile-manifest-repair-failed', rollback: 'succeeded' })
      expect(await readFile(join(root, 'package.json'), 'utf8')).toBe(original)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
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

  it('rejects an update while the previous profile change awaits restart', async () => {
    const profile = profileStub()
    profile.list = async () => [{
      packageName: 'demo-plugin', requestedSpec: '1.0.0', version: '1.0.0', description: 'Demo',
      author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
      system: false, directDependency: true, bundle: true, client: false,
      activeAtLaunch: true, activeAfterRestart: true, state: 'pending-update', runtimeEntries: [],
      latestVersion: '1.2.0', updateAvailable: true, updateCheckError: null, catalogId: 'acme/demo-plugin',
    }]
    const manager = new ProfileOperations({ profile, catalog: catalogStub(), dshBin: 'dsh' })
    const plan = await manager.plan({ action: 'update', catalogId: 'acme/demo-plugin', packageName: 'demo-plugin' })
    expect(plan).toMatchObject({ status: 'blocked', blockReason: 'restart-required-before-next-change' })
  })

  it('rejects a pause plan when its same-version source changes before execution', async () => {
    const profile = profileStub()
    let requestedSpec = `github:acme/demo-plugin#${'a'.repeat(40)}`
    profile.list = async () => [{
      packageName: 'demo-plugin', requestedSpec, version: '1.2.0', description: 'Demo',
      author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
      system: false, directDependency: true, bundle: true, client: false,
      activeAtLaunch: true, activeAfterRestart: true, state: 'active', runtimeEntries: [{ entryId: 'demo', enabled: true, phase: 'active' }],
      latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
    }]
    const setPluginPaused = vi.fn(async () => [{ id: 'demo', name: 'demo-plugin' }])
    profile.setPluginPaused = setPluginPaused
    const manager = new ProfileOperations({ profile, catalog: catalogStub(), dshBin: 'dsh' })
    const plan = await manager.plan({ action: 'pause', packageName: 'demo-plugin' })
    requestedSpec = `github:acme/demo-plugin#${'b'.repeat(40)}`
    expect(await manager.execute(plan.planId as string)).toMatchObject({ status: 'failed', code: 'plan-state-changed' })
    expect(setPluginPaused).not.toHaveBeenCalled()
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

  it('restores a pause patch when composition validation throws', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-pause-throw-'))
    try {
      await writeFile(join(root, 'package.json'), '{"dependencies":{"demo-plugin":"1.0.0"}}\n')
      await writeFile(join(root, 'pnpm-workspace.yaml'), 'packages:\n  - .\n')
      await writeFile(join(root, 'cordis.patch.yml'), '[]\n')
      const profile = profileStub(root)
      profile.list = async () => [{
        packageName: 'demo-plugin', requestedSpec: '1.0.0', version: '1.0.0', description: 'Demo',
        author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo-plugin',
        system: false, directDependency: true, bundle: true, client: false,
        activeAtLaunch: true, activeAfterRestart: true, state: 'active',
        runtimeEntries: [{ entryId: 'demo', enabled: true, phase: 'active' }],
        latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo-plugin',
      }]
      profile.setPluginPaused = async () => {
        await writeFile(join(root, 'cordis.patch.yml'), '- id: demo\n  name: demo-plugin\n  disabled: true\n')
        return [{ id: 'demo', name: 'demo-plugin' }]
      }
      const manager = new ProfileOperations({
        profile,
        catalog: catalogStub(),
        dshBin: 'dsh',
        runCommand: async () => { throw new Error('validation command crashed') },
      })
      const plan = await manager.plan({ action: 'pause', packageName: 'demo-plugin' })
      const result = await manager.execute(plan.planId as string)
      expect(result).toMatchObject({ status: 'failed', code: 'composition-validation-failed' })
      expect(await readFile(join(root, 'cordis.patch.yml'), 'utf8')).toBe('[]\n')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
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
