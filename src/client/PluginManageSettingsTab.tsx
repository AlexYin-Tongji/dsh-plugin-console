import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  IconChevronLeftOutline14,
  IconChevronRightOutline14,
  IconCloseOutline16,
  IconDownloadOutline16,
  IconPauseOutline16,
  IconPlayOutline16,
  IconRefreshOutline16,
  IconRightUpOutline14,
  IconSearchOutline16,
  IconTrashOutline16,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {
  BootstrapResponse,
  CatalogListRequest,
  CatalogListResponse,
  CatalogPluginDetail,
  CatalogPluginSummary,
  InstalledPluginDetail,
  InstalledPluginSummary,
  ManagerCapabilities,
  OperationAction,
  OperationPlan,
  OperationPlanRequest,
  OperationResult,
} from '../types.ts'
import type { PluginManageLocaleKey } from './locales.ts'
import type { PluginManageApi } from './api.ts'
import { RichReadme } from './ReadmeRenderer.tsx'
import css from './PluginManageSettingsTab.module.css'

export interface PluginManageSettingsTabInjected {
  readonly api: PluginManageApi
  readonly locale: () => string
}

export type PluginManageSettingsTabProps =
  PropsRuntime<'settings.section'>
  & PropsLocale<'settings.pluginConsole'>
  & InjectFace<PluginManageSettingsTabInjected>

type Translate = PluginManageSettingsTabProps['t']
type View = 'store' | 'installed'
type Selection = { readonly kind: 'store'; readonly id: string } | { readonly kind: 'installed'; readonly packageName: string }
type DetailState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly value: CatalogPluginDetail | InstalledPluginDetail }
  | { readonly status: 'missing' | 'error'; readonly message: string | null }

interface ReviewState {
  readonly plan: OperationPlan
  readonly title: string
}

interface LoadState {
  readonly status: 'loading' | 'ready' | 'error'
  readonly message?: string
}

const DEFAULT_REQUEST: CatalogListRequest = { query: '', category: 'all', page: 1, pageSize: 24 }

function languageOf(value: string): 'zh' | 'en' {
  return value.toLocaleLowerCase().startsWith('en') ? 'en' : 'zh'
}

function interpolate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template)
}

function formatStars(value: number, t: Translate): string {
  return interpolate(t('stars', { count: value }), { count: value })
}

const CATEGORY_LABEL_KEYS: Partial<Record<string, PluginManageLocaleKey>> = {
  ui: 'category.ui', tools: 'category.tools', tool: 'category.tool', theme: 'category.theme', memory: 'category.memory',
  skill: 'category.skill', model: 'category.model', session: 'category.session', workflow: 'category.workflow',
  notify: 'category.notify', dev: 'category.dev', market: 'category.market', vision: 'category.vision', fun: 'category.fun',
  other: 'category.other', uncategorized: 'category.uncategorized',
}

function categoryLabel(category: string, t: Translate): string {
  const key = CATEGORY_LABEL_KEYS[category]
  return key === undefined ? category : t(key)
}

function localizedDescription(description: { readonly zh: string; readonly en: string }, language: 'zh' | 'en'): string {
  return description[language] || description[language === 'zh' ? 'en' : 'zh']
}

function statusLabel(state: InstalledPluginSummary['state'], t: Translate): string {
  switch (state) {
    case 'active': return t('active')
    case 'paused': return t('paused')
    case 'partially-paused': return t('partiallyPaused')
    case 'installed-inactive': return t('inactive')
    case 'pending-install': return t('pendingInstall')
    case 'pending-update': return t('pendingUpdate')
    case 'pending-removal': return t('pendingRemoval')
  }
}

function reasonLabel(reason: string | null, t: Translate): string {
  switch (reason) {
    case 'artifact-not-verified': return t('reasonNotVerified')
    case 'already-installed': return t('reasonAlreadyInstalled')
    case 'already-up-to-date': return t('reasonUpToDate')
    case 'profile-not-writable': return t('reasonProfile')
    case 'another-operation-is-running': return t('reasonBusy')
    case 'dsh-command-unavailable': return t('reasonUnavailable')
    case 'pnpm-command-unavailable': return t('reasonPnpmUnavailable')
    case 'system-package-protected': return t('reasonProtected')
    case 'package-not-installed': return t('reasonMissing')
    case 'already-paused': return t('reasonAlreadyPaused')
    case 'already-active': return t('reasonAlreadyActive')
    case 'plugin-entry-unavailable': return t('reasonEntryUnavailable')
    case 'self-pause-protected': return t('reasonSelfPause')
    case 'canary-preparation-failed': return t('reasonCanaryPreparation')
    case 'canary-start-failed': return t('reasonCanaryStart')
    case 'canary-process-exited': return t('reasonCanaryExited')
    case 'canary-timeout': return t('reasonCanaryTimeout')
    case 'canary-target-failed': return t('reasonCanaryTarget')
    case 'canary-http-failed': return t('reasonCanaryHttp')
    case 'canary-shutdown-failed': return t('reasonCanaryShutdown')
    case 'canary-cleanup-failed': return t('reasonCanaryCleanup')
    case 'operation-process-leaked': return t('reasonProcessLeaked')
    case 'profile-locked': return t('reasonProfileLocked')
    case 'profile-lock-failed': return t('reasonProfileLockFailed')
    case 'restart-required-before-next-change': return t('reasonRestart')
    case 'profile-changed': return t('reasonChanged')
    case 'profile-changed-during-canary': return t('reasonChanged')
    case 'profile-changed-during-removal': return t('reasonChanged')
    case 'artifact-repository-mismatch': return t('reasonRepository')
    case 'installed-version-invalid': return t('reasonVersion')
    case 'plan-state-changed': return t('reasonState')
    case 'profile-manifest-repair-failed': return t('reasonManifestRepair')
    case 'operation-timeout': return t('reasonOperationTimeout')
    case 'dsh-command-failed': return t('reasonCommandFailed')
    case 'dsh-command-indeterminate': return t('reasonCommandIndeterminate')
    case 'backup-failed': return t('reasonBackupFailed')
    case 'mutation-snapshot-failed': return t('reasonBackupFailed')
    case 'post-install-validation-failed': return t('reasonValidationFailed')
    case 'activation-change-failed': return t('reasonValidationFailed')
    case 'catalog-entry-required': return t('reasonCatalogRequired')
    case 'catalog-entry-missing': return t('reasonCatalogMissing')
    case 'plan-invalid-or-expired': return t('reasonPlanExpired')
    case 'plan-expired': return t('reasonPlanExpired')
    case 'plan-invalid': return t('reasonPlanExpired')
    case 'operation-busy': return t('reasonBusy')
    case 'composition-validation-failed': return t('reasonState')
    case 'activation-validation-failed': return t('reasonState')
    default: return reason ?? t('reasonGeneric')
  }
}

function warningText(warning: OperationPlan['warnings'][number], t: Translate): string {
  switch (warning) {
    case 'trusted-code': return t('warningTrusted')
    case 'restart-required': return t('warningRestart')
    case 'scripts-disabled': return t('warningScripts')
    case 'canary-validation': return t('warningCanary')
    case 'compatibility-unknown': return t('warningCompat')
    case 'remove-data-kept': return t('warningData')
    case 'self-removal': return t('warningSelf')
    case 'uncatalogued-update': return t('warningUncatalogued')
  }
}

function artifactWarningText(signal: string, t: Translate): string {
  switch (signal) {
    case 'lifecycle-scripts-present': return t('artifactLifecycle')
    case 'license-missing': return t('artifactLicense')
    case 'package-deprecated': return t('artifactDeprecated')
    case 'dsh-compatibility-not-declared': return t('artifactCompat')
    case 'git-source': return t('artifactGit')
    case 'registry-version-pinned': return t('artifactRegistry')
    default: return interpolate(t('artifactOther', { signal }), { signal })
  }
}

function OwnerAvatar({ owner, name }: { readonly owner: string; readonly name: string }): ReactNode {
  const [failed, setFailed] = useState(false)
  if (failed || !/^[A-Za-z0-9_.-]+$/.test(owner)) {
    return <span className={css.avatarFallback} aria-hidden="true">{name.trim().slice(0, 1).toUpperCase() || '?'}</span>
  }
  return <img
    className={css.avatar}
    src={`https://github.com/${encodeURIComponent(owner)}.png?size=64`}
    alt=""
    loading="lazy"
    referrerPolicy="no-referrer"
    onError={() => { setFailed(true) }}
  />
}

function SourceBadge({ item, t }: { readonly item: CatalogPluginSummary; readonly t: Translate }): ReactNode {
  return <span className={css.sourceBadge} data-kind={item.artifactKind}>
    {item.artifactKind === 'npm' ? t('npm') : t('github')}
  </span>
}

function CatalogRow({
  item,
  installed,
  language,
  t,
  onOpen,
  onInstall,
  working,
}: {
  readonly item: CatalogPluginSummary
  readonly installed: InstalledPluginSummary | undefined
  readonly language: 'zh' | 'en'
  readonly t: Translate
  readonly onOpen: () => void
  readonly onInstall: () => void
  readonly working: boolean
}): ReactNode {
  const canInstall = installed === undefined && !working
  return <li className={css.row}>
    <button className={css.rowOpen} type="button" disabled={working} onClick={onOpen}>
      <OwnerAvatar owner={item.owner} name={item.name} />
      <span className={css.rowBody}>
        <span className={css.rowHeading}>
          <strong title={item.name}>{item.name}</strong>
          <span className={css.categoryBadge}>{categoryLabel(item.category, t)}</span>
        </span>
        <span className={css.rowDescription}>{localizedDescription(item.description, language) || item.repositoryUrl}</span>
        <span className={css.rowMeta}>
          <SourceBadge item={item} t={t} />
          <span>{formatStars(item.stars, t)}</span>
          <span>{t('community')}</span>
        </span>
      </span>
    </button>
    <span className={css.rowActions}>
      {installed !== undefined ? <span className={css.stateBadge} data-state={installed.state}>{statusLabel(installed.state, t)}</span> : null}
      {installed === undefined ? (
        <button className={css.primaryButton} type="button" disabled={!canInstall} onClick={onInstall}>
          <IconDownloadOutline16 aria-hidden="true" />{working ? t('installing') : t('install')}
        </button>
      ) : (
        <button className={css.ghostButton} type="button" disabled={working} onClick={onOpen}>{t('details')}</button>
      )}
    </span>
  </li>
}

function InstalledRow({
  item,
  t,
  onOpen,
  onUpdate,
  onRemove,
  onPause,
  onResume,
  working,
}: {
  readonly item: InstalledPluginSummary
  readonly t: Translate
  readonly onOpen: () => void
  readonly onUpdate: () => void
  readonly onRemove: () => void
  readonly onPause: () => void
  readonly onResume: () => void
  readonly working: boolean
}): ReactNode {
  const pending = item.state.startsWith('pending-')
  const paused = item.state === 'paused' || item.state === 'partially-paused'
  const canUpdate = item.updateAvailable && !working && !pending && !item.system
  const canRemove = item.directDependency && !item.system && !working
    && item.state !== 'pending-removal' && item.state !== 'pending-update'
  const canToggle = item.packageName !== 'dsh-plugin-console'
    && item.directDependency && !item.system && !working && !pending && item.runtimeEntries.length > 0
  return <li className={css.row}>
    <button className={css.rowOpen} type="button" disabled={working} onClick={onOpen}>
      <OwnerAvatar owner={item.repositoryUrl?.split('/')[3] ?? ''} name={item.packageName} />
      <span className={css.rowBody}>
        <span className={css.rowHeading}>
          <strong title={item.packageName}>{item.packageName}</strong>
          <span className={css.stateBadge} data-state={item.state}>{statusLabel(item.state, t)}</span>
        </span>
        <span className={css.rowDescription}>{item.description ?? item.repositoryUrl ?? t('runtimeUnknown')}</span>
        <span className={css.rowMeta}>
          <span>{item.version === null ? t('missingValue') : interpolate(t('versionValue', { version: item.version }), { version: item.version })}</span>
          {item.system ? <span>{t('system')}</span> : <span>{t('direct')}</span>}
          {item.bundle ? <span>{t('bundleLayer')}</span> : null}
          {item.client ? <span>{t('clientLayer')}</span> : null}
          {item.updateAvailable && item.latestVersion !== null ? <span className={css.updateMeta}>{interpolate(t('updateAvailable'), { version: item.latestVersion })}</span> : null}
        </span>
      </span>
    </button>
    <span className={css.iconActions}>
      {canToggle && !paused ? <button className={css.iconButton} type="button" title={t('ariaPause')} aria-label={t('ariaPause')} onClick={onPause}><IconPauseOutline16 aria-hidden="true" /></button> : null}
      {canToggle && paused ? <button className={css.iconButton} type="button" title={t('ariaResume')} aria-label={t('ariaResume')} onClick={onResume}><IconPlayOutline16 aria-hidden="true" /></button> : null}
      {canUpdate ? <button className={css.iconButton} type="button" title={item.packageName === 'dsh-plugin-console' ? t('ariaUpdateManager') : t('ariaUpdate')} aria-label={item.packageName === 'dsh-plugin-console' ? t('ariaUpdateManager') : t('ariaUpdate')} onClick={onUpdate}><IconRefreshOutline16 aria-hidden="true" /></button> : null}
      {canRemove ? <button className={css.iconButtonDanger} type="button" title={t('ariaRemove')} aria-label={t('ariaRemove')} onClick={onRemove}><IconTrashOutline16 aria-hidden="true" /></button> : null}
      <button className={css.ghostButton} type="button" disabled={working} onClick={onOpen}>{t('details')}</button>
    </span>
  </li>
}

function isMarkdownSource(source: string | null): boolean {
  if (source === null) return true
  const file = source.split('/').at(-1)?.toLocaleLowerCase() ?? ''
  return /\.(?:md|markdown|mdx)$/.test(file)
}

function Readme({
  value,
  source,
  repositoryUrl,
  gitRef,
  t,
}: {
  readonly value: string | null
  readonly source: string | null
  readonly repositoryUrl: string | null
  readonly gitRef: string | null
  readonly t: Translate
}): ReactNode {
  const markdown = isMarkdownSource(source)
  const [mode, setMode] = useState<'rendered' | 'source'>(markdown ? 'rendered' : 'source')
  if (value === null || value.trim().length === 0) return null
  return <div className={css.readmeContent}>
    <div className={css.readmeMode} role="group" aria-label={t('usage')}>
      {markdown ? <button className={css.readmeModeButton} type="button" data-active={mode === 'rendered' ? 'true' : undefined} onClick={() => setMode('rendered')}>{t('readmeRendered')}</button> : null}
      <button className={css.readmeModeButton} type="button" data-active={mode === 'source' ? 'true' : undefined} onClick={() => setMode('source')}>{t('readmeSourceView')}</button>
    </div>
    {mode === 'rendered' && markdown
      ? <div className={css.markdown}><RichReadme value={value} source={source} repositoryUrl={repositoryUrl} gitRef={gitRef} /></div>
      : <pre className={css.readmeSource}>{value}</pre>}
  </div>
}

function ReviewDialog({
  review,
  t,
  working,
  onCancel,
  onConfirm,
}: {
  readonly review: ReviewState
  readonly t: Translate
  readonly working: boolean
  readonly onCancel: () => void
  readonly onConfirm: () => void
}): ReactNode {
  const [acknowledged, setAcknowledged] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const requiresAck = review.plan.action === 'install' || review.plan.action === 'update'
  const workingLabel = review.plan.action === 'install'
    ? t('installing')
    : review.plan.action === 'update'
      ? t('updating')
      : review.plan.action === 'remove'
        ? t('removing')
        : review.plan.action === 'pause'
          ? t('pausing')
          : t('resuming')
  const reviewSpec = review.plan.sourceSpec
    ?? (review.plan.action === 'pause' || review.plan.action === 'resume' ? t('activationSpec') : t('removeSpec'))

  useEffect(() => {
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && !working) {
        event.preventDefault()
        onCancel()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = [...(modalRef.current?.querySelectorAll<HTMLElement>('button, input, a[href]') ?? [])]
        .filter(element => !element.hasAttribute('disabled') && element.tabIndex >= 0)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onCancel, review.plan.planId, working])
  useEffect(() => { setAcknowledged(false) }, [review.plan.planId])
  return <div className={css.modalBackdrop} role="presentation">
    <div ref={modalRef} className={css.modal} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className={css.modalHeader}>
        <h3 id={titleId}>{t('reviewTitle')}</h3>
        <button ref={closeRef} className={css.iconButton} type="button" disabled={working} title={t('close')} aria-label={t('close')} onClick={onCancel}><IconCloseOutline16 aria-hidden="true" /></button>
      </div>
      <p className={css.modalLead}>{review.title}</p>
      <dl className={css.metaGrid}>
        <div><dt>{t('packageName')}</dt><dd><code>{review.plan.packageName ?? t('missingValue')}</code></dd></div>
        <div><dt>{t('reviewTarget')}</dt><dd>{review.plan.targetVersion ?? review.plan.currentVersion ?? t('missingValue')}</dd></div>
        <div><dt>{t('reviewSpec')}</dt><dd><code className={css.breakable}>{reviewSpec}</code></dd></div>
      </dl>
      {review.plan.warnings.length > 0 ? <div className={css.warningList}>
        <h4>{t('reviewWarnings')}</h4>
        <ul>{review.plan.warnings.map(warning => <li key={warning}>{warningText(warning, t)}</li>)}</ul>
      </div> : null}
      {requiresAck ? <label className={css.checkRow}>
        <input type="checkbox" checked={acknowledged} onChange={event => { setAcknowledged(event.currentTarget.checked) }} />
        <span>{t('acknowledge')}</span>
      </label> : null}
      <div className={css.modalActions}>
        <button className={css.ghostButton} type="button" disabled={working} onClick={onCancel}>{t('cancel')}</button>
        <button className={review.plan.action === 'remove' ? css.dangerButton : css.primaryButton} type="button" disabled={working || (requiresAck && !acknowledged)} onClick={onConfirm}>
          {working ? workingLabel : t('confirm')}
        </button>
      </div>
    </div>
  </div>
}

function CatalogDetailView({
  detail,
  language,
  t,
  working,
  onBack,
  onInstall,
}: {
  readonly detail: CatalogPluginDetail
  readonly language: 'zh' | 'en'
  readonly t: Translate
  readonly working: boolean
  readonly onBack: () => void
  readonly onInstall: () => void
}): ReactNode {
  const description = localizedDescription(detail.description, language)
  return <section className={css.detail}>
    <button className={css.backButton} type="button" disabled={working} onClick={onBack}><IconChevronLeftOutline14 aria-hidden="true" />{t('back')}</button>
    <div className={css.detailHeader}>
      <OwnerAvatar owner={detail.owner} name={detail.name} />
      <div className={css.detailTitle}>
        <h3>{detail.name}</h3>
        <p>{detail.owner}{t('separator')}{categoryLabel(detail.category, t)}</p>
      </div>
      <a className={css.iconButton} href={detail.repositoryUrl} target="_blank" rel="noreferrer noopener" title={t('openRepository')} aria-label={t('openRepository')}><IconRightUpOutline14 aria-hidden="true" /></a>
    </div>
    {description ? <p className={css.detailDescription}>{description}</p> : null}
    <div className={css.detailFacts}>
      <span>{detail.artifactKind === 'npm' ? t('npm') : t('github')}</span>
      <span>{formatStars(detail.stars, t)}</span>
      {detail.verification === 'verified' ? <span className={css.verified}>{t('verified')}</span> : <span className={css.unverified}>{detail.verificationMessage ?? t('unverified')}</span>}
    </div>
    {detail.verification === 'verified' && detail.installSpec !== null ? <div className={css.detailActionRow}>
      <code className={css.spec}>{detail.installSpec}</code>
      <button className={css.primaryButton} type="button" disabled={working} onClick={onInstall}><IconDownloadOutline16 aria-hidden="true" />{working ? t('installing') : t('install')}</button>
    </div> : null}
    {detail.manifest !== null ? <dl className={css.metaGrid}>
      <div><dt>{t('packageName')}</dt><dd><code>{detail.manifest.packageName}</code></dd></div>
      <div><dt>{t('version')}</dt><dd>{detail.manifest.version}</dd></div>
      <div><dt>{t('license')}</dt><dd>{detail.manifest.license ?? t('missingValue')}</dd></div>
      <div><dt>{t('clientLayer')}</dt><dd>{detail.manifest.client ? t('verified') : t('missingValue')}</dd></div>
    </dl> : null}
    {detail.warnings.length > 0 ? <ul className={css.inlineWarnings}>{detail.warnings.map(warning => <li key={warning}>{artifactWarningText(warning, t)}</li>)}</ul> : null}
    <div className={css.readmeHeading}><h4>{t('usage')}</h4>{detail.readmeSource ? <span>{interpolate(t('readmeSource'), { source: detail.readmeSource })}</span> : null}</div>
    {detail.readme === null ? <p className={css.muted}>{t('noReadme')}</p> : <Readme value={detail.readme} source={detail.readmeSource} repositoryUrl={detail.repositoryUrl} gitRef={detail.commitSha} t={t} />}
  </section>
}

function InstalledDetailView({
  detail,
  t,
  working,
  onBack,
  onUpdate,
  onRemove,
  onPause,
  onResume,
}: {
  readonly detail: InstalledPluginDetail
  readonly t: Translate
  readonly working: boolean
  readonly onBack: () => void
  readonly onUpdate: () => void
  readonly onRemove: () => void
  readonly onPause: () => void
  readonly onResume: () => void
}): ReactNode {
  const paused = detail.state === 'paused' || detail.state === 'partially-paused'
  const pending = detail.state.startsWith('pending-')
  const canUpdate = detail.updateAvailable && !working && !pending && !detail.system && detail.directDependency
  const canToggle = detail.packageName !== 'dsh-plugin-console'
    && !detail.system && detail.directDependency && !detail.state.startsWith('pending-') && detail.runtimeEntries.length > 0
  return <section className={css.detail}>
    <button className={css.backButton} type="button" disabled={working} onClick={onBack}><IconChevronLeftOutline14 aria-hidden="true" />{t('back')}</button>
    <div className={css.detailHeader}>
      <OwnerAvatar owner={detail.repositoryUrl?.split('/')[3] ?? ''} name={detail.packageName} />
      <div className={css.detailTitle}><h3>{detail.packageName}</h3><p>{statusLabel(detail.state, t)}</p></div>
      {detail.repositoryUrl ? <a className={css.iconButton} href={detail.repositoryUrl} target="_blank" rel="noreferrer noopener" title={t('openRepository')} aria-label={t('openRepository')}><IconRightUpOutline14 aria-hidden="true" /></a> : null}
    </div>
    {detail.description ? <p className={css.detailDescription}>{detail.description}</p> : null}
    <dl className={css.metaGrid}>
      <div><dt>{t('version')}</dt><dd>{detail.version ?? t('missingValue')}</dd></div>
      <div><dt>{t('source')}</dt><dd><code className={css.breakable}>{detail.requestedSpec ?? t('missingValue')}</code></dd></div>
      <div><dt>{t('bundleLayer')}</dt><dd>{detail.activeAfterRestart ? t('verified') : t('inactive')}</dd></div>
      <div><dt>{t('runtime')}</dt><dd>{detail.runtimeEntries.length === 0 ? t('runtimeUnknown') : detail.runtimeEntries.map(entry => interpolate(t('runtimeEntry', { id: entry.entryId, phase: entry.phase ?? t('missingValue') }), { id: entry.entryId, phase: entry.phase ?? t('missingValue') })).join(t('separator'))}</dd></div>
    </dl>
    <div className={css.detailActionRow}>
      {canToggle && !paused ? <button className={css.ghostButton} type="button" disabled={working} onClick={onPause}><IconPauseOutline16 aria-hidden="true" />{working ? t('pausing') : t('pause')}</button> : null}
      {canToggle && paused ? <button className={css.ghostButton} type="button" disabled={working} onClick={onResume}><IconPlayOutline16 aria-hidden="true" />{working ? t('resuming') : t('resume')}</button> : null}
      {canUpdate ? <button className={css.primaryButton} type="button" disabled={working} onClick={onUpdate}><IconRefreshOutline16 aria-hidden="true" />{working ? t('updating') : t('update')}</button> : null}
      {!detail.system && detail.directDependency && detail.state !== 'pending-removal' && detail.state !== 'pending-update' ? <button className={css.dangerButton} type="button" disabled={working} onClick={onRemove}><IconTrashOutline16 aria-hidden="true" />{working ? t('removing') : t('remove')}</button> : null}
      {detail.updateCheckError ? <span className={css.muted}>{t('checkFailed')}</span> : null}
    </div>
    <div className={css.readmeHeading}><h4>{t('usage')}</h4>{detail.readmeFile ? <span>{detail.readmeFile}</span> : null}</div>
    {detail.readme === null ? <p className={css.muted}>{t('noReadme')}</p> : <Readme value={detail.readme} source={detail.readmeFile} repositoryUrl={detail.repositoryUrl} gitRef={detail.requestedSpec?.match(/#([0-9a-f]{40})$/i)?.[1] ?? null} t={t} />}
  </section>
}

export function PluginManageSettingsTab({ api, locale, t }: PluginManageSettingsTabProps): ReactNode {
  const [view, setView] = useState<View>('store')
  const [catalog, setCatalog] = useState<CatalogListResponse | null>(null)
  const [installed, setInstalled] = useState<readonly InstalledPluginSummary[]>([])
  const [capabilities, setCapabilities] = useState<ManagerCapabilities | null>(null)
  const [load, setLoad] = useState<LoadState>({ status: 'loading' })
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [detail, setDetail] = useState<DetailState>({ status: 'idle' })
  const [review, setReview] = useState<ReviewState | null>(null)
  const [working, setWorking] = useState(false)
  const [banner, setBanner] = useState<string | null>(null)
  const [operationError, setOperationError] = useState<string | null>(null)
  const [reload, setReload] = useState(0)
  const alive = useRef(true)
  const requestSequence = useRef(0)
  const operationSequence = useRef(0)
  const language = languageOf(locale())

  useEffect(() => {
    alive.current = true
    return () => { alive.current = false }
  }, [])

  const request = useMemo<CatalogListRequest>(() => ({ query, category, page, pageSize: 24 }), [category, page, query])

  const loadBootstrap = (): void => {
    const sequence = ++requestSequence.current
    setLoad({ status: 'loading' })
    void api.bootstrap(DEFAULT_REQUEST, language).then((value: BootstrapResponse) => {
      if (!alive.current || sequence !== requestSequence.current) return
      setCatalog(value.catalog)
      setInstalled(value.installed)
      setCapabilities(value.capabilities)
      setLoad({ status: 'ready' })
    }).catch((error: unknown) => {
      if (!alive.current || sequence !== requestSequence.current) return
      setLoad({ status: 'error', message: error instanceof Error ? error.message : String(error) })
    })
  }

  useEffect(() => { loadBootstrap() }, [language, reload])

  useEffect(() => {
    if (load.status !== 'ready') return
    let live = true
    const sequence = ++requestSequence.current
    const timer = setTimeout(() => {
      void api.listCatalog(request).then(value => {
        if (live && alive.current && sequence === requestSequence.current) setCatalog(value)
      }).catch(() => undefined)
    }, 180)
    return () => { live = false; clearTimeout(timer) }
  }, [category, load.status, page, query, request])

  useEffect(() => {
    if (selection === null) { setDetail({ status: 'idle' }); return }
    let live = true
    setDetail({ status: 'loading' })
    const promise = selection.kind === 'store'
      ? api.catalogDetail(selection.id, language)
      : api.installedDetail(selection.packageName, language)
    void promise.then(value => {
      if (!live || !alive.current) return
      setDetail(value === null ? { status: 'missing', message: null } : { status: 'ready', value })
    }).catch((error: unknown) => {
      if (live && alive.current) setDetail({ status: 'error', message: error instanceof Error ? error.message : String(error) })
    })
    return () => { live = false }
  }, [language, selection])

  const installedByCatalog = useMemo(() => new Map(installed.flatMap(item => item.catalogId === null ? [] : [[item.catalogId, item]])), [installed])
  const categories = catalog?.categories ?? []
  const pages = catalog === null ? 1 : Math.max(1, Math.ceil(catalog.total / catalog.pageSize))

  const openStore = (id: string): void => { setView('store'); setSelection({ kind: 'store', id }); setOperationError(null) }
  const openInstalled = (packageName: string): void => { setView('installed'); setSelection({ kind: 'installed', packageName }); setOperationError(null) }
  const closeDetail = (): void => { setSelection(null); setOperationError(null) }

  const applyOperationResult = (result: OperationResult, sequence: number): void => {
    if (!alive.current || sequence !== operationSequence.current) return
    setInstalled(result.installed)
    setCapabilities(result.capabilities)
    void api.installed(language).then(value => {
      if (alive.current && sequence === operationSequence.current) setInstalled(value)
    }).catch(() => undefined)
    setReview(null)
    if (result.status === 'succeeded') {
      setBanner(t(result.canary === 'passed'
        ? 'canaryPassedBanner'
        : result.action === 'remove'
          ? 'removeRestartBanner'
          : 'restartBanner'))
      setSelection(null)
    } else {
      const reason = result.detail ?? reasonLabel(result.code, t)
      const message = result.rollback === 'failed' ? `${reason} ${t('rollbackFailed')}` : reason
      setOperationError(interpolate(t('operationFailed', { message: '' }), { message }))
    }
  }

  const startPlan = (requestToPlan: OperationPlanRequest, title: string, immediate = false): void => {
    const sequence = ++operationSequence.current
    setWorking(true)
    setOperationError(null)
    void api.plan(requestToPlan).then(plan => {
      if (!alive.current || sequence !== operationSequence.current) return
      if (plan.status === 'blocked') {
        setOperationError(interpolate(t('blocked', { reason: '' }), { reason: reasonLabel(plan.blockReason, t) }))
      } else if (immediate && plan.planId !== null) {
        return api.execute(plan.planId).then(result => { applyOperationResult(result, sequence) })
      } else {
        setReview({ plan, title })
      }
    }).catch((error: unknown) => {
      if (!alive.current || sequence !== operationSequence.current) return
      setOperationError(interpolate(t('operationFailed', { message: '' }), { message: error instanceof Error ? error.message : String(error) }))
    }).finally(() => { if (alive.current && sequence === operationSequence.current) setWorking(false) })
  }

  const confirmPlan = (): void => {
    if (review?.plan.planId === null || review?.plan.planId === undefined) return
    const sequence = ++operationSequence.current
    const planId = review.plan.planId
    setWorking(true)
    void api.execute(planId).then(result => { applyOperationResult(result, sequence) }).catch((error: unknown) => {
      if (!alive.current || sequence !== operationSequence.current) return
      setOperationError(interpolate(t('operationFailed', { message: '' }), { message: error instanceof Error ? error.message : String(error) }))
    }).finally(() => { if (alive.current && sequence === operationSequence.current) setWorking(false) })
  }

  const refresh = (): void => {
    const sequence = ++operationSequence.current
    const requestId = ++requestSequence.current
    setWorking(true)
    void api.refreshCatalog(request).then(value => {
      if (alive.current && sequence === operationSequence.current && requestId === requestSequence.current) setCatalog(value)
    }).catch((error: unknown) => {
      if (alive.current && sequence === operationSequence.current) {
        setOperationError(interpolate(t('catalogError', { message: '' }), { message: error instanceof Error ? error.message : String(error) }))
      }
    }).finally(() => { if (alive.current && sequence === operationSequence.current) setWorking(false) })
  }

  const detailReady = detail.status === 'ready' ? detail.value : null
  const storeDetail = detailReady !== null && 'verification' in detailReady ? detailReady : null
  const installedDetail = detailReady !== null && 'readmeFile' in detailReady ? detailReady : null

  return <div className={css.section} aria-busy={load.status === 'loading' || working}>
    <header className={css.header}>
      <div>
        <h3>{t('nav')}</h3>
        <p>{capabilities === null ? t('loading') : interpolate(t('profile', { name: capabilities.profileName }), { name: capabilities.profileName })}</p>
      </div>
      <span className={css.capability} data-ready={capabilities?.profileWritable && capabilities.dshAvailable && capabilities.pnpmAvailable ? 'true' : 'false'}>
        {capabilities?.profileWritable && capabilities.dshAvailable && capabilities.pnpmAvailable ? t('dshReady') : capabilities === null ? t('loading') : t('dshMissing')}
      </span>
    </header>
    <div className={css.viewTabs} aria-label={t('tab')}>
      <button className={css.viewTab} type="button" disabled={working} aria-pressed={view === 'store'} data-active={view === 'store' ? 'true' : undefined} onClick={() => { setView('store'); setSelection(null) }}>{t('store')}</button>
      <button className={css.viewTab} type="button" disabled={working} aria-pressed={view === 'installed'} data-active={view === 'installed' ? 'true' : undefined} onClick={() => { setView('installed'); setSelection(null) }}>{t('installed')} <span className={css.tabCount}>{installed.length}</span></button>
    </div>
    {banner ? <div className={css.banner} role="status"><span>{banner}</span><button className={css.iconButton} type="button" title={t('close')} aria-label={t('close')} onClick={() => setBanner(null)}><IconCloseOutline16 aria-hidden="true" /></button></div> : null}
    {operationError ? <div className={css.errorBanner} role="alert"><span>{operationError}</span><button className={css.iconButton} type="button" title={t('close')} aria-label={t('close')} onClick={() => setOperationError(null)}><IconCloseOutline16 aria-hidden="true" /></button></div> : null}
    {load.status === 'loading' ? <p className={css.status}>{t('loading')}</p> : null}
    {load.status === 'error' ? <div className={css.failure} role="alert"><span>{load.message ?? t('error')}</span><button className={css.ghostButton} type="button" onClick={() => setReload(value => value + 1)}>{t('retry')}</button></div> : null}
    {selection !== null ? (
      detail.status === 'loading' ? <p className={css.status}>{t('loading')}</p>
        : detail.status === 'error' ? <div className={css.failure} role="alert"><span>{detail.message ?? t('error')}</span><button className={css.ghostButton} type="button" onClick={() => setSelection({ ...selection })}>{t('retry')}</button></div>
          : detail.status === 'ready' && storeDetail !== null ? <CatalogDetailView detail={storeDetail} language={language} t={t} working={working} onBack={closeDetail} onInstall={() => startPlan({ action: 'install', catalogId: storeDetail.id }, t('reviewInstall'))} />
            : detail.status === 'ready' && installedDetail !== null ? <InstalledDetailView detail={installedDetail} t={t} working={working} onBack={closeDetail} onUpdate={() => installedDetail.catalogId !== null
        ? startPlan({ action: 'update', catalogId: installedDetail.catalogId, packageName: installedDetail.packageName }, t('reviewUpdate'), true)
        : startPlan({ action: 'update', packageName: installedDetail.packageName }, t('reviewUpdate'), true)} onRemove={() => startPlan({ action: 'remove', packageName: installedDetail.packageName }, t('reviewRemove'))}
               onPause={() => startPlan({ action: 'pause', packageName: installedDetail.packageName }, t('reviewPause'))}
               onResume={() => startPlan({ action: 'resume', packageName: installedDetail.packageName }, t('reviewResume'))} />
              : <p className={css.status}>{t('error')}</p>
    ) : view === 'store' ? (
      <section className={css.catalogView} aria-label={t('ariaStore')}>
        <div className={css.toolbar}>
          <label className={css.search}>
            <IconSearchOutline16 aria-hidden="true" />
            <span className={css.visuallyHidden}>{t('ariaSearch')}</span>
            <input type="search" disabled={working} value={query} placeholder={t('search')} aria-label={t('ariaSearch')} onChange={event => { setQuery(event.currentTarget.value); setPage(1) }} />
          </label>
          <label className={css.selectLabel}><span>{t('category')}</span><select disabled={working} value={category} onChange={event => { setCategory(event.currentTarget.value); setPage(1) }}><option value="all">{t('allCategories')}</option>{categories.map(item => <option key={item.id} value={item.id}>{categoryLabel(item.id, t)} ({item.count})</option>)}</select></label>
          <button className={css.iconButton} type="button" disabled={working || load.status !== 'ready'} title={t('ariaRefresh')} aria-label={t('ariaRefresh')} onClick={refresh}><IconRefreshOutline16 aria-hidden="true" /></button>
        </div>
        {catalog?.status.stale ? <p className={css.stale}>{t('stale')}</p> : null}
        {catalog?.status.state === 'unavailable' ? <p className={css.status}>{t('catalogUnavailable')}</p> : null}
        {catalog !== null && catalog.items.length === 0 && catalog.status.state !== 'unavailable' ? <p className={css.status}>{t('catalogEmpty')}</p> : null}
        {catalog !== null && catalog.items.length > 0 ? <>
          <div className={css.listHeader}><span>{interpolate(t('catalogCount', { count: catalog.total }), { count: catalog.total })}</span><span>{catalog.status.source === 'network' ? t('sourceNetwork') : catalog.status.source === 'cache' ? t('sourceCache') : t('sourceNone')}</span></div>
          <ul className={css.list}>{catalog.items.map(item => <CatalogRow key={item.id} item={item} installed={installedByCatalog.get(item.id)} language={language} t={t} onOpen={() => openStore(item.id)} onInstall={() => startPlan({ action: 'install', catalogId: item.id }, t('reviewInstall'))} working={working} />)}</ul>
          <Pagination page={catalog.page} pages={pages} t={t} onPage={setPage} disabled={working} />
        </> : null}
      </section>
    ) : (
      <section className={css.catalogView} aria-label={t('ariaInstalled')}>
        <div className={css.listHeader}><span>{interpolate(t('installedCount', { count: installed.length }), { count: installed.length })}</span><button className={css.ghostButton} type="button" disabled={working || load.status !== 'ready'} onClick={() => setReload(value => value + 1)}>{t('refresh')}</button></div>
        {installed.length === 0 ? <p className={css.status}>{t('noPlugins')}</p> : <ul className={css.list}>{installed.map(item => <InstalledRow key={item.packageName} item={item} t={t} onOpen={() => openInstalled(item.packageName)} onUpdate={() => item.catalogId !== null
              ? startPlan({ action: 'update', catalogId: item.catalogId, packageName: item.packageName }, t('reviewUpdate'), true)
              : startPlan({ action: 'update', packageName: item.packageName }, t('reviewUpdate'), true)} onRemove={() => startPlan({ action: 'remove', packageName: item.packageName }, t('reviewRemove'))}
              onPause={() => startPlan({ action: 'pause', packageName: item.packageName }, t('reviewPause'))}
              onResume={() => startPlan({ action: 'resume', packageName: item.packageName }, t('reviewResume'))} working={working} />)}</ul>}
      </section>
    )}
    {review !== null ? <ReviewDialog review={review} t={t} working={working} onCancel={() => setReview(null)} onConfirm={confirmPlan} /> : null}
  </div>
}

function Pagination({ page, pages, t, onPage, disabled }: { readonly page: number; readonly pages: number; readonly t: Translate; readonly onPage: (page: number) => void; readonly disabled: boolean }): ReactNode {
  if (pages <= 1) return null
  return <nav className={css.pagination} aria-label={t('page', { page, pages })}>
    <button className={css.iconButton} type="button" disabled={disabled || page <= 1} title={t('previous')} aria-label={t('previous')} onClick={() => onPage(page - 1)}><IconChevronLeftOutline14 aria-hidden="true" /></button>
    <span>{interpolate(t('page', { page, pages }), { page, pages })}</span>
    <button className={css.iconButton} type="button" disabled={disabled || page >= pages} title={t('next')} aria-label={t('next')} onClick={() => onPage(page + 1)}><IconChevronRightOutline14 aria-hidden="true" /></button>
  </nav>
}
