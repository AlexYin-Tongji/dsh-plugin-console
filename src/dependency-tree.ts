import { cp, lstat, mkdir, opendir, readlink, realpath, rm } from 'node:fs/promises'
import { dirname, isAbsolute, relative, resolve } from 'node:path'

function pathWithin(path: string, root: string): boolean {
  const child = relative(resolve(root), resolve(path))
  return child.length === 0 || (!child.startsWith('..') && !isAbsolute(child))
}

function copyFilter(root: string): (source: string) => boolean {
  return source => {
    const child = relative(root, source)
    const first = child.split(/[/\\]/)[0]
    return first !== '.git' && first !== 'node_modules'
  }
}

async function materializeExternalLinks(sourceRoot: string, targetRoot: string): Promise<void> {
  const pending = [targetRoot]
  while (pending.length > 0) {
    const current = pending.pop() as string
    const directory = await opendir(current)
    for await (const entry of directory) {
      const targetPath = resolve(current, entry.name)
      const sourcePath = resolve(sourceRoot, relative(targetRoot, targetPath))
      const stat = await lstat(targetPath)
      if (stat.isDirectory()) {
        pending.push(targetPath)
        continue
      }
      if (!stat.isSymbolicLink()) continue
      const link = await readlink(targetPath)
      const resolvedTarget = resolve(dirname(targetPath), link)
      if (pathWithin(resolvedTarget, targetRoot)) continue
      let sourceActual: string
      try {
        sourceActual = await realpath(sourcePath)
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          await rm(targetPath, { force: true })
          continue
        }
        throw error
      }
      await rm(targetPath, { recursive: true, force: true })
      const sourceStat = await lstat(sourceActual)
      await cp(sourceActual, targetPath, {
        recursive: sourceStat.isDirectory(),
        dereference: false,
        verbatimSymlinks: true,
        preserveTimestamps: true,
        filter: sourceStat.isDirectory() ? copyFilter(sourceActual) : undefined,
      })
      if (sourceStat.isDirectory()) pending.push(targetPath)
    }
  }
}

async function assertNoExternalLinks(targetRoot: string): Promise<void> {
  const pending = [targetRoot]
  while (pending.length > 0) {
    const current = pending.pop() as string
    const directory = await opendir(current)
    for await (const entry of directory) {
      const path = resolve(current, entry.name)
      const stat = await lstat(path)
      if (stat.isDirectory()) pending.push(path)
      if (!stat.isSymbolicLink()) continue
      const resolvedTarget = resolve(dirname(path), await readlink(path))
      if (!pathWithin(resolvedTarget, targetRoot)) throw new Error(`Dependency link escapes its private tree: ${path}`)
    }
  }
}

export async function copyDependencyTree(sourceRoot: string, targetRoot: string): Promise<void> {
  await mkdir(dirname(targetRoot), { recursive: true, mode: 0o700 })
  await cp(sourceRoot, targetRoot, {
    recursive: true,
    dereference: false,
    verbatimSymlinks: true,
    preserveTimestamps: true,
  })
  await materializeExternalLinks(sourceRoot, targetRoot)
  await assertNoExternalLinks(targetRoot)
}
