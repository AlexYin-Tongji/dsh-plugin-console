import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
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
      await writeFile(join(pluginRoot, 'README.zh.md'), '# 用法\n\n运行 demo')
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
      expect(detail?.readmeFile).toBe('README.zh.md')
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
})
