export function fileURLToPath(value: string | URL): string {
  const url = typeof value === 'string' ? new URL(value) : value
  return decodeURIComponent(url.pathname)
}

export function pathToFileURL(value: string): URL {
  return new URL(`file://${value.startsWith('/') ? '' : '/'}${value}`)
}

export default { fileURLToPath, pathToFileURL }
