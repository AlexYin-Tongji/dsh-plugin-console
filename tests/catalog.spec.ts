import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { PluginCatalog, parseCatalogText, queryCatalog } from '../src/catalog.ts'
import type { CatalogListRequest } from '../src/types.ts'

const npmIntegrity = `sha512-${Buffer.alloc(64, 7).toString('base64')}`

const feed = {
  name: 'fixture',
  plugins: [
    {
      name: 'Demo Plugin',
      owner: 'Acme',
      url: 'https://github.com/Acme/demo-plugin',
      page: 'https://example.test/demo',
      category: 'tools',
      description: { zh: '演示插件', en: 'A demo plugin' },
      npm: 'acme-demo-plugin',
      stars: 12,
      added: '2026-01-01',
    },
    {
      name: 'Git Plugin',
      owner: 'Other',
      url: 'https://github.com/Other/git-plugin.git',
      category: 'ui',
      description: 'Git only',
      npm: null,
      stars: 4,
    },
    {
      name: 'duplicate',
      owner: 'acme',
      url: 'https://github.com/acme/demo-plugin',
      category: 'other',
      description: 'ignored duplicate',
      npm: null,
    },
  ],
}

function request(overrides: Partial<CatalogListRequest> = {}): CatalogListRequest {
  return { query: '', category: 'all', page: 1, pageSize: 20, ...overrides }
}

describe('plugin catalog', () => {
  it('normalizes and deduplicates the curated feed', () => {
    const items = parseCatalogText(JSON.stringify(feed))
    expect(items).toHaveLength(2)
    expect(items[0]).toMatchObject({
      id: 'acme/demo-plugin',
      packageName: 'acme-demo-plugin',
      artifactKind: 'npm',
      description: { zh: '演示插件', en: 'A demo plugin' },
    })
    expect(items[1]?.id).toBe('other/git-plugin')
  })

  it('filters by query and category and paginates', () => {
    const items = parseCatalogText(JSON.stringify(feed))
    const status = { state: 'ready', source: 'cache', sourceUrl: 'fixture', fetchedAt: null, stale: false, error: null } as const
    expect(queryCatalog(items, request({ query: 'demo' }), status).total).toBe(1)
    expect(queryCatalog(items, request({ category: 'ui' }), status).items[0]?.id).toBe('other/git-plugin')
    expect(queryCatalog(items, request({ pageSize: 1, page: 2 }), status).items[0]?.id).toBe('other/git-plugin')
  })

  it('refreshes, caches, and verifies an npm artifact against its repository', async () => {
    const home = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-catalog-'))
    const cachePath = join(home, 'catalog.json')
    const calls: string[] = []
    const fetchImpl: typeof fetch = async (input, init) => {
      const url = String(input)
      calls.push(url)
      if (url === 'https://catalog.test/plugins.json') {
        return new Response(JSON.stringify(feed), { status: 200, headers: { etag: 'v1' } })
      }
      if (url === 'https://registry.npmjs.org/acme-demo-plugin/latest') {
        return new Response(JSON.stringify({
          name: 'acme-demo-plugin',
          version: '1.2.0',
          description: 'A demo plugin',
          repository: { type: 'git', url: 'git+https://github.com/Acme/demo-plugin.git' },
          license: 'MIT',
          dsh: { bundle: { patch: './cordis.patch.yml' }, client: { platform: 'web' } },
          peerDependencies: { '@deepseek-ai/cordis': '^4.0.0' },
          dist: {
            integrity: npmIntegrity,
            tarball: 'https://registry.npmjs.org/acme-demo-plugin/-/acme-demo-plugin-1.2.0.tgz',
          },
          gitHead: 'a'.repeat(40),
          scripts: { build: 'tsdown' },
        }), { status: 200 })
      }
      if (url === 'https://raw.githubusercontent.com/Acme/demo-plugin/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/README.md') {
        return new Response('# Demo\n\nUsage', { status: 200 })
      }
      return new Response('not found', { status: 404 })
    }
    try {
      const catalog = new PluginCatalog({
        sourceUrl: 'https://catalog.test/plugins.json',
        cachePath,
        maxAgeMs: 60_000,
        timeoutMs: 5_000,
        maxCatalogBytes: 100_000,
        maxReadmeBytes: 10_000,
        fetchImpl,
      })
      await catalog.initialize()
      await catalog.refresh()
      const detail = await catalog.detail('acme/demo-plugin', 'en')
      expect(detail).toMatchObject({
        verification: 'verified',
        installSpec: 'acme-demo-plugin@1.2.0',
        commitSha: 'a'.repeat(40),
        integrity: npmIntegrity,
        manifest: { bundle: true, client: true },
        readme: '# Demo\n\nUsage',
      })
      expect(calls).toContain('https://catalog.test/plugins.json')
      expect(calls).toContain('https://registry.npmjs.org/acme-demo-plugin/latest')
    } finally {
      await rm(home, { recursive: true, force: true })
    }
  })

  it('rejects npm metadata without an immutable integrity hash', async () => {
    const home = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-integrity-'))
    try {
      const catalog = new PluginCatalog({
        sourceUrl: 'https://catalog.test/plugins.json',
        cachePath: join(home, 'catalog.json'),
        maxAgeMs: 60_000,
        timeoutMs: 5_000,
        maxCatalogBytes: 100_000,
        maxReadmeBytes: 10_000,
        fetchImpl: async (input) => String(input).includes('registry.npmjs.org')
          ? new Response(JSON.stringify({
              name: 'acme-demo-plugin', version: '1.2.0', repository: 'https://github.com/Acme/demo-plugin',
              dsh: { bundle: { patch: './cordis.patch.yml' } }, dist: {},
            }), { status: 200 })
          : new Response(JSON.stringify(feed), { status: 200 }),
      })
      await catalog.refresh()
      const detail = await catalog.detail('acme/demo-plugin', 'en')
      expect(detail?.verification).toBe('invalid')
      expect(detail?.verificationMessage).toContain('integrity')
    } finally {
      await rm(home, { recursive: true, force: true })
    }
  })

  it('does not trust malformed cached catalog entries', async () => {
    const home = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-cache-'))
    const cachePath = join(home, 'catalog.json')
    try {
      await writeFile(cachePath, JSON.stringify({
        schemaVersion: 1,
        sourceUrl: 'https://catalog.test/plugins.json',
        fetchedAt: new Date().toISOString(),
        etag: null,
        items: [{
          id: 'attacker/not-the-url', name: 'Bad', owner: 'attacker', repositoryUrl: 'javascript:alert(1)',
          pageUrl: null, category: 'tools', description: { zh: '', en: '' }, packageName: 'bad', stars: -1,
          addedAt: null, artifactKind: 'npm',
        }],
      }))
      const catalog = new PluginCatalog({
        sourceUrl: 'https://catalog.test/plugins.json',
        cachePath,
        maxAgeMs: 60_000,
        timeoutMs: 5_000,
        maxCatalogBytes: 100_000,
        maxReadmeBytes: 10_000,
        fetchImpl: async () => new Response('offline', { status: 503 }),
      })
      await catalog.initialize()
      expect(catalog.status()).toMatchObject({ state: 'unavailable', source: 'none' })
      expect(catalog.list(request()).items).toHaveLength(0)
    } finally {
      await rm(home, { recursive: true, force: true })
    }
  })
})
