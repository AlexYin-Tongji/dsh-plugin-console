import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { isRecord } from './util.ts'

const LOCK_DIR = '.dsh-plugin-console.lock'
const OWNER_FILE = 'owner.json'
const OWNER_WRITE_GRACE_MS = 500
const OWNERLESS_STALE_MS = 30_000

export class ProfileLockedError extends Error {
  constructor(message = 'Another plugin manager process is changing this profile.') {
    super(message)
    this.name = 'ProfileLockedError'
  }
}

function pidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return (error as NodeJS.ErrnoException).code !== 'ESRCH'
  }
}

async function owner(path: string): Promise<{ pid: number; nonce: string } | null> {
  try {
    const value: unknown = JSON.parse(await readFile(path, 'utf8'))
    if (!isRecord(value) || !Number.isSafeInteger(value.pid) || (value.pid as number) <= 0 || typeof value.nonce !== 'string') return null
    return { pid: value.pid as number, nonce: value.nonce }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw error
  }
}

export async function acquireProfileLock(profileDir: string): Promise<() => Promise<void>> {
  await mkdir(profileDir, { recursive: true })
  const lockDir = join(profileDir, LOCK_DIR)
  const ownerPath = join(lockDir, OWNER_FILE)
  const nonce = randomUUID()

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await mkdir(lockDir, { mode: 0o700 })
      await writeFile(ownerPath, `${JSON.stringify({ pid: process.pid, nonce, createdAt: new Date().toISOString() })}\n`, {
        encoding: 'utf8',
        flag: 'wx',
        mode: 0o600,
      })
      return async () => {
        const current = await owner(ownerPath)
        if (current?.nonce !== nonce || current.pid !== process.pid) return
        await rm(lockDir, { recursive: true, force: true })
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
      await delay(OWNER_WRITE_GRACE_MS)
      const current = await owner(ownerPath)
      if (current !== null && pidAlive(current.pid)) throw new ProfileLockedError()
      if (current === null) {
        let info
        try {
          info = await stat(lockDir)
        } catch (statError) {
          if ((statError as NodeJS.ErrnoException).code === 'ENOENT') continue
          throw statError
        }
        if (Date.now() - info.mtimeMs < OWNERLESS_STALE_MS) throw new ProfileLockedError()
      }
      // Claim the exact stale directory before removing it. Deleting lockDir
      // directly would let two reclaimers race and remove a new owner's lock.
      const staleDir = join(profileDir, `${LOCK_DIR}.stale-${nonce}-${String(attempt)}`)
      try {
        await rename(lockDir, staleDir)
      } catch (renameError) {
        if ((renameError as NodeJS.ErrnoException).code === 'ENOENT') continue
        throw renameError
      }
      await rm(staleDir, { recursive: true, force: true })
    }
  }
  throw new ProfileLockedError()
}
