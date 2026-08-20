/**
 * Sidebar foot action: one-click DeepSeek Harness update entry.
 * The icon shows the current vs. available version; the popover runs the
 * reviewed plan → full-profile canary → automatic-rollback flow behind the
 * same Host API used by the settings manager.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  IconCheckOutline16,
  IconCloseOutline16,
  IconDownloadOutline16,
  IconRefreshOutline16,
  IconWarningOutline16,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { HarnessStatus, HarnessUpdatePlan } from '../types.ts'
import type { PluginManageApi } from './api.ts'
import css from './HarnessUpdateAction.module.css'

export interface HarnessUpdateActionInjected {
  readonly api: PluginManageApi
  readonly locale: () => string
}

export type HarnessUpdateActionProps =
  PropsRuntime<'sidebar.footer.action'>
  & PropsLocale<'settings.pluginConsole'>
  & InjectFace<HarnessUpdateActionInjected>

type Translate = HarnessUpdateActionProps['t']

const PANEL_WIDTH = 340
const PANEL_MAX_HEIGHT = 420
const POLL_MS = 60_000

function reasonLabel(reason: string | null, t: Translate): string {
  switch (reason) {
    case 'harness-not-managed': return t('harnessReasonNotManaged')
    case 'harness-up-to-date': return t('harnessReasonUpToDate')
    case 'another-operation-is-running': return t('harnessReasonBusy')
    case 'operation-busy': return t('harnessReasonBusy')
    case 'restart-required-before-next-change': return t('harnessReasonRestart')
    case 'update-check-failed': return t('harnessReasonCheckFailed')
    case 'npm-command-unavailable': return t('harnessReasonNpmUnavailable')
    case 'plan-invalid-or-expired':
    case 'plan-expired': return t('harnessReasonPlanExpired')
    case 'harness-state-changed':
    case 'profile-changed': return t('harnessReasonStateChanged')
    case 'composition-snapshot-failed': return t('harnessReasonComposition')
    default: return reason ?? t('harnessReasonGeneric')
  }
}

function badgeKind(status: HarnessStatus | null): 'available' | 'pending' | 'none' {
  if (status === null) return 'none'
  if (status.updateAvailable) return 'available'
  if (status.pendingRestart) return 'pending'
  return 'none'
}

export function HarnessUpdateAction({ api, wide, t }: HarnessUpdateActionProps): ReactNode {
  const [status, setStatus] = useState<HarnessStatus | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [review, setReview] = useState<HarnessUpdatePlan | null>(null)
  const [working, setWorking] = useState(false)
  const [banner, setBanner] = useState<string | null>(null)
  const [operationError, setOperationError] = useState<string | null>(null)
  const [position, setPosition] = useState<{ readonly top: number; readonly left: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const alive = useRef(true)

  const load = (refresh = false): void => {
    void api.harnessStatus(refresh).then(value => {
      if (alive.current) {
        setStatus(value)
        setLoadError(null)
      }
    }).catch((error: unknown) => {
      if (alive.current) setLoadError(error instanceof Error ? error.message : String(error))
    })
  }

  useEffect(() => {
    alive.current = true
    load()
    const timer = setInterval(load, POLL_MS)
    return () => {
      alive.current = false
      clearInterval(timer)
    }
  }, [])

  const close = (): void => {
    setOpen(false)
    setReview(null)
    setPosition(null)
  }

  const toggle = (): void => {
    if (open) {
      close()
      return
    }
    const rect = triggerRef.current?.getBoundingClientRect()
    const width = Math.min(PANEL_WIDTH, window.innerWidth - 16)
    const top = rect === undefined ? 96 : Math.max(8, rect.top - PANEL_MAX_HEIGHT - 8)
    const left = rect === undefined ? 8 : Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))
    setPosition({ top, left })
    setBanner(null)
    setOperationError(null)
    setOpen(true)
    load()
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') close()
    }
    const onPointerDown = (event: MouseEvent): void => {
      const target = event.target
      if (target instanceof Node && !panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) close()
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [open])

  const startPlan = (): void => {
    setWorking(true)
    setOperationError(null)
    setBanner(null)
    void api.harnessPlan().then(plan => {
      if (!alive.current) return
      if (plan.status === 'blocked') {
        setOperationError(t('harnessUpdateFailed', { message: reasonLabel(plan.blockReason, t) }))
      } else {
        setReview(plan)
      }
    }).catch((error: unknown) => {
      if (!alive.current) return
      setOperationError(t('harnessUpdateFailed', { message: error instanceof Error ? error.message : String(error) }))
    }).finally(() => { if (alive.current) setWorking(false) })
  }

  const confirmPlan = (): void => {
    const planId = review?.planId
    if (planId === null || planId === undefined) return
    setWorking(true)
    setOperationError(null)
    void api.harnessExecute(planId).then(result => {
      if (!alive.current) return
      setReview(null)
      if (result.status === 'succeeded') {
        setBanner(t('harnessUpdated', { from: result.currentVersion ?? '?', to: result.targetVersion ?? '?' }))
      } else {
        const reason = result.detail ?? reasonLabel(result.code, t)
        const rollbackNote = result.rollback === 'succeeded'
          ? ` ${t('harnessUpdatedRollbackNote', { version: result.currentVersion ?? '?' })}`
          : ''
        setOperationError(t('harnessUpdateFailed', { message: `${reason}${rollbackNote}` }))
      }
      load()
    }).catch((error: unknown) => {
      if (!alive.current) return
      setOperationError(t('harnessUpdateFailed', { message: error instanceof Error ? error.message : String(error) }))
    }).finally(() => { if (alive.current) setWorking(false) })
  }

  const badge = badgeKind(status)
  const title = status === null
    ? t('harnessAria')
    : status.updateAvailable
      ? t('harnessUpdate', { version: status.latestVersion ?? '?' })
      : `${t('harnessTitle')} ${status.currentVersion ?? '?'}`

  return <>
    <button
      ref={triggerRef}
      className={css.trigger}
      type="button"
      title={title}
      aria-label={t('harnessAria')}
      aria-expanded={open}
      aria-haspopup="dialog"
      onClick={toggle}
    >
      {working ? <IconRefreshOutline16 aria-hidden="true" className={css.spin} /> : <IconRefreshOutline16 aria-hidden="true" />}
      {wide ? <span className={css.triggerLabel}>{t('harnessAction')}</span> : null}
      {badge !== 'none' ? <span className={badge === 'available' ? css.badgeAvailable : css.badgePending} aria-hidden="true" /> : null}
    </button>
    {open && position !== null ? <div
      ref={panelRef}
      className={css.panel}
      role="dialog"
      aria-label={t('harnessAria')}
      style={{ top: position.top, left: position.left, width: PANEL_WIDTH, maxHeight: PANEL_MAX_HEIGHT }}
    >
      <div className={css.panelHeader}>
        <h3>{t('harnessTitle')}</h3>
        <button className={css.iconButton} type="button" disabled={working} title={t('harnessClose')} aria-label={t('harnessClose')} onClick={close}><IconCloseOutline16 aria-hidden="true" /></button>
      </div>
      {review !== null ? (
        <div className={css.panelBody}>
          <p className={css.lead}>{t('harnessReviewTitle')}</p>
          <dl className={css.metaGrid}>
            <div><dt>{t('harnessRunning')}</dt><dd>{review.currentVersion ?? '?'}</dd></div>
            <div><dt>{t('harnessReviewTarget')}</dt><dd>{review.targetVersion ?? '?'}</dd></div>
            <div><dt>{t('harnessReviewCommand')}</dt><dd><code className={css.breakable}>{review.updateCommand ?? '?'}</code></dd></div>
          </dl>
          <p className={css.reviewWarning}><IconWarningOutline16 aria-hidden="true" />{t('harnessReviewWarning')}</p>
          <div className={css.panelActions}>
            <button className={css.ghostButton} type="button" disabled={working} onClick={() => setReview(null)}>{t('harnessCancel')}</button>
            <button className={css.primaryButton} type="button" disabled={working} onClick={confirmPlan}>
              {working ? t('harnessUpdating') : t('harnessConfirm')}
            </button>
          </div>
        </div>
      ) : (
        <div className={css.panelBody}>
          {banner !== null ? <div className={css.banner} role="status"><IconCheckOutline16 aria-hidden="true" /><span>{banner}</span></div> : null}
          {operationError !== null ? <div className={css.errorBanner} role="alert"><span>{operationError}</span></div> : null}
          {loadError !== null ? (
            <div className={css.errorBanner} role="alert">
              <span>{t('harnessCheckFailed', { message: loadError })}</span>
            </div>
          ) : status === null ? (
            <p className={css.status}>{t('harnessChecking')}</p>
          ) : status.managed ? (
            <>
              <dl className={css.metaGrid}>
                <div><dt>{t('harnessRunning')}</dt><dd>{status.currentVersion ?? '?'}</dd></div>
                <div><dt>{t('harnessInstalled')}</dt><dd>{status.installedVersion ?? '?'}</dd></div>
                <div><dt>{t('harnessLatest')}</dt><dd>{status.latestVersion ?? '?'}</dd></div>
                <div><dt>{t('harnessTag')}</dt><dd><code>{status.updateTag ?? '-'}</code></dd></div>
              </dl>
              {status.pendingRestart ? (
                <p className={css.pending} role="status">{t('harnessPendingRestart', { version: status.installedVersion ?? '?' })}</p>
              ) : status.updateAvailable && status.latestVersion !== null ? (
                <div className={css.panelActions}>
                  <button className={css.primaryButton} type="button" disabled={working} onClick={startPlan}>
                    <IconDownloadOutline16 aria-hidden="true" />{working ? t('harnessUpdating') : t('harnessUpdate', { version: status.latestVersion })}
                  </button>
                </div>
              ) : status.updateCheckError !== null ? (
                <p className={css.status}>{t('harnessCheckFailed', { message: status.updateCheckError })}</p>
              ) : (
                <p className={css.status}>{t('harnessUpToDate')}</p>
              )}
            </>
          ) : (
            <p className={css.status}>{status.installMessage === null
              ? t('harnessReasonNotManaged')
              : t('harnessNotManaged', { root: status.installRoot ?? status.executablePath ?? '?' })}</p>
          )}
          {status !== null ? <button className={css.refreshButton} type="button" disabled={working} onClick={() => { setBanner(null); setOperationError(null); load(true) }}>{t('harnessRefresh')}</button> : null}
        </div>
      )}
    </div> : null}
  </>
}
