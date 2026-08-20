import { spawn, type ChildProcess } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

export interface ProcessExit {
  readonly code: number | null
  readonly signal: NodeJS.Signals | null
}

export function processExit(child: ChildProcess, onError?: (error: Error) => void): Promise<ProcessExit> {
  return new Promise(resolve => {
    let settled = false
    const finish = (exit: ProcessExit): void => {
      if (settled) return
      settled = true
      resolve(exit)
    }
    child.once('error', error => {
      onError?.(error)
      finish({ code: 1, signal: null })
    })
    child.once('exit', (code, signal) => finish({ code, signal }))
  })
}

async function waitUntil(check: () => boolean, timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (check()) return true
    await delay(40)
  }
  return check()
}

function posixGroupAlive(pid: number): boolean {
  try {
    process.kill(-pid, 0)
    return true
  } catch (error) {
    return (error as NodeJS.ErrnoException).code !== 'ESRCH'
  }
}

async function runTaskkill(pid: number, force: boolean, timeoutMs: number): Promise<boolean> {
  const child = spawn('taskkill', ['/pid', String(pid), '/t', ...(force ? ['/f'] : [])], {
    shell: false,
    stdio: 'ignore',
  })
  const exited = processExit(child)
  const result = await Promise.race([
    exited.then(exit => exit.code === 0),
    delay(timeoutMs).then(() => null),
  ])
  if (result !== null) return result
  child.kill('SIGKILL')
  await Promise.race([exited, delay(1_000)])
  return false
}

export async function terminateProcessTree(
  child: ChildProcess,
  exited: Promise<ProcessExit>,
  graceMs = 7_000,
  forceMs = 3_000,
): Promise<boolean> {
  const pid = child.pid
  if (pid === undefined) return (await Promise.race([exited.then(() => true), delay(forceMs).then(() => false)]))

  if (process.platform === 'win32') {
    const graceful = await runTaskkill(pid, false, graceMs)
    if (graceful && await Promise.race([exited.then(() => true), delay(1_000).then(() => false)])) return true
    const forced = await runTaskkill(pid, true, forceMs)
    return forced && await Promise.race([exited.then(() => true), delay(forceMs).then(() => false)])
  }

  if (!posixGroupAlive(pid)) return true
  try {
    process.kill(-pid, 'SIGTERM')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ESRCH') return false
  }
  if (await waitUntil(() => !posixGroupAlive(pid), graceMs)) {
    await Promise.race([exited, delay(500)])
    return true
  }
  try {
    process.kill(-pid, 'SIGKILL')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ESRCH') return false
  }
  const gone = await waitUntil(() => !posixGroupAlive(pid), forceMs)
  await Promise.race([exited, delay(500)])
  return gone
}
