/** Current-profile projection: package metadata, persisted layers, and live Loader state. */

import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { access, constants } from 'node:fs/promises'
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { readProfileManifest, type ProfileManifest } from '@deepseek-ai/dsh-app-boot'
import type { Context, FiberState } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/cordis-plugin-loader'
import semver from 'semver'
import type {
  InstalledPluginDetail,
  InstalledPluginSummary,
  ManagerCapabilities,
  RuntimeEntrySummary,
  RuntimePhase,
  UiLocale,
} from './types.ts'
import { errorMessage, isRecord, normalizeGithubRepository, readTextBounded, stringValue } from './util.ts'
import type { PluginCatalog } from './catalog.ts'

const PACKAGE_NAME = /^[a-z0-9][a-z0-9._~-]*$/i
const SCOPED_PACKAGE_NAME = /^@[a-z0-9][a-z0-9._~-]*\/[a-z0-9][a-z0-9._~-]*$/i
const MAX_PACKAGE_JSON_BYTES = 512_000
const NPM_TIMEOUT_MS = 8_000
const NPM_CACHE_MS = 5 * 60 * 1000
const LIFECYCLE_SCRIPT_NAMES = ['preinstall', 'install', 'postinstall', 'prepare'] as const

interface PackageJson {
  readonly name?: unknown
  readonly version?: unknown
  readonly description?: unknown
  readonly author?: unknown
  readonly license?: unknown
  readonly homepage?: unknown
  readonly repository?: unknown
  readonly keywords?: unknown
  readonly scripts?: unknown
  readonly dsh?: unknown
}

export interface ProfileRuntime {
  readonly profileName: string
  readonly dir: string
  readonly launchDependencies: Readonly<Record<string, string>>
  readonly launchBundles: readonly string[]
}

export interface ProfileManagerOptions {
  readonly ctx: Context
  readonly profileDir?: string
  readonly dshBin: string
  readonly catalog: PluginCatalog
  readonly maxReadmeBytes?: number
  readonly fetchImpl?: typeof fetch
}

function packageNameValid(name: string): boolean {
  return name.length <= 214 && (PACKAGE_NAME.test(name) || SCOPED_PACKAGE_NAME.test(name))
}

function packagePath(profileDir: string, packageName: string): string {
  return join(profileDir, 'node_modules', ...packageName.split('/'), 'package.json')
}

function pathWithin(path: string, root: string): boolean {
  const child = relative(resolve(root), resolve(path))
  return child.length === 0 || (!child.startsWith('..') && !isAbsolute(child))
}

async function readPackageJson(profileDir: string, packageName: string): Promise<{ path: string; root: string; value: PackageJson } | null> {
  if (!packageNameValid(packageName)) return null
  const directPath = packagePath(profileDir, packageName)
  const paths = [directPath]
  try {
    const require = createRequire(join(profileDir, 'package.json'))
    const resolved = require.resolve(`${packageName}/package.json`)
    // DSH's only intentional second resolution anchor is the flat profile
    // fallback. Never borrow an unrelated ancestor's package metadata.
    if (pathWithin(resolved, join(profileDir, 'node_modules'))
      || pathWithin(resolved, join(dirname(profileDir), 'node_modules'))) paths.push(resolved)
  } catch {
    // Some packages do not export package.json; the direct profile path is enough.
  }
  for (const path of [...new Set(paths)]) {
    try {
      const raw = await readTextBounded(path, MAX_PACKAGE_JSON_BYTES)
      const value: unknown = JSON.parse(raw)
      if (!isRecord(value) || value.name !== packageName) continue
      return { path, root: dirname(path), value: value as PackageJson }
    } catch {
      // A missing or malformed package is still represented by the profile row.
    }
  }
  return null
}

function packageString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null
}

function packageAuthor(value: unknown): string | null {
  if (typeof value === 'string') return packageString(value)
  return isRecord(value) ? packageString(value.name) : null
}

function packageRepository(value: unknown): string | null {
  const fullName = normalizeGithubRepository(value)
  return fullName === null ? null : `https://github.com/${fullName}`
}

function lifecycleScripts(value: unknown): readonly string[] {
  if (!isRecord(value)) return []
  return LIFECYCLE_SCRIPT_NAMES.filter(name => typeof value[name] === 'string')
}

function isBundle(value: unknown): boolean {
  return isRecord(value) && isRecord(value.bundle) && typeof value.bundle.patch === 'string'
}

function isWebClient(value: unknown): boolean {
  return isRecord(value) && isRecord(value.client) && value.client.platform === 'web'
}

/**
 * Runtime mirror: FiberState is an exported cross-package const enum.
 * This projection follows DeepSeek Harness's host-plugin-inventory pattern.
 */
const FIBER_STATE = {
  PENDING: 0 as FiberState.PENDING,
  LOADING: 1 as FiberState.LOADING,
  ACTIVE: 2 as FiberState.ACTIVE,
  FAILED: 3 as FiberState.FAILED,
  DISPOSED: 4 as FiberState.DISPOSED,
  UNLOADING: 5 as FiberState.UNLOADING,
} as const

function runtimePhase(value: FiberState): RuntimePhase {
  switch (value) {
    case FIBER_STATE.PENDING: return 'pending'
    case FIBER_STATE.LOADING: return 'loading'
    case FIBER_STATE.ACTIVE: return 'active'
    case FIBER_STATE.FAILED: return 'failed'
    case FIBER_STATE.UNLOADING: return 'unloading'
    case FIBER_STATE.DISPOSED: return null
  }
}

function launchState(
  requestedSpec: string | null,
  activeAtLaunch: boolean,
  activeAfterRestart: boolean,
  launchSpec: string | undefined,
): InstalledPluginSummary['state'] {
  if (requestedSpec === null) {
    return activeAtLaunch && !activeAfterRestart ? 'pending-removal' : 'installed-inactive'
  }
  if (activeAtLaunch && !activeAfterRestart) return 'pending-removal'
  if (!activeAtLaunch && activeAfterRestart) return 'pending-install'
  if (activeAtLaunch && launchSpec !== undefined && launchSpec !== requestedSpec) return 'pending-update'
  if (!activeAfterRestart) return 'installed-inactive'
  return 'active'
}

function npmPackageFromSpec(packageName: string, spec: string | null): boolean {
  if (spec === null) return false
  if (spec.startsWith('github:') || spec.startsWith('git:') || spec.startsWith('file:') || spec.startsWith('link:')) return false
  return spec === packageName || spec.startsWith(`${packageName}@`)
}

function githubCommitFromSpec(spec: string | null): string | null {
  if (spec === null) return null
  const match = /^(?:github:[\w.-]+\/[\w.-]+|git\+https:\/\/github\.com\/[\w.-]+\/[\w.-]+(?:\.git)?)#([0-9a-f]{40})$/i.exec(spec)
  return match?.[1]?.toLocaleLowerCase() ?? null
}

function packageVersion(value: PackageJson): string | null {
  return packageString(value.version)
}

function packageDsh(value: PackageJson): Record<string, unknown> | null {
  return isRecord(value.dsh) ? value.dsh : null
}

function runtimeEntries(ctx: Context, packageName: string): readonly RuntimeEntrySummary[] {
  const entries: RuntimeEntrySummary[] = []
  for (const entry of ctx.loader.entries()) {
    if (entry.options.group || entry.options.name !== packageName) continue
    entries.push({
      entryId: entry.id,
      enabled: !entry.disabled,
      phase: entry.fiber === undefined ? null : runtimePhase(entry.fiber.state),
    })
  }
  return entries
}

function profileFromContext(ctx: Context, explicit?: string): string {
  if (explicit !== undefined) return explicit
  if (ctx.baseUrl === undefined || !ctx.baseUrl.startsWith('file:')) {
    throw new Error('dsh-plugin-console requires a file-backed profile Loader baseUrl.')
  }
  return fileURLToPath(ctx.baseUrl)
}

async function latestNpmVersion(packageName: string, fetchImpl: typeof fetch): Promise<{ version: string | null; error: string | null }> {
  try {
    const response = await fetchImpl(`https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`, {
      signal: AbortSignal.timeout(NPM_TIMEOUT_MS),
      headers: { accept: 'application/json', 'user-agent': 'dsh-plugin-console' },
    })
    if (!response.ok) return { version: null, error: `npm returned HTTP ${String(response.status)}.` }
    const value: unknown = await response.json()
    if (!isRecord(value) || typeof value.version !== 'string') return { version: null, error: 'npm latest metadata is invalid.' }
    return { version: value.version, error: null }
  } catch (error) {
    return { version: null, error: errorMessage(error) }
  }
}

async function readProfileReadme(root: string, locale: UiLocale, maxBytes: number): Promise<{ text: string | null; file: string | null }> {
  const names = locale === 'zh' ? ['README.zh.md', 'README.zh-CN.md', 'README.md'] : ['README.md', 'README.en.md']
  for (const name of names) {
    try {
      return { text: await readTextBounded(join(root, name), maxBytes), file: name }
    } catch {
      // Try the next conventional README name.
    }
  }
  return { text: null, file: null }
}

async function writable(path: string): Promise<boolean> {
  try {
    await access(path, constants.W_OK)
    return true
  } catch {
    return false
  }
}

async function commandAvailable(command: string): Promise<boolean> {
  return new Promise(resolve => {
    const child = spawn(command, ['--version'], { stdio: ['ignore', 'ignore', 'ignore'] })
    const timer = setTimeout(() => {
      child.kill('SIGTERM')
      resolve(false)
    }, 5_000)
    child.once('error', () => {
      clearTimeout(timer)
      resolve(false)
    })
    child.once('exit', code => {
      clearTimeout(timer)
      resolve(code === 0)
    })
  })
}

async function mapWithConcurrency<T, R>(items: readonly T[], limit: number, map: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length)
  let cursor = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const index = cursor++
      const item = items[index]
      if (item === undefined) return
      results[index] = await map(item)
    }
  })
  await Promise.all(workers)
  return results
}

/** Host-owned view of one active profile. */
export class ProfileManager {
  readonly runtime: ProfileRuntime
  private readonly ctx: Context
  private readonly dshBin: string
  private readonly catalog: PluginCatalog
  private readonly maxReadmeBytes: number
  private readonly fetchImpl: typeof fetch
  private readonly latestCache = new Map<string, { readonly expiresAt: number; readonly value: { readonly version: string | null; readonly error: string | null } }>()
  private busy = false

  constructor(options: ProfileManagerOptions) {
    this.ctx = options.ctx
    this.dshBin = options.dshBin
    this.catalog = options.catalog
    this.maxReadmeBytes = options.maxReadmeBytes ?? 262_144
    this.fetchImpl = options.fetchImpl ?? fetch
    const dir = profileFromContext(options.ctx, options.profileDir)
    const manifest = readProfileManifest('dsh-plugin-console', dir)
    this.runtime = {
      profileName: basename(dir),
      dir,
      launchDependencies: { ...(manifest.dependencies ?? {}) },
      launchBundles: [...(manifest.dsh?.profile?.bundles ?? [])],
    }
  }

  get isBusy(): boolean {
    return this.busy
  }

  setBusy(value: boolean): void {
    this.busy = value
  }

  async capabilities(): Promise<ManagerCapabilities> {
    const profileWritable = await Promise.all([
      writable(this.runtime.dir),
      writable(join(this.runtime.dir, 'package.json')),
      writable(join(this.runtime.dir, 'pnpm-workspace.yaml')),
    ]).then(values => values.every(Boolean))
    const dshAvailable = await commandAvailable(this.dshBin)
    return {
      profileName: this.runtime.profileName,
      profileWritable,
      dshAvailable,
      busy: this.busy,
      message: !profileWritable
        ? 'The active DSH profile is not writable.'
        : !dshAvailable
          ? `Cannot execute ${this.dshBin}; install DSH or configure dshBin.`
          : null,
    }
  }

  fingerprint(): string {
    const hash = createHash('sha256')
    for (const filename of ['package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml']) {
      hash.update(filename).update('\0')
      try {
        hash.update(readFileSync(join(this.runtime.dir, filename)))
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') return ''
        hash.update('<missing>')
      }
      hash.update('\0')
    }
    return hash.digest('hex')
  }

  async list(locale: UiLocale = 'zh', checkUpdates = true): Promise<readonly InstalledPluginSummary[]> {
    const manifest = readProfileManifest('dsh-plugin-console', this.runtime.dir)
    const dependencies = manifest.dependencies ?? {}
    const bundles = manifest.dsh?.profile?.bundles ?? []
    const names = [...new Set([...Object.keys(dependencies), ...bundles])].filter(packageNameValid).sort()
    const rows = await mapWithConcurrency(names, 4, async packageName => {
      const requestedSpec = dependencies[packageName] ?? null
      const packageData = await readPackageJson(this.runtime.dir, packageName)
      const dsh = packageData === null ? null : packageDsh(packageData.value)
      const bundle = dsh !== null && isBundle(dsh)
      const client = dsh !== null && isWebClient(dsh)
      const activeAtLaunch = this.runtime.launchBundles.includes(packageName)
      const activeAfterRestart = bundles.includes(packageName)
      const baseRow: InstalledPluginSummary = {
        packageName,
        requestedSpec,
        version: packageData === null ? null : packageVersion(packageData.value),
        description: packageData === null ? null : packageString(packageData.value.description),
        author: packageData === null ? null : packageAuthor(packageData.value.author),
        license: packageData === null ? null : packageString(packageData.value.license),
        homepage: packageData === null ? null : packageString(packageData.value.homepage),
        repositoryUrl: packageData === null ? null : packageRepository(packageData.value.repository),
        system: !Object.prototype.hasOwnProperty.call(dependencies, packageName) || packageName.startsWith('@deepseek-ai/'),
        directDependency: Object.prototype.hasOwnProperty.call(dependencies, packageName),
        bundle,
        client,
        activeAtLaunch,
        activeAfterRestart,
        state: launchState(requestedSpec, activeAtLaunch, activeAfterRestart, this.runtime.launchDependencies[packageName]),
        runtimeEntries: runtimeEntries(this.ctx, packageName),
        latestVersion: null,
        updateAvailable: false,
        updateCheckError: null,
        catalogId: this.catalog.findByRepository(packageRepository(packageData?.value.repository ?? null))?.id
          ?? this.catalog.findByPackage(packageName)?.id
          ?? null,
      }
      if (checkUpdates && baseRow.directDependency && !baseRow.system && baseRow.version !== null && npmPackageFromSpec(packageName, requestedSpec)) {
        const cached = this.latestCache.get(packageName)
        const latest = cached !== undefined && cached.expiresAt > Date.now()
          ? cached.value
          : await latestNpmVersion(packageName, this.fetchImpl)
        this.latestCache.set(packageName, { expiresAt: Date.now() + NPM_CACHE_MS, value: latest })
        return {
          ...baseRow,
          latestVersion: latest.version,
          updateAvailable: latest.version !== null
            && semver.valid(baseRow.version) !== null
            && semver.valid(latest.version) !== null
            && semver.gt(latest.version, baseRow.version),
          updateCheckError: latest.error ?? (latest.version !== null
            && (semver.valid(baseRow.version) === null || semver.valid(latest.version) === null)
            ? 'Installed or latest version is not valid semver.'
            : null),
        }
      }
      const installedCommit = githubCommitFromSpec(requestedSpec)
      if (checkUpdates && baseRow.directDependency && !baseRow.system && installedCommit !== null && baseRow.catalogId !== null) {
        const latest = await this.catalog.detail(baseRow.catalogId, 'en')
        return {
          ...baseRow,
          latestVersion: latest?.commitSha?.slice(0, 7) ?? latest?.manifest?.version ?? null,
          updateAvailable: latest?.verification === 'verified'
            && latest.commitSha !== null
            && latest.commitSha.toLocaleLowerCase() !== installedCommit,
          updateCheckError: latest === null || latest.verification === 'verified'
            ? null
            : latest.verificationMessage,
        }
      }
      return baseRow
    })
    return rows
  }

  async detail(packageName: string, locale: UiLocale = 'zh'): Promise<InstalledPluginDetail | null> {
    const rows = await this.list(locale, true)
    const summary = rows.find(row => row.packageName === packageName)
    if (summary === undefined) return null
    const packageData = await readPackageJson(this.runtime.dir, packageName)
    if (packageData === null) {
      return { ...summary, readme: null, readmeFile: null, keywords: [], lifecycleScripts: [] }
    }
    const readme = await readProfileReadme(packageData.root, locale, this.maxReadmeBytes)
    return {
      ...summary,
      readme: readme.text,
      readmeFile: readme.file,
      keywords: Array.isArray(packageData.value.keywords)
        ? packageData.value.keywords.filter((value): value is string => typeof value === 'string').slice(0, 100)
        : [],
      lifecycleScripts: lifecycleScripts(packageData.value.scripts),
    }
  }

  async currentManifest(): Promise<ProfileManifest> {
    return readProfileManifest('dsh-plugin-console', this.runtime.dir)
  }

  async close(): Promise<void> {
    this.latestCache.clear()
  }
}

export function profilePackageJsonPath(runtime: ProfileRuntime): string {
  return join(runtime.dir, 'package.json')
}

export function profileLockPath(runtime: ProfileRuntime): string {
  return join(runtime.dir, 'pnpm-lock.yaml')
}

export function profileWorkspacePath(runtime: ProfileRuntime): string {
  return join(runtime.dir, 'pnpm-workspace.yaml')
}

export function packageInstallPath(runtime: ProfileRuntime, packageName: string): string {
  return packagePath(runtime.dir, packageName)
}
