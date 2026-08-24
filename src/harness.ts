/**
 * DeepSeek Harness self-management: resolve the running npm-global
 * installation, query the registry for newer releases, and project a
 * restart-aware update status for the sidebar entry and update operations.
 */

import { access, realpath } from 'node:fs/promises'
import { basename, delimiter, dirname, isAbsolute, join, relative, resolve } from 'node:path'
import semver from 'semver'
import type { HarnessStatus } from './types.ts'
import { errorMessage, isRecord, readResponseTextBounded, readTextBounded } from './util.ts'

export const HARNESS_PACKAGE = '@deepseek-ai/dsh'

const MAX_PACKAGE_JSON_BYTES = 512_000
const NPM_TIMEOUT_MS = 8_000
const NPM_CACHE_MS = 5 * 60 * 1000
const MAX_NPM_METADATA_BYTES = 128_000
const PACKAGE_ROOT_DEPTH = 12

export interface HarnessInstallation {
  readonly status: 'managed' | 'unmanaged' | 'unresolved'
  readonly installRoot: string | null
  readonly prefix: string | null
  readonly executablePath: string | null
  readonly version: string | null
  readonly message: string | null
}

export interface HarnessManagerOptions {
  readonly dshBin: string
  readonly fetchImpl?: typeof fetch
  readonly now?: () => number
}

export interface HarnessChannelVersion {
  readonly tag: string
  readonly version: string
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

function pathCandidates(dshBin: string): readonly string[] {
  const candidates: string[] = []
  if (dshBin.includes('/') || dshBin.includes('\\') || isAbsolute(dshBin)) {
    candidates.push(resolve(dshBin))
  } else {
    for (const dir of (process.env.PATH ?? '').split(delimiter).filter(Boolean)) {
      candidates.push(join(dir, dshBin))
      if (process.platform === 'win32') {
        candidates.push(`${join(dir, dshBin)}.cmd`, `${join(dir, dshBin)}.exe`, `${join(dir, dshBin)}.ps1`)
      }
    }
  }
  return candidates
}

async function resolveExecutable(dshBin: string): Promise<string | null> {
  for (const candidate of pathCandidates(dshBin)) {
    try {
      return await realpath(candidate)
    } catch {
      // Try the next PATH entry.
    }
  }
  return null
}

async function packageRootFromExecutable(executablePath: string): Promise<{ root: string; version: string } | null> {
  let current = dirname(executablePath)
  for (let depth = 0; depth < PACKAGE_ROOT_DEPTH; depth += 1) {
    try {
      const raw = await readTextBounded(join(current, 'package.json'), MAX_PACKAGE_JSON_BYTES)
      const value: unknown = JSON.parse(raw)
      if (isRecord(value) && value.name === HARNESS_PACKAGE && typeof value.version === 'string') {
        return { root: current, version: value.version }
      }
    } catch {
      // Not a package directory (or an unrelated package); walk up.
    }
    const parent = dirname(current)
    if (parent === current) return null
    current = parent
  }
  return null
}

/**
 * Detect the npm-global layout around an install root. Scoped packages add
 * extra levels, so walk up to the real `node_modules` directory first:
 * POSIX uses `<prefix>/lib/node_modules/<scope>/<name>`, Windows uses
 * `<prefix>/node_modules/<scope>/<name>`. A prefix is accepted only when the
 * install root stays inside it and the package-manager bin surface exists,
 * so pnpm-store and manual installs stay out of the managed path.
 */
async function npmPrefixForRoot(installRoot: string): Promise<string | null> {
  let nodeModulesDir = dirname(installRoot)
  for (let depth = 0; depth < 8; depth += 1) {
    if (basename(nodeModulesDir) === 'node_modules') break
    const parent = dirname(nodeModulesDir)
    if (parent === nodeModulesDir) return null
    nodeModulesDir = parent
  }
  if (basename(nodeModulesDir) !== 'node_modules') return null
  const layoutParent = dirname(nodeModulesDir)
  if (basename(layoutParent) === 'lib') {
    const prefix = dirname(layoutParent)
    const child = relative(join(prefix, 'lib', 'node_modules'), installRoot)
    if (child.startsWith('..') || isAbsolute(child)) return null
    return await pathExists(join(prefix, 'bin')) ? prefix : null
  }
  if (process.platform === 'win32') {
    const prefix = layoutParent
    const child = relative(join(prefix, 'node_modules'), installRoot)
    if (child.startsWith('..') || isAbsolute(child)) return null
    return await pathExists(join(prefix, 'node_modules', '.bin')) ? prefix : null
  }
  return null
}

async function resolveInstallation(dshBin: string): Promise<HarnessInstallation> {
  const executablePath = await resolveExecutable(dshBin)
  if (executablePath === null) {
    return {
      status: 'unresolved',
      installRoot: null,
      prefix: null,
      executablePath: null,
      version: null,
      message: `Cannot resolve the ${dshBin} executable on PATH.`,
    }
  }
  const packageRoot = await packageRootFromExecutable(executablePath)
  if (packageRoot === null) {
    return {
      status: 'unmanaged',
      installRoot: null,
      prefix: null,
      executablePath,
      version: null,
      message: 'The running dsh executable is not inside an @deepseek-ai/dsh package tree.',
    }
  }
  const prefix = await npmPrefixForRoot(packageRoot.root)
  if (prefix === null) {
    return {
      status: 'unmanaged',
      installRoot: packageRoot.root,
      prefix: null,
      executablePath,
      version: packageRoot.version,
      message: 'This DeepSeek Harness installation is not managed by an npm global prefix; update it with the installer you originally used.',
    }
  }
  return {
    status: 'managed',
    installRoot: packageRoot.root,
    prefix,
    executablePath,
    version: packageRoot.version,
    message: null,
  }
}

function parseVersionField(value: unknown): string | null {
  return isRecord(value) && typeof value.version === 'string' && semver.valid(value.version) !== null
    ? value.version
    : null
}

/**
 * Harness-side registry lookup: the Harness is a first-party npm package, so
 * dist-tag metadata (bounded, cached) is the update source of truth.
 */
export class HarnessManager {
  private readonly dshBin: string
  private readonly fetchImpl: typeof fetch
  private readonly now: () => number
  private readonly distTagsCache = new Map<string, { readonly expiresAt: number; readonly value: { readonly channels: readonly HarnessChannelVersion[]; readonly error: string | null } }>()
  private distTagsInflight: Promise<{ readonly channels: readonly HarnessChannelVersion[]; readonly error: string | null }> | null = null
  private static readonly CACHE_KEY = 'dist-tags'

  constructor(options: HarnessManagerOptions) {
    this.dshBin = options.dshBin
    this.fetchImpl = options.fetchImpl ?? fetch
    this.now = options.now ?? (() => Date.now())
  }

  /** Resolve the installation the configured dsh binary belongs to. */
  resolve(): Promise<HarnessInstallation> {
    return resolveInstallation(this.dshBin)
  }

  /**
   * All npm dist-tags of the Harness package. The newest valid semver across
   * every channel is the update candidate — the registry keeps `latest` one
   * release behind `next` during the rc series, and the updater must follow
   * the highest available version instead of a single channel. Concurrent
   * callers (background warm-up plus explicit polls) share one lookup.
   */
  private distTags(): Promise<{ readonly channels: readonly HarnessChannelVersion[]; readonly error: string | null }> {
    const cached = this.distTagsCache.get(HarnessManager.CACHE_KEY)
    if (cached !== undefined && cached.expiresAt > this.now()) return Promise.resolve(cached.value)
    if (this.distTagsInflight !== null) return this.distTagsInflight
    const pending = this.fetchDistTags().finally(() => {
      if (this.distTagsInflight === pending) this.distTagsInflight = null
    })
    this.distTagsInflight = pending
    return pending
  }

  private async fetchDistTags(): Promise<{ channels: readonly HarnessChannelVersion[]; error: string | null }> {
    let value: { channels: readonly HarnessChannelVersion[]; error: string | null }
    try {
      const escaped = HARNESS_PACKAGE.replace('/', '%2F')
      const response = await this.fetchImpl(`https://registry.npmjs.org/-/package/${escaped}/dist-tags`, {
        signal: AbortSignal.timeout(NPM_TIMEOUT_MS),
        headers: { accept: 'application/json', 'user-agent': 'dsh-plugin-console' },
      })
      if (!response.ok) {
        value = { channels: [], error: `npm returned HTTP ${String(response.status)} for the dist-tags document.` }
      } else {
        const parsed: unknown = JSON.parse(await readResponseTextBounded(response, MAX_NPM_METADATA_BYTES)) as unknown
        const channels = isRecord(parsed)
          ? Object.entries(parsed)
              .filter((entry): entry is [string, string] => typeof entry[1] === 'string' && semver.valid(entry[1]) !== null)
              .map(([tag, version]) => ({ tag, version }))
              .sort((left, right) => left.tag.localeCompare(right.tag))
          : []
        value = channels.length === 0
          ? { channels: [], error: 'The npm dist-tags document is invalid or has no usable channels.' }
          : { channels, error: null }
      }
    } catch (error) {
      value = { channels: [], error: errorMessage(error) }
    }
    this.distTagsCache.set(HarnessManager.CACHE_KEY, { expiresAt: this.now() + NPM_CACHE_MS, value })
    return value
  }

  /** Read the package version currently installed at a package root. */
  async installedVersionAt(installRoot: string): Promise<string | null> {
    try {
      const raw = await readTextBounded(join(installRoot, 'package.json'), MAX_PACKAGE_JSON_BYTES)
      const value: unknown = JSON.parse(raw)
      return parseVersionField(value)
    } catch {
      return null
    }
  }

  /**
   * Restart-aware status. `currentVersion` is captured by the caller at
   * startup (the Host keeps running the code it booted with), while
   * `installedVersion` is re-read from disk on every call. `refresh` drops
   * the cached dist-tags document so "check again" observes new releases
   * immediately.
   */
  async status(currentVersion: string | null, refresh = false): Promise<HarnessStatus> {
    if (refresh) {
      // An explicit check-again must observe releases published after the
      // in-flight background warm-up started, so bypass cache and dedup.
      this.distTagsCache.delete(HarnessManager.CACHE_KEY)
    }
    const installation = await this.resolve()
    const tags = refresh ? await this.fetchDistTags() : await this.distTags()
    return this.project(currentVersion, installation, tags)
  }

  /**
   * Non-blocking projection for first paint: serves the last known dist-tags
   * snapshot (an expired snapshot included) and revalidates in the background,
   * so a slow registry lookup never delays the response. The next explicit
   * `status` poll observes the refreshed document.
   */
  async cachedStatus(currentVersion: string | null): Promise<HarnessStatus> {
    const installation = await this.resolve()
    const entry = this.distTagsCache.get(HarnessManager.CACHE_KEY)
    if (entry === undefined || entry.expiresAt <= this.now()) void this.distTags()
    return this.project(currentVersion, installation, entry?.value ?? { channels: [], error: null })
  }

  private project(
    currentVersion: string | null,
    installation: HarnessInstallation,
    tags: { readonly channels: readonly HarnessChannelVersion[]; readonly error: string | null },
  ): HarnessStatus {
    const installedVersion = installation.status !== 'unresolved'
      ? installation.version
      : null
    const candidate = tags.channels.length === 0
      ? null
      : tags.channels.reduce((best, channel) => semver.gt(channel.version, best.version) ? channel : best)
    const updateAvailable = installation.status === 'managed'
      && currentVersion !== null
      && installedVersion !== null
      && installedVersion === currentVersion
      && candidate !== null
      && semver.gt(candidate.version, installedVersion)
    const pendingRestart = currentVersion !== null && installedVersion !== null && installedVersion !== currentVersion
    return {
      currentVersion,
      installedVersion,
      latestVersion: candidate?.version ?? null,
      updateTag: candidate?.tag ?? null,
      channels: tags.channels,
      updateAvailable,
      pendingRestart,
      managed: installation.status === 'managed',
      packageName: HARNESS_PACKAGE,
      installRoot: installation.installRoot,
      prefix: installation.prefix,
      executablePath: installation.executablePath,
      installMessage: installation.message,
      updateCheckError: tags.error,
    }
  }

  async close(): Promise<void> {
    this.distTagsCache.clear()
  }
}
