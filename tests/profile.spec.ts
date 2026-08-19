import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { ProfileManager } from '../src/profile.ts'

function fakeCatalog() {
  return {
    findByRepository: () => undefined,
    findByPackage: () => undefined,
  } as never
}

describe('profile projection', () => {
  it('separates launch state from the persisted profile state and reads usage docs', async () => {
    const root = await mkdtemp(join('/tmp', 'dsh-plugin-console-profile-'))
    const pluginRoot = join(root, 'node_modules', 'demo-plugin')
    try {
      await mkdir(pluginRoot, { recursive: true })
      await writeFile(join(root, 'package.json'), JSON.stringify({
        name: 'dsh-profile-test',
        dependencies: { 'demo-plugin': '^1.0.0' },
        dsh: { profile: { bundles: ['@deepseek-ai/dsh-base'] } },
      }))
      await writeFile(join(root, 'pnpm-workspace.yaml'), 'packages:\n  - .\n')
      await writeFile(join(pluginRoot, 'package.json'), JSON.stringify({
        name: 'demo-plugin',
        version: '1.2.0',
        description: 'Demo',
        repository: 'https://github.com/acme/demo-plugin',
        dsh: { bundle: { patch: './cordis.patch.yml' }, client: { platform: 'web' } },
      }))
      await writeFile(join(pluginRoot, 'README.zh.txt'), '用法\n====\n运行 demo')
      const ctx = {
        baseUrl: pathToFileURL(root).href,
        loader: { entries: () => [] },
      } as never
      const manager = new ProfileManager({
        ctx,
        dshBin: 'dsh',
        catalog: fakeCatalog(),
        fetchImpl: async () => new Response('not found', { status: 404 }),
      })
      await writeFile(join(root, 'package.json'), JSON.stringify({
        name: 'dsh-profile-test',
        dependencies: { 'demo-plugin': '^1.0.0' },
        dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', 'demo-plugin'] } },
      }))
      const rows = await manager.list('zh', false)
      const row = rows.find(item => item.packageName === 'demo-plugin')
      expect(row).toMatchObject({
        requestedSpec: '^1.0.0',
        version: '1.2.0',
        bundle: true,
        client: true,
        activeAtLaunch: false,
        activeAfterRestart: true,
        state: 'pending-install',
      })
      const detail = await manager.detail('demo-plugin', 'zh')
      expect(detail?.readme).toContain('运行 demo')
      expect(detail?.readmeFile).toBe('README.zh.txt')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('does not borrow package metadata from an unrelated ancestor node_modules', async () => {
    const root = await mkdtemp(join('/tmp', 'dsh-plugin-console-confinement-'))
    const profile = join(root, 'profiles', 'test')
    const ancestorPackage = join(root, 'node_modules', 'borrowed-plugin')
    try {
      await mkdir(profile, { recursive: true })
      await mkdir(ancestorPackage, { recursive: true })
      await writeFile(join(profile, 'package.json'), JSON.stringify({
        name: 'dsh-profile-test',
        dependencies: { 'borrowed-plugin': '1.0.0' },
        dsh: { profile: { bundles: ['borrowed-plugin'] } },
      }))
      await writeFile(join(profile, 'pnpm-workspace.yaml'), 'packages:\n  - .\n')
      await writeFile(join(ancestorPackage, 'package.json'), JSON.stringify({
        name: 'borrowed-plugin',
        version: '9.9.9',
        dsh: { bundle: { patch: './cordis.patch.yml' } },
      }))
      const ctx = { baseUrl: pathToFileURL(profile).href, loader: { entries: () => [] } } as never
      const manager = new ProfileManager({
        ctx,
        dshBin: 'dsh',
        catalog: fakeCatalog(),
        fetchImpl: async () => new Response('not found', { status: 404 }),
      })
      const row = (await manager.list('en', false))[0]
      expect(row).toMatchObject({ packageName: 'borrowed-plugin', version: null, bundle: false })
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('treats absent optional profile files as writable', async () => {
    const root = await mkdtemp(join('/tmp', 'dsh-plugin-console-writable-'))
    try {
      await writeFile(join(root, 'package.json'), JSON.stringify({
        name: 'dsh-profile-test',
        dependencies: {},
        dsh: { profile: { bundles: [] } },
      }))
      const ctx = { baseUrl: pathToFileURL(root).href, loader: { entries: () => [] } } as never
      const manager = new ProfileManager({ ctx, dshBin: 'missing-dsh-test-command', catalog: fakeCatalog() })
      expect((await manager.capabilities()).profileWritable).toBe(true)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('persists multi-entry pause state without stripping YAML comments or js tags', async () => {
    const root = await mkdtemp(join('/tmp', 'dsh-plugin-console-pause-'))
    const pluginRoot = join(root, 'node_modules', 'demo-plugin')
    try {
      await mkdir(pluginRoot, { recursive: true })
      await writeFile(join(root, 'package.json'), JSON.stringify({
        name: 'dsh-profile-test',
        dependencies: { 'demo-plugin': '1.0.0' },
        dsh: { profile: { bundles: ['demo-plugin'] } },
      }))
      await writeFile(join(pluginRoot, 'package.json'), JSON.stringify({
        name: 'demo-plugin',
        version: '1.0.0',
        dsh: { bundle: { patch: './cordis.patch.yml' } },
      }))
      await writeFile(join(pluginRoot, 'cordis.patch.yml'), [
        '- insert:',
        '    - id: demo-a',
        '      name: demo-plugin-a',
        '    - id: demo-b',
        '      name: demo-plugin-b',
        '',
      ].join('\n'))
      await writeFile(join(root, 'cordis.patch.yml'), [
        '# keep this user comment',
        '- id: existing',
        '  name: existing-plugin',
        '  config:',
        "    value: !!js process.env.DEMO ?? 'default'",
        '- id: demo-a',
        '  name: demo-plugin-a',
        '  disabled: true',
        '',
      ].join('\n'))
      const entries = [
        { id: 'demo-a', disabled: false, options: { id: 'demo-a', name: 'demo-plugin-a', group: false } },
        { id: 'demo-b', disabled: false, options: { id: 'demo-b', name: 'demo-plugin-b', group: false } },
      ]
      const ctx = { baseUrl: pathToFileURL(root).href, loader: { entries: () => entries } } as never
      const manager = new ProfileManager({ ctx, dshBin: 'dsh', catalog: fakeCatalog() })

      expect((await manager.list('en', false))[0]?.state).toBe('partially-paused')
      await manager.setPluginPaused('demo-plugin', true)
      let patch = await readFile(join(root, 'cordis.patch.yml'), 'utf8')
      expect(patch).toContain('# keep this user comment')
      expect(patch).toContain("!!js process.env.DEMO ?? 'default'")
      expect((await manager.list('en', false))[0]?.state).toBe('paused')

      await manager.setPluginPaused('demo-plugin', false)
      patch = await readFile(join(root, 'cordis.patch.yml'), 'utf8')
      expect(patch).toContain('# keep this user comment')
      expect(patch).toContain('disabled: false')
      expect((await manager.list('en', false))[0]?.state).toBe('active')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
