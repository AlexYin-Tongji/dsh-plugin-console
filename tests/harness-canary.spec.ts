import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it } from 'vitest'
import { runHarnessUpdateCanary } from '../src/canary.ts'
import { composedEntriesFromDump } from '../src/harness-operations.ts'

const roots: string[] = []

afterEach(async () => {
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

interface FixturePlugin {
  readonly name: string
  readonly entryId: string
  readonly source: string
  readonly clientSource?: string
}

/**
 * Isolated DSH home whose `profiles/web` carries the fixture bundles. The
 * expected composition is captured with the real CLI (`--dump-config`) from
 * this same home, so it matches exactly what the canary boots.
 */
async function fixtureHome(plugins: readonly FixturePlugin[], patch = '[]\n'): Promise<{ home: string; profileDir: string; pluginNames: string[] }> {
  const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-harness-canary-'))
  roots.push(root)
  const home = join(root, 'home')
  const profileDir = join(home, 'profiles', 'web')
  await mkdir(profileDir, { recursive: true })
  const pluginNames = plugins.map(plugin => plugin.name)
  await writeFile(join(profileDir, 'package.json'), JSON.stringify({
    name: 'dsh-profile-web',
    private: true,
    dependencies: Object.fromEntries(plugins.map(plugin => [plugin.name, `file:${join(profileDir, 'node_modules', plugin.name)}`])),
    dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app', ...pluginNames] } },
  }))
  await writeFile(join(profileDir, 'pnpm-workspace.yaml'), 'packages:\n  - .\n\nnodeLinker: hoisted\nautoInstallPeers: false\n')
  await writeFile(join(profileDir, 'cordis.patch.yml'), patch)
  await writeFile(join(home, 'cordis.patch.yml'), '[]\n')
  for (const plugin of plugins) {
    const pluginRoot = join(profileDir, 'node_modules', plugin.name)
    await mkdir(pluginRoot, { recursive: true })
    const manifest: Record<string, unknown> = {
      name: plugin.name,
      version: '1.0.0',
      type: 'module',
      main: './index.js',
      exports: { '.': './index.js', './package.json': './package.json' },
      dsh: { bundle: { patch: './cordis.patch.yml' } },
    }
    if (plugin.clientSource !== undefined) {
      manifest.exports = { '.': './index.js', './client': './client.js', './package.json': './package.json' }
      manifest.dsh = { bundle: { patch: './cordis.patch.yml' }, client: { platform: 'web', inject: [] } }
      await writeFile(join(pluginRoot, 'client.js'), plugin.clientSource)
    }
    await writeFile(join(pluginRoot, 'package.json'), JSON.stringify(manifest))
    await writeFile(join(pluginRoot, 'index.js'), plugin.source)
    await writeFile(join(pluginRoot, 'cordis.patch.yml'), `- insert:\n    - id: ${plugin.entryId}\n      name: ${plugin.name}\n`)
  }
  return { home, profileDir, pluginNames }
}

function expectedComposition(home: string, profileDir: string): { id: string; name: string; disabled: boolean | 'unknown' }[] {
  const dump = spawnSync('dsh', ['--profile', 'web', '--dump-config'], {
    cwd: profileDir,
    env: { ...process.env, DSH_HOME: home },
    encoding: 'utf8',
    timeout: 60_000,
  })
  expect(dump.status).toBe(0)
  const entries = composedEntriesFromDump(dump.stdout)
  expect(entries).not.toBeNull()
  return [...(entries ?? [])]
}

const goodPlugin = "export function apply() {}\nexport default { apply }\n"
const clientSource = 'window.__ModuleLoader__.load({ id: "client-fixture", factory: () => ({}) });\n'

describe('harness update canary', () => {
  it('passes when every composed Loader entry and client bundle survives the new Harness', async () => {
    const { home, profileDir } = await fixtureHome([
      { name: 'harness-canary-fixture', entryId: 'harness-fixture', source: goodPlugin },
      { name: 'client-fixture', entryId: 'client-fixture-entry', source: goodPlugin, clientSource },
    ])
    const expected = expectedComposition(home, profileDir)
    const result = await runHarnessUpdateCanary({
      profileDir,
      profileName: 'web',
      dshBin: 'dsh',
      expectedEntries: expected,
      expectedClientPackages: ['client-fixture'],
      timeoutMs: 30_000,
    })
    expect(result).toEqual({ status: 'passed', code: 'harness-canary-passed', detail: null })
  }, 60_000)

  it('fails when an expected Loader entry is missing from the composition', async () => {
    const { home, profileDir } = await fixtureHome([
      { name: 'harness-canary-fixture', entryId: 'harness-fixture', source: goodPlugin },
    ])
    const expected = [...expectedComposition(home, profileDir), { id: 'ghost-entry', name: 'ghost', disabled: false }]
    const result = await runHarnessUpdateCanary({
      profileDir,
      profileName: 'web',
      dshBin: 'dsh',
      expectedEntries: expected,
      expectedClientPackages: [],
      timeoutMs: 30_000,
    })
    expect(result.status).toBe('failed')
    expect(result.code).toBe('harness-canary-composition-failed')
    expect(result.detail).toContain('ghost-entry')
  }, 60_000)

  it('fails when an installed plugin crashes during isolated activation', async () => {
    const { home, profileDir } = await fixtureHome([
      { name: 'harness-canary-fixture', entryId: 'harness-fixture', source: goodPlugin },
      { name: 'conflicting-fixture', entryId: 'conflicting-entry', source: "export function apply() { throw new Error('compatibility conflict') }\nexport default { apply }\n" },
    ])
    const expected = expectedComposition(home, profileDir)
    const result = await runHarnessUpdateCanary({
      profileDir,
      profileName: 'web',
      dshBin: 'dsh',
      expectedEntries: expected,
      expectedClientPackages: [],
      timeoutMs: 30_000,
    })
    expect(result.status).toBe('failed')
    expect(result.detail === null ? '' : result.detail).toMatch(/compatibility conflict|not active/)
  }, 60_000)

  it('keeps persisted pause overrides disabled without failing the composition', async () => {
    const { home, profileDir } = await fixtureHome([
      { name: 'harness-canary-fixture', entryId: 'harness-fixture', source: goodPlugin },
    ], '- id: harness-fixture\n  name: harness-canary-fixture\n  disabled: true\n')
    const expected = expectedComposition(home, profileDir)
    expect(expected.find(entry => entry.id === 'harness-fixture')?.disabled).toBe(true)
    const result = await runHarnessUpdateCanary({
      profileDir,
      profileName: 'web',
      dshBin: 'dsh',
      expectedEntries: expected,
      expectedClientPackages: [],
      timeoutMs: 30_000,
    })
    expect(result.status).toBe('passed')
  }, 60_000)

  it('fails when a client package is missing from the Web module graph', async () => {
    const { home, profileDir } = await fixtureHome([
      { name: 'harness-canary-fixture', entryId: 'harness-fixture', source: goodPlugin },
    ])
    const expected = expectedComposition(home, profileDir)
    const result = await runHarnessUpdateCanary({
      profileDir,
      profileName: 'web',
      dshBin: 'dsh',
      expectedEntries: expected,
      expectedClientPackages: ['no-such-client'],
      timeoutMs: 30_000,
    })
    expect(result.status).toBe('failed')
    expect(result.code).toBe('harness-canary-http-failed')
    expect(result.detail).toContain('no-such-client')
  }, 60_000)
})
