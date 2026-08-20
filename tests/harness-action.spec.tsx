// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HarnessUpdateAction } from '../src/client/HarnessUpdateAction.tsx'
import { en } from '../src/client/locales.ts'
import type { HarnessStatus, HarnessUpdatePlan, HarnessUpdateResult } from '../src/types.ts'

afterEach(cleanup)

vi.mock('@deepseek-ai/dsh-client-ui-primitives', () => {
  const Icon = () => null
  return {
    IconCheckOutline16: Icon,
    IconCloseOutline16: Icon,
    IconDownloadOutline16: Icon,
    IconRefreshOutline16: Icon,
    IconWarningOutline16: Icon,
  }
})

function t(key: keyof typeof en, values?: Record<string, string | number>): string {
  let value: string = en[key]
  for (const [name, replacement] of Object.entries(values ?? {})) value = value.replaceAll(`{${name}}`, String(replacement))
  return value
}

function status(overrides: Partial<HarnessStatus> = {}): HarnessStatus {
  return {
    currentVersion: '0.1.0-rc.6',
    installedVersion: '0.1.0-rc.6',
    latestVersion: '0.1.0-rc.7',
    updateTag: 'latest',
    channels: [{ tag: 'latest', version: '0.1.0-rc.7' }],
    updateAvailable: true,
    pendingRestart: false,
    managed: true,
    packageName: '@deepseek-ai/dsh',
    installRoot: '/prefix/lib/node_modules/@deepseek-ai/dsh',
    prefix: '/prefix',
    executablePath: '/prefix/bin/dsh',
    installMessage: null,
    updateCheckError: null,
    ...overrides,
  }
}

function apiStub(overrides: Record<string, unknown> = {}): any {
  return {
    harnessStatus: async () => status(),
    harnessPlan: async () => { throw new Error('not used') },
    harnessExecute: async () => { throw new Error('not used') },
    ...overrides,
  }
}

describe('harness update sidebar action', () => {
  it('opens a popover with the current and latest versions and offers the one-click update', async () => {
    const api = apiStub()
    render(<HarnessUpdateAction {...({ api, wide: false, t } as any)} />)
    const trigger = await screen.findByRole('button', { name: 'DeepSeek Harness update' })
    expect(trigger.getAttribute('title')).toBe('Update to 0.1.0-rc.7')
    fireEvent.click(trigger)
    expect(await screen.findByRole('dialog')).toBeTruthy()
    expect(screen.getAllByText('0.1.0-rc.6').length).toBeGreaterThan(0)
    expect(screen.getAllByText('0.1.0-rc.7').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /Update to 0.1.0-rc.7/ })).toBeTruthy()
  })

  it('runs plan review and execution, then reports the pending restart', async () => {
    const plan: HarnessUpdatePlan = {
      status: 'ready',
      planId: 'plan-harness-000000000000',
      blockReason: null,
      currentVersion: '0.1.0-rc.6',
      targetVersion: '0.1.0-rc.7',
      updateTag: 'latest',
      installRoot: '/prefix/lib/node_modules/@deepseek-ai/dsh',
      prefix: '/prefix',
      updateCommand: 'npm install --global --prefix /prefix @deepseek-ai/dsh@0.1.0-rc.7',
      warnings: ['trusted-code', 'restart-required', 'canary-validation'],
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    }
    const result: HarnessUpdateResult = {
      status: 'succeeded',
      code: 'succeeded',
      currentVersion: '0.1.0-rc.6',
      targetVersion: '0.1.0-rc.7',
      restartRequired: true,
      activation: 'pending-restart',
      canary: 'passed',
      processCleanup: 'succeeded',
      rollback: 'not-needed',
      detail: null,
      harness: status({ installedVersion: '0.1.0-rc.7', updateAvailable: false, pendingRestart: true }),
      installed: [],
      capabilities: { profileName: 'web', profileWritable: true, dshAvailable: true, pnpmAvailable: true, busy: false, message: null },
    }
    const planSpy = vi.fn(async () => plan)
    const executeSpy = vi.fn(async () => result)
    const api = apiStub({ harnessPlan: planSpy, harnessExecute: executeSpy })
    render(<HarnessUpdateAction {...({ api, wide: true, t } as any)} />)
    fireEvent.click(await screen.findByRole('button', { name: 'DeepSeek Harness update' }))
    fireEvent.click(await screen.findByRole('button', { name: /Update to 0.1.0-rc.7/ }))
    expect(await screen.findByText('Confirm DeepSeek Harness update')).toBeTruthy()
    expect(planSpy).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: 'Confirm update' }))
    await waitFor(() => expect(executeSpy).toHaveBeenCalledWith('plan-harness-000000000000'))
    expect(await screen.findByText(/Update succeeded/)).toBeTruthy()
    expect(screen.getByText(/Restart DSH/)).toBeTruthy()
  })

  it('shows the pending-restart state after an applied update', async () => {
    const api = apiStub({
      harnessStatus: async () => status({ installedVersion: '0.1.0-rc.7', currentVersion: '0.1.0-rc.6', updateAvailable: false, pendingRestart: true }),
    })
    render(<HarnessUpdateAction {...({ api, wide: false, t } as any)} />)
    fireEvent.click(await screen.findByRole('button', { name: 'DeepSeek Harness update' }))
    expect(await screen.findByText(/Updated to 0.1.0-rc.7/)).toBeTruthy()
  })

  it('forces a fresh update check when Check again is pressed', async () => {
    const statusSpy = vi.fn(async () => status())
    const api = apiStub({ harnessStatus: statusSpy })
    render(<HarnessUpdateAction {...({ api, wide: false, t } as any)} />)
    fireEvent.click(await screen.findByRole('button', { name: 'DeepSeek Harness update' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Check again' }))
    await waitFor(() => expect(statusSpy).toHaveBeenCalledWith(true))
  })

  it('explains an unmanaged installation without offering an update button', async () => {
    const api = apiStub({
      harnessStatus: async () => status({ managed: false, updateAvailable: false, installMessage: 'not managed by npm global', prefix: null, executablePath: '/opt/dsh/bin.js' }),
    })
    render(<HarnessUpdateAction {...({ api, wide: false, t } as any)} />)
    fireEvent.click(await screen.findByRole('button', { name: 'DeepSeek Harness update' }))
    expect(await screen.findByText(/not managed by npm global/)).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Update to/ })).toBeNull()
  })

  it('surfaces blocked plans as localized failures', async () => {
    const api = apiStub({
      harnessPlan: async () => ({
        status: 'blocked',
        planId: null,
        blockReason: 'harness-not-managed',
        currentVersion: '0.1.0-rc.6',
        targetVersion: null,
        updateTag: 'latest',
        installRoot: null,
        prefix: null,
        updateCommand: null,
        warnings: [],
        expiresAt: null,
      } satisfies HarnessUpdatePlan),
    })
    render(<HarnessUpdateAction {...({ api, wide: false, t } as any)} />)
    fireEvent.click(await screen.findByRole('button', { name: 'DeepSeek Harness update' }))
    fireEvent.click(await screen.findByRole('button', { name: /Update to 0.1.0-rc.7/ }))
    expect(await screen.findByText(/This Harness installation is not managed by npm global/)).toBeTruthy()
  })
})
