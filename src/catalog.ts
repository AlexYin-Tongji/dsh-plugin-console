/** Community catalog synchronization and exact artifact verification. */

import { readFile } from 'node:fs/promises'
import semver from 'semver'
import type {
  ArtifactManifestSummary,
  CatalogListRequest,
  CatalogListResponse,
  CatalogPluginDetail,
  CatalogPluginSummary,
  CatalogStatus,
  UiLocale,
} from './types.ts'
import {
  authorName,
  errorMessage,
  isRecord,
  normalizeGithubRepository,
  readResponseTextBounded,
  stringValue,
  writeFileAtomic,
} from './util.ts'

const CACHE_SCHEMA = 1
const INSPECTION_CACHE_MS = 10 * 60 * 1000
const MAX_CATALOG_ITEMS = 5000
const LIFECYCLE_SCRIPT_NAMES = ['preinstall', 'install', 'postinstall', 'prepare'] as const
const README_NAMES: Record<UiLocale, readonly string[]> = {
  zh: [
    'README.zh.md', 'README.zh-CN.md', 'README.zh.markdown', 'README.zh.rst', 'README.zh.txt',
    'README.md', 'README.markdown', 'README.mdx', 'README.rst', 'README.txt', 'README',
  ],
  en: [
    'README.md', 'README.en.md', 'README.markdown', 'README.en.markdown', 'README.mdx',
    'README.rst', 'README.txt', 'README',
  ],
}
const NPM_PACKAGE = /^(?:@[a-z0-9][a-z0-9._~-]*\/[a-z0-9][a-z0-9._~-]*|[a-z0-9][a-z0-9._~-]*)$/i
const NPM_INTEGRITY = /^sha512-[A-Za-z0-9+/]+={0,2}$/

function validNpmPackageName(value: string): boolean {
  return value.length <= 214 && NPM_PACKAGE.test(value)
}

function validNpmIntegrity(value: string): boolean {
  if (!NPM_INTEGRITY.test(value)) return false
  try {
    return Buffer.from(value.slice('sha512-'.length), 'base64').byteLength === 64
  } catch {
    return false
  }
}

interface CatalogCache {
  readonly schemaVersion: 1
  readonly sourceUrl: string
  readonly fetchedAt: string
  readonly etag: string | null
  readonly items: readonly CatalogPluginSummary[]
}

interface InspectionCacheEntry {
  readonly expiresAt: number
  readonly locale: UiLocale
  readonly detail: CatalogPluginDetail
}

export interface NpmArtifact {
  readonly manifest: ArtifactManifestSummary
  readonly sourceSpec: string
  readonly repositoryUrl: string
  readonly integrity: string
  readonly warnings: readonly string[]
}

export interface CatalogOptions {
  readonly sourceUrl: string
  readonly cachePath: string
  readonly maxAgeMs: number
  readonly timeoutMs: number
  readonly maxCatalogBytes: number
  readonly maxReadmeBytes: number
  readonly fetchImpl?: typeof fetch
  readonly now?: () => Date
}

function readDescription(value: unknown): { zh: string; en: string } {
  if (typeof value === 'string') return { zh: value, en: value }
  if (!isRecord(value)) return { zh: '', en: '' }
  const zh = stringValue(value.zh) ?? stringValue(value.en) ?? ''
  const en = stringValue(value.en) ?? stringValue(value.zh) ?? ''
  return { zh, en }
}

function parseGithubUrl(value: unknown): { fullName: string; url: string } | null {
  const fullName = normalizeGithubRepository(value)
  if (fullName === null) return null
  return { fullName, url: `https://github.com/${fullName}` }
}

function parseRawCatalogItem(value: unknown): CatalogPluginSummary | null {
  if (!isRecord(value)) return null
  const repository = parseGithubUrl(value.url)
  if (repository === null) return null
  const [owner = '', repo = ''] = repository.fullName.split('/')
  const name = stringValue(value.name) ?? repo
  const description = readDescription(value.description)
  if (name.length > 160 || owner.length === 0 || repo.length === 0
    || (stringValue(value.category)?.length ?? 0) > 64
    || description.zh.length > 4_000 || description.en.length > 4_000) return null
  const npm = stringValue(value.npm)
  const packageName = npm !== null && validNpmPackageName(npm) ? npm : null
  const stars = typeof value.stars === 'number' && Number.isSafeInteger(value.stars) && value.stars >= 0
    ? value.stars
    : 0
  return {
    id: repository.fullName.toLowerCase(),
    name,
    owner,
    repositoryUrl: repository.url,
    pageUrl: stringValue(value.page),
    category: stringValue(value.category) ?? 'other',
    description,
    packageName,
    stars,
    addedAt: stringValue(value.added),
    artifactKind: packageName === null ? 'github' : 'npm',
  }
}

/** Parse the curated community feed into one deterministic, deduplicated index. */
export function parseCatalogText(text: string): readonly CatalogPluginSummary[] {
  const root: unknown = JSON.parse(text)
  const values = Array.isArray(root) ? root : isRecord(root) && Array.isArray(root.plugins) ? root.plugins : null
  if (values === null) throw new TypeError('Catalog root must contain a plugins array.')
  if (values.length > MAX_CATALOG_ITEMS) throw new TypeError('Catalog contains too many entries.')
  const byId = new Map<string, CatalogPluginSummary>()
  for (const value of values) {
    const item = parseRawCatalogItem(value)
    if (item !== null && !byId.has(item.id)) byId.set(item.id, item)
  }
  return [...byId.values()].sort((left, right) => {
    if (right.stars !== left.stars) return right.stars - left.stars
    return left.name < right.name ? -1 : left.name > right.name ? 1 : 0
  })
}

function validateListRequest(request: CatalogListRequest): CatalogListRequest {
  return {
    query: request.query.trim().slice(0, 256),
    category: request.category.trim().slice(0, 64) || 'all',
    page: Number.isSafeInteger(request.page) ? Math.max(1, request.page) : 1,
    pageSize: Number.isSafeInteger(request.pageSize) ? Math.min(50, Math.max(1, request.pageSize)) : 30,
  }
}

export function queryCatalog(
  items: readonly CatalogPluginSummary[],
  request: CatalogListRequest,
  status: CatalogStatus,
): CatalogListResponse {
  const normalized = validateListRequest(request)
  const query = normalized.query.toLocaleLowerCase()
  const filtered = items.filter((item) => {
    if (normalized.category !== 'all' && item.category !== normalized.category) return false
    if (query.length === 0) return true
    return [item.name, item.owner, item.packageName ?? '', item.description.zh, item.description.en]
      .some(value => value.toLocaleLowerCase().includes(query))
  })
  const categories = [...items.reduce((counts, item) => {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1)
    return counts
  }, new Map<string, number>())]
    .map(([id, count]) => ({ id, count }))
    .sort((left, right) => right.count - left.count || left.id.localeCompare(right.id))
  const start = (normalized.page - 1) * normalized.pageSize
  return {
    items: filtered.slice(start, start + normalized.pageSize),
    total: filtered.length,
    page: normalized.page,
    pageSize: normalized.pageSize,
    categories,
    status,
  }
}

function bundlePatchPath(value: Record<string, unknown>): string | null {
  const dsh = isRecord(value.dsh) ? value.dsh : null
  const patch = dsh !== null && isRecord(dsh.bundle) ? stringValue(dsh.bundle.patch) : null
  if (patch === null || patch.startsWith('/') || patch.includes('\\')) return null
  const normalized = patch.startsWith('./') ? patch.slice(2) : patch
  const segments = normalized.split('/')
  if (segments.some(segment => segment.length === 0 || segment === '.' || segment === '..')) return null
  return normalized
}

function manifestSummary(value: Record<string, unknown>): ArtifactManifestSummary | null {
  const packageName = stringValue(value.name)
  const version = stringValue(value.version)
  if (packageName === null || !validNpmPackageName(packageName) || version === null || semver.valid(version) === null) return null
  const dsh = isRecord(value.dsh) ? value.dsh : null
  const bundle = bundlePatchPath(value) !== null
  const client = dsh !== null && isRecord(dsh.client) && dsh.client.platform === 'web'
  const scripts = isRecord(value.scripts) ? value.scripts : {}
  const lifecycleScripts = LIFECYCLE_SCRIPT_NAMES.filter(name => typeof scripts[name] === 'string')
  const repository = normalizeGithubRepository(value.repository)
  return {
    packageName,
    version,
    description: stringValue(value.description),
    author: authorName(value.author),
    license: stringValue(value.license),
    homepage: stringValue(value.homepage),
    repositoryUrl: repository === null ? null : `https://github.com/${repository}`,
    bundle,
    client,
    lifecycleScripts,
    deprecated: stringValue(value.deprecated),
  }
}

function validNpmTarball(value: unknown): boolean {
  const raw = stringValue(value)
  if (raw === null) return false
  try {
    const url = new URL(raw)
    return url.protocol === 'https:' && url.hostname === 'registry.npmjs.org'
  } catch {
    return false
  }
}

function inspectionWarnings(manifest: ArtifactManifestSummary, value: Record<string, unknown>): string[] {
  const warnings: string[] = []
  if (manifest.lifecycleScripts.length > 0) warnings.push('lifecycle-scripts-present')
  if (manifest.license === null) warnings.push('license-missing')
  if (manifest.deprecated !== null) warnings.push('package-deprecated')
  const peers = isRecord(value.peerDependencies) ? value.peerDependencies : {}
  if (!Object.keys(peers).some(name => name === '@deepseek-ai/cordis' || name.startsWith('@deepseek-ai/dsh-'))) {
    warnings.push('dsh-compatibility-not-declared')
  }
  return warnings
}

async function fetchJson(
  fetchImpl: typeof fetch,
  url: string,
  signal: AbortSignal,
  maxBytes: number,
  headers: Record<string, string> = {},
): Promise<{ value: unknown; response: Response }> {
  const response = await fetchImpl(url, {
    signal,
    headers: { accept: 'application/json', 'user-agent': 'dsh-plugin-console', ...headers },
  })
  if (!response.ok) throw new Error(`HTTP ${String(response.status)} from ${new URL(url).hostname}.`)
  return { value: JSON.parse(await readResponseTextBounded(response, maxBytes)) as unknown, response }
}

async function fetchReadme(
  fetchImpl: typeof fetch,
  fullName: string,
  ref: string,
  locale: UiLocale,
  signal: AbortSignal,
  maxBytes: number,
): Promise<{ text: string | null; source: string | null }> {
  for (const file of README_NAMES[locale]) {
    const encodedRef = ref.split('/').map(segment => encodeURIComponent(segment)).join('/')
    const url = `https://raw.githubusercontent.com/${fullName}/${encodedRef}/${file}`
    try {
      const response = await fetchImpl(url, { signal, headers: { 'user-agent': 'dsh-plugin-console' } })
      if (response.status === 404) continue
      if (!response.ok) continue
      return { text: await readResponseTextBounded(response, maxBytes), source: `${fullName}@${ref}/${file}` }
    } catch {
      // README enrichment is best-effort; an artifact remains verified when
      // documentation fetches time out or exceed the display limit.
    }
  }
  return { text: null, source: null }
}

function unavailableDetail(item: CatalogPluginSummary, message: string): CatalogPluginDetail {
  return {
    ...item,
    verification: 'unavailable',
    verificationMessage: message,
    installSpec: null,
    commitSha: null,
    integrity: null,
    manifest: null,
    readme: null,
    readmeSource: null,
    warnings: [],
  }
}

function invalidDetail(
  item: CatalogPluginSummary,
  message: string,
  manifest: ArtifactManifestSummary | null = null,
  warnings: readonly string[] = [],
): CatalogPluginDetail {
  return {
    ...item,
    verification: 'invalid',
    verificationMessage: message,
    installSpec: null,
    commitSha: null,
    integrity: null,
    manifest,
    readme: null,
    readmeSource: null,
    warnings,
  }
}

function cacheRecord(value: unknown, sourceUrl: string): CatalogCache {
  if (!isRecord(value) || value.schemaVersion !== CACHE_SCHEMA || value.sourceUrl !== sourceUrl
    || typeof value.fetchedAt !== 'string' || Number.isNaN(Date.parse(value.fetchedAt))
    || !(typeof value.etag === 'string' || value.etag === null)
    || !Array.isArray(value.items)) {
    throw new TypeError('Invalid plugin catalog cache.')
  }
  const items = value.items.map(parseCachedItem)
  if (items.some(item => item === null)) throw new TypeError('Invalid plugin catalog cache entry.')
  return {
    schemaVersion: CACHE_SCHEMA,
    sourceUrl,
    fetchedAt: value.fetchedAt,
    etag: value.etag,
    items: items as CatalogPluginSummary[],
  }
}

function parseCachedItem(value: unknown): CatalogPluginSummary | null {
  if (!isRecord(value)) return null
  const canonical = parseRawCatalogItem({
    name: value.name,
    url: value.repositoryUrl,
    page: value.pageUrl,
    category: value.category,
    description: value.description,
    npm: value.packageName,
    stars: value.stars,
    added: value.addedAt,
  })
  if (canonical === null || value.id !== canonical.id || value.owner !== canonical.owner
    || value.artifactKind !== canonical.artifactKind) return null
  return canonical
}

/** Owns the last-known-good catalog and on-demand package verification. */
export class PluginCatalog {
  private readonly fetchImpl: typeof fetch
  private readonly now: () => Date
  private readonly closeController = new AbortController()
  private items: readonly CatalogPluginSummary[] = []
  private source: CatalogStatus['source'] = 'none'
  private fetchedAt: string | null = null
  private etag: string | null = null
  private error: string | null = null
  private refreshPromise: Promise<CatalogStatus> | null = null
  private readonly inspections = new Map<string, InspectionCacheEntry>()
  private disposed = false

  constructor(private readonly options: CatalogOptions) {
    this.fetchImpl = options.fetchImpl ?? fetch
    this.now = options.now ?? (() => new Date())
  }

  async initialize(): Promise<void> {
    try {
      const record = cacheRecord(JSON.parse(await readFile(this.options.cachePath, 'utf8')) as unknown, this.options.sourceUrl)
      this.items = record.items
      this.source = 'cache'
      this.fetchedAt = record.fetchedAt
      this.etag = record.etag
      this.error = null
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') this.error = 'Saved community catalog is invalid.'
    }
  }

  status(): CatalogStatus {
    const stale = this.fetchedAt !== null
      && this.now().getTime() - Date.parse(this.fetchedAt) > this.options.maxAgeMs
    return {
      state: this.items.length === 0 ? (this.source === 'none' ? 'unavailable' : 'empty') : 'ready',
      source: this.source,
      sourceUrl: this.options.sourceUrl,
      fetchedAt: this.fetchedAt,
      stale,
      error: this.error,
    }
  }

  list(request: CatalogListRequest): CatalogListResponse {
    return queryCatalog(this.items, request, this.status())
  }

  find(id: string): CatalogPluginSummary | undefined {
    return this.items.find(item => item.id === id.toLocaleLowerCase())
  }

  findByPackage(packageName: string): CatalogPluginSummary | undefined {
    return this.items.find(item => item.packageName === packageName)
  }

  findByRepository(repository: string | null): CatalogPluginSummary | undefined {
    if (repository === null) return undefined
    const normalized = repository.toLocaleLowerCase()
    return this.items.find(item => item.id === normalized)
  }

  refresh(): Promise<CatalogStatus> {
    if (this.refreshPromise !== null) return this.refreshPromise
    const pending = this.refreshOnce().finally(() => {
      if (this.refreshPromise === pending) this.refreshPromise = null
    })
    this.refreshPromise = pending
    return pending
  }

  private async refreshOnce(): Promise<CatalogStatus> {
    if (this.disposed) return this.status()
    try {
      const timeout = AbortSignal.timeout(this.options.timeoutMs)
      const headers: Record<string, string> = {}
      if (this.etag !== null) headers['if-none-match'] = this.etag
      const response = await this.fetchImpl(this.options.sourceUrl, {
        signal: AbortSignal.any([timeout, this.closeController.signal]),
        headers: { accept: 'application/json', 'user-agent': 'dsh-plugin-console', ...headers },
      })
      const fetchedAt = this.now().toISOString()
      if (response.status === 304) {
        if (this.items.length === 0) throw new Error('Catalog returned not-modified without a local cache.')
        await this.commit({
          schemaVersion: CACHE_SCHEMA,
          sourceUrl: this.options.sourceUrl,
          fetchedAt,
          etag: this.etag,
          items: this.items,
        })
        this.source = 'network'
        this.fetchedAt = fetchedAt
        this.error = null
        return this.status()
      }
      if (!response.ok) throw new Error(`Catalog returned HTTP ${String(response.status)}.`)
      const items = parseCatalogText(await readResponseTextBounded(response, this.options.maxCatalogBytes))
      const next: CatalogCache = {
        schemaVersion: CACHE_SCHEMA,
        sourceUrl: this.options.sourceUrl,
        fetchedAt,
        etag: response.headers.get('etag'),
        items,
      }
      await this.commit(next)
      this.items = items
      this.source = 'network'
      this.fetchedAt = fetchedAt
      this.etag = next.etag
      this.error = null
    } catch (error) {
      if (!this.disposed) this.error = errorMessage(error)
    }
    return this.status()
  }

  private async commit(record: CatalogCache): Promise<void> {
    await writeFileAtomic(this.options.cachePath, `${JSON.stringify(record)}\n`)
  }

  async detail(id: string, locale: UiLocale, force = false): Promise<CatalogPluginDetail | null> {
    const item = this.find(id)
    if (item === undefined) return null
    const cached = this.inspections.get(item.id)
    if (!force && cached !== undefined && cached.locale === locale && cached.expiresAt > this.now().getTime()) return cached.detail
    let detail: CatalogPluginDetail
    try {
      detail = item.artifactKind === 'npm'
        ? await this.inspectNpm(item, locale)
        : await this.inspectGithub(item, locale)
    } catch (error) {
      detail = unavailableDetail(item, errorMessage(error))
    }
    this.inspections.set(item.id, {
      expiresAt: this.now().getTime() + INSPECTION_CACHE_MS,
      locale,
      detail,
    })
    return detail
  }

  /** Verify the latest npm manifest even when a package is absent from the community index. */
  async latestNpmArtifact(packageName: string): Promise<NpmArtifact | null> {
    if (!validNpmPackageName(packageName)) return null
    const catalogItem = this.findByPackage(packageName)
    if (catalogItem !== undefined) {
      const detail = await this.detail(catalogItem.id, 'en')
      if (detail?.verification === 'verified' && detail.manifest !== null && detail.installSpec !== null
        && detail.manifest.repositoryUrl !== null && detail.integrity !== null && validNpmIntegrity(detail.integrity)) {
        return {
          manifest: detail.manifest,
          sourceSpec: detail.installSpec,
          repositoryUrl: detail.manifest.repositoryUrl,
          integrity: detail.integrity,
          warnings: detail.warnings,
        }
      }
      return null
    }
    const signal = this.operationSignal()
    const { value } = await fetchJson(
      this.fetchImpl,
      `https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`,
      signal,
      Math.min(this.options.maxCatalogBytes, 1_000_000),
    )
    if (!isRecord(value)) return null
    const manifest = manifestSummary(value)
    if (manifest === null || manifest.packageName !== packageName || !manifest.bundle) return null
    const repository = normalizeGithubRepository(value.repository)
    const dist = isRecord(value.dist) ? value.dist : {}
    const integrity = stringValue(dist.integrity)
    if (repository === null || integrity === null || !validNpmIntegrity(integrity)
      || !validNpmTarball(dist.tarball)) return null
    const warnings = inspectionWarnings(manifest, value)
    return {
      manifest,
      sourceSpec: `${packageName}@${manifest.version}`,
      repositoryUrl: `https://github.com/${repository}`,
      integrity,
      warnings,
    }
  }

  private operationSignal(): AbortSignal {
    return AbortSignal.any([AbortSignal.timeout(this.options.timeoutMs), this.closeController.signal])
  }

  private async inspectNpm(item: CatalogPluginSummary, locale: UiLocale): Promise<CatalogPluginDetail> {
    const packageName = item.packageName
    if (packageName === null || !validNpmPackageName(packageName)) return invalidDetail(item, 'Catalog npm package name is invalid.')
    const encoded = encodeURIComponent(packageName)
    const signal = this.operationSignal()
    const { value } = await fetchJson(
      this.fetchImpl,
      `https://registry.npmjs.org/${encoded}/latest`,
      signal,
      Math.min(this.options.maxCatalogBytes, 1_000_000),
    )
    if (!isRecord(value)) return invalidDetail(item, 'npm metadata is invalid.')
    const manifest = manifestSummary(value)
    if (manifest === null || manifest.packageName !== packageName) return invalidDetail(item, 'npm package identity does not match the catalog.')
    const warnings = inspectionWarnings(manifest, value)
    if (!manifest.bundle) return invalidDetail(item, 'Published package does not declare an installable DSH bundle.', manifest, warnings)
    const dist = isRecord(value.dist) ? value.dist : {}
    const integrity = stringValue(dist.integrity)
    if (integrity === null || !validNpmIntegrity(integrity) || !validNpmTarball(dist.tarball)) {
      return invalidDetail(item, 'npm metadata has no valid HTTPS tarball and immutable integrity hash.', manifest, [...warnings, 'integrity-missing'])
    }
    const repository = normalizeGithubRepository(value.repository)
    if (repository === null || repository.toLocaleLowerCase() !== item.id) {
      return invalidDetail(item, 'npm package repository does not match the catalog repository.', manifest, [...warnings, 'repository-mismatch'])
    }
    const gitHead = typeof value.gitHead === 'string' && /^[0-9a-f]{40}$/i.test(value.gitHead) ? value.gitHead : null
    const readme = gitHead === null
      ? { text: null, source: null }
      : await fetchReadme(this.fetchImpl, repository, gitHead, locale, signal, this.options.maxReadmeBytes)
    return {
      ...item,
      verification: 'verified',
      verificationMessage: null,
      installSpec: `${packageName}@${manifest.version}`,
      commitSha: gitHead,
      integrity,
      manifest,
      readme: readme.text,
      readmeSource: readme.source,
      warnings: gitHead === null ? [...warnings, 'registry-version-pinned'] : warnings,
    }
  }

  private async inspectGithub(item: CatalogPluginSummary, locale: UiLocale): Promise<CatalogPluginDetail> {
    const fullName = item.id
    const signal = this.operationSignal()
    const repoResult = await fetchJson(
      this.fetchImpl,
      `https://api.github.com/repos/${fullName}`,
      signal,
      Math.min(this.options.maxCatalogBytes, 1_000_000),
    )
    if (!isRecord(repoResult.value)) return invalidDetail(item, 'GitHub repository metadata is invalid.')
    if (repoResult.value.archived === true) return invalidDetail(item, 'GitHub repository is archived.', null, ['repository-archived'])
    const defaultBranch = stringValue(repoResult.value.default_branch)
    if (defaultBranch === null) return invalidDetail(item, 'GitHub default branch is unavailable.')
    const commitResult = await fetchJson(
      this.fetchImpl,
      `https://api.github.com/repos/${fullName}/commits/${encodeURIComponent(defaultBranch)}`,
      signal,
      Math.min(this.options.maxCatalogBytes, 1_000_000),
    )
    const sha = isRecord(commitResult.value) ? stringValue(commitResult.value.sha) : null
    if (sha === null || !/^[0-9a-f]{40}$/i.test(sha)) return invalidDetail(item, 'GitHub commit could not be pinned.')
    const packageResponse = await this.fetchImpl(
      `https://raw.githubusercontent.com/${fullName}/${sha}/package.json`,
      { signal, headers: { 'user-agent': 'dsh-plugin-console' } },
    )
    if (!packageResponse.ok) return invalidDetail(item, 'Repository root does not contain package.json.')
    const packageValue: unknown = JSON.parse(await readResponseTextBounded(packageResponse, 512_000))
    if (!isRecord(packageValue)) return invalidDetail(item, 'Repository package.json is invalid.')
    const manifest = manifestSummary(packageValue)
    if (manifest === null) return invalidDetail(item, 'Repository package manifest has no valid name or version.')
    const warnings = inspectionWarnings(manifest, packageValue)
    if (!manifest.bundle) return invalidDetail(item, 'Repository does not declare an installable DSH bundle.', manifest, warnings)
    const declaredRepository = normalizeGithubRepository(packageValue.repository)
    if (declaredRepository !== null && declaredRepository.toLocaleLowerCase() !== item.id) {
      return invalidDetail(item, 'Repository package identity points to a different GitHub project.', manifest, [...warnings, 'repository-mismatch'])
    }
    const patchPath = bundlePatchPath(packageValue)
    if (patchPath === null) return invalidDetail(item, 'Repository bundle patch path is invalid.', manifest, warnings)
    const encodedPatch = patchPath.split('/').map(segment => encodeURIComponent(segment)).join('/')
    const patchResponse = await this.fetchImpl(
      `https://raw.githubusercontent.com/${fullName}/${sha}/${encodedPatch}`,
      { signal, headers: { 'user-agent': 'dsh-plugin-console' } },
    )
    if (!patchResponse.ok) return invalidDetail(item, 'Repository does not ship its declared bundle patch.', manifest, warnings)
    await readResponseTextBounded(patchResponse, 1_000_000)
    const readme = await fetchReadme(this.fetchImpl, fullName, sha, locale, signal, this.options.maxReadmeBytes)
    return {
      ...item,
      packageName: manifest.packageName,
      verification: 'verified',
      verificationMessage: null,
      installSpec: `github:${fullName}#${sha}`,
      commitSha: sha,
      integrity: null,
      manifest,
      readme: readme.text,
      readmeSource: readme.source,
      warnings: [...warnings, 'git-source'],
    }
  }

  async close(): Promise<void> {
    this.disposed = true
    this.closeController.abort()
    await this.refreshPromise
    this.inspections.clear()
  }
}
