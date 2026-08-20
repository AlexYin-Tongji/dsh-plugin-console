import { access, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it } from 'vitest'
import { runActivationCanary, validateClientBundle } from '../src/canary.ts'

const roots: string[] = []

afterEach(async () => {
  delete process.env.CANARY_UNRELATED_MARKER
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

async function fixtureProfile(pluginSource: string, version = '1.0.0', extra?: { readonly name: string; readonly source: string }): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-canary-fixture-'))
  roots.push(root)
  const profile = join(root, 'profile')
  const plugin = join(profile, 'node_modules', 'canary-fixture-plugin')
  const extraPlugin = extra === undefined ? null : join(profile, 'node_modules', extra.name)
  await mkdir(plugin, { recursive: true })
  if (extraPlugin !== null) await mkdir(extraPlugin, { recursive: true })
  await writeFile(join(profile, 'package.json'), JSON.stringify({
    name: 'dsh-profile-web',
    private: true,
    dependencies: {
      'canary-fixture-plugin': `file:${plugin}`,
      ...(extra === undefined ? {} : { [extra.name]: `file:${extraPlugin as string}` }),
    },
    dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app', 'canary-fixture-plugin', ...(extra === undefined ? [] : [extra.name])] } },
  }))
  await writeFile(join(profile, 'pnpm-workspace.yaml'), 'packages:\n  - .\n\nnodeLinker: hoisted\nautoInstallPeers: false\n')
  await writeFile(join(profile, 'cordis.patch.yml'), '[]\n')
  await writeFile(join(plugin, 'package.json'), JSON.stringify({
    name: 'canary-fixture-plugin',
    version,
    type: 'module',
    main: './index.js',
    exports: { '.': './index.js', './package.json': './package.json' },
    dsh: { bundle: { patch: './cordis.patch.yml' } },
  }))
  await writeFile(join(plugin, 'index.js'), pluginSource)
  await writeFile(join(plugin, 'cordis.patch.yml'), "- insert:\n    - id: canary-fixture\n      name: canary-fixture-plugin\n")
  if (extraPlugin !== null && extra !== undefined) {
    await writeFile(join(extraPlugin, 'package.json'), JSON.stringify({
      name: extra.name,
      version: '1.0.0',
      type: 'module',
      main: './index.js',
      exports: { '.': './index.js', './package.json': './package.json' },
      dsh: { bundle: { patch: './cordis.patch.yml' } },
    }))
    await writeFile(join(extraPlugin, 'index.js'), extra.source)
    await writeFile(join(extraPlugin, 'cordis.patch.yml'), `- insert:\n    - id: ${extra.name}-entry\n      name: ${extra.name}\n`)
  }
  return profile
}

describe('client bundle probe', () => {
  it('accepts one matching registration and resolves platform and graph dependencies', () => {
    const result = validateClientBundle([
      'window.__ModuleLoader__.load({',
      '  id: "fixture-plugin",',
      '  factory: (require) => ({ react: require("react"), peer: require("fixture-peer/client") }),',
      '});',
    ].join('\n'), 'fixture-plugin', ['fixture-plugin', 'fixture-peer'])

    expect(result).toEqual({ ok: true, detail: null })
  })

  it.each([
    ['syntax errors', 'window.__ModuleLoader__.load({', 'Unexpected end of input'],
    ['script execution errors', 'throw new Error("script execution failed")', 'script execution failed'],
    ['a missing registration', 'void 0', 'registered 0 modules'],
    ['multiple registrations', [
      'window.__ModuleLoader__.load({ id: "fixture-plugin", factory: () => ({}) });',
      'window.__ModuleLoader__.load({ id: "fixture-plugin", factory: () => ({}) });',
    ].join('\n'), 'registered 2 modules'],
    ['the wrong registration id', 'window.__ModuleLoader__.load({ id: "other-plugin", factory: () => ({}) });', 'registered "other-plugin"'],
    ['factory execution errors', 'window.__ModuleLoader__.load({ id: "fixture-plugin", factory: () => { throw new Error("factory failed") } });', 'factory failed'],
    ['a missing factory dependency', 'window.__ModuleLoader__.load({ id: "fixture-plugin", factory: (require) => require("missing-plugin/client") });', 'dependency "missing-plugin/client" is absent'],
    ['a factory escape attempt', 'window.__ModuleLoader__.load({ id: "fixture-plugin", factory: (require) => require.constructor.constructor("return process")() });', 'Code generation from strings disallowed'],
  ])('rejects %s', (_label, source, detail) => {
    const result = validateClientBundle(source, 'fixture-plugin', ['fixture-plugin'])

    expect(result.ok).toBe(false)
    expect(result.detail).toContain(detail)
  })
})

describe('activation canary', () => {
  it('passes only after the target package and Loader entry activate in an isolated Web profile', async () => {
    const profileDir = await fixtureProfile("export function apply() {}\nexport default { apply }\n")
    const result = await runActivationCanary({
      profileDir,
      profileName: 'web',
      dshBin: 'dsh',
      packageName: 'canary-fixture-plugin',
      expectedVersion: '1.0.0',
      targets: [{ id: 'canary-fixture', name: 'canary-fixture-plugin' }],
      timeoutMs: 30_000,
    })
    expect(result).toEqual({ status: 'passed', code: 'canary-passed', detail: null })
    expect(await readFile(join(profileDir, 'cordis.patch.yml'), 'utf8')).toBe('[]\n')
  }, 45_000)

  it('keeps writes to the target package inside the private dependency copy', async () => {
    const profileDir = await fixtureProfile([
      "import { writeFileSync } from 'node:fs'",
      "import { fileURLToPath } from 'node:url'",
      "export function apply() { writeFileSync(fileURLToPath(new URL('./canary-write.txt', import.meta.url)), 'private') }",
      'export default { apply }',
      '',
    ].join('\n'))
    const result = await runActivationCanary({
      profileDir,
      profileName: 'web',
      dshBin: 'dsh',
      packageName: 'canary-fixture-plugin',
      expectedVersion: '1.0.0',
      targets: [{ id: 'canary-fixture', name: 'canary-fixture-plugin' }],
      timeoutMs: 30_000,
    })
    expect(result.status).toBe('passed')
    await expect(access(join(profileDir, 'node_modules', 'canary-fixture-plugin', 'canary-write.txt'))).rejects.toMatchObject({ code: 'ENOENT' })
  }, 45_000)

  it('includes unrelated third-party bundles so compatibility failures block the update', async () => {
    const profileDir = await fixtureProfile("export function apply() {}\nexport default { apply }\n", '1.0.0', {
      name: 'unrelated-fixture-plugin',
      source: "export function apply() { throw new Error('unrelated compatibility conflict') }\nexport default { apply }\n",
    })
    const result = await runActivationCanary({
      profileDir,
      profileName: 'web',
      dshBin: 'dsh',
      packageName: 'canary-fixture-plugin',
      expectedVersion: '1.0.0',
      targets: [{ id: 'canary-fixture', name: 'canary-fixture-plugin' }],
      timeoutMs: 30_000,
    })
    expect(result.status).toBe('failed')
    expect(result.detail).toContain('unrelated compatibility conflict')
  }, 45_000)

  it('validates and serves a declared Web client bundle', async () => {
    const profileDir = await fixtureProfile("export function apply() {}\nexport default { apply }\n")
    const pluginRoot = join(profileDir, 'node_modules', 'canary-fixture-plugin')
    const manifest = JSON.parse(await readFile(join(pluginRoot, 'package.json'), 'utf8')) as Record<string, any>
    manifest.exports['./client'] = './client.js'
    manifest.dsh.client = { platform: 'web', inject: [] }
    await writeFile(join(pluginRoot, 'package.json'), JSON.stringify(manifest))
    await writeFile(join(pluginRoot, 'client.js'), 'window.__ModuleLoader__.load({ id: "canary-fixture-plugin", factory: () => ({}) });\n')
    const result = await runActivationCanary({
      profileDir,
      profileName: 'web',
      dshBin: 'dsh',
      packageName: 'canary-fixture-plugin',
      expectedVersion: '1.0.0',
      targets: [{ id: 'canary-fixture', name: 'canary-fixture-plugin' }],
      timeoutMs: 30_000,
    })
    expect(result.status).toBe('passed')
  }, 45_000)

  it('fails when the plugin crashes during the post-start stability window', async () => {
    const profileDir = await fixtureProfile("export function apply() { setTimeout(() => { throw new Error('delayed canary crash') }, 150) }\nexport default { apply }\n")
    const result = await runActivationCanary({
      profileDir,
      profileName: 'web',
      dshBin: 'dsh',
      packageName: 'canary-fixture-plugin',
      expectedVersion: '1.0.0',
      targets: [{ id: 'canary-fixture', name: 'canary-fixture-plugin' }],
      stabilityMs: 500,
      timeoutMs: 30_000,
    })
    expect(result.status).toBe('failed')
    expect(result.code).toBe('canary-process-exited')
    expect(result.detail).toContain('delayed canary crash')
  }, 45_000)

  it('fails when the updated plugin throws during activation', async () => {
    const profileDir = await fixtureProfile("export function apply() { throw new Error('canary boom') }\nexport default { apply }\n")
    const result = await runActivationCanary({
      profileDir,
      profileName: 'web',
      dshBin: 'dsh',
      packageName: 'canary-fixture-plugin',
      expectedVersion: '1.0.0',
      targets: [{ id: 'canary-fixture', name: 'canary-fixture-plugin' }],
      timeoutMs: 30_000,
    })
    expect(result.status).toBe('failed')
    expect(result.code).toBe('canary-process-exited')
    expect(result.detail).toContain('canary boom')
  }, 45_000)

  it('accepts a configuration-only bundle with no dedicated Loader entry', async () => {
    const profileDir = await fixtureProfile("export function apply() {}\nexport default { apply }\n")
    const result = await runActivationCanary({
      profileDir,
      profileName: 'web',
      dshBin: 'dsh',
      packageName: 'canary-fixture-plugin',
      expectedVersion: '1.0.0',
      targets: [],
      configurationTargets: [{ id: 'web-runtime', name: '@deepseek-ai/dsh-web-app' }],
      configurationOnly: true,
      timeoutMs: 30_000,
    })
    expect(result).toEqual({ status: 'passed', code: 'canary-passed', detail: null })
  }, 45_000)

  it('rejects an empty target set without an explicit configuration-only descriptor', async () => {
    const profileDir = await fixtureProfile("export function apply() {}\nexport default { apply }\n")
    const result = await runActivationCanary({
      profileDir,
      profileName: 'web',
      dshBin: 'dsh',
      packageName: 'canary-fixture-plugin',
      expectedVersion: '1.0.0',
      targets: [],
      timeoutMs: 30_000,
    })
    expect(result.status).toBe('failed')
    expect(result.code).toBe('canary-target-failed')
  })

  it('rejects a configuration-only bundle whose patch target is missing', async () => {
    const profileDir = await fixtureProfile("export function apply() {}\nexport default { apply }\n")
    const result = await runActivationCanary({
      profileDir,
      profileName: 'web',
      dshBin: 'dsh',
      packageName: 'canary-fixture-plugin',
      expectedVersion: '1.0.0',
      targets: [],
      configurationTargets: [{ id: 'missing-config-target', name: null }],
      configurationOnly: true,
      timeoutMs: 30_000,
    })
    expect(result.status).toBe('failed')
    expect(result.code).toBe('canary-target-failed')
    expect(result.detail).toContain('matches=0')
  }, 45_000)

  it('reports an unavailable dsh executable as a start failure', async () => {
    const profileDir = await fixtureProfile("export function apply() {}\nexport default { apply }\n")
    const result = await runActivationCanary({
      profileDir,
      profileName: 'web',
      dshBin: 'missing-dsh-canary-command',
      packageName: 'canary-fixture-plugin',
      expectedVersion: '1.0.0',
      targets: [{ id: 'canary-fixture', name: 'canary-fixture-plugin' }],
      timeoutMs: 5_000,
    })
    expect(result.status).toBe('failed')
    expect(result.code).toBe('canary-start-failed')
    expect(result.detail).toContain('ENOENT')
  })

  it('fails a target-version mismatch without changing the source profile', async () => {
    const profileDir = await fixtureProfile("export function apply() {}\nexport default { apply }\n", '1.0.0')
    const result = await runActivationCanary({
      profileDir,
      profileName: 'web',
      dshBin: 'dsh',
      packageName: 'canary-fixture-plugin',
      expectedVersion: '2.0.0',
      targets: [{ id: 'canary-fixture', name: 'canary-fixture-plugin' }],
      timeoutMs: 30_000,
    })
    expect(result.status).toBe('failed')
    expect(result.code).toBe('canary-target-failed')
    expect(result.detail).toContain('loaded 1.0.0')
  }, 45_000)
})
