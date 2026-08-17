/** Browser half: one Settings → Plugins → Manage tab. */

import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { PluginManageSettingsTab, type PluginManageSettingsTabInjected } from './PluginManageSettingsTab.tsx'
import { createPluginManageApi } from './api.ts'
import { en, zh, type PluginManageLocaleKey } from './locales.ts'

export type { PluginManageSettingsTabInjected, PluginManageSettingsTabProps } from './PluginManageSettingsTab.tsx'
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
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'manage',
    order: 30,
    label: () => t('tab'),
    locale: NS,
    inject: injected,
  }, PluginManageSettingsTab))
}
