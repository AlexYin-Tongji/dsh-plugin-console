import { describe, expect, it } from 'vitest'
import { HarnessOperations } from '../src/harness-operations.ts'
import type { HarnessStatus, HarnessUpdateResult } from '../src/types.ts'

const CURRENT = '0.1.0-rc.6'
const TARGET = '0.1.0-rc.7'
const INSTALL_ROOT = '/prefix/lib/node_modules/@deepseek-ai/dsh'
const PREFIX = '/prefix'
const EXECUTABLE = '/prefix/bin/dsh'

function profileStub(): any {
  let busy = false
  return {
    runtime: { profileName: 'web', dir: '/tmp/test-profile' },
    get isBusy() { return busy },
    setBusy(value: boolean) { busy = value },
    fingerprint: () => 'stable',
    list: async () => [],
    capabilities: async () => ({ profileName: 'web', profileWritable: true, dshAvailable: true, pnpmAvailable: true, busy, message: null }),
  }
}

function harnessStub(options: { version?: string; managed?: boolean; latest?: string | null } = {}): any {
  const state = {
    version: options.version ?? CURRENT,
    managed: options.managed ?? true,
    latest: options.latest === undefined ? TARGET : options.latest,
  }
  const status = (running: string | null): HarnessStatus => ({
    currentVersion: running,
    installedVersion: state.version,
    latestVersion: state.latest,
    updateTag: 'latest',
    channels: [{ tag: 'latest', version: state.latest ?? '' }],
    updateAvailable: state.managed
      && state.latest !== null
      && state.version === running
      && state.version !== state.latest
      && running !== null,
    pendingRestart: state.version !== running && running !== null,
    managed: state.managed,
    packageName: '@deepseek-ai/dsh',
    installRoot: INSTALL_ROOT,
    prefix: PREFIX,
    executablePath: EXECUTABLE,
    installMessage: state.managed ? null : 'not managed by npm global',
    updateCheckError: null,
  })
  return {
    resolve: async () => ({
      status: state.managed ? 'managed' : 'unmanaged',
      installRoot: INSTALL_ROOT,
      prefix: PREFIX,
      executablePath: EXECUTABLE,
      version: state.version,
      message: state.managed ? null : 'not managed by npm global',
    }),
    status,
    installedVersionAt: async () => state.version,
    setVersion: (version: string) => { state.version = version },
    state,
  }
}

function commandResult(code = 0, stdout: string | null = null, extra: Partial<Record<string, unknown>> = {}): any {
  return { code, unavailable: false, timedOut: false, output: stdout ?? 'ok', stdout, stdoutTruncated: false, ...extra }
}

const passedCanary = async () => ({ status: 'passed', code: 'harness-canary-passed', detail: null } as const)
const releaseLock = async () => undefined

function makeOperations(profile: any, harness: any, options: Record<string, unknown> = {}): HarnessOperations {
  return new HarnessOperations({
    profile,
    harness,
    npmBin: 'npm',
    runningVersion: CURRENT,
    lockDir: '/tmp/test-home',
    lockProfile: async () => releaseLock,
    commandAvailable: async () => true,
    ...options,
  } as any)
}

describe('harness operations', () => {
  it('creates a reviewed plan with the npm-global update command and warnings', async () => {
    const manager = makeOperations(profileStub(), harnessStub())
    const plan = await manager.plan()
    expect(plan.status).toBe('ready')
    expect(plan.currentVersion).toBe(CURRENT)
    expect(plan.targetVersion).toBe(TARGET)
    expect(plan.updateCommand).toBe(`npm install --global --prefix ${PREFIX} @deepseek-ai/dsh@${TARGET}`)
    expect(plan.warnings).toEqual(['trusted-code', 'restart-required', 'canary-validation'])
    expect(plan.expiresAt).not.toBeNull()
  })

  it.each<[string, { managed?: boolean; version?: string; latest?: string | null; runningCurrent?: string; npmMissing?: boolean }, string]>([
    ['an unmanaged installation', { managed: false }, 'harness-not-managed'],
    ['a pending restart', { version: TARGET, latest: TARGET }, 'restart-required-before-next-change'],
    ['an up-to-date installation', { version: TARGET, latest: TARGET, runningCurrent: TARGET }, 'harness-up-to-date'],
    ['a failed update check', { latest: null }, 'update-check-failed'],
    ['an unavailable npm command', { npmMissing: true }, 'npm-command-unavailable'],
  ])('blocks the plan for %s', async (_name, options, reason) => {
    const profile = profileStub()
    const harness = harnessStub({
      ...(options.version === undefined ? {} : { version: options.version }),
      ...(options.managed === undefined ? {} : { managed: options.managed }),
      ...(options.latest === undefined ? {} : { latest: options.latest }),
    })
    const manager = makeOperations(profile, harness, {
      runningVersion: options.runningCurrent ?? CURRENT,
      commandAvailable: async () => !(options.npmMissing ?? false),
    })
    const plan = await manager.plan()
    expect(plan.status).toBe('blocked')
    expect(plan.blockReason).toBe(reason)
  })

  it('blocks the plan while another operation is running', async () => {
    const profile = profileStub()
    profile.setBusy(true)
    const manager = makeOperations(profile, harnessStub())
    const plan = await manager.plan()
    expect(plan.status).toBe('blocked')
    expect(plan.blockReason).toBe('another-operation-is-running')
  })

  it('updates the Harness, verifies the exact version, and runs the full-profile canary', async () => {
    const calls: { executable: string; args: string[] }[] = []
    const harness = harnessStub()
    const manager = makeOperations(profileStub(), harness, {
      runCommand: async (executable: string, args: readonly string[]) => {
        calls.push({ executable, args: [...args] })
        if (args.includes('--dump-config')) return commandResult(0, '- id: demo\n  name: demo-plugin\n')
        if (args[0] === '--version') return commandResult(0, harness.state.version)
        if (executable === 'npm' && args[1] === '--global') {
          harness.setVersion((args[4] as string).split('@').at(-1) as string)
          return commandResult(0)
        }
        return commandResult(1, 'unexpected command')
      },
      probeActivation: passedCanary,
    })
    const plan = await manager.plan()
    const result: HarnessUpdateResult = await manager.execute(plan.planId as string)
    expect(result.status).toBe('succeeded')
    expect(result.canary).toBe('passed')
    expect(result.rollback).toBe('not-needed')
    expect(result.restartRequired).toBe(true)
    expect(result.activation).toBe('pending-restart')
    expect(result.capabilities.busy).toBe(false)
    const npmCalls = calls.filter(call => call.executable === 'npm')
    expect(npmCalls).toHaveLength(1)
    expect(npmCalls[0]?.args).toEqual(['install', '--global', '--prefix', PREFIX, `@deepseek-ai/dsh@${TARGET}`])
    expect(calls.some(call => call.executable === EXECUTABLE && call.args.includes('--dump-config'))).toBe(true)
    expect(calls.some(call => call.executable === EXECUTABLE && call.args[0] === '--version')).toBe(true)
  })

  it('rolls back to the previous version when the full-profile canary fails', async () => {
    const calls: string[][] = []
    const harness = harnessStub()
    const canaries: string[] = []
    const manager = makeOperations(profileStub(), harness, {
      runCommand: async (executable: string, args: readonly string[]) => {
        calls.push([executable, ...args])
        if (args.includes('--dump-config')) return commandResult(0, '- id: demo\n  name: demo-plugin\n')
        if (args[0] === '--version') return commandResult(0, harness.state.version)
        if (executable === 'npm' && args[1] === '--global') {
          harness.setVersion((args[4] as string).split('@').at(-1) as string)
          return commandResult(0)
        }
        return commandResult(1, 'unexpected command')
      },
      probeActivation: async () => {
        canaries.push(harness.state.version)
        return canaries.length === 1
          ? { status: 'failed', code: 'harness-canary-composition-failed', detail: 'entry missing' }
          : { status: 'passed', code: 'harness-canary-passed', detail: null }
      },
    })
    const plan = await manager.plan()
    const result = await manager.execute(plan.planId as string)
    expect(result.status).toBe('failed')
    expect(result.code).toBe('harness-canary-failed')
    expect(result.canary).toBe('failed')
    expect(result.rollback).toBe('succeeded')
    expect(canaries).toEqual([TARGET, CURRENT])
    const npmVersions = calls.filter(call => call[0] === 'npm').map(call => call[5])
    expect(npmVersions).toEqual([`@deepseek-ai/dsh@${TARGET}`, `@deepseek-ai/dsh@${CURRENT}`])
  })

  it('does not roll back when the failed command left the previous version intact', async () => {
    const calls: string[][] = []
    const harness = harnessStub()
    const manager = makeOperations(profileStub(), harness, {
      runCommand: async (executable: string, args: readonly string[]) => {
        calls.push([executable, ...args])
        if (args.includes('--dump-config')) return commandResult(0, '- id: demo\n  name: demo-plugin\n')
        return commandResult(1, 'npm install failed before any mutation')
      },
    })
    const plan = await manager.plan()
    const result = await manager.execute(plan.planId as string)
    expect(result.status).toBe('failed')
    expect(result.code).toBe('harness-update-command-failed')
    expect(result.rollback).toBe('not-needed')
    expect(calls.filter(call => call[0] === 'npm')).toHaveLength(1)
  })

  it('reinstalls the previous version when a failed command still replaced the package', async () => {
    const calls: string[][] = []
    const harness = harnessStub()
    const manager = makeOperations(profileStub(), harness, {
      runCommand: async (executable: string, args: readonly string[]) => {
        calls.push([executable, ...args])
        if (args.includes('--dump-config')) return commandResult(0, '- id: demo\n  name: demo-plugin\n')
        if (args[0] === '--version') return commandResult(0, harness.state.version)
        if (executable === 'npm' && args[1] === '--global') {
          harness.setVersion((args[4] as string).split('@').at(-1) as string)
          return commandResult(args[4] === `@deepseek-ai/dsh@${TARGET}` ? 1 : 0, 'failed halfway')
        }
        return commandResult(1, 'unexpected command')
      },
      probeActivation: passedCanary,
    })
    const plan = await manager.plan()
    const result = await manager.execute(plan.planId as string)
    expect(result.status).toBe('failed')
    expect(result.rollback).toBe('succeeded')
    expect(calls.filter(call => call[0] === 'npm').map(call => call[5])).toEqual([
      `@deepseek-ai/dsh@${TARGET}`,
      `@deepseek-ai/dsh@${CURRENT}`,
    ])
  })

  it('fails when the profile composition cannot be captured before the update', async () => {
    const calls: string[][] = []
    const manager = makeOperations(profileStub(), harnessStub(), {
      runCommand: async (executable: string, args: readonly string[]) => {
        calls.push([executable, ...args])
        return commandResult(1, 'dump failed')
      },
    })
    const plan = await manager.plan()
    const result = await manager.execute(plan.planId as string)
    expect(result.status).toBe('failed')
    expect(result.code).toBe('composition-snapshot-failed')
    expect(calls.filter(call => call[0] === 'npm')).toHaveLength(0)
  })

  it('expires plans after five minutes', async () => {
    let now = Date.now()
    const manager = makeOperations(profileStub(), harnessStub(), { now: () => now })
    const plan = await manager.plan()
    now += 6 * 60 * 1000
    const result = await manager.execute(plan.planId as string)
    expect(result.status).toBe('failed')
    expect(result.code).toBe('plan-invalid-or-expired')
  })

  it('rejects execution when the profile fingerprint changed after review', async () => {
    const profile = profileStub()
    const manager = makeOperations(profile, harnessStub())
    const plan = await manager.plan()
    profile.fingerprint = () => 'changed'
    const result = await manager.execute(plan.planId as string)
    expect(result.status).toBe('failed')
    expect(result.code).toBe('profile-changed')
  })

  it('rejects execution when the installed version changed after review', async () => {
    const harness = harnessStub()
    const manager = makeOperations(profileStub(), harness)
    const plan = await manager.plan()
    harness.setVersion(TARGET)
    const result = await manager.execute(plan.planId as string)
    expect(result.status).toBe('failed')
    expect(result.code).toBe('harness-state-changed')
  })

  it('rejects unknown plan ids', async () => {
    const manager = makeOperations(profileStub(), harnessStub())
    const result = await manager.execute('no-such-plan-id-0000')
    expect(result.status).toBe('failed')
    expect(result.code).toBe('plan-invalid-or-expired')
  })
})
