import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it } from 'vitest'
import { acquireProfileLock, ProfileLockedError } from '../src/lock.ts'

const roots: string[] = []

afterEach(async () => {
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

describe('profile mutation lock', () => {
  it('excludes another manager until the owner releases', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-lock-'))
    roots.push(root)
    const release = await acquireProfileLock(root)
    await expect(acquireProfileLock(root)).rejects.toBeInstanceOf(ProfileLockedError)
    await release()
    const releaseAgain = await acquireProfileLock(root)
    await releaseAgain()
  })

  it('reclaims a lock whose owner process no longer exists', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-stale-lock-'))
    roots.push(root)
    const lockDir = join(root, '.dsh-plugin-console.lock')
    await mkdir(lockDir)
    await writeFile(join(lockDir, 'owner.json'), JSON.stringify({ pid: 2_147_483_647, nonce: 'stale' }))
    const release = await acquireProfileLock(root)
    await release()
  })

  it('does not let a released stale owner remove a replacement lock', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-replacement-lock-'))
    roots.push(root)
    const release = await acquireProfileLock(root)
    const lockDir = join(root, '.dsh-plugin-console.lock')
    await rm(lockDir, { recursive: true, force: true })
    await mkdir(lockDir)
    await writeFile(join(lockDir, 'owner.json'), JSON.stringify({ pid: process.pid, nonce: 'replacement' }))

    await release()
    await expect(acquireProfileLock(root)).rejects.toBeInstanceOf(ProfileLockedError)
  })
})
