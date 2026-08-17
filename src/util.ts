import { randomUUID } from 'node:crypto'
import { mkdir, open, readFile, rename, rm } from 'node:fs/promises'
import { dirname } from 'node:path'

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export async function writeFileAtomic(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 })
  const temporary = `${path}.${randomUUID()}.tmp`
  try {
    const handle = await open(temporary, 'wx', 0o600)
    try {
      await handle.writeFile(content, 'utf8')
      await handle.sync()
    } finally {
      await handle.close()
    }
    await rename(temporary, path)
  } finally {
    await rm(temporary, { force: true }).catch(() => undefined)
  }
}

export async function readTextBounded(path: string, maxBytes: number): Promise<string> {
  const handle = await open(path, 'r')
  try {
    const stat = await handle.stat()
    if (stat.size > maxBytes) throw new Error(`File exceeds ${String(maxBytes)} bytes.`)
    return await handle.readFile('utf8')
  } finally {
    await handle.close()
  }
}

export async function readResponseTextBounded(response: Response, maxBytes: number): Promise<string> {
  const declared = response.headers.get('content-length')
  if (declared !== null && Number(declared) > maxBytes) {
    throw new Error(`Response exceeds ${String(maxBytes)} bytes.`)
  }
  if (response.body === null) return ''
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > maxBytes) {
        await reader.cancel()
        throw new Error(`Response exceeds ${String(maxBytes)} bytes.`)
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  const all = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    all.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(all)
}

export function stringValue(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null
}

export function authorName(value: unknown): string | null {
  if (typeof value === 'string') return stringValue(value)
  if (!isRecord(value)) return null
  return stringValue(value.name)
}

export function normalizeGithubRepository(value: unknown): string | null {
  const raw = typeof value === 'string'
    ? value
    : isRecord(value) && typeof value.url === 'string'
      ? value.url
      : null
  if (raw === null) return null
  const normalized = raw
    .replace(/^git\+/, '')
    .replace(/^git@github\.com:/, 'https://github.com/')
    .replace(/^github:/, 'https://github.com/')
    .replace(/\.git(?:#.*)?$/, '')
    .replace(/#.*$/, '')
  let url: URL
  try {
    url = new URL(normalized)
  } catch {
    return null
  }
  if (url.hostname.toLowerCase() !== 'github.com') return null
  const parts = url.pathname.split('/').filter(Boolean)
  if (parts.length < 2) return null
  const owner = parts[0]
  const repo = parts[1]
  if (owner === undefined || repo === undefined || !/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo)) return null
  return `${owner}/${repo}`
}

export function redactProcessOutput(value: string, maxChars = 8000): string | null {
  const redacted = value
    .replace(/(https?:\/\/)([^\s/@:]+):([^\s/@]+)@/g, '$1***:***@')
    .replace(/(token|password|secret|api[_-]?key)(\s*[=:]\s*)[^\s]+/gi, '$1$2***')
    .trim()
  if (redacted.length === 0) return null
  return redacted.length > maxChars ? redacted.slice(-maxChars) : redacted
}

export async function readJsonFile(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, 'utf8')) as unknown
}
