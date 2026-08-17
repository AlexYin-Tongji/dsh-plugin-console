/**
 * Host half of dsh-plugin-console: catalog API and profile mutations.
 * The package-private same-origin route shape is adapted from the MIT-licensed
 * DSH Plugin Marketplace; see THIRD_PARTY_NOTICES.md.
 */

import type { IncomingMessage, ServerResponse } from 'node:http'
import { isAbsolute, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/cordis-plugin-loader'
import { dshHomePath } from '@deepseek-ai/dsh-home-paths'
import type {} from '@deepseek-ai/dsh-host-webserver'
import z from '@deepseek-ai/schemastery'
import { PluginCatalog } from './catalog.ts'
import { ProfileManager } from './profile.ts'
import { ProfileOperations } from './operations.ts'
import type {
  BootstrapResponse,
  CatalogListRequest,
  OperationPlanRequest,
  UiLocale,
} from './types.ts'
import { errorMessage, isRecord } from './util.ts'

export type * from './types.ts'
export { PluginCatalog, parseCatalogText, queryCatalog } from './catalog.ts'
export { ProfileManager } from './profile.ts'
export { ProfileOperations } from './operations.ts'

export const name = 'plugin-console'
export const inject = ['webServer', 'loader']

export interface Config {
  readonly catalogUrl: string
  readonly cacheMaxAgeMs: number
  readonly requestTimeoutMs: number
  readonly maxCatalogBytes: number
  readonly maxReadmeBytes: number
  readonly operationTimeoutMs: number
  readonly dshBin: string
}

export const Config: z<Config> = z.object({
  catalogUrl: z.string().default('https://awesome-dsh-plugin.com/plugins.json'),
  cacheMaxAgeMs: z.natural().min(60_000).default(172_800_000),
  requestTimeoutMs: z.natural().min(1_000).default(15_000),
  maxCatalogBytes: z.natural().min(1_024).default(5_000_000),
  maxReadmeBytes: z.natural().min(1_024).default(262_144),
  operationTimeoutMs: z.natural().min(10_000).default(300_000),
  dshBin: z.string().default('dsh'),
})

const API_PATH = '/api/plugin-console'
const MAX_BODY_BYTES = 64 * 1024

class ApiFailure extends Error {
  constructor(readonly status: number, readonly code: string, message: string) {
    super(message)
    this.name = 'ApiFailure'
  }
}

function locale(value: unknown): UiLocale {
  return value === 'en' ? 'en' : 'zh'
}

function listRequest(value: unknown): CatalogListRequest {
  if (!isRecord(value)) return { query: '', category: 'all', page: 1, pageSize: 24 }
  const query = typeof value.query === 'string' ? value.query : ''
  const category = typeof value.category === 'string' ? value.category : 'all'
  const page = typeof value.page === 'number' && Number.isSafeInteger(value.page) ? value.page : 1
  const pageSize = typeof value.pageSize === 'number' && Number.isSafeInteger(value.pageSize) ? value.pageSize : 24
  if (query.length > 256 || category.length > 64 || page < 1 || pageSize < 1 || pageSize > 50) {
    throw new ApiFailure(400, 'request-invalid', 'Invalid catalog list request.')
  }
  return { query, category, page, pageSize }
}

function planRequest(value: unknown): OperationPlanRequest {
  if (!isRecord(value) || (value.action !== 'install' && value.action !== 'update' && value.action !== 'remove')) {
    throw new ApiFailure(400, 'request-invalid', 'Invalid operation action.')
  }
  const catalogId = value.catalogId === undefined ? undefined : typeof value.catalogId === 'string' ? value.catalogId : null
  const packageName = value.packageName === undefined ? undefined : typeof value.packageName === 'string' ? value.packageName : null
  if (catalogId === null || packageName === null || (catalogId === undefined && packageName === undefined)) {
    throw new ApiFailure(400, 'request-invalid', 'An operation target is required.')
  }
  return {
    action: value.action,
    ...(catalogId === undefined ? {} : { catalogId }),
    ...(packageName === undefined ? {} : { packageName }),
  }
}

function executeRequest(value: unknown): string {
  if (!isRecord(value) || typeof value.planId !== 'string' || value.planId.length < 16 || value.planId.length > 128) {
    throw new ApiFailure(400, 'request-invalid', 'Invalid operation plan.')
  }
  return value.planId
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  if (!req.headers['content-type']?.toLocaleLowerCase().startsWith('application/json')) {
    throw new ApiFailure(415, 'content-type-invalid', 'Expected application/json.')
  }
  const chunks: Buffer[] = []
  let total = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    total += buffer.byteLength
    if (total > MAX_BODY_BYTES) {
      req.resume()
      throw new ApiFailure(413, 'request-too-large', 'Request body is too large.')
    }
    chunks.push(buffer)
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
  } catch {
    throw new ApiFailure(400, 'json-invalid', 'Request body is not valid JSON.')
  }
  if (!isRecord(parsed)) throw new ApiFailure(400, 'request-invalid', 'Request body must be an object.')
  return parsed
}

function verifySameOrigin(req: IncomingMessage): void {
  const host = req.headers.host
  const origin = req.headers.origin
  const fetchSite = req.headers['sec-fetch-site']
  if (fetchSite !== undefined && fetchSite !== 'same-origin' && fetchSite !== 'same-site' && fetchSite !== 'none') {
    throw new ApiFailure(403, 'origin-denied', 'Only same-origin WebUI requests are accepted.')
  }
  if (host === undefined || origin === undefined) throw new ApiFailure(403, 'origin-denied', 'Only same-origin WebUI requests are accepted.')
  let url: URL
  try {
    url = new URL(origin)
  } catch {
    throw new ApiFailure(403, 'origin-denied', 'Only same-origin WebUI requests are accepted.')
  }
  if ((url.protocol !== 'http:' && url.protocol !== 'https:') || url.host !== host) {
    throw new ApiFailure(403, 'origin-denied', 'Only same-origin WebUI requests are accepted.')
  }
}

function verifyLoopback(req: IncomingMessage): void {
  const address = req.socket.remoteAddress ?? ''
  if (address !== '127.0.0.1' && address !== '::1' && !address.startsWith('::ffff:127.')) {
    throw new ApiFailure(403, 'mutation-local-only', 'Plugin mutations are available only from the loopback WebUI.')
  }
}

function sendJson(res: ServerResponse, status: number, value: unknown): void {
  const body = `${JSON.stringify(value)}\n`
  res.writeHead(status, {
    'cache-control': 'no-store',
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'x-content-type-options': 'nosniff',
  })
  res.end(body)
}

/** Resolve the profile path from the Loader's own base URL, never from client input. */
function profileDir(ctx: Context): string {
  if (ctx.baseUrl === undefined || !ctx.baseUrl.startsWith('file:')) {
    throw new Error('dsh-plugin-console requires a file-backed profile Loader baseUrl.')
  }
  const profilesRoot = resolve(dshHomePath('profiles'))
  const dir = resolve(fileURLToPath(ctx.baseUrl))
  const child = relative(profilesRoot, dir)
  if (child.length === 0 || child.startsWith('..') || isAbsolute(child)) {
    throw new Error('dsh-plugin-console can manage only the active profile under $DSH_HOME/profiles.')
  }
  return dir
}

/** Mount the manager against only the active profile. */
export async function apply(ctx: Context, config: Config): Promise<void> {
  let catalogUrl: URL
  try {
    catalogUrl = new URL(config.catalogUrl)
  } catch {
    throw new Error('dsh-plugin-console catalogUrl must be an absolute HTTPS URL.')
  }
  if (catalogUrl.protocol !== 'https:') throw new Error('dsh-plugin-console catalogUrl must use HTTPS.')
  if (config.dshBin.trim().length === 0 || config.dshBin.includes('\u0000')) throw new Error('dsh-plugin-console dshBin is invalid.')
  const catalog = new PluginCatalog({
    sourceUrl: catalogUrl.href,
    cachePath: dshHomePath('cache', 'plugin-console', 'catalog.json'),
    maxAgeMs: config.cacheMaxAgeMs,
    timeoutMs: config.requestTimeoutMs,
    maxCatalogBytes: config.maxCatalogBytes,
    maxReadmeBytes: config.maxReadmeBytes,
  })
  await catalog.initialize()
  const manager = new ProfileManager({
    ctx,
    profileDir: profileDir(ctx),
    dshBin: config.dshBin,
    catalog,
    maxReadmeBytes: config.maxReadmeBytes,
  })
  const operations = new ProfileOperations({
    profile: manager,
    catalog,
    dshBin: config.dshBin,
    timeoutMs: config.operationTimeoutMs,
  })

  const disposeRoute = ctx.webServer.register({
    kind: 'exact',
    path: API_PATH,
    handler: async (req, res) => {
      try {
        if (req.method !== 'POST') {
          res.setHeader('allow', 'POST')
          throw new ApiFailure(405, 'method-not-allowed', 'Use POST for the manager API.')
        }
        verifySameOrigin(req)
        const body = await readJson(req)
        const method = body.method
        const params = body.params
        let value: unknown
        switch (method) {
          case 'bootstrap': {
            const request = listRequest(params)
            if (catalog.status().state === 'unavailable' || catalog.status().stale) await catalog.refresh()
            const response: BootstrapResponse = {
              catalog: catalog.list(request),
              installed: await manager.list(locale(isRecord(params) ? params.locale : undefined)),
              capabilities: await manager.capabilities(),
            }
            value = response
            break
          }
          case 'catalog/list': value = catalog.list(listRequest(params)); break
          case 'catalog/refresh':
            await catalog.refresh()
            value = catalog.list(listRequest(isRecord(params) ? params.request : undefined))
            break
          case 'catalog/detail': {
            if (!isRecord(params) || typeof params.id !== 'string') throw new ApiFailure(400, 'request-invalid', 'Catalog id is required.')
            value = await catalog.detail(params.id, locale(params.locale))
            break
          }
          case 'installed/list': value = await manager.list(locale(isRecord(params) ? params.locale : undefined)); break
          case 'installed/detail': {
            if (!isRecord(params) || typeof params.packageName !== 'string') throw new ApiFailure(400, 'request-invalid', 'Package name is required.')
            value = await manager.detail(params.packageName, locale(params.locale))
            break
          }
          case 'capabilities': value = await manager.capabilities(); break
          case 'plan':
            verifyLoopback(req)
            value = await operations.plan(planRequest(params))
            break
          case 'execute':
            verifyLoopback(req)
            value = await operations.execute(executeRequest(params))
            break
          default: throw new ApiFailure(404, 'method-unknown', 'Unknown manager API method.')
        }
        sendJson(res, 200, { ok: true, value })
      } catch (error) {
        const failure = error instanceof ApiFailure
          ? error
          : new ApiFailure(500, 'request-failed', 'The manager request could not be completed.')
        ctx.logger.warn(error instanceof Error ? error : new Error(errorMessage(error)))
        sendJson(res, failure.status, { ok: false, error: { code: failure.code, message: failure.message } })
      }
    },
  })
  ctx.effect(() => disposeRoute, 'plugin-console.api')
  ctx.effect(() => async () => {
    await operations.close()
    await manager.close()
    await catalog.close()
  }, 'plugin-console.close')
}

export default { name, inject, apply, Config }
