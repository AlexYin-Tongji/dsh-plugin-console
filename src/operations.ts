/**
 * Serialized, confirmation-gated profile mutations backed by the official dsh CLI.
 * The reviewed-plan/recovery architecture was informed by the MIT-licensed
 * DSH Plugin Marketplace and substantially hardened here; see THIRD_PARTY_NOTICES.md.
 */

import { randomUUID } from 'node:crypto'
import { access, mkdtemp, readFile, rename, rm } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import semver from 'semver'
import { isSeq, parse as parseYaml, parseDocument, type ScalarTag } from 'yaml'
import type { NpmArtifact, PluginCatalog } from './catalog.ts'
import { runActivationCanary, type ActivationCanaryRequest, type ActivationCanaryResult } from './canary.ts'
import { copyDependencyTree } from './dependency-tree.ts'
import { profilePatchPath, type PluginActivationTarget, type ProfileManager } from './profile.ts'
import { acquireProfileLock, ProfileLockedError } from './lock.ts'
import { processExit, terminateProcessTree } from './process.ts'
import type {
  CatalogPluginDetail,
  InstalledPluginSummary,
  OperationAction,
  OperationPlan,
  OperationPlanRequest,
  OperationResult,
  OperationWarning,
} from './types.ts'
import { errorMessage, isRecord, redactProcessOutput, writeFileAtomic } from './util.ts'

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
  readonly processCleanup?: boolean
}

interface FileBackup {
  readonly path: string
  readonly content: string | null
}

interface DependencyBackup {
  readonly root: string
  snapshot: string | null
  preserve: boolean
}

export interface OperationOptions {
  readonly profile: ProfileManager
  readonly catalog: PluginCatalog
  readonly dshBin: string
  readonly timeoutMs?: number
  readonly canaryTimeoutMs?: number
  readonly runCommand?: (args: readonly string[], cwd: string, timeoutMs: number) => Promise<CommandResult>
  readonly probeActivation?: (request: ActivationCanaryRequest) => Promise<ActivationCanaryResult>
  readonly lockProfile?: (profileDir: string) => Promise<() => Promise<void>>
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
    currentSpec: null,
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

async function snapshotResult(
  profile: ProfileManager,
  action: OperationAction | null,
  code: string,
  packageName: string | null,
  restartRequired: boolean,
  rollback: OperationResult['rollback'],
  detail: string | null,
  canary: OperationResult['canary'] = 'not-run',
  processCleanup: OperationResult['processCleanup'] = 'not-needed',
): Promise<OperationResult> {
  const [installedResult, capabilitiesResult] = await Promise.allSettled([
    profile.list('zh', false),
    profile.capabilities(),
  ])
  const snapshotError = installedResult.status === 'rejected'
    ? errorMessage(installedResult.reason)
    : capabilitiesResult.status === 'rejected'
      ? errorMessage(capabilitiesResult.reason)
      : null
  return {
    status: code === 'succeeded' ? 'succeeded' : 'failed',
    code,
    action,
    packageName,
    restartRequired,
    activation: code === 'succeeded' && restartRequired
      ? 'pending-restart'
      : rollback === 'failed' || processCleanup === 'failed'
        ? 'unknown'
        : 'unchanged',
    canary,
    processCleanup,
    rollback,
    detail: detail ?? snapshotError,
    installed: installedResult.status === 'fulfilled' ? installedResult.value : [],
    capabilities: capabilitiesResult.status === 'fulfilled'
      ? capabilitiesResult.value
      : {
          profileName: profile.runtime.profileName,
          profileWritable: false,
          dshAvailable: false,
          pnpmAvailable: false,
          busy: false,
          message: snapshotError ?? 'The profile state could not be read after the operation.',
        },
  }
}

async function command(
  executable: string,
  args: readonly string[],
  cwd: string,
  timeoutMs: number,
): Promise<CommandResult> {
  let stdout = ''
  let stderr = ''
  let stdoutTruncated = false
  let startError: Error | null = null
  const child = spawn(executable, [...args], {
    cwd,
    detached: process.platform !== 'win32',
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
  const exited = processExit(child, error => { startError = error })
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<null>(resolve => {
    timeoutHandle = setTimeout(() => resolve(null), timeoutMs)
  })
  const exit = await Promise.race([exited, timeout])
  if (timeoutHandle !== undefined) clearTimeout(timeoutHandle)
  let timedOut = false
  let processCleanup = true
  if (exit === null) {
    timedOut = true
    processCleanup = await terminateProcessTree(child, exited)
    if (!processCleanup) stderr += '\nThe timed-out command process tree could not be terminated completely.'
  }
  const output = redactProcessOutput(`${stdout}\n${stderr}`)
  if (startError !== null) {
    return {
      code: 1,
      unavailable: (startError as NodeJS.ErrnoException).code === 'ENOENT',
      timedOut,
      output: output ?? errorMessage(startError),
      stdout: stdout.trim().length === 0 ? null : stdout,
      stdoutTruncated,
      processCleanup,
    }
  }
  return {
    code: exit?.code ?? null,
    unavailable: false,
    timedOut,
    output,
    stdout: stdout.trim().length === 0 ? null : stdout,
    stdoutTruncated,
  }
}

async function backupFile(path: string): Promise<FileBackup> {
  try {
    return { path, content: await readFile(path, 'utf8') }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { path, content: null }
    throw error
  }
}

function manifestRecordField(value: Record<string, unknown>, field: string, context: string): Record<string, unknown> | undefined {
  const nested = value[field]
  if (nested === undefined) return undefined
  if (!isRecord(nested)) throw new Error(`${context}.${field} must be an object.`)
  return nested
}

function manifestBundles(manifest: Record<string, unknown>): string[] {
  const dsh = manifestRecordField(manifest, 'dsh', 'package.json')
  if (dsh === undefined) return []
  const profile = manifestRecordField(dsh, 'profile', 'package.json.dsh')
  if (profile === undefined || profile.bundles === undefined) return []
  if (!Array.isArray(profile.bundles) || profile.bundles.some(bundle => typeof bundle !== 'string')) {
    throw new Error('package.json.dsh.profile.bundles must be an array of package names.')
  }
  return profile.bundles as string[]
}

async function removeBundleFromProfileManifest(profileDir: string, packageName: string): Promise<void> {
  const path = join(profileDir, 'package.json')
  let raw: string
  try {
    raw = await readFile(path, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return
    throw error
  }
  const parsed: unknown = JSON.parse(raw)
  if (!isRecord(parsed)) throw new Error('The profile package.json must contain an object.')
  const dependencies = manifestRecordField(parsed, 'dependencies', 'package.json')
  const dependencyPresent = dependencies !== undefined
    && Object.prototype.hasOwnProperty.call(dependencies, packageName)
  if (dependencyPresent) {
    throw new Error(`The package manager reported removal success, but ${packageName} is still a profile dependency.`)
  }

  const dsh = manifestRecordField(parsed, 'dsh', 'package.json')
  const profile = dsh === undefined ? undefined : manifestRecordField(dsh, 'profile', 'package.json.dsh')
  const bundles = profile === undefined || profile.bundles === undefined
    ? []
    : manifestBundles(parsed)
  const remaining = bundles.filter(bundle => bundle !== packageName)
  if (remaining.length !== bundles.length) {
    const nextDsh = dsh === undefined ? undefined : {
      ...dsh,
      profile: profile === undefined ? undefined : { ...profile, bundles: remaining },
    }
    const nextManifest = nextDsh === undefined ? parsed : { ...parsed, dsh: nextDsh }
    const trailingNewline = raw.endsWith('\n') ? '\n' : ''
    await writeFileAtomic(path, `${JSON.stringify(nextManifest, null, 2)}${trailingNewline}`)
  }
}

function workspaceReleaseAgeExclusions(raw: string): string[] {
  const document = parseDocument(raw)
  if (document.errors.length > 0) throw document.errors[0]
  const value = document.get('minimumReleaseAgeExclude', true)
  if (value === undefined) return []
  if (!isSeq(value) || value.items.some(item => !(typeof item === 'string' || (isRecord(item) && typeof item.value === 'string')))) {
    throw new Error('pnpm-workspace.yaml.minimumReleaseAgeExclude must be a string array.')
  }
  return value.items.map(item => typeof item === 'string' ? item : (item as { readonly value: string }).value)
}

/** Remove only release-age exceptions introduced by the package operation. */
async function removeAddedWorkspaceReleaseExclusion(
  profileDir: string,
  packageName: string,
  originalRaw: string | null,
): Promise<void> {
  const path = join(profileDir, 'pnpm-workspace.yaml')
  let raw: string
  try {
    raw = await readFile(path, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return
    throw error
  }
  const document = parseDocument(raw)
  if (document.errors.length > 0) throw document.errors[0]
  const value = document.get('minimumReleaseAgeExclude', true)
  if (value === undefined) return
  if (!isSeq(value) || value.items.some(item => !(typeof item === 'string' || (isRecord(item) && typeof item.value === 'string')))) {
    throw new Error('pnpm-workspace.yaml.minimumReleaseAgeExclude must be a string array.')
  }
  // Preserve entries that were already present before this operation. A
  // multiset handles package-manager duplicates without losing the user's
  // original count while still removing newly added copies.
  const originalCounts = new Map<string, number>()
  for (const text of originalRaw === null ? [] : workspaceReleaseAgeExclusions(originalRaw)) {
    originalCounts.set(text, (originalCounts.get(text) ?? 0) + 1)
  }
  const removed = value.items.filter(item => {
    const text = typeof item === 'string' ? item : (item as { readonly value: string }).value
    if (text !== packageName && !text.startsWith(`${packageName}@`)) return true
    const count = originalCounts.get(text) ?? 0
    if (count > 0) {
      originalCounts.set(text, count - 1)
      return true
    }
    return false
  })
  if (removed.length === value.items.length) return
  if (removed.length === 0) document.delete('minimumReleaseAgeExclude')
  else {
    value.items.splice(0, value.items.length, ...removed)
  }
  const trailingNewline = raw.endsWith('\n') ? '\n' : ''
  await writeFileAtomic(path, `${String(document).replace(/\n+$/, '')}${trailingNewline}`)
}

async function restoreFiles(files: readonly FileBackup[]): Promise<void> {
  for (const file of files) {
    if (file.content === null) await rm(file.path, { force: true })
    else await writeFileAtomic(file.path, file.content)
  }
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function backupDependencies(profileDir: string): Promise<DependencyBackup> {
  const root = await mkdtemp(join(profileDir, '.dsh-plugin-console-recovery-'))
  const source = join(profileDir, 'node_modules')
  const snapshot = join(root, 'node_modules')
  try {
    if (!(await pathExists(source))) return { root, snapshot: null, preserve: false }
    await copyDependencyTree(source, snapshot)
    return { root, snapshot, preserve: false }
  } catch (error) {
    await rm(root, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }).catch(() => undefined)
    throw error
  }
}

async function restoreDependencies(profileDir: string, backup: DependencyBackup): Promise<boolean> {
  const current = join(profileDir, 'node_modules')
  const displaced = join(backup.root, 'failed-node_modules')
  let currentMoved = false
  let snapshotMoved = false
  try {
    await rm(displaced, { recursive: true, force: true })
    if (await pathExists(current)) {
      await rename(current, displaced)
      currentMoved = true
    }
    if (backup.snapshot !== null) {
      await rename(backup.snapshot, current)
      snapshotMoved = true
      backup.snapshot = null
    }
    try {
      await rm(displaced, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 })
    } catch {
      // The restored snapshot is the authoritative state. Keep it in place
      // and let the caller report recovery failure without deleting it.
      return false
    }
    return true
  } catch {
    // A failed rename must not turn a recoverable profile into an empty one.
    // If the snapshot is still available, install it only when the current
    // path is absent; otherwise preserve the current tree for inspection.
    try {
      if (!snapshotMoved && backup.snapshot !== null && !(await pathExists(current))) {
        await rename(backup.snapshot, current)
        backup.snapshot = null
        snapshotMoved = true
      }
      if (snapshotMoved) {
        if (currentMoved) {
          try {
            await rm(displaced, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 })
          } catch {
            return false
          }
        }
        return true
      }
    } catch {
      // Fall through with the snapshot and/or displaced tree untouched.
    }
    return false
  }
}

async function cleanupDependencyBackup(backup: DependencyBackup | null): Promise<void> {
  if (backup === null || backup.preserve) return
  await rm(backup.root, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 })
}

function preserveDependencyBackup(backup: DependencyBackup | null): void {
  if (backup !== null) backup.preserve = true
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

function requestedSpecMatchesPlan(requestedSpec: string | null, plan: OperationPlan): boolean {
  if (requestedSpec === null || plan.sourceSpec === null) return false
  if (plan.sourceSpec.startsWith('github:') || plan.sourceSpec.startsWith('git+')) return requestedSpec === plan.sourceSpec
  const fileSpec = plan.sourceSpec.startsWith('/') ? `file:${plan.sourceSpec}` : plan.sourceSpec
  return requestedSpec === plan.sourceSpec || requestedSpec === fileSpec || requestedSpec === plan.targetVersion
}

function packageManagerRejectedBeforeMutation(output: string | null): boolean {
  if (output === null) return false
  return /ERR_PNPM_(?:MINIMUM_RELEASE_AGE_VIOLATION|TRUST_DOWNGRADE|LOCKFILE_RESOLUTION_VERIFICATION|FROZEN_LOCKFILE_WITH_OUTDATED_LOCKFILE|BROKEN_LOCKFILE|OUTDATED_LOCKFILE)/.test(output)
}

function warningList(detail: Pick<CatalogPluginDetail, 'warnings'>, action: OperationAction): OperationWarning[] {
  const warnings: OperationWarning[] = []
  if (action === 'pause' || action === 'resume') {
    warnings.push('restart-required')
  } else if (action === 'remove') {
    warnings.push('remove-data-kept')
  } else {
    warnings.push('trusted-code', 'restart-required', 'scripts-disabled', 'canary-validation')
    if (detail.warnings.includes('dsh-compatibility-not-declared')) warnings.push('compatibility-unknown')
  }
  return warnings
}

/** Owns one mutation at a time and never exposes arbitrary package-manager args. */
export class ProfileOperations {
  private readonly plans = new Map<string, StoredPlan>()
  private readonly runCommand: (args: readonly string[], cwd: string, timeoutMs: number) => Promise<CommandResult>
  private readonly probeActivation: (request: ActivationCanaryRequest) => Promise<ActivationCanaryResult>
  private readonly lockProfile: (profileDir: string) => Promise<() => Promise<void>>
  private readonly now: () => number
  private readonly timeoutMs: number
  private readonly canaryTimeoutMs: number
  private operation: Promise<OperationResult> | null = null
  private disposed = false

  constructor(private readonly options: OperationOptions) {
    this.runCommand = options.runCommand ?? ((args, cwd, timeoutMs) => command(options.dshBin, args, cwd, timeoutMs))
    this.probeActivation = options.probeActivation ?? runActivationCanary
    this.lockProfile = options.lockProfile ?? acquireProfileLock
    this.now = options.now ?? (() => Date.now())
    this.timeoutMs = options.timeoutMs ?? 5 * 60 * 1000
    this.canaryTimeoutMs = options.canaryTimeoutMs ?? 60_000
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
    let currentSpec: string | null = null
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
        currentSpec: row.requestedSpec,
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
      currentSpec = row.requestedSpec
      catalogId = row.catalogId
      const warnings: OperationWarning[] = warningList({ warnings: [] }, request.action)
      if (packageName === 'dsh-plugin-console') warnings.push('self-removal')
      return this.storePlan({
        action: request.action,
        catalogId,
        packageName,
        currentVersion,
        currentSpec,
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
      if (row.state === 'pending-install' || row.state === 'pending-update' || row.state === 'pending-removal') {
        return emptyPlan(this.options.profile.runtime.profileName, request.action, 'restart-required-before-next-change', resolvedPackageName, catalogId)
      }
      if (artifact !== null && (row.repositoryUrl === null || row.repositoryUrl.toLocaleLowerCase() !== artifact.repositoryUrl.toLocaleLowerCase())) {
        return emptyPlan(this.options.profile.runtime.profileName, request.action, 'artifact-repository-mismatch', resolvedPackageName, catalogId)
      }
      currentVersion = row.version
      currentSpec = row.requestedSpec
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
      currentSpec,
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
    currentSpec: string | null
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
      currentSpec: input.currentSpec,
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
    const operation = this.prepareAndRun(plan, stored.fingerprint)
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

  private profileFiles(): Promise<readonly FileBackup[]> {
    return Promise.all([
      backupFile(join(this.options.profile.runtime.dir, 'package.json')),
      backupFile(join(this.options.profile.runtime.dir, 'pnpm-lock.yaml')),
      backupFile(join(this.options.profile.runtime.dir, 'pnpm-workspace.yaml')),
      backupFile(profilePatchPath(this.options.profile.runtime)),
    ])
  }

  private async prepareAndRun(
    plan: OperationPlan & { readonly status: 'ready' },
    fingerprint: string,
  ): Promise<OperationResult> {
    let release: (() => Promise<void>) | null = null
    try {
      release = await this.lockProfile(this.options.profile.runtime.dir)
    } catch (error) {
      const code = error instanceof ProfileLockedError ? 'profile-locked' : 'profile-lock-failed'
      return snapshotResult(this.options.profile, plan.action, code, plan.packageName, false, 'not-needed', errorMessage(error))
    }
    try {
      if (fingerprint !== this.options.profile.fingerprint()) {
        return snapshotResult(this.options.profile, plan.action, 'profile-changed', plan.packageName, false, 'not-needed', null)
      }
      if (!(await this.planStillTargetsCurrentState(plan))) {
        return snapshotResult(this.options.profile, plan.action, 'plan-state-changed', plan.packageName, false, 'not-needed', null)
      }
      let backups: readonly FileBackup[]
      let dependencies: DependencyBackup | null = null
      try {
        backups = await this.profileFiles()
        if (plan.action === 'install' || plan.action === 'update' || plan.action === 'remove') {
          dependencies = await backupDependencies(this.options.profile.runtime.dir)
        }
      } catch (error) {
        await cleanupDependencyBackup(dependencies).catch(() => undefined)
        return snapshotResult(this.options.profile, plan.action, 'backup-failed', plan.packageName, false, 'not-needed', errorMessage(error))
      }
      try {
        return await this.runPlan(plan, backups, dependencies)
      } finally {
        await cleanupDependencyBackup(dependencies).catch(() => undefined)
      }
    } finally {
      await release().catch(() => undefined)
    }
  }

  private async planStillTargetsCurrentState(plan: OperationPlan & { readonly status: 'ready' }): Promise<boolean> {
    if (plan.action === 'pause' || plan.action === 'resume') {
      const rows = await this.options.profile.list('zh', false)
      const row = rows.find(item => item.packageName === plan.packageName)
      if (row === undefined || !row.directDependency || row.system || row.version !== plan.currentVersion || row.requestedSpec !== plan.currentSpec) return false
      if (row.runtimeEntries.length === 0) return false
      const paused = row.state === 'paused' || row.state === 'partially-paused'
      return plan.action === 'pause' ? !paused : paused
    }
    if (plan.action === 'remove') {
      const rows = await this.options.profile.list('zh', false)
      const row = rows.find(item => item.packageName === plan.packageName)
      return row !== undefined && row.directDependency && !row.system && row.version === plan.currentVersion && row.requestedSpec === plan.currentSpec
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
    return row !== undefined
      && row.directDependency
      && row.version === plan.currentVersion
      && row.requestedSpec === plan.currentSpec
  }

  private async runPlan(
    plan: OperationPlan & { readonly status: 'ready' },
    backups: readonly FileBackup[],
    dependencies: DependencyBackup | null,
  ): Promise<OperationResult> {
    if (plan.action === 'pause' || plan.action === 'resume') {
      const paused = plan.action === 'pause'
      let targets: readonly PluginActivationTarget[]
      try {
        targets = await this.options.profile.setPluginPaused(plan.packageName as string, paused)
      } catch (error) {
        const rollback = await this.rollbackActivation(backups)
        return snapshotResult(this.options.profile, plan.action, 'activation-change-failed', plan.packageName, false, rollback, errorMessage(error))
      }
      let composition: CommandResult
      try {
        composition = await this.runCommand(
          ['--profile', this.options.profile.runtime.profileName, '--dump-config'],
          this.options.profile.runtime.dir,
          this.timeoutMs,
        )
      } catch (error) {
        const rollback = await this.rollbackActivation(backups)
        return snapshotResult(this.options.profile, plan.action, 'composition-validation-failed', plan.packageName, false, rollback, errorMessage(error))
      }
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
    let removalTargets: readonly PluginActivationTarget[] = []
    if (plan.action === 'remove') {
      try {
        removalTargets = (await this.options.profile.activationDescriptor(plan.packageName as string)).targets
      } catch {
        // A malformed bundle cannot provide safe target names. The package
        // removal still proceeds, while manifest and dependency cleanup below
        // remain authoritative.
      }
    }
    let result: CommandResult
    try {
      result = await this.runCommand(args, this.options.profile.runtime.dir, this.timeoutMs)
    } catch (error) {
      preserveDependencyBackup(dependencies)
      return snapshotResult(
        this.options.profile,
        plan.action,
        'dsh-command-indeterminate',
        plan.packageName,
        false,
        'failed',
        errorMessage(error),
        'not-run',
        'failed',
      )
    }
    let mutationState: readonly FileBackup[]
    try {
      // Current DSH releases reconcile this list themselves, but older or
      // replaced launchers may only remove the package-manager dependency.
      // Keep the profile invariant local to this confirmed removal so a stale
      // bundle can never survive into the next startup.
      if (result.code === 0 && plan.action === 'remove') {
        if (removalTargets.length > 0 && typeof this.options.profile.removePluginPauseOverrides === 'function') {
          await this.options.profile.removePluginPauseOverrides(removalTargets)
        }
        await removeBundleFromProfileManifest(this.options.profile.runtime.dir, plan.packageName as string)
        await removeAddedWorkspaceReleaseExclusion(
          this.options.profile.runtime.dir,
          plan.packageName as string,
          backups.find(file => file.path === join(this.options.profile.runtime.dir, 'pnpm-workspace.yaml'))?.content ?? null,
        )
      }
      mutationState = await this.profileFiles()
    } catch (error) {
      try {
        mutationState = await this.profileFiles()
      } catch {
        preserveDependencyBackup(dependencies)
        return snapshotResult(this.options.profile, plan.action, 'mutation-snapshot-failed', plan.packageName, false, 'failed', errorMessage(error))
      }
      const rollback = await this.rollback(backups, true, plan, mutationState, dependencies)
      return snapshotResult(this.options.profile, plan.action, 'profile-manifest-repair-failed', plan.packageName, false, rollback, errorMessage(error))
    }
    if (result.unavailable) {
      const rollback = await this.rollback(backups, true, plan, mutationState, dependencies, true)
      return snapshotResult(this.options.profile, plan.action, 'dsh-command-indeterminate', plan.packageName, false, rollback, result.output)
    }
    if (result.timedOut) {
      if (result.processCleanup === false) {
        preserveDependencyBackup(dependencies)
        return snapshotResult(this.options.profile, plan.action, 'operation-process-leaked', plan.packageName, false, 'failed', result.output, 'not-run', 'failed')
      }
      const rollback = await this.rollback(backups, true, plan, mutationState, dependencies)
      return snapshotResult(this.options.profile, plan.action, 'operation-timeout', plan.packageName, false, rollback, result.output, 'not-run', 'succeeded')
    }
    if (result.code !== 0) {
      const rollback = await this.rollback(backups, true, plan, mutationState, dependencies, packageManagerRejectedBeforeMutation(result.output))
      return snapshotResult(this.options.profile, plan.action, 'dsh-command-failed', plan.packageName, false, rollback, result.output)
    }
    try {
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
      const githubSource = plan.sourceSpec?.startsWith('github:') === true || plan.sourceSpec?.startsWith('git+') === true
      const valid = plan.action === 'remove'
        ? row === undefined || !row.directDependency
        : row !== undefined
          && row.directDependency
          && row.bundle
          && row.version === plan.targetVersion
          && (!githubSource || row.requestedSpec === plan.sourceSpec)
          && integrityValid
      if (!valid) {
        const rollback = await this.rollback(backups, true, plan, mutationState, dependencies)
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
        const rollback = await this.rollback(backups, true, plan, mutationState, dependencies)
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
      if (plan.action === 'remove') {
        if (await backupFilesChanged(mutationState)) {
          preserveDependencyBackup(dependencies)
          return snapshotResult(
            this.options.profile,
            plan.action,
            'profile-changed-during-removal',
            plan.packageName,
            false,
            'failed',
            'The profile changed outside this operation while removal was being validated; the changed state was left untouched.',
          )
        }
        return snapshotResult(this.options.profile, plan.action, 'succeeded', plan.packageName, true, 'not-needed', result.output)
      }

      let canary: ActivationCanaryResult
      try {
        canary = await this.runIsolatedActivation(plan.packageName as string, plan.targetVersion as string)
      } catch (error) {
        const rollback = await this.rollback(backups, true, plan, mutationState, dependencies)
        return snapshotResult(this.options.profile, plan.action, 'canary-preparation-failed', plan.packageName, false, rollback, errorMessage(error), 'failed')
      }
      if (canary.status !== 'passed') {
        const rollback = await this.rollback(backups, true, plan, mutationState, dependencies)
        const detail = canary.detail === null ? null : redactProcessOutput(canary.detail)
        const cleanup = canary.code === 'canary-shutdown-failed' ? 'failed' : 'succeeded'
        return snapshotResult(this.options.profile, plan.action, canary.code, plan.packageName, false, rollback, detail, 'failed', cleanup)
      }
      if (await backupFilesChanged(mutationState)) {
        preserveDependencyBackup(dependencies)
        return snapshotResult(
          this.options.profile,
          plan.action,
          'profile-changed-during-canary',
          plan.packageName,
          false,
          'failed',
          'The profile changed outside this operation while the isolated canary was running; the tested snapshot was not accepted.',
          'failed',
          'succeeded',
        )
      }
      const finalRow = (await this.options.profile.list('zh', false)).find(row => row.packageName === plan.packageName)
      if (finalRow === undefined || finalRow.version !== plan.targetVersion || !requestedSpecMatchesPlan(finalRow.requestedSpec, plan)) {
        preserveDependencyBackup(dependencies)
        return snapshotResult(this.options.profile, plan.action, 'profile-changed-during-canary', plan.packageName, false, 'failed', null, 'failed', 'succeeded')
      }
      return snapshotResult(this.options.profile, plan.action, 'succeeded', plan.packageName, true, 'not-needed', result.output, 'passed', 'succeeded')
    } catch (error) {
      const rollback = await this.rollback(backups, true, plan, mutationState, dependencies)
      return snapshotResult(this.options.profile, plan.action, 'post-install-validation-failed', plan.packageName, false, rollback, errorMessage(error))
    }
  }

  private async runIsolatedActivation(packageName: string, expectedVersion: string): Promise<ActivationCanaryResult> {
    const descriptor = await this.options.profile.activationDescriptor(packageName)
    return this.probeActivation({
      profileDir: this.options.profile.runtime.dir,
      profileName: this.options.profile.runtime.profileName,
      dshBin: this.options.dshBin,
      packageName,
      expectedVersion,
      targets: descriptor.targets,
      configurationTargets: descriptor.configurationTargets,
      configurationOnly: descriptor.configurationOnly,
      timeoutMs: this.canaryTimeoutMs,
    })
  }

  private async rollbackActivation(backups: readonly FileBackup[]): Promise<OperationResult['rollback']> {
    try {
      const restored = await this.rollback(backups, false)
      if (restored === 'failed') return 'failed'
      const validation = await this.runCommand(
        ['--profile', this.options.profile.runtime.profileName, '--dump-config'],
        this.options.profile.runtime.dir,
        this.timeoutMs,
      )
      return validation.code === 0 && !validation.unavailable && !validation.timedOut ? 'succeeded' : 'failed'
    } catch {
      return 'failed'
    }
  }

  private async rollbackStateMatches(plan: OperationPlan & { readonly status: 'ready' }): Promise<boolean> {
    const rows = await this.options.profile.list('zh', false)
    const row = rows.find(item => item.packageName === plan.packageName)
    if (plan.action === 'install') return row === undefined || !row.directDependency
    if (plan.action !== 'update' && plan.action !== 'remove') return true
    return row !== undefined
      && row.directDependency
      && row.bundle
      && row.version === plan.currentVersion
      && row.requestedSpec === plan.currentSpec
  }

  private async rollback(
    backups: readonly FileBackup[],
    repairPackages = true,
    plan?: OperationPlan & { readonly status: 'ready' },
    expectedCurrent?: readonly FileBackup[],
    dependencies: DependencyBackup | null = null,
    metadataNoopSafe = false,
  ): Promise<OperationResult['rollback']> {
    const failed = (): OperationResult['rollback'] => {
      preserveDependencyBackup(dependencies)
      return 'failed'
    }
    try {
      const metadataChanged = await backupFilesChanged(backups)
      if (!metadataChanged && (!repairPackages || metadataNoopSafe)) return 'not-needed'
      if (expectedCurrent !== undefined && await backupFilesChanged(expectedCurrent)) return failed()
      if (metadataChanged) await restoreFiles(backups)
      if (!repairPackages) return 'succeeded'
      let dependenciesRestored = false
      if (dependencies !== null) dependenciesRestored = await restoreDependencies(this.options.profile.runtime.dir, dependencies)
      if (!dependenciesRestored) {
        const hasLockfile = backups.some(file => file.path.endsWith('pnpm-lock.yaml') && file.content !== null)
        const installArgs = ['plugin', '--profile', this.options.profile.runtime.profileName, 'install', '--force', '--package-import-method=copy']
        if (hasLockfile) installArgs.push('--frozen-lockfile')
        installArgs.push('--ignore-scripts')
        const repair = await this.runCommand(installArgs, this.options.profile.runtime.dir, this.timeoutMs)
        if (repair.code !== 0 || repair.unavailable || repair.timedOut) return failed()
      }
      const composition = await this.runCommand(
        ['--profile', this.options.profile.runtime.profileName, '--dump-config'],
        this.options.profile.runtime.dir,
        this.timeoutMs,
      )
      if (composition.code !== 0 || composition.unavailable || composition.timedOut) return failed()
      if (await backupFilesChanged(backups)) return failed()
      if (plan !== undefined && !(await this.rollbackStateMatches(plan))) return failed()
      if (plan !== undefined && (plan.action === 'update' || plan.action === 'remove')) {
        if (plan.packageName === null || plan.currentVersion === null) return failed()
        const canary = await this.runIsolatedActivation(plan.packageName, plan.currentVersion)
        if (canary.status !== 'passed') return failed()
      }
      return 'succeeded'
    } catch {
      return failed()
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
