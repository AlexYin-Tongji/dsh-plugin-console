import type {
  BootstrapResponse,
  CatalogListRequest,
  CatalogListResponse,
  CatalogPluginDetail,
  HarnessStatus,
  HarnessUpdatePlan,
  HarnessUpdateResult,
  InstalledPluginDetail,
  InstalledPluginSummary,
  ManagerCapabilities,
  OperationPlan,
  OperationPlanRequest,
  OperationResult,
  ApiFailure,
  ApiSuccess,
} from '../types.ts'

export interface PluginManageApi {
  bootstrap: (request: CatalogListRequest, locale: string) => Promise<BootstrapResponse>
  listCatalog: (request: CatalogListRequest) => Promise<CatalogListResponse>
  refreshCatalog: (request: CatalogListRequest) => Promise<CatalogListResponse>
  catalogDetail: (id: string, locale: string) => Promise<CatalogPluginDetail | null>
  installed: (locale: string) => Promise<readonly InstalledPluginSummary[]>
  installedDetail: (packageName: string, locale: string) => Promise<InstalledPluginDetail | null>
  capabilities: () => Promise<ManagerCapabilities>
  harnessStatus: (refresh?: boolean) => Promise<HarnessStatus>
  harnessPlan: () => Promise<HarnessUpdatePlan>
  harnessExecute: (planId: string) => Promise<HarnessUpdateResult>
  plan: (request: OperationPlanRequest) => Promise<OperationPlan>
  execute: (planId: string) => Promise<OperationResult>
}

async function call<T>(method: string, params?: unknown): Promise<T> {
  const response = await fetch('/api/plugin-console', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ method, ...(params === undefined ? {} : { params }) }),
  })
  const result = await response.json() as ApiSuccess<T> | ApiFailure
  if (!response.ok || !result.ok) {
    const message = result.ok ? `HTTP ${String(response.status)}` : result.error.message
    throw new Error(message)
  }
  return result.value
}

export function createPluginManageApi(): PluginManageApi {
  return {
    bootstrap: (request, locale) => call('bootstrap', { ...request, locale }),
    listCatalog: request => call('catalog/list', request),
    refreshCatalog: request => call('catalog/refresh', { request }),
    catalogDetail: (id, locale) => call('catalog/detail', { id, locale }),
    installed: locale => call('installed/list', { locale }),
    installedDetail: (packageName, locale) => call('installed/detail', { packageName, locale }),
    capabilities: () => call('capabilities'),
    harnessStatus: refresh => call('harness/status', { refresh: refresh === true }),
    harnessPlan: () => call('harness/plan'),
    harnessExecute: planId => call('harness/execute', { planId }),
    plan: request => call('plan', request),
    execute: planId => call('execute', { planId }),
  }
}
