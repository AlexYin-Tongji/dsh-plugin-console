// @vitest-environment jsdom

import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PluginManageSettingsTab } from '../src/client/PluginManageSettingsTab.tsx'
import { en } from '../src/client/locales.ts'

vi.mock('@deepseek-ai/dsh-client-ui-primitives', () => {
  const Icon = () => null
  return {
    IconChevronLeftOutline14: Icon,
    IconChevronRightOutline14: Icon,
    IconCloseOutline16: Icon,
    IconDownloadOutline16: Icon,
    IconRefreshOutline16: Icon,
    IconRightUpOutline14: Icon,
    IconSearchOutline16: Icon,
    IconTrashOutline16: Icon,
    MarkdownText: ({ text }: { text: string }) => <div>{text}</div>,
  }
})

const catalog = {
  items: [{
    id: 'acme/demo', name: 'Demo', owner: 'acme', repositoryUrl: 'https://github.com/acme/demo',
    pageUrl: null, category: 'tools', description: { zh: '中文说明', en: 'English description' },
    packageName: 'demo-plugin', stars: 2, addedAt: null, artifactKind: 'npm',
  }],
  total: 1,
  page: 1,
  pageSize: 24,
  categories: [{ id: 'tools', count: 1 }],
  status: { state: 'ready', source: 'cache', sourceUrl: 'https://catalog.test', fetchedAt: null, stale: false, error: null },
} as const

const capabilities = {
  profileName: 'web', profileWritable: true, dshAvailable: true, busy: false, message: null,
} as const

function t(key: keyof typeof en, values?: Record<string, string | number>): string {
  let value: string = en[key]
  for (const [name, replacement] of Object.entries(values ?? {})) value = value.replaceAll(`{${name}}`, String(replacement))
  return value
}

describe('plugin manager client', () => {
  it('renders the active locale and uses buttons rather than a nested ARIA tablist', async () => {
    const api = {
      bootstrap: async () => ({ catalog, installed: [], capabilities }),
      listCatalog: async () => catalog,
      refreshCatalog: async () => catalog,
      catalogDetail: async () => null,
      installed: async () => [],
      installedDetail: async () => null,
      capabilities: async () => capabilities,
      plan: async () => { throw new Error('not used') },
      execute: async () => { throw new Error('not used') },
    }
    render(<PluginManageSettingsTab {...({ api, locale: () => 'en', t } as any)} />)
    expect(await screen.findByText('English description')).toBeTruthy()
    expect(screen.queryByText('中文说明')).toBeNull()
    expect(screen.queryByRole('tablist')).toBeNull()
    await waitFor(() => expect(screen.getByText('1 results')).toBeTruthy())
  })
})
