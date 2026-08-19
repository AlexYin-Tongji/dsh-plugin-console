/**
 * Serialized, confirmation-gated profile mutations backed by the official dsh CLI.
 * The reviewed-plan/recovery architecture was informed by the MIT-licensed
 * DSH Plugin Marketplace and substantially hardened here; see THIRD_PARTY_NOTICES.md.
 */

import { randomUUID } from 'node:crypto'
import { readFile, rm, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import semver from 'semver'
import { parse as parseYaml, type ScalarTag } from 'yaml'
import type { NpmArtifact, PluginCatalog } from './catalog.ts'
import { profilePatchPath, type PluginActivationTarget, type ProfileManager } from './profile.ts'
import type {
  CatalogPluginDetail,
  InstalledPluginSummary,
  OperationAction,
  OperationPlan,
  OperationPlanRequest,
  OperationResult,
  OperationWarning,
} from './types.ts'
import { errorMessage, isRecord, redactProcessOutput } from './util.ts'

const PLAN_TTL_MS = 5 * 60 * 1000
const MAX_OUTPUT_CHARS = 24_000
const MAX_STDOUT_CHARS = 5_000_000
const PACKAGE_NAME = /^(?:[a-z0-9][a-z0-9._~-]*|@[a-z0-9][a-z0-9._~-]*\/[a-z0-9][a-z0-9._~-]*)$/i
const JS_EXPRESSION_TAG: ScalarTag = {
  tag: 'tag:yaml.org,2002:js',
  identify: (value: unknown): boolean => isRecord(value)
    && Object.keys(value).length === 1
    && typeof value.__jsExpr === 'string',
  resolve: (value: string): Record<string, string> => ({ __jsExpr: value }),
  stringify: ({ value }): string => isRecord(value) && typeof value.__jsExpr === 'string' ? value.__jsExpr : '',
}

interface StoredPlan {
  readonly plan: OperationPlan & { readonly status: 'ready'; readonly planId: string }
  readonly fingerprint: string
}

interface CommandResult {
  readonly code: number | null
  readonly unavailable: boolean
  readonly timedOut: boolean
  readonly output: string | null
  readonly stdout?: string | null
  readonly stdoutTruncated?: boolean
}

interface FileBackup {
  readonly path: string
  readonly content: string | null
}

export interface OperationOptions {
  readonly profile: ProfileManager
  readonly catalog: PluginCatalog
  readonly dshBin: string
  readonly timeoutMs?: number
  readonly runCommand?: (args: readonly string[], cwd: string, timeoutMs: number) => Promise<CommandResult>
  readonly now?: () => number
}

function emptyPlan(profileName: string, action: OperationAction | null, reason: string, packageName: string | null = null, catalogId: string | null = null): OperationPlan {
  return {
    status: 'blocked',
    planId: null,
    blockReason: reason,
    action,
    profileName,
    catalogId,
    packageName,
    currentVersion: null,
    targetVersion: null,
    sourceSpec: null,
    artifactIntegrity: null,
    lifecycleScripts: [],
    warnings: [],
    expiresAt: null,
  }
}

function validPackageName(value: string): boolean {
  return value.length <= 214 && PACKAGE_NAME.test(value)
}

function snapshotResult(
  profile: ProfileManager,
  action: OperationAction | null,
  code: string,
  packageName: string | null,
  restartRequired: boolean,
  rollback: OperationResult['rollback'],
  detail: string | null,
): Promise<OperationResult> {
  return Promise.all([profile.list('zh', false), profile.capabilities()]).then(([installed, capabilities]) => ({
    status: code === 'succeeded' ? 'succeeded' : 'failed',
    code,
    action,
    packageName,
    restartRequired,
    rollback,
    detail,
    installed,
    capabilities,
  }))
}

function command(
  executable: string,
  args: readonly string[],
  cwd: string,
  timeoutMs: number,
): Promise<CommandResult> {
  return new Promise(resolve => {
    let stdout = ''
    let stderr = ''
    let stdoutTruncated = false
    let timedOut = false
    let settled = false
    const child = spawn(executable, [...args], {
      cwd,
      shell: false,
      env: { ...process.env },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    child.stdout?.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8')
      if (stdout.length > MAX_STDOUT_CHARS) {
        stdout = stdout.slice(-MAX_STDOUT_CHARS)
        stdoutTruncated = true
      }
    })
    child.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8')
      if (stderr.length > MAX_OUTPUT_CHARS) stderr = stderr.slice(-MAX_OUTPUT_CHARS)
    })
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGTERM')
      setTimeout(() => { if (!settled) child.kill('SIGKILL') }, 5_000)
    }, timeoutMs)
    const finish = (result: CommandResult): void => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve({
        ...result,
        stdout: stdout.trim().length === 0 ? null : stdout,
        stdoutTruncated,
        output: redactProcessOutput(`${stdout}\n${stderr}`),
      })
    }
    child.once('error', error => finish({ code: 1, unavailable: (error as NodeJS.ErrnoException).code === 'ENOENT', timedOut, output: null }))
    child.once('exit', code => finish({ code, unavailable: false, timedOut, output: null }))
  })
}

async function backupFile(path: string): Promise<FileBackup> {
  try {
    return { path, content: await readFile(path, 'utf8') }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { path, content: null }
    throw error
  }
}

async function restoreFiles(files: readonly FileBackup[]): Promise<void> {
  for (const file of files) {
    if (file.content === null) await rm(file.path, { force: true })
    else await writeFile(file.path, file.content, { encoding: 'utf8', mode: 0o600 })
  }
}

async function backupFilesChanged(files: readonly FileBackup[]): Promise<boolean> {
  for (const file of files) {
    try {
      const current = await readFile(file.path, 'utf8')
      if (file.content === null || current !== file.content) return true
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT' || file.content !== null) return true
    }
  }
  return false
}

async function lockfileHasIntegrity(profileDir: string, packageName: string, version: string, integrity: string): Promise<boolean> {
  try {
    const value: unknown = parseYaml(await readFile(join(profileDir, 'pnpm-lock.yaml'), 'utf8'))
    if (!isRecord(value)) return false
    const stores = [value.packages, value.snapshots].filter(isRecord)
    if (stores.length === 0) return false

    const importer = isRecord(value.importers) && isRecord(value.importers['.']) ? value.importers['.'] : null
    if (importer === null) return false
    let reference: string | null = null
    for (const field of ['dependencies', 'devDependencies', 'optionalDependencies']) {
      const dependencies = importer[field]
      if (!isRecord(dependencies) || dependencies[packageName] === undefined) continue
      const direct = dependencies[packageName]
      reference = typeof direct === 'string'
        ? direct
        : isRecord(direct) && typeof direct.version === 'string'
          ? direct.version
          : null
      break
    }
    if (reference === null || (reference !== version && !reference.startsWith(`${version}(`))) return false

    const prefixes = new Set([`${packageName}@${version}`, `${packageName}@${reference}`])
    return stores.some(store => Object.entries(store).some(([rawKey, entry]) => {
      const key = rawKey.startsWith('/') ? rawKey.slice(1) : rawKey
      if (![...prefixes].some(prefix => key === prefix || key.startsWith(`${prefix}(`))) return false
      return isRecord(entry) && isRecord(entry.resolution) && entry.resolution.integrity === integrity
    }))
  } catch {
    return false
  }
}

function collectComposedEntries(value: unknown, entries: Record<string, unknown>[]): void {
  if (!Array.isArray(value)) return
  for (const item of value) {
    if (!isRecord(item)) continue
    entries.push(item)
    if (item.group === true) collectComposedEntries(item.config, entries)
  }
}

function activationDumpMatches(output: string | null | undefined, targets: readonly PluginActivationTarget[], paused: boolean): boolean {
  if (output === null || output === undefined) return false
  try {
    const entries: Record<string, unknown>[] = []
    collectComposedEntries(parseYaml(output, { customTags: [JS_EXPRESSION_TAG] }), entries)
    return targets.every(target => {
      const matching = entries.filter(entry => entry.id === target.id && entry.name === target.name)
      return matching.length === 1 && matching[0]?.disabled === paused
    })
  } catch {
    return false
  }
}

function warningList(detail: Pick<CatalogPluginDetail, 'warnings'>, action: OperationAction): OperationWarning[] {
  const warnings: OperationWarning[] = []
  if (action === 'pause' || action === 'resume') {
    warnings.push('restart-required')
  } else if (action === 'remove') {
    warnings.push('remove-data-kept')
  } else {
    warnings.push('trusted-code', 'restart-required', 'scripts-disabled')
    if (detail.warnings.includes('dsh-compatibility-not-declared')) warnings.push('compatibility-unknown')
  }
  return warnings
}

/** Owns one mutation at a time and never exposes arbitrary package-manager args. */
export class ProfileOperations {
  private readonly plans = new Map<string, StoredPlan>()
  private readonly runCommand: (args: readonly string[], cwd: string, timeoutMs: number) => Promise<CommandResult>
  private readonly now: () => number
  private readonly timeoutMs: number
  private operation: Promise<OperationResult> | null = null
  private disposed = false

  constructor(private readonly options: OperationOptions) {
    this.runCommand = options.runCommand ?? ((args, cwd, timeoutMs) => command(options.dshBin, args, cwd, timeoutMs))
    this.now = options.now ?? (() => Date.now())
    this.timeoutMs = options.timeoutMs ?? 5 * 60 * 1000
  }

  get busy(): boolean {
    return this.options.profile.isBusy
  }

  async plan(request: OperationPlanRequest): Promise<OperationPlan> {
    this.prunePlans()
    if (this.disposed) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'manager-disposed')
    if (this.busy) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'another-operation-is-running')
    const capabilities = await this.options.profile.capabilities()
    if (!capabilities.profileWritable) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'profile-not-writable')
    if (request.action !== 'pause' && request.action !== 'resume') {
      if (!capabilities.dshAvailable) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'dsh-command-unavailable')
      if (!capabilities.pnpmAvailable) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'pnpm-command-unavailable')
    }

    const installed = await this.options.profile.list('zh', false)
    let packageName: string | null = request.packageName ?? null
    let catalogId: string | null = request.catalogId ?? null
    let currentVersion: string | null = null
    let targetVersion: string | null = null
    let sourceSpec: string | null = null
    let artifactIntegrity: string | null = null
    let lifecycleScripts: readonly string[] = []
    let detail: CatalogPluginDetail | null = null

    if (request.action === 'pause' || request.action === 'resume') {
      if (packageName === null || !validPackageName(packageName)) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'package-name-invalid')
      const row = installed.find(item => item.packageName === packageName)
      if (row === undefined) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'package-not-installed', packageName)
      if (!row.directDependency || row.system) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'system-package-protected', packageName)
      if (row.state === 'pending-removal' || row.state === 'pending-install' || row.state === 'pending-update') {
        return emptyPlan(this.options.profile.runtime.profileName, request.action, 'restart-required-before-next-change', packageName)
      }
      if (packageName === 'dsh-plugin-console' && request.action === 'pause') {
        return emptyPlan(this.options.profile.runtime.profileName, request.action, 'self-pause-protected', packageName)
      }
      if (!row.bundle || row.runtimeEntries.length === 0) {
        return emptyPlan(this.options.profile.runtime.profileName, request.action, 'plugin-entry-unavailable', packageName)
      }
      const paused = row.state === 'paused' || row.state === 'partially-paused'
      if (request.action === 'pause' && paused) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'already-paused', packageName)
      if (request.action === 'resume' && !paused) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'already-active', packageName)
      return this.storePlan({
        action: request.action,
        catalogId: row.catalogId,
        packageName,
        currentVersion: row.version,
        targetVersion: row.version,
        sourceSpec: null,
        artifactIntegrity: null,
        lifecycleScripts,
        warnings: warningList({ warnings: [] }, request.action),
      })
    }

    if (request.action === 'remove') {
      if (packageName === null || !validPackageName(packageName)) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'package-name-invalid')
      const row = installed.find(item => item.packageName === packageName)
      if (row === undefined) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'package-not-installed', packageName)
      if (!row.directDependency || row.system) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'system-package-protected', packageName)
      if (row.state === 'pending-removal' || row.state === 'pending-update') {
        return emptyPlan(this.options.profile.runtime.profileName, request.action, 'restart-required-before-next-change', packageName)
      }
      currentVersion = row.version
      catalogId = row.catalogId
      const warnings: OperationWarning[] = warningList({ warnings: [] }, request.action)
      if (packageName === 'dsh-plugin-console') warnings.push('self-removal')
      return this.storePlan({
        action: request.action,
        catalogId,
        packageName,
        currentVersion,
        targetVersion: null,
        sourceSpec: null,
        artifactIntegrity: null,
        lifecycleScripts,
        warnings,
      })
    }

    if (catalogId === null && packageName !== null) catalogId = this.options.catalog.findByPackage(packageName)?.id ?? null
    let artifact: NpmArtifact | null = null
    if (catalogId === null && request.action === 'update' && packageName !== null) {
      artifact = await this.options.catalog.latestNpmArtifact(packageName)
      if (artifact === null) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'catalog-entry-required', packageName)
    } else if (catalogId !== null) {
      detail = await this.options.catalog.detail(catalogId, 'zh')
      if (detail === null) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'catalog-entry-missing', packageName, catalogId)
      if (detail.verification !== 'verified' || detail.installSpec === null || detail.manifest === null) {
        return emptyPlan(this.options.profile.runtime.profileName, request.action, detail.verificationMessage ?? 'artifact-not-verified', detail.manifest?.packageName ?? packageName, catalogId)
      }
    } else {
      return emptyPlan(this.options.profile.runtime.profileName, request.action, 'catalog-entry-required', packageName)
    }
    const resolvedPackageName = detail?.manifest?.packageName ?? artifact?.manifest.packageName
    const resolvedVersion = detail?.manifest?.version ?? artifact?.manifest.version
    const resolvedSpec = detail?.installSpec ?? artifact?.sourceSpec
    const resolvedScripts = detail?.manifest?.lifecycleScripts ?? artifact?.manifest.lifecycleScripts ?? []
    artifactIntegrity = detail?.integrity ?? artifact?.integrity ?? null
    const row = resolvedPackageName === undefined ? undefined : installed.find(item => item.packageName === resolvedPackageName)
    if (resolvedPackageName === undefined || resolvedVersion === undefined || resolvedSpec === undefined) {
      return emptyPlan(this.options.profile.runtime.profileName, request.action, 'artifact-not-verified', packageName, catalogId)
    }
    if (request.action === 'install' && row !== undefined) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'already-installed', resolvedPackageName, catalogId)
    if (request.action === 'update') {
      if (row === undefined) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'package-not-installed', resolvedPackageName, catalogId)
      if (!row.directDependency) return emptyPlan(this.options.profile.runtime.profileName, request.action, 'system-package-protected', resolvedPackageName, catalogId)
      if (artifact !== null && (row.repositoryUrl === null || row.repositoryUrl.toLocaleLowerCase() !== artifact.repositoryUrl.toLocaleLowerCase())) {
        return emptyPlan(this.options.profile.runtime.profileName, request.action, 'artifact-repository-mismatch', resolvedPackageName, catalogId)
      }
      currentVersion = row.version
      const githubPinChanged = detail?.artifactKind === 'github'
      if (githubPinChanged) {
        if (row.requestedSpec === resolvedSpec) {
          return emptyPlan(this.options.profile.runtime.profileName, request.action, 'already-up-to-date', resolvedPackageName, catalogId)
        }
      } else {
        if (currentVersion === null || semver.valid(currentVersion) === null) {
          return emptyPlan(this.options.profile.runtime.profileName, request.action, 'installed-version-invalid', resolvedPackageName, catalogId)
        }
        if (semver.valid(resolvedVersion) === null || !semver.gt(resolvedVersion, currentVersion)) {
          return emptyPlan(this.options.profile.runtime.profileName, request.action, 'already-up-to-date', resolvedPackageName, catalogId)
        }
      }
    }
    targetVersion = resolvedVersion
    sourceSpec = resolvedSpec
    lifecycleScripts = resolvedScripts
    return this.storePlan({
      action: request.action,
      catalogId,
      packageName: resolvedPackageName,
      currentVersion,
      targetVersion,
      sourceSpec,
      artifactIntegrity,
      lifecycleScripts,
      warnings: [
        ...(detail === null ? warningList({ warnings: artifact?.warnings ?? [] }, request.action) : warningList(detail, request.action)),
        ...(artifact === null ? [] : ['uncatalogued-update' as const]),
      ],
    })
  }

  private storePlan(input: {
    action: OperationAction
    catalogId: string | null
    packageName: string
    currentVersion: string | null
    targetVersion: string | null
    sourceSpec: string | null
    artifactIntegrity: string | null
    lifecycleScripts: readonly string[]
    warnings: readonly OperationWarning[]
  }): OperationPlan {
    const planId = randomUUID()
    const expiresAt = new Date(this.now() + PLAN_TTL_MS).toISOString()
    const plan: OperationPlan & { readonly status: 'ready'; readonly planId: string } = {
      status: 'ready',
      planId,
      blockReason: null,
      profileName: this.options.profile.runtime.profileName,
      catalogId: input.catalogId,
      packageName: input.packageName,
      currentVersion: input.currentVersion,
      targetVersion: input.targetVersion,
      sourceSpec: input.sourceSpec,
      artifactIntegrity: input.artifactIntegrity,
      lifecycleScripts: [...input.lifecycleScripts],
      warnings: [...input.warnings],
      expiresAt,
      action: input.action,
    }
    this.plans.set(planId, { plan, fingerprint: this.options.profile.fingerprint() })
    return plan
  }

  async execute(planId: string): Promise<OperationResult> {
    this.prunePlans()
    if (this.disposed) return snapshotResult(this.options.profile, null, 'manager-disposed', null, false, 'not-needed', null)
    if (this.operation !== null || this.busy) return snapshotResult(this.options.profile, null, 'operation-busy', null, false, 'not-needed', null)
    const stored = this.plans.get(planId)
    this.plans.delete(planId)
    if (stored === undefined) return snapshotResult(this.options.profile, null, 'plan-invalid-or-expired', null, false, 'not-needed', null)
    if (Date.parse(stored.plan.expiresAt ?? '') <= this.now()) return snapshotResult(this.options.profile, stored.plan.action, 'plan-expired', stored.plan.packageName, false, 'not-needed', null)
    if (stored.fingerprint !== this.options.profile.fingerprint()) return snapshotResult(this.options.profile, stored.plan.action, 'profile-changed', stored.plan.packageName, false, 'not-needed', null)
    const plan = stored.plan
    if (plan.packageName === null) return snapshotResult(this.options.profile, plan.action, 'plan-invalid', null, false, 'not-needed', null)

    // Reserve synchronously before any filesystem or process await. A second
    // request in the same turn therefore cannot enter the mutation path.
    this.options.profile.setBusy(true)
    const operation = this.prepareAndRun(plan)
      .then(result => ({
        ...result,
        capabilities: { ...result.capabilities, busy: false },
      }))
      .finally(() => this.options.profile.setBusy(false))
    this.operation = operation
    try {
      return await operation
    } finally {
      if (this.operation === operation) this.operation = null
    }
  }

  private async prepareAndRun(plan: OperationPlan & { readonly status: 'ready' }): Promise<OperationResult> {
    if (!(await this.planStillTargetsCurrentState(plan))) {
      return snapshotResult(this.options.profile, plan.action, 'plan-state-changed', plan.packageName, false, 'not-needed', null)
    }
    let backups: readonly FileBackup[]
    try {
      backups = await Promise.all([
        backupFile(join(this.options.profile.runtime.dir, 'package.json')),
        backupFile(join(this.options.profile.runtime.dir, 'pnpm-lock.yaml')),
        backupFile(join(this.options.profile.runtime.dir, 'pnpm-workspace.yaml')),
        backupFile(profilePatchPath(this.options.profile.runtime)),
      ])
    } catch (error) {
      return snapshotResult(this.options.profile, plan.action, 'backup-failed', plan.packageName, false, 'not-needed', errorMessage(error))
    }
    return this.runPlan(plan, backups)
  }

  private async planStillTargetsCurrentState(plan: OperationPlan & { readonly status: 'ready' }): Promise<boolean> {
    if (plan.action === 'pause' || plan.action === 'resume') {
      const rows = await this.options.profile.list('zh', false)
      const row = rows.find(item => item.packageName === plan.packageName)
      if (row === undefined || !row.directDependency || row.system || row.version !== plan.currentVersion) return false
      if (row.runtimeEntries.length === 0) return false
      const paused = row.state === 'paused' || row.state === 'partially-paused'
      return plan.action === 'pause' ? !paused : paused
    }
    if (plan.action === 'remove') {
      const rows = await this.options.profile.list('zh', false)
      const row = rows.find(item => item.packageName === plan.packageName)
      return row !== undefined && row.directDependency && !row.system && row.version === plan.currentVersion
    }
    if (plan.catalogId !== null) {
      const detail = await this.options.catalog.detail(plan.catalogId, 'en', true)
      if (detail === null || detail.verification !== 'verified' || detail.installSpec !== plan.sourceSpec) return false
      if (detail.integrity !== plan.artifactIntegrity) return false
    } else if (plan.action === 'update' && plan.packageName !== null) {
      const artifact = await this.options.catalog.latestNpmArtifact(plan.packageName)
      if (artifact === null || artifact.sourceSpec !== plan.sourceSpec || artifact.integrity !== plan.artifactIntegrity) return false
    }
    const rows = await this.options.profile.list('zh', false)
    const row = rows.find(item => item.packageName === plan.packageName)
    if (plan.action === 'install') return row === undefined
    return row !== undefined && row.directDependency && row.version === plan.currentVersion
  }

  private async runPlan(plan: OperationPlan & { readonly status: 'ready' }, backups: readonly FileBackup[]): Promise<OperationResult> {
    if (plan.action === 'pause' || plan.action === 'resume') {
      const paused = plan.action === 'pause'
      let targets: readonly PluginActivationTarget[]
      try {
        targets = await this.options.profile.setPluginPaused(plan.packageName as string, paused)
      } catch (error) {
        const rollback = await this.rollbackActivation(backups)
        return snapshotResult(this.options.profile, plan.action, 'activation-change-failed', plan.packageName, false, rollback, errorMessage(error))
      }
      const composition = await this.runCommand(
        ['--profile', this.options.profile.runtime.profileName, '--dump-config'],
        this.options.profile.runtime.dir,
        this.timeoutMs,
      )
      if (composition.unavailable || composition.timedOut || composition.code !== 0) {
        const rollback = await this.rollbackActivation(backups)
        return snapshotResult(this.options.profile, plan.action, 'composition-validation-failed', plan.packageName, false, rollback, composition.output)
      }
      if (composition.stdoutTruncated || !activationDumpMatches(composition.stdout ?? composition.output, targets, paused)) {
        const rollback = await this.rollbackActivation(backups)
        return snapshotResult(this.options.profile, plan.action, 'activation-validation-failed', plan.packageName, false, rollback, null)
      }
      return snapshotResult(this.options.profile, plan.action, 'succeeded', plan.packageName, true, 'not-needed', null)
    }

    const args = plan.action === 'remove'
      ? ['plugin', '--profile', this.options.profile.runtime.profileName, 'remove', plan.packageName as string]
      : [
          'plugin', '--profile', this.options.profile.runtime.profileName, 'add',
          '--save-exact', '--ignore-scripts', plan.sourceSpec as string,
        ]
    const result = await this.runCommand(args, this.options.profile.runtime.dir, this.timeoutMs)
    if (result.unavailable) {
      const rollback = await this.rollback(backups)
      return snapshotResult(this.options.profile, plan.action, 'dsh-command-indeterminate', plan.packageName, false, rollback, result.output)
    }
    if (result.timedOut) {
      const rollback = await this.rollback(backups)
      return snapshotResult(this.options.profile, plan.action, 'operation-timeout', plan.packageName, false, rollback, result.output)
    }
    if (result.code !== 0) {
      const rollback = await this.rollback(backups)
      return snapshotResult(this.options.profile, plan.action, 'dsh-command-failed', plan.packageName, false, rollback, result.output)
    }
    const installed = await this.options.profile.list('zh', false)
    const row = installed.find(item => item.packageName === plan.packageName)
    const integrityValid = plan.action === 'remove' || plan.artifactIntegrity === null
      ? true
      : plan.targetVersion !== null && await lockfileHasIntegrity(
          this.options.profile.runtime.dir,
          plan.packageName as string,
          plan.targetVersion,
          plan.artifactIntegrity,
        )
    const valid = plan.action === 'remove'
      ? row === undefined || !row.directDependency
      : row !== undefined
        && row.directDependency
        && row.bundle
        && row.version === plan.targetVersion
        && integrityValid
    if (!valid) {
      const rollback = await this.rollback(backups)
      return snapshotResult(this.options.profile, plan.action, 'post-install-validation-failed', plan.packageName, false, rollback, result.output)
    }

    // Ask the official launcher to compose the persisted layers before calling
    // the operation successful. This catches missing patch files and bad rows.
    const composition = await this.runCommand(
      ['--profile', this.options.profile.runtime.profileName, '--dump-config'],
      this.options.profile.runtime.dir,
      this.timeoutMs,
    )
    if (composition.unavailable || composition.timedOut || composition.code !== 0) {
      const rollback = await this.rollback(backups)
      return snapshotResult(
        this.options.profile,
        plan.action,
        'composition-validation-failed',
        plan.packageName,
        false,
        rollback,
        composition.output ?? result.output,
      )
    }
    return snapshotResult(this.options.profile, plan.action, 'succeeded', plan.packageName, true, 'not-needed', result.output)
  }

  private async rollbackActivation(backups: readonly FileBackup[]): Promise<OperationResult['rollback']> {
    const restored = await this.rollback(backups, false)
    if (restored === 'failed') return 'failed'
    const validation = await this.runCommand(
      ['--profile', this.options.profile.runtime.profileName, '--dump-config'],
      this.options.profile.runtime.dir,
      this.timeoutMs,
    )
    return validation.code === 0 && !validation.unavailable && !validation.timedOut ? 'succeeded' : 'failed'
  }

  private async rollback(backups: readonly FileBackup[], repairPackages = true): Promise<OperationResult['rollback']> {
    try {
      if (!(await backupFilesChanged(backups))) return 'not-needed'
      await restoreFiles(backups)
      if (!repairPackages) return 'succeeded'
      await rm(join(this.options.profile.runtime.dir, 'node_modules'), { recursive: true, force: true })
      const hasLockfile = backups.some(file => file.path.endsWith('pnpm-lock.yaml') && file.content !== null)
      const installArgs = ['plugin', '--profile', this.options.profile.runtime.profileName, 'install']
      if (hasLockfile) installArgs.push('--frozen-lockfile')
      installArgs.push('--ignore-scripts')
      const repair = await this.runCommand(installArgs, this.options.profile.runtime.dir, this.timeoutMs)
      return repair.code === 0 && !repair.unavailable && !repair.timedOut ? 'succeeded' : 'failed'
    } catch {
      return 'failed'
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
