import type { ReactNode } from 'react'
import ReactMarkdown, { type Components, type UrlTransform } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema, type Options as SanitizeSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import type { Element, Root, RootContent } from 'hast'
import type { Plugin } from 'unified'

export interface ReadmeGitHubContext {
  readonly owner: string
  readonly repo: string
  readonly ref: string
  readonly path: string
}

export interface ReadmeRendererProps {
  readonly value: string
  readonly source: string | null
  readonly repositoryUrl: string | null
  readonly gitRef: string | null
}

type ReadmeUrlKind = 'link' | 'image'

const SAFE_REPOSITORY_PART = /^[A-Za-z0-9_.-]+$/
const CONTROL_OR_BACKSLASH = /[\u0000-\u001f\u007f\\]/
const RAW_HTML = /<(?:a|div|details|img|p|picture|span|summary|table)\b/i

const DISALLOWED_TAGS = new Set(['audio', 'embed', 'form', 'iframe', 'input', 'math', 'object', 'script', 'source', 'style', 'svg', 'video'])

const readmeSchema: SanitizeSchema = {
  ...defaultSchema,
  tagNames: [...new Set([
    ...(defaultSchema.tagNames ?? []),
    'div',
    'details',
    'summary',
    'kbd',
    'sub',
    'sup',
  ])].filter(tagName => !DISALLOWED_TAGS.has(tagName)),
  attributes: {
    ...defaultSchema.attributes,
    '*': (defaultSchema.attributes?.['*'] ?? []).filter(attribute => attribute !== 'id'),
    p: [...(defaultSchema.attributes?.p ?? []), ['align', 'left', 'center', 'right']],
    div: [...(defaultSchema.attributes?.div ?? []), ['align', 'left', 'center', 'right']],
    a: [...(defaultSchema.attributes?.a ?? []), 'href', 'title'],
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      'src',
      'alt',
      'title',
      'width',
      'height',
      ['align', 'left', 'center', 'right'],
    ],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto'],
    src: ['http', 'https'],
  },
  clobberPrefix: 'readme-',
}

function repositoryParts(repositoryUrl: string | null): { owner: string; repo: string } | null {
  if (repositoryUrl === null) return null
  try {
    const url = new URL(repositoryUrl)
    if (url.protocol !== 'https:' || url.hostname.toLocaleLowerCase() !== 'github.com') return null
    const [owner, rawRepo] = url.pathname.split('/').filter(Boolean)
    const repo = rawRepo?.replace(/\.git$/i, '')
    if (owner === undefined || repo === undefined || !SAFE_REPOSITORY_PART.test(owner) || !SAFE_REPOSITORY_PART.test(repo)) return null
    return { owner, repo }
  } catch {
    return null
  }
}

function sourceContext(source: string | null): ReadmeGitHubContext | null {
  if (source === null) return null
  const match = /^([^/@]+)\/([^/@]+)@([^/]+)\/(.+)$/.exec(source)
  if (match === null) return null
  const [, owner, repo, ref, path] = match
  if (owner === undefined || repo === undefined || ref === undefined || path === undefined
    || !SAFE_REPOSITORY_PART.test(owner) || !SAFE_REPOSITORY_PART.test(repo) || ref.length === 0 || path.length === 0) return null
  return { owner, repo, ref, path }
}

export function readmeGitHubContext(
  source: string | null,
  repositoryUrl: string | null,
  ref: string | null,
): ReadmeGitHubContext | null {
  const fromSource = sourceContext(source)
  if (fromSource !== null) return fromSource
  const repository = repositoryParts(repositoryUrl)
  if (repository === null || source === null || source.includes('/') || CONTROL_OR_BACKSLASH.test(source)) return null
  return { ...repository, ref: ref ?? 'HEAD', path: source }
}

function splitSuffix(value: string): { path: string; suffix: string } {
  const query = value.indexOf('?')
  const fragment = value.indexOf('#')
  const index = query < 0 ? fragment : fragment < 0 ? query : Math.min(query, fragment)
  return index < 0 ? { path: value, suffix: '' } : { path: value.slice(0, index), suffix: value.slice(index) }
}

function normalizedPath(value: string, basePath: string): string | null {
  const { path } = splitSuffix(value)
  const base = value.startsWith('/') ? [] : basePath.split('/').slice(0, -1)
  const segments = [...base]
  for (const raw of path.replace(/^\/?/, '').split('/')) {
    if (raw.length === 0 || raw === '.') continue
    let segment: string
    try {
      segment = decodeURIComponent(raw)
    } catch {
      return null
    }
    if (segment.includes('/') || segment.includes('\\') || CONTROL_OR_BACKSLASH.test(segment)) return null
    if (segment === '..') {
      if (segments.length === 0) return null
      segments.pop()
      continue
    }
    segments.push(segment)
  }
  return segments.length === 0 ? null : segments.map(segment => encodeURIComponent(segment)).join('/')
}

function absoluteUrl(value: string, kind: ReadmeUrlKind): string | null {
  try {
    const url = new URL(value)
    const protocol = url.protocol.toLocaleLowerCase()
    if (protocol === 'http:' || protocol === 'https:') return url.href
    if (kind === 'link' && protocol === 'mailto:') return url.href
  } catch {
    // Relative URLs are resolved against the immutable GitHub README context.
  }
  return null
}

export function resolveReadmeUrl(
  value: string,
  kind: ReadmeUrlKind,
  context: ReadmeGitHubContext | null,
): string | null {
  const url = value.trim()
  if (url.length === 0 || CONTROL_OR_BACKSLASH.test(url) || url.startsWith('//')) return null
  const absolute = absoluteUrl(url, kind)
  if (absolute !== null) return absolute
  if (/^[A-Za-z][A-Za-z0-9+.-]*:/.test(url) || context === null) return null

  const relative = url.startsWith('#') || url.startsWith('?') ? context.path + url : url
  const normalized = normalizedPath(relative, context.path)
  if (normalized === null) return null
  const { suffix } = splitSuffix(relative)
  const ref = context.ref.split('/').map(segment => encodeURIComponent(segment)).join('/')
  const owner = encodeURIComponent(context.owner)
  const repo = encodeURIComponent(context.repo)
  return kind === 'image'
    ? `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${normalized}${suffix}`
    : `https://github.com/${owner}/${repo}/blob/${ref}/${normalized}${suffix}`
}

function visitElements(node: Root | RootContent, visit: (element: Element) => void): void {
  if (node.type === 'element') visit(node)
  if ('children' in node) {
    for (const child of node.children) visitElements(child, visit)
  }
}

const rehypeResolveReadmeUrls: Plugin<[{ readonly context: ReadmeGitHubContext | null }], Root> = ({ context }) => tree => {
  visitElements(tree, element => {
    const href = element.properties.href
    if (typeof href === 'string') {
      const resolved = resolveReadmeUrl(href, 'link', context)
      if (resolved === null) delete element.properties.href
      else element.properties.href = resolved
    }
    const src = element.properties.src
    if (typeof src === 'string') {
      const resolved = resolveReadmeUrl(src, 'image', context)
      if (resolved === null) delete element.properties.src
      else element.properties.src = resolved
    }
  })
}

const components: Components = {
  a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noreferrer noopener" />,
  img: ({ node: _node, ...props }) => <img {...props} loading="lazy" decoding="async" referrerPolicy="no-referrer" />,
}

export function hasRawReadmeHtml(value: string): boolean {
  return RAW_HTML.test(value)
}

export function RichReadme({ value, source, repositoryUrl, gitRef }: ReadmeRendererProps): ReactNode {
  const context = readmeGitHubContext(source, repositoryUrl, gitRef)
  const urlTransform: UrlTransform = (url, key) => resolveReadmeUrl(url, key === 'src' ? 'image' : 'link', context)
  return <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[
      rehypeRaw,
      [rehypeResolveReadmeUrls, { context }],
      [rehypeSanitize, readmeSchema],
    ]}
    urlTransform={urlTransform}
    components={components}
  >
    {value}
  </ReactMarkdown>
}
