function normalize(value: string): string {
  const parts: string[] = []
  for (const part of value.split('/')) {
    if (part.length === 0 || part === '.') continue
    if (part === '..') {
      parts.pop()
      continue
    }
    parts.push(part)
  }
  return parts.join('/')
}

export const sep = '/'

export function basename(value: string, suffix = ''): string {
  const normalized = value.replace(/\\/g, '/').split('/').at(-1) ?? ''
  return suffix.length > 0 && normalized.endsWith(suffix) ? normalized.slice(0, -suffix.length) : normalized
}

export function dirname(value: string): string {
  const normalized = value.replace(/\\/g, '/')
  const index = normalized.lastIndexOf('/')
  if (index < 0) return '.'
  return normalized.slice(0, index) || '/'
}

export function extname(value: string): string {
  const name = basename(value)
  const index = name.lastIndexOf('.')
  return index <= 0 ? '' : name.slice(index)
}

export function join(...values: string[]): string {
  return normalize(values.filter(value => value.length > 0).join('/'))
}

export default { basename, dirname, extname, join, sep }
