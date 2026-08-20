/**
 * Serialized, confirmation-gated DeepSeek Harness self-updates.
 * Mirrors ProfileOperations' reviewed-plan/recovery discipline: a short-lived
 * plan, pre-flight revalidation, the npm-global update command, exact version
 * verification, a full-profile isolated canary that re-activates EVERY
 * installed plugin under the new Harness binary, and an automatic reinstall
 * of the previous version when the canary fails.
 */

import { randomUUID } from 'node:crypto'
import { parse as parseYaml, type ScalarTag } from 'yaml'
import { runHarnessUpdateCanary, type HarnessCanaryRequest, type HarnessCanaryResult } from './canary.ts'
import { acquireProfileLock, ProfileLockedError } from './lock.ts'
import { collectComposedEntries, command, type CommandResult } from './operations.ts'
import { commandAvailable, type ProfileManager } from './profile.ts'
import type { HarnessInstallation, HarnessManager } from './harness.ts'
import type { HarnessStatus, HarnessUpdatePlan, HarnessUpdateResult, HarnessUpdateWarning } from './types.ts'
import { errorMessage, isRecord } from './util.ts'

const PLAN_TTL_MS = 5 * 60 * 1000

interface StoredHarnessPlan {
  readonly plan: HarnessUpdatePlan & { readonly status: 'ready'; readonly planId: string }
  readonly profileFingerprint: string
  readonly executablePath: string
}

export interface HarnessOperationOptions {
  readonly profile: ProfileManager
  readonly harness: Pick<HarnessManager, 'resolve' | 'status' | 'installedVersionAt'>
  readonly npmBin: string
  readonly runningVersion: string | null
  readonly lockDir: string
  readonly timeoutMs?: number
  readonly canaryTimeoutMs?: number
  readonly runCommand?: (executable: string, args: readonly string[], cwd: string, timeoutMs: number) => Promise<CommandResult>
  readonly probeActivation?: (request: HarnessCanaryRequest) => Promise<HarnessCanaryResult>
  readonly lockProfile?: (dir: string) => Promise<() => Promise<void>>
  readonly commandAvailable?: (command: string) => Promise<boolean>
  readonly now?: () => number
}

interface ComposedEntry {
  readonly id: string
  readonly name: string
  /** Literal boolean from the dump, or 'unknown' for unevaluatable `!!js` expressions. */
  readonly disabled: boolean | 'unknown'
}

/**
 * `--dump-config` keeps `!!js` values as raw expressions. The launcher
 * evaluates them against `process` at boot, so evaluate the same way here —
 * the expressions come from the trusted local composed config and are exactly
 * what the Host itself executes on every startup. Anything that fails to
 * evaluate stays 'unknown' and skips the strict disabled comparison.
 */
function evaluateJsExpression(expression: string): unknown {
  try {
    // eslint-disable-next-line no-new-func
    const evaluate = new Function('process', `"use strict"; return (${expression});`) as (process: NodeJS.Process) => unknown
    return evaluate(process)
  } catch {
    return { __jsExpr: expression }
  }
}

const EVALUATED_JS_TAG: ScalarTag = {
  tag: 'tag:yaml.org,2002:js',
  identify: (value: unknown): boolean => isRecord(value)
    && Object.keys(value).length === 1
    && typeof value.__jsExpr === 'string',
  resolve: (value: string): unknown => evaluateJsExpression(value),
  stringify: ({ value }): string => isRecord(value) && typeof value.__jsExpr === 'string' ? value.__jsExpr : '',
}

export function composedEntriesFromDump(output: string | null | undefined): readonly ComposedEntry[] | null {
  if (output === null || output === undefined) return null
  try {
    const entries: Record<string, unknown>[] = []
    collectComposedEntries(parseYaml(output, { customTags: [EVALUATED_JS_TAG] }), entries)
    const mapped = entries
      .filter(entry => typeof entry.id === 'string' && typeof entry.name === 'string')
      .map(entry => ({
        id: entry.id as string,
        name: entry.name as string,
        disabled: typeof entry.disabled === 'boolean' ? entry.disabled : 'unknown' as const,
      }))
    return mapped.length === 0 ? null : mapped
  } catch {
    return null
  }
}

function blockedPlan(profileName: string, reason: string, harness: HarnessStatus): HarnessUpdatePlan {
  return {
    status: 'blocked',
    planId: null,
    blockReason: reason,
    currentVersion: harness.installedVersion,
    targetVersion: harness.latestVersion,
    updateTag: harness.updateTag,
    installRoot: harness.installRoot,
    prefix: harness.prefix,
    updateCommand: null,
    warnings: [],
    expiresAt: null,
  }
}

/** Exact-version verification: package manifest first, then the CLI itself. */
async function verifyInstalledVersion(
  harness: HarnessOperationOptions['harness'],
  runCommand: (executable: string, args: readonly string[], cwd: string, timeoutMs: number) => Promise<CommandResult>,
  profileDir: string,
  timeoutMs: number,
  expectedVersion: string,
  previousInstallRoot: string | null,
): Promise<{ ok: boolean; installation: HarnessInstallation | null; detail: string | null }> {
  const installation = await harness.resolve()
  if (installation.status !== 'managed' || installation.version !== expectedVersion
    || (previousInstallRoot !== null && installation.installRoot !== previousInstallRoot)) {
    return {
      ok: false,
      installation,
      detail: `Expected the npm-global installation to be ${expectedVersion}, found ${installation.version ?? 'unknown'}.`,
    }
  }
  if (installation.executablePath === null) {
    return { ok: false, installation, detail: 'The updated dsh executable could not be resolved.' }
  }
  let version: CommandResult
  try {
    version = await runCommand(installation.executablePath, ['--version'], profileDir, Math.min(timeoutMs, 30_000))
  } catch (error) {
    return { ok: false, installation, detail: errorMessage(error) }
  }
  if (version.unavailable || version.timedOut || version.code !== 0
    || (version.stdout ?? version.output ?? '').includes(expectedVersion) === false) {
    return {
      ok: false,
      installation,
      detail: version.output ?? `The dsh CLI did not report version ${expectedVersion}.`,
    }
  }
  return { ok: true, installation, detail: null }
}

/** Owns one Harness update at a time and never exposes arbitrary package-manager args. */
export class HarnessOperations {
  private readonly plans = new Map<string, StoredHarnessPlan>()
  private readonly runCommand: (executable: string, args: readonly string[], cwd: string, timeoutMs: number) => Promise<CommandResult>
  private readonly probeActivation: (request: HarnessCanaryRequest) => Promise<HarnessCanaryResult>
  private readonly lockProfile: (dir: string) => Promise<() => Promise<void>>
  private readonly available: (command: string) => Promise<boolean>
  private readonly now: () => number
  private readonly timeoutMs: number
  private readonly canaryTimeoutMs: number
  private operation: Promise<HarnessUpdateResult> | null = null
  private disposed = false

  constructor(private readonly options: HarnessOperationOptions) {
    this.runCommand = options.runCommand ?? command
    this.probeActivation = options.probeActivation ?? runHarnessUpdateCanary
    this.lockProfile = options.lockProfile ?? acquireProfileLock
    this.available = options.commandAvailable ?? commandAvailable
    this.now = options.now ?? (() => Date.now())
    this.timeoutMs = options.timeoutMs ?? 5 * 60 * 1000
    this.canaryTimeoutMs = options.canaryTimeoutMs ?? 60_000
  }

  private async snapshot(
    status: 'succeeded' | 'failed',
    code: string,
    plan: HarnessUpdatePlan | null,
    restartRequired: boolean,
    rollback: HarnessUpdateResult['rollback'],
    detail: string | null,
    canary: HarnessUpdateResult['canary'] = 'not-run',
    processCleanup: HarnessUpdateResult['processCleanup'] = 'not-needed',
  ): Promise<HarnessUpdateResult> {
    const [harnessResult, installedResult, capabilitiesResult] = await Promise.allSettled([
      this.options.harness.status(this.options.runningVersion),
      this.options.profile.list('zh', false),
      this.options.profile.capabilities(),
    ])
    const fallbackHarness: HarnessStatus = {
      currentVersion: this.options.runningVersion,
      installedVersion: plan?.targetVersion ?? plan?.currentVersion ?? null,
      latestVersion: null,
      updateTag: null,
      channels: [],
      updateAvailable: false,
      pendingRestart: false,
      managed: false,
      packageName: '@deepseek-ai/dsh',
      installRoot: plan?.installRoot ?? null,
      prefix: plan?.prefix ?? null,
      executablePath: null,
      installMessage: 'The Harness installation state could not be read after the operation.',
      updateCheckError: null,
    }
    const snapshotError = installedResult.status === 'rejected'
      ? errorMessage(installedResult.reason)
      : capabilitiesResult.status === 'rejected'
        ? errorMessage(capabilitiesResult.reason)
        : null
    const capabilities = capabilitiesResult.status === 'fulfilled'
      ? capabilitiesResult.value
      : {
          profileName: this.options.profile.runtime.profileName,
          profileWritable: false,
          dshAvailable: false,
          pnpmAvailable: false,
          busy: false,
          message: snapshotError ?? 'The profile state could not be read after the operation.',
        }
    return {
      status,
      code,
      currentVersion: plan?.currentVersion ?? null,
      targetVersion: plan?.targetVersion ?? null,
      restartRequired,
      activation: status === 'succeeded' && restartRequired
        ? 'pending-restart'
        : rollback === 'failed' || processCleanup === 'failed'
          ? 'unknown'
          : 'unchanged',
      canary,
      processCleanup,
      rollback,
      detail: detail ?? snapshotError,
      harness: harnessResult.status === 'fulfilled' ? harnessResult.value : fallbackHarness,
      installed: installedResult.status === 'fulfilled' ? installedResult.value : [],
      capabilities,
    }
  }

  async plan(): Promise<HarnessUpdatePlan> {
    this.prunePlans()
    if (this.disposed) return blockedPlan(this.options.profile.runtime.profileName, 'manager-disposed', {
      currentVersion: this.options.runningVersion, installedVersion: null, latestVersion: null, updateTag: null,
      channels: [], updateAvailable: false, pendingRestart: false, managed: false, packageName: '@deepseek-ai/dsh',
      installRoot: null, prefix: null, executablePath: null, installMessage: null, updateCheckError: null,
    })
    if (this.busy) return this.blockedFromStatus('another-operation-is-running')
    const status = await this.options.harness.status(this.options.runningVersion)
    if (!status.managed) return blockedPlan(this.options.profile.runtime.profileName, 'harness-not-managed', status)
    if (status.pendingRestart) return blockedPlan(this.options.profile.runtime.profileName, 'restart-required-before-next-change', status)
    if (status.latestVersion === null) return blockedPlan(this.options.profile.runtime.profileName, 'update-check-failed', status)
    if (!status.updateAvailable) return blockedPlan(this.options.profile.runtime.profileName, 'harness-up-to-date', status)
    if (!(await this.available(this.options.npmBin))) return blockedPlan(this.options.profile.runtime.profileName, 'npm-command-unavailable', status)
    if (status.installRoot === null || status.prefix === null) return blockedPlan(this.options.profile.runtime.profileName, 'harness-not-managed', status)
    const planId = randomUUID()
    const expiresAt = new Date(this.now() + PLAN_TTL_MS).toISOString()
    const plan: HarnessUpdatePlan & { readonly status: 'ready'; readonly planId: string } = {
      status: 'ready',
      planId,
      blockReason: null,
      currentVersion: status.installedVersion,
      targetVersion: status.latestVersion,
      updateTag: status.updateTag ?? '',
      installRoot: status.installRoot,
      prefix: status.prefix,
      updateCommand: `${this.options.npmBin} install --global --prefix ${status.prefix} @deepseek-ai/dsh@${status.latestVersion}`,
      warnings: ['trusted-code', 'restart-required', 'canary-validation'] as const satisfies readonly HarnessUpdateWarning[],
      expiresAt,
    }
    this.plans.set(planId, {
      plan,
      profileFingerprint: this.options.profile.fingerprint(),
      executablePath: status.executablePath ?? '',
    })
    return plan
  }

  private async blockedFromStatus(reason: string): Promise<HarnessUpdatePlan> {
    const status = await this.options.harness.status(this.options.runningVersion)
    return blockedPlan(this.options.profile.runtime.profileName, reason, status)
  }

  get busy(): boolean {
    return this.options.profile.isBusy
  }

  async execute(planId: string): Promise<HarnessUpdateResult> {
    this.prunePlans()
    if (this.disposed) return this.snapshot('failed', 'manager-disposed', null, false, 'not-needed', null)
    if (this.operation !== null || this.busy) return this.snapshot('failed', 'operation-busy', null, false, 'not-needed', null)
    const stored = this.plans.get(planId)
    this.plans.delete(planId)
    if (stored === undefined) return this.snapshot('failed', 'plan-invalid-or-expired', null, false, 'not-needed', null)
    if (Date.parse(stored.plan.expiresAt ?? '') <= this.now()) return this.snapshot('failed', 'plan-expired', stored.plan, false, 'not-needed', null)
    if (stored.profileFingerprint !== this.options.profile.fingerprint()) return this.snapshot('failed', 'profile-changed', stored.plan, false, 'not-needed', null)

    this.options.profile.setBusy(true)
    const operation = this.prepareAndRun(stored)
      .then(async result => ({ ...result, capabilities: { ...result.capabilities, busy: false } }))
      .finally(() => this.options.profile.setBusy(false))
    this.operation = operation
    try {
      return await operation
    } finally {
      if (this.operation === operation) this.operation = null
    }
  }

  private async prepareAndRun(stored: StoredHarnessPlan): Promise<HarnessUpdateResult> {
    const plan = stored.plan
    let release: (() => Promise<void>) | null = null
    try {
      release = await this.lockProfile(this.options.lockDir)
    } catch (error) {
      const code = error instanceof ProfileLockedError ? 'harness-locked' : 'harness-lock-failed'
      return this.snapshot('failed', code, plan, false, 'not-needed', errorMessage(error))
    }
    try {
      if (stored.profileFingerprint !== this.options.profile.fingerprint()) {
        return this.snapshot('failed', 'profile-changed', plan, false, 'not-needed', null)
      }
      const status = await this.options.harness.status(this.options.runningVersion)
      if (!status.managed || status.installedVersion !== plan.currentVersion
        || status.executablePath !== stored.executablePath) {
        return this.snapshot('failed', 'harness-state-changed', plan, false, 'not-needed', null)
      }
      if (status.latestVersion === null || status.latestVersion !== plan.targetVersion || !status.updateAvailable) {
        return this.snapshot('failed', 'harness-state-changed', plan, false, 'not-needed', null)
      }

      // Capture the expected composition with the OLD binary before mutating
      // anything. The canary must reproduce exactly this composed profile.
      const profileDir = this.options.profile.runtime.dir
      const profileName = this.options.profile.runtime.profileName
      let composition: CommandResult
      try {
        composition = await this.runCommand(stored.executablePath, ['--profile', profileName, '--dump-config'], profileDir, this.timeoutMs)
      } catch (error) {
        return this.snapshot('failed', 'composition-snapshot-failed', plan, false, 'not-needed', errorMessage(error))
      }
      if (composition.unavailable || composition.timedOut || composition.code !== 0 || composition.stdoutTruncated) {
        return this.snapshot('failed', 'composition-snapshot-failed', plan, false, 'not-needed', composition.output)
      }
      const expectedEntries = composedEntriesFromDump(composition.stdout ?? composition.output)
      if (expectedEntries === null) {
        return this.snapshot('failed', 'composition-snapshot-failed', plan, false, 'not-needed', 'The composed profile dump has no Loader entries.')
      }
      const expectedClientPackages = (await this.options.profile.list('zh', false))
        .filter(row => row.client && row.activeAfterRestart)
        .map(row => row.packageName)

      const args = ['install', '--global', '--prefix', plan.prefix as string, `@deepseek-ai/dsh@${plan.targetVersion as string}`]
      let update: CommandResult
      try {
        update = await this.runCommand(this.options.npmBin, args, profileDir, this.timeoutMs)
      } catch (error) {
        return this.rollbackFrom(plan, expectedEntries, expectedClientPackages, null, profileDir, profileName, errorMessage(error), true)
      }

      if (update.unavailable) {
        return this.rollbackFrom(plan, expectedEntries, expectedClientPackages, update, profileDir, profileName, update.output, true)
      }
      if (update.timedOut) {
        if (update.processCleanup === false) {
          return this.snapshot('failed', 'operation-process-leaked', plan, false, 'failed', update.output, 'not-run', 'failed')
        }
        return this.rollbackFrom(plan, expectedEntries, expectedClientPackages, update, profileDir, profileName, update.output, true, 'succeeded')
      }
      if (update.code !== 0) {
        // A failed command may still have replaced the package tree; only
        // skip rollback when the previous version survived untouched.
        return this.rollbackFrom(plan, expectedEntries, expectedClientPackages, update, profileDir, profileName, update.output, true)
      }

      const verified = await verifyInstalledVersion(
        this.options.harness,
        this.runCommand,
        profileDir,
        this.timeoutMs,
        plan.targetVersion as string,
        plan.installRoot,
      )
      if (!verified.ok) {
        return this.rollbackFrom(plan, expectedEntries, expectedClientPackages, null, profileDir, profileName, verified.detail, true)
      }

      let canary: HarnessCanaryResult
      try {
        canary = await this.probeActivation({
          profileDir,
          profileName,
          dshBin: verified.installation?.executablePath ?? stored.executablePath,
          expectedEntries,
          expectedClientPackages,
          timeoutMs: this.canaryTimeoutMs,
        })
      } catch (error) {
        return this.rollbackFrom(plan, expectedEntries, expectedClientPackages, null, profileDir, profileName, errorMessage(error), true)
      }
      if (canary.status !== 'passed') {
        return this.rollbackFrom(plan, expectedEntries, expectedClientPackages, null, profileDir, profileName, canary.detail, true, 'succeeded')
      }
      return this.snapshot('succeeded', 'succeeded', plan, true, 'not-needed', null, 'passed', 'succeeded')
    } finally {
      await release().catch(() => undefined)
    }
  }

  private async rollbackFrom(
    plan: HarnessUpdatePlan,
    expectedEntries: readonly ComposedEntry[],
    expectedClientPackages: readonly string[],
    failedUpdate: CommandResult | null,
    profileDir: string,
    profileName: string,
    detail: string | null,
    mutationSuspected: boolean,
    failedProcessCleanup: HarnessUpdateResult['processCleanup'] = failedUpdate?.timedOut === true
      ? failedUpdate.processCleanup === false ? 'failed' : 'succeeded'
      : 'not-needed',
  ): Promise<HarnessUpdateResult> {
    if (!mutationSuspected) {
      return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'not-needed', detail, 'not-run', failedProcessCleanup)
    }
    // The previous version may already be intact even after a failed command.
    const current = await this.options.harness.resolve()
    if (current.status === 'managed' && current.version === plan.currentVersion) {
      return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'not-needed', detail, 'not-run', failedProcessCleanup)
    }
    try {
      const args = ['install', '--global', '--prefix', plan.prefix as string, `@deepseek-ai/dsh@${plan.currentVersion as string}`]
      const restore = await this.runCommand(this.options.npmBin, args, profileDir, this.timeoutMs)
      if (restore.unavailable || restore.timedOut || restore.code !== 0) {
        return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', `${detail ?? ''} ${restore.output ?? 'Rollback reinstall failed.'}`.trim(), 'not-run', failedProcessCleanup)
      }
      const restored = await verifyInstalledVersion(
        this.options.harness,
        this.runCommand,
        profileDir,
        this.timeoutMs,
        plan.currentVersion as string,
        plan.installRoot,
      )
      if (!restored.ok) {
        return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', `${detail ?? ''} ${restored.detail ?? 'Rollback verification failed.'}`.trim(), 'not-run', failedProcessCleanup)
      }
      let canary: HarnessCanaryResult
      try {
        canary = await this.probeActivation({
          profileDir,
          profileName,
          dshBin: restored.installation?.executablePath ?? '',
          expectedEntries,
          expectedClientPackages,
          timeoutMs: this.canaryTimeoutMs,
        })
      } catch (error) {
        return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', `${detail ?? ''} ${errorMessage(error)}`.trim(), 'failed', failedProcessCleanup)
      }
      if (canary.status !== 'passed') {
        return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', `${detail ?? ''} ${canary.detail ?? 'Rollback canary failed.'}`.trim(), 'failed', failedProcessCleanup)
      }
      return this.snapshot('failed', 'harness-canary-failed', plan, false, 'succeeded', detail, 'failed', failedProcessCleanup)
    } catch (error) {
      return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', errorMessage(error), 'not-run', failedProcessCleanup)
    }
  }

  private prunePlans(): void {
    const now = this.now()
    for (const [id, stored] of this.plans) {
      if (Date.parse(stored.plan.expiresAt ?? '') <= now) this.plans.delete(id)
    }
  }

  async close(): Promise<void> {
    this.disposed = true
    this.plans.clear()
    await this.operation
  }
}
