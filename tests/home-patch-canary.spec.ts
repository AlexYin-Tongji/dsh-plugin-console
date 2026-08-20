import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it } from 'vitest'
import { runActivationCanary } from '../src/canary.ts'

const roots: string[] = []

afterEach(async () => {
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

describe('home patch canary parity', () => {
  it('applies the real DSH home patch during the isolated startup', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-home-patch-'))
    roots.push(root)
    const home = join(root, 'home')
    const profile = join(home, 'profiles', 'web')
    const plugin = join(profile, 'node_modules', 'home-patch-fixture')
    await mkdir(plugin, { recursive: true })
    await writeFile(join(profile, 'package.json'), JSON.stringify({
      name: 'dsh-profile-web', private: true,
      dependencies: { 'home-patch-fixture': `file:${plugin}` },
      dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app', 'home-patch-fixture'] } },
    }))
    await writeFile(join(profile, 'pnpm-workspace.yaml'), 'packages:\n  - .\n')
    await writeFile(join(profile, 'cordis.patch.yml'), '[]\n')
    await writeFile(join(plugin, 'package.json'), JSON.stringify({
      name: 'home-patch-fixture', version: '1.0.0', type: 'module', main: './index.js',
      exports: { '.': './index.js', './package.json': './package.json' },
      dsh: { bundle: { patch: './cordis.patch.yml' } },
    }))
    await writeFile(join(plugin, 'index.js'), "export function apply(_ctx, config) { if (config.fail) throw new Error('home patch conflict') }\nexport default { apply }\n")
    await writeFile(join(plugin, 'cordis.patch.yml'), "- insert:\n    - id: home-patch-fixture\n      name: home-patch-fixture\n      config:\n        fail: false\n")
    await writeFile(join(home, 'cordis.patch.yml'), "- id: home-patch-fixture\n  name: home-patch-fixture\n  config:\n    fail: true\n")

    const result = await runActivationCanary({
      profileDir: profile, profileName: 'web', dshBin: 'dsh', packageName: 'home-patch-fixture',
      expectedVersion: '1.0.0', targets: [{ id: 'home-patch-fixture', name: 'home-patch-fixture' }], timeoutMs: 30_000,
    })
    expect(result.status).toBe('failed')
    expect(result.detail).toContain('home patch conflict')
  }, 45_000)
})
