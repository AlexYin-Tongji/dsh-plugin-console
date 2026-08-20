import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { ProfileOperations } from '../src/operations.ts'
import { ProfileManager } from '../src/profile.ts'

const roots: string[] = []

afterEach(async () => {
  delete process.env.DSH_HOME
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

async function run(executable: string, args: readonly string[], cwd: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(executable, [...args], { cwd, stdio: ['ignore', 'pipe', 'pipe'] })
    let output = ''
    child.stdout?.on('data', chunk => { output += String(chunk) })
    child.stderr?.on('data', chunk => { output += String(chunk) })
    child.once('error', reject)
    child.once('exit', code => code === 0 ? resolve() : reject(new Error(output || `command exited ${String(code)}`)))
  })
}

async function pluginFixture(root: string, version: string, source: string, clientSource?: string): Promise<string> {
  const dir = join(root, `plugin-${version}`)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'package.json'), JSON.stringify({
    name: 'canary-rollback-plugin',
    version,
    type: 'module',
    main: './index.js',
    exports: {
      '.': './index.js',
      './package.json': './package.json',
      ...(clientSource === undefined ? {} : { './client': './client.js' }),
    },
    dsh: {
      bundle: { patch: './cordis.patch.yml' },
      ...(clientSource === undefined ? {} : { client: { platform: 'web', inject: [] } }),
    },
  }))
  await writeFile(join(dir, 'index.js'), source)
  if (clientSource !== undefined) await writeFile(join(dir, 'client.js'), clientSource)
  await writeFile(join(dir, 'cordis.patch.yml'), "- insert:\n    - id: canary-rollback\n      name: canary-rollback-plugin\n")
  return dir
}

async function packPlugin(root: string, dir: string, version: string): Promise<string> {
  await run('npm', ['pack', '--ignore-scripts', '--pack-destination', root], dir)
  return join(root, `canary-rollback-plugin-${version}.tgz`)
}

describe('canary update rollback', () => {
  it('restores the previous installed version after the new plugin crashes during isolated startup', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-real-rollback-'))
    roots.push(root)
    const home = join(root, 'home')
    process.env.DSH_HOME = home
    const goodDir = await pluginFixture(root, '1.0.0', "export function apply() {}\nexport default { apply }\n")
    const badDir = await pluginFixture(root, '2.0.0', "export function apply() { throw new Error('bad update canary crash') }\nexport default { apply }\n")
    const good = await packPlugin(root, goodDir, '1.0.0')
    const bad = await packPlugin(root, badDir, '2.0.0')

    await run('dsh', ['plugin', '--profile', 'web', 'add', '--save-exact', '--ignore-scripts', good], root)
    const profileDir = join(home, 'profiles', 'web')
    const catalogDetail = {
      id: 'fixture/canary-rollback', name: 'Canary rollback', owner: 'fixture', repositoryUrl: 'https://github.com/fixture/canary-rollback',
      pageUrl: null, category: 'tools', description: { zh: '测试', en: 'Fixture' }, packageName: 'canary-rollback-plugin', stars: 0,
      addedAt: null, artifactKind: 'npm', verification: 'verified', verificationMessage: null,
      installSpec: bad, commitSha: null, integrity: null,
      manifest: {
        packageName: 'canary-rollback-plugin', version: '2.0.0', description: null, author: null, license: 'MIT',
        homepage: null, repositoryUrl: 'https://github.com/fixture/canary-rollback', bundle: true, client: false,
        lifecycleScripts: [], deprecated: null,
      }, readme: null, readmeSource: null, warnings: [],
    } as const
    const catalog = {
      findByPackage: () => ({ id: catalogDetail.id }),
      findByRepository: () => undefined,
      detail: async () => catalogDetail,
    } as never
    const ctx = {
      baseUrl: pathToFileURL(profileDir).href,
      loader: { entries: () => [] },
      logger: { warn: () => undefined },
    } as never
    const profile = new ProfileManager({ ctx, profileDir, dshBin: 'dsh', catalog })
    const operations = new ProfileOperations({ profile, catalog, dshBin: 'dsh', canaryTimeoutMs: 30_000 })

    const plan = await operations.plan({ action: 'update', catalogId: catalogDetail.id, packageName: 'canary-rollback-plugin' })
    expect(plan.status).toBe('ready')
    const result = await operations.execute(plan.planId as string)
    expect(result.status).toBe('failed')
    expect(result.canary).toBe('failed')
    expect(result.code).toBe('canary-process-exited')
    expect(result.rollback).toBe('succeeded')
    expect(result.detail).toContain('bad update canary crash')

    const installed = JSON.parse(await readFile(join(profileDir, 'node_modules', 'canary-rollback-plugin', 'package.json'), 'utf8')) as { version?: string }
    expect(installed.version).toBe('1.0.0')
    const manifest = JSON.parse(await readFile(join(profileDir, 'package.json'), 'utf8')) as { dependencies?: Record<string, string> }
    expect(manifest.dependencies?.['canary-rollback-plugin']).toContain('canary-rollback-plugin-1.0.0.tgz')
    await run('dsh', ['--profile', 'web', '--dump-config'], root)
  }, 120_000)

  it('rolls back an HTTP-servable client bundle that registers the wrong module id', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-client-rollback-'))
    roots.push(root)
    const home = join(root, 'home')
    process.env.DSH_HOME = home
    const oldDir = await pluginFixture(root, '1.0.0', "export function apply() {}\nexport default { apply }\n")
    const badDir = await pluginFixture(
      root,
      '2.0.0',
      "export function apply() {}\nexport default { apply }\n",
      'window.__ModuleLoader__.load({ id: "wrong-client-id", factory: () => ({}) });\n',
    )
    const oldPlugin = await packPlugin(root, oldDir, '1.0.0')
    const badPlugin = await packPlugin(root, badDir, '2.0.0')
    await run('dsh', ['plugin', '--profile', 'web', 'add', '--save-exact', '--ignore-scripts', oldPlugin], root)

    const profileDir = join(home, 'profiles', 'web')
    const detail = {
      id: 'fixture/canary-client-rollback', name: 'Canary client rollback', owner: 'fixture', repositoryUrl: 'https://github.com/fixture/canary-client-rollback',
      pageUrl: null, category: 'tools', description: { zh: '测试', en: 'Fixture' }, packageName: 'canary-rollback-plugin', stars: 0,
      addedAt: null, artifactKind: 'npm', verification: 'verified', verificationMessage: null,
      installSpec: badPlugin, commitSha: null, integrity: null,
      manifest: {
        packageName: 'canary-rollback-plugin', version: '2.0.0', description: null, author: null, license: 'MIT',
        homepage: null, repositoryUrl: 'https://github.com/fixture/canary-client-rollback', bundle: true, client: true,
        lifecycleScripts: [], deprecated: null,
      }, readme: null, readmeSource: null, warnings: [],
    } as const
    const catalog = { findByPackage: () => ({ id: detail.id }), findByRepository: () => undefined, detail: async () => detail } as never
    const ctx = { baseUrl: pathToFileURL(profileDir).href, loader: { entries: () => [] }, logger: { warn: () => undefined } } as never
    const profile = new ProfileManager({ ctx, profileDir, dshBin: 'dsh', catalog })
    const operations = new ProfileOperations({ profile, catalog, dshBin: 'dsh', canaryTimeoutMs: 30_000 })

    const plan = await operations.plan({ action: 'update', catalogId: detail.id, packageName: 'canary-rollback-plugin' })
    const result = await operations.execute(plan.planId as string)
    expect(result).toMatchObject({
      status: 'failed',
      code: 'canary-http-failed',
      canary: 'failed',
      rollback: 'succeeded',
      processCleanup: 'succeeded',
    })
    expect(result.detail).toContain('registered "wrong-client-id"')
    expect(result.detail).toContain('expects "canary-rollback-plugin"')

    const installed = JSON.parse(await readFile(join(profileDir, 'node_modules', 'canary-rollback-plugin', 'package.json'), 'utf8')) as { version?: string }
    expect(installed.version).toBe('1.0.0')
    const manifest = JSON.parse(await readFile(join(profileDir, 'package.json'), 'utf8')) as { dependencies?: Record<string, string> }
    expect(manifest.dependencies?.['canary-rollback-plugin']).toContain('canary-rollback-plugin-1.0.0.tgz')
    await run('dsh', ['--profile', 'web', '--dump-config'], root)
  }, 120_000)

  it('keeps the new version only after the isolated startup canary passes', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-real-canary-success-'))
    roots.push(root)
    const home = join(root, 'home')
    process.env.DSH_HOME = home
    const oldDir = await pluginFixture(root, '1.0.0', "export function apply() {}\nexport default { apply }\n")
    const newDir = await pluginFixture(root, '2.0.0', "export function apply() {}\nexport default { apply }\n")
    const oldPlugin = await packPlugin(root, oldDir, '1.0.0')
    const newPlugin = await packPlugin(root, newDir, '2.0.0')
    await run('dsh', ['plugin', '--profile', 'web', 'add', '--save-exact', '--ignore-scripts', oldPlugin], root)

    const profileDir = join(home, 'profiles', 'web')
    const detail = {
      id: 'fixture/canary-success', name: 'Canary success', owner: 'fixture', repositoryUrl: 'https://github.com/fixture/canary-success',
      pageUrl: null, category: 'tools', description: { zh: '测试', en: 'Fixture' }, packageName: 'canary-rollback-plugin', stars: 0,
      addedAt: null, artifactKind: 'npm', verification: 'verified', verificationMessage: null,
      installSpec: newPlugin, commitSha: null, integrity: null,
      manifest: {
        packageName: 'canary-rollback-plugin', version: '2.0.0', description: null, author: null, license: 'MIT',
        homepage: null, repositoryUrl: 'https://github.com/fixture/canary-success', bundle: true, client: false,
        lifecycleScripts: [], deprecated: null,
      }, readme: null, readmeSource: null, warnings: [],
    } as const
    const catalog = { findByPackage: () => ({ id: detail.id }), findByRepository: () => undefined, detail: async () => detail } as never
    const ctx = { baseUrl: pathToFileURL(profileDir).href, loader: { entries: () => [] }, logger: { warn: () => undefined } } as never
    const profile = new ProfileManager({ ctx, profileDir, dshBin: 'dsh', catalog })
    const operations = new ProfileOperations({ profile, catalog, dshBin: 'dsh', canaryTimeoutMs: 30_000 })

    const plan = await operations.plan({ action: 'update', catalogId: detail.id, packageName: 'canary-rollback-plugin' })
    const result = await operations.execute(plan.planId as string)
    expect(result).toMatchObject({
      status: 'succeeded',
      canary: 'passed',
      activation: 'pending-restart',
      processCleanup: 'succeeded',
      rollback: 'not-needed',
      restartRequired: true,
    })
    const installed = JSON.parse(await readFile(join(profileDir, 'node_modules', 'canary-rollback-plugin', 'package.json'), 'utf8')) as { version?: string }
    expect(installed.version).toBe('2.0.0')
  }, 120_000)
})
