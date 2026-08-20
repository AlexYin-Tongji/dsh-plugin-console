// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PluginManageSettingsTab } from '../src/client/PluginManageSettingsTab.tsx'
import { en } from '../src/client/locales.ts'

afterEach(cleanup)

vi.mock('@deepseek-ai/dsh-client-ui-primitives', () => {
  const Icon = () => null
  return {
    IconChevronLeftOutline14: Icon,
    IconChevronRightOutline14: Icon,
    IconCloseOutline16: Icon,
    IconDownloadOutline16: Icon,
    IconPauseOutline16: Icon,
    IconPlayOutline16: Icon,
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
  profileName: 'web', profileWritable: true, dshAvailable: true, pnpmAvailable: true, busy: false, message: null,
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

  it('shows non-Markdown README files as preserved source text', async () => {
    const detail = {
      ...catalog.items[0],
      verification: 'verified', verificationMessage: null, installSpec: 'demo-plugin@1.0.0',
      commitSha: 'a'.repeat(40), integrity: null,
      manifest: {
        packageName: 'demo-plugin', version: '1.0.0', description: 'Demo', author: null,
        license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo',
        bundle: true, client: true, lifecycleScripts: [], deprecated: null,
      },
      readme: 'Usage\n=====\nrun demo --verbose',
      readmeSource: 'acme/demo@main/README.txt',
      warnings: [],
    } as const
    const api = {
      bootstrap: async () => ({ catalog, installed: [], capabilities }),
      listCatalog: async () => catalog,
      refreshCatalog: async () => catalog,
      catalogDetail: async () => detail,
      installed: async () => [],
      installedDetail: async () => null,
      capabilities: async () => capabilities,
      plan: async () => { throw new Error('not used') },
      execute: async () => { throw new Error('not used') },
    }
    render(<PluginManageSettingsTab {...({ api, locale: () => 'en', t } as any)} />)
    const description = await screen.findByText('English description')
    fireEvent.click(description.closest('button') as HTMLButtonElement)
    expect(await screen.findByText(/run demo --verbose/)).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Source' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Preview' })).toBeNull()
  })

  it('reports a successful isolated canary after installation', async () => {
    const plan = {
      status: 'ready', planId: 'canary-plan-123456789', blockReason: null, action: 'install', profileName: 'web',
      catalogId: 'acme/demo', packageName: 'demo-plugin', currentVersion: null, targetVersion: '1.0.0',
      sourceSpec: 'demo-plugin@1.0.0', artifactIntegrity: null, lifecycleScripts: [],
      warnings: ['canary-validation'], expiresAt: new Date(Date.now() + 60_000).toISOString(),
    } as const
    const api = {
      bootstrap: async () => ({ catalog, installed: [], capabilities }),
      listCatalog: async () => catalog,
      refreshCatalog: async () => catalog,
      catalogDetail: async () => null,
      installed: async () => [],
      installedDetail: async () => null,
      capabilities: async () => capabilities,
      plan: async () => plan,
      execute: async () => ({
        status: 'succeeded', code: 'succeeded', action: 'install', packageName: 'demo-plugin',
        restartRequired: true, canary: 'passed', rollback: 'not-needed', detail: null,
        installed: [], capabilities,
      }),
    }
    render(<PluginManageSettingsTab {...({ api, locale: () => 'en', t } as any)} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Install' }))
    expect(await screen.findByText(/isolated temporary profile/)).toBeTruthy()
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(await screen.findByText(/passed an isolated profile canary/)).toBeTruthy()
  })

  it('explains that removal needs a Host restart and browser refresh', async () => {
    const installed = [{
      packageName: 'demo-plugin', requestedSpec: '1.0.0', version: '1.0.0', description: 'Demo',
      author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo',
      system: false, directDependency: true, bundle: true, client: true,
      activeAtLaunch: true, activeAfterRestart: true, state: 'active', runtimeEntries: [],
      latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo',
    }] as const
    const plan = {
      status: 'ready', planId: 'remove-plan-123456789', blockReason: null, action: 'remove', profileName: 'web',
      catalogId: 'acme/demo', packageName: 'demo-plugin', currentVersion: '1.0.0', currentSpec: '1.0.0',
      targetVersion: null, sourceSpec: null, artifactIntegrity: null, lifecycleScripts: [],
      warnings: ['remove-data-kept'], expiresAt: new Date(Date.now() + 60_000).toISOString(),
    } as const
    const api = {
      bootstrap: async () => ({ catalog, installed, capabilities }),
      listCatalog: async () => catalog,
      refreshCatalog: async () => catalog,
      catalogDetail: async () => null,
      installed: async () => installed,
      installedDetail: async () => null,
      capabilities: async () => capabilities,
      plan: async () => plan,
      execute: async () => ({
        status: 'succeeded', code: 'succeeded', action: 'remove', packageName: 'demo-plugin',
        restartRequired: true, activation: 'pending-restart', canary: 'not-run', processCleanup: 'not-needed',
        rollback: 'not-needed', detail: null, installed: [], capabilities,
      }),
    }
    render(<PluginManageSettingsTab {...({ api, locale: () => 'en', t } as any)} />)
    fireEvent.click(await screen.findByRole('button', { name: /Installed/ }))
    fireEvent.click(await screen.findByRole('button', { name: 'Remove plugin' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Confirm' }))
    expect(await screen.findByText(/stop and restart DSH, then refresh the page/)).toBeTruthy()
  })

  it('applies an available update with one click after planning', async () => {
    const installed = [{
      packageName: 'demo-plugin', requestedSpec: '1.0.0', version: '1.0.0', description: 'Demo',
      author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo',
      system: false, directDependency: true, bundle: true, client: true,
      activeAtLaunch: true, activeAfterRestart: true, state: 'active', runtimeEntries: [],
      latestVersion: '2.0.0', updateAvailable: true, updateCheckError: null, catalogId: 'acme/demo',
    }] as const
    const plan = {
      status: 'ready', planId: 'update-plan-123456789', blockReason: null, action: 'update', profileName: 'web',
      catalogId: 'acme/demo', packageName: 'demo-plugin', currentVersion: '1.0.0', currentSpec: '1.0.0',
      targetVersion: '2.0.0', sourceSpec: 'demo-plugin@2.0.0', artifactIntegrity: null, lifecycleScripts: [],
      warnings: ['trusted-code', 'restart-required', 'scripts-disabled', 'canary-validation'],
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    } as const
    const execute = vi.fn(async () => ({
      status: 'succeeded', code: 'succeeded', action: 'update', packageName: 'demo-plugin',
      restartRequired: true, activation: 'pending-restart', canary: 'passed', processCleanup: 'succeeded',
      rollback: 'not-needed', detail: null, installed, capabilities,
    }))
    const api = {
      bootstrap: async () => ({ catalog, installed, capabilities }),
      listCatalog: async () => catalog,
      refreshCatalog: async () => catalog,
      catalogDetail: async () => null,
      installed: async () => installed,
      installedDetail: async () => null,
      capabilities: async () => capabilities,
      plan: async () => plan,
      execute,
    }
    render(<PluginManageSettingsTab {...({ api, locale: () => 'en', t } as any)} />)
    fireEvent.click(await screen.findByRole('button', { name: /Installed/ }))
    fireEvent.click(await screen.findByRole('button', { name: 'Update plugin' }))
    await waitFor(() => expect(execute).toHaveBeenCalledTimes(1))
    expect(screen.queryByRole('button', { name: 'Confirm' })).toBeNull()
  })

  it('offers the manager itself as a one-click update target', async () => {
    const installed = [{
      packageName: 'dsh-plugin-console', requestedSpec: '0.2.1', version: '0.2.1', description: 'Plugin manager',
      author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/AlexYin-Tongji/dsh-plugin-console',
      system: false, directDependency: true, bundle: true, client: true,
      activeAtLaunch: true, activeAfterRestart: true, state: 'active', runtimeEntries: [],
      latestVersion: '0.2.2', updateAvailable: true, updateCheckError: null, catalogId: 'acme/demo',
    }] as const
    const plan = {
      status: 'ready', planId: 'self-update-plan-123456789', blockReason: null, action: 'update', profileName: 'web',
      catalogId: 'acme/demo', packageName: 'dsh-plugin-console', currentVersion: '0.2.1', currentSpec: '0.2.1',
      targetVersion: '0.2.2', sourceSpec: 'dsh-plugin-console@0.2.2', artifactIntegrity: null, lifecycleScripts: [],
      warnings: ['trusted-code', 'restart-required', 'scripts-disabled', 'canary-validation'],
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    } as const
    const execute = vi.fn(async () => ({
      status: 'succeeded', code: 'succeeded', action: 'update', packageName: 'dsh-plugin-console',
      restartRequired: true, activation: 'pending-restart', canary: 'passed', processCleanup: 'succeeded',
      rollback: 'not-needed', detail: null, installed, capabilities,
    }))
    const api = {
      bootstrap: async () => ({ catalog, installed, capabilities }),
      listCatalog: async () => catalog,
      refreshCatalog: async () => catalog,
      catalogDetail: async () => null,
      installed: async () => installed,
      installedDetail: async () => null,
      capabilities: async () => capabilities,
      plan: async () => plan,
      execute,
    }
    render(<PluginManageSettingsTab {...({ api, locale: () => 'en', t } as any)} />)
    fireEvent.click(await screen.findByRole('button', { name: /Installed/ }))
    fireEvent.click(await screen.findByRole('button', { name: 'Update Plugin manager' }))
    await waitFor(() => expect(execute).toHaveBeenCalledTimes(1))
  })

  it('offers pause for an active external plugin', async () => {
    const installed = [{
      packageName: 'demo-plugin', requestedSpec: '1.0.0', version: '1.0.0', description: 'Demo',
      author: null, license: 'MIT', homepage: null, repositoryUrl: 'https://github.com/acme/demo',
      system: false, directDependency: true, bundle: true, client: true,
      activeAtLaunch: true, activeAfterRestart: true, state: 'active',
      runtimeEntries: [{ entryId: 'demo', enabled: true, phase: 'active' }],
      latestVersion: null, updateAvailable: false, updateCheckError: null, catalogId: 'acme/demo',
    }] as const
    const api = {
      bootstrap: async () => ({ catalog, installed, capabilities }),
      listCatalog: async () => catalog,
      refreshCatalog: async () => catalog,
      catalogDetail: async () => null,
      installed: async () => installed,
      installedDetail: async () => null,
      capabilities: async () => capabilities,
      plan: async () => { throw new Error('not used') },
      execute: async () => { throw new Error('not used') },
    }
    render(<PluginManageSettingsTab {...({ api, locale: () => 'en', t } as any)} />)
    fireEvent.click(await screen.findByRole('button', { name: /Installed/ }))
    expect(await screen.findByRole('button', { name: 'Pause plugin' })).toBeTruthy()
  })
})
