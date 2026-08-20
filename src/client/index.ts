/** Browser half: one first-level Plugin Manager settings section plus the sidebar Harness-update action. */

import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { PluginManageSettingsTab, type PluginManageSettingsTabInjected } from './PluginManageSettingsTab.tsx'
import { HarnessUpdateAction, type HarnessUpdateActionInjected } from './HarnessUpdateAction.tsx'
import { createPluginManageApi } from './api.ts'
import { en, zh, type PluginManageLocaleKey } from './locales.ts'

export type { PluginManageSettingsTabInjected, PluginManageSettingsTabProps } from './PluginManageSettingsTab.tsx'
export type { HarnessUpdateActionInjected, HarnessUpdateActionProps } from './HarnessUpdateAction.tsx'
export type { PluginManageLocaleKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'settings.pluginConsole': PluginManageLocaleKey
  }
}

export const NS = 'settings.pluginConsole'
export const inject = ['slots', 'locale']

export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'plugin-console: dictionaries')
  const t = ctx.locale.bind(NS)
  const api = createPluginManageApi()
  const injected = (): PluginManageSettingsTabInjected => ({
    api,
    locale: () => ctx.locale.getLocale().active,
  })
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'plugin-manager',
    order: 20,
    label: () => t('nav'),
    locale: NS,
    inject: injected,
  }, PluginManageSettingsTab))
  // The Harness-update foot action. The sidebar shell declares this hole;
  // when a custom profile omits the sidebar package the registration simply
  // never mounts (ctx.slots.inject reconciles declarations lazily).
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'plugin-console-harness-update',
    order: 100,
    label: () => t('harnessAction'),
    locale: NS,
    inject: (): HarnessUpdateActionInjected => injected(),
  }, HarnessUpdateAction))
}
