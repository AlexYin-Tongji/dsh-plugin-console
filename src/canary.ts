import { randomUUID } from 'node:crypto'
import { spawn, type ChildProcess } from 'node:child_process'
import { copyFile, mkdir, mkdtemp, opendir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { Script, createContext } from 'node:vm'
import { stringify as stringifyYaml } from 'yaml'
import { copyDependencyTree } from './dependency-tree.ts'
import type { PluginActivationTarget, PluginConfigurationTarget } from './profile.ts'
import { processExit, terminateProcessTree, type ProcessExit } from './process.ts'
import { errorMessage, isRecord, readResponseTextBounded, redactProcessOutput } from './util.ts'

const OUTPUT_LIMIT = 24_000
const POLL_MS = 40
const DEFAULT_STARTUP_STABILITY_MS = 3_000
const CLIENT_SCRIPT_TIMEOUT_MS = 3_000
const CLIENT_FACTORY_TIMEOUT_MS = 3_000

// These are supplied by the shell rather than represented by a client graph row.
// The list is intentionally narrow: every other require must be present in the
// isolated profile's client module graph.
const CLIENT_SEED_MODULES = new Set([
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-web-react',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-attachment',
  '@deepseek-ai/dsh-client-schema-form',
])

const CLIENT_SCRIPT_MAX_BYTES = 8 * 1024 * 1024

export interface ActivationCanaryRequest {
  readonly profileDir: string
  readonly profileName: string
  readonly dshBin: string
  readonly packageName: string
  readonly expectedVersion: string
  readonly targets: readonly PluginActivationTarget[]
  readonly configurationTargets?: readonly PluginConfigurationTarget[]
  readonly configurationOnly?: boolean
  readonly stabilityMs?: number
  readonly timeoutMs: number
}

export interface ActivationCanaryResult {
  readonly status: 'passed' | 'failed'
  readonly code:
    | 'canary-passed'
    | 'canary-preparation-failed'
    | 'canary-start-failed'
    | 'canary-process-exited'
    | 'canary-timeout'
    | 'canary-target-failed'
    | 'canary-http-failed'
    | 'canary-shutdown-failed'
    | 'canary-cleanup-failed'
  readonly detail: string | null
}

class CanarySetupError extends Error {
  readonly code: 'canary-preparation-failed' | 'canary-shutdown-failed' | 'canary-cleanup-failed'

  constructor(code: CanarySetupError['code'], message: string) {
    super(message)
    this.name = 'CanarySetupError'
    this.code = code
  }
}

interface ProbeEntry {
  readonly id: string
  readonly name: string
  readonly matches: number
  readonly disabled: boolean | null
  readonly state: number | null
  readonly missingServices: readonly string[]
}

interface ProbeDocument {
  readonly protocolVersion: 1
  readonly nonce: string
  readonly pid: number
  readonly passed: boolean
  readonly packageName: string
  readonly expectedVersion: string
  readonly actualVersion: string | null
  readonly clientExpected: boolean
  readonly clientPresent: boolean
  readonly clientUrl: string | null
  readonly clientGraphIds: readonly string[]
  readonly port: number | null
  readonly entries: readonly ProbeEntry[]
  readonly configurationEntries: readonly ProbeEntry[]
  readonly error?: string
}

const PROBE_SOURCE = String.raw`import { readFileSync, renameSync, writeFileSync } from 'node:fs'

export const name = 'plugin-console-canary-probe'
export const inject = ['loader']

function publish(path, value) {
  const temporary = path + '.tmp'
  writeFileSync(temporary, JSON.stringify(value))
  renameSync(temporary, path)
}

export function apply(ctx, config) {
  queueMicrotask(async () => {
    const base = {
      protocolVersion: 1,
      nonce: config.nonce,
      pid: process.pid,
      packageName: config.packageName,
      expectedVersion: config.expectedVersion,
    }
    try {
      await ctx.loader.await()
      await new Promise(resolve => setImmediate(resolve))
      const all = [...ctx.loader.entries()]
      const entries = config.targets.map(target => {
        const matches = all.filter(entry => entry.options.id === target.id && entry.options.name === target.name)
        const entry = matches[0]
        return {
          ...target,
          matches: matches.length,
          disabled: entry?.disabled ?? null,
          state: entry?.fiber?.state ?? null,
          missingServices: entry?.fiber === undefined
            ? []
            : Object.keys(entry.fiber.inject).filter(service => entry.fiber.ctx.get(service) === undefined),
        }
      })
      const configurationEntries = config.configurationTargets.map(target => {
        const matches = all.filter(entry => entry.options.id === target.id && (target.name === null || entry.options.name === target.name))
        const entry = matches[0]
        return {
          id: target.id,
          name: target.name ?? entry?.options.name ?? '',
          matches: matches.length,
          disabled: entry?.disabled ?? null,
          state: entry?.fiber?.state ?? null,
          missingServices: entry?.fiber === undefined
            ? []
            : Object.keys(entry.fiber.inject).filter(service => entry.fiber.ctx.get(service) === undefined),
        }
      })
      const manifest = JSON.parse(readFileSync(config.packageJsonPath, 'utf8'))
      const actualVersion = typeof manifest.version === 'string' ? manifest.version : null
      const clientExpected = manifest.dsh?.client?.platform === 'web'
      const clientGraph = ctx.get('clientModules')?.graph?.()
      const clientEntry = clientGraph?.entries?.find(entry => entry.id === config.packageName)
      const clientPresent = !clientExpected || clientEntry !== undefined
      const clientUrl = clientExpected && typeof clientEntry?.url === 'string' ? clientEntry.url : null
      const clientGraphIds = clientGraph?.entries
        ?.filter(entry => typeof entry.id === 'string')
        .map(entry => entry.id) ?? []
      const port = ctx.get('webServer')?.port
      const passed = actualVersion === config.expectedVersion
        && clientPresent
        && Number.isSafeInteger(port)
        && port > 0
        && entries.every(entry => entry.matches === 1 && entry.disabled === false && entry.state === 2)
        && configurationEntries.every(entry => entry.matches === 1 && (entry.disabled === true || entry.state === 2))
      publish(config.resultPath, {
        ...base,
        passed,
        actualVersion,
        clientExpected,
        clientPresent,
        clientUrl,
        clientGraphIds,
        port: Number.isSafeInteger(port) ? port : null,
        entries,
        configurationEntries,
      })
    } catch (error) {
      publish(config.resultPath, {
        ...base,
        passed: false,
        actualVersion: null,
        clientExpected: false,
        clientPresent: false,
        clientUrl: null,
        clientGraphIds: [],
        port: null,
        entries: [],
        configurationEntries: [],
        error: error instanceof Error ? error.stack ?? error.message : String(error),
      })
    }
  })
}

export default { name, inject, apply }
`

function appendOutput(current: string, chunk: Buffer): string {
  const next = current + chunk.toString('utf8')
  return next.length > OUTPUT_LIMIT ? next.slice(-OUTPUT_LIMIT) : next
}

async function copyIfPresent(source: string, destination: string): Promise<void> {
  try {
    await copyFile(source, destination)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
}

function packageJsonPath(profileDir: string, packageName: string): string {
  return join(profileDir, 'node_modules', ...packageName.split('/'), 'package.json')
}

async function copyCanaryDependencies(sourceProfile: string, canaryProfile: string): Promise<void> {
  await copyDependencyTree(join(sourceProfile, 'node_modules'), join(canaryProfile, 'node_modules'))
}

async function prepareCanaryHome(request: ActivationCanaryRequest): Promise<{
  readonly root: string
  readonly resultPath: string
  readonly patchPath: string
  readonly cwd: string
  readonly nonce: string
}> {
  const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-console-canary-'))
  try {
    const profileDir = join(root, 'profiles', request.profileName)
    const tempDir = join(root, 'tmp')
    const cwd = join(root, 'workspace')
    await Promise.all([
      mkdir(profileDir, { recursive: true, mode: 0o700 }),
      mkdir(tempDir, { recursive: true, mode: 0o700 }),
      mkdir(cwd, { recursive: true, mode: 0o700 }),
    ])
    await copyIfPresent(join(process.cwd(), '.env'), join(cwd, '.env'))
    for (const filename of ['package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'cordis.patch.yml']) {
      await copyIfPresent(join(request.profileDir, filename), join(profileDir, filename))
    }
    const homePatch = join(root, 'cordis.patch.yml')
    await writeFile(homePatch, '[]\n', { encoding: 'utf8', mode: 0o600 })
    const profilesRoot = dirname(request.profileDir)
    if (basename(profilesRoot) === 'profiles') {
      const sourceHome = dirname(profilesRoot)
      await copyIfPresent(join(sourceHome, 'cordis.patch.yml'), homePatch)
      await copyIfPresent(join(sourceHome, '.env'), join(root, '.env'))
    }

    await copyCanaryDependencies(request.profileDir, profileDir)

    const nonce = randomUUID()
    const resultPath = join(root, 'result.json')
    const probePath = join(root, 'probe.mjs')
    const patchPath = join(root, 'canary.patch.yml')
    await writeFile(probePath, PROBE_SOURCE, { encoding: 'utf8', mode: 0o600 })
    const config = {
      nonce,
      resultPath,
      packageName: request.packageName,
      expectedVersion: request.expectedVersion,
      packageJsonPath: packageJsonPath(profileDir, request.packageName),
      targets: request.targets.map(target => ({ id: target.id, name: target.name })),
      configurationTargets: (request.configurationTargets ?? []).map(target => ({ id: target.id, name: target.name })),
    }
    await writeFile(patchPath, stringifyYaml([
      ...request.targets.map(target => ({ id: target.id, name: target.name, disabled: false })),
      { insert: [{ id: `plugin-console-canary-${nonce}`, name: probePath, config }] },
    ]), { encoding: 'utf8', mode: 0o600 })
    return { root, resultPath, patchPath, cwd, nonce }
  } catch (error) {
    try {
      await rm(root, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 })
    } catch (cleanupError) {
      if (error instanceof CanarySetupError && error.code === 'canary-shutdown-failed') throw error
      throw new CanarySetupError('canary-cleanup-failed', `Canary preparation failed and its temporary profile could not be removed: ${errorMessage(cleanupError)}`)
    }
    throw error
  }
}

function canaryEnvironment(root: string, nonce: string): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    DSH_HOME: root,
    HOME: root,
    USERPROFILE: root,
    XDG_CONFIG_HOME: join(root, 'config'),
    XDG_CACHE_HOME: join(root, 'cache'),
    TMPDIR: join(root, 'tmp'),
    TMP: join(root, 'tmp'),
    TEMP: join(root, 'tmp'),
    DSH_PLUGIN_CONSOLE_CANARY_NONCE: nonce,
  }
  for (const name of [
    'CORDIS_SHARED',
    'DSH_SNAPSHOT',
    'DSH_WEB_URL',
    'NODE_PATH',
    'NODE_AUTH_TOKEN',
    'NPM_TOKEN',
    'NPM_CONFIG_USERCONFIG',
    'npm_config_userconfig',
  ]) delete env[name]
  return env
}

function startProcess(
  request: ActivationCanaryRequest,
  prepared: Awaited<ReturnType<typeof prepareCanaryHome>>,
): {
  readonly child: ChildProcess
  readonly exited: Promise<ProcessExit>
  readonly startError: () => string | null
  readonly output: () => string | null
} {
  let stdout = ''
  let stderr = ''
  let startError: string | null = null
  const child = spawn(request.dshBin, [
    '--profile',
    request.profileName,
    '--patch',
    prepared.patchPath,
    '--host',
    '127.0.0.1',
    '--port',
    '0',
  ], {
    cwd: prepared.cwd,
    detached: process.platform !== 'win32',
    env: canaryEnvironment(prepared.root, prepared.nonce),
    shell: false,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stdout?.on('data', (chunk: Buffer) => { stdout = appendOutput(stdout, chunk) })
  child.stderr?.on('data', (chunk: Buffer) => { stderr = appendOutput(stderr, chunk) })
  const exited = processExit(child, error => { startError = errorMessage(error) })
  return {
    child,
    exited,
    startError: () => startError,
    output: () => redactProcessOutput(`${stdout}\n${stderr}`),
  }
}

function parseProbeDocument(
  text: string,
  request: ActivationCanaryRequest,
  nonce: string,
  pid: number | undefined,
): ProbeDocument | null {
  try {
    const value: unknown = JSON.parse(text)
    if (!isRecord(value) || value.protocolVersion !== 1 || value.nonce !== nonce || value.pid !== pid
      || value.packageName !== request.packageName || value.expectedVersion !== request.expectedVersion
      || typeof value.passed !== 'boolean'
      || !(typeof value.actualVersion === 'string' || value.actualVersion === null)
      || typeof value.clientExpected !== 'boolean' || typeof value.clientPresent !== 'boolean'
      || !(typeof value.clientUrl === 'string' || value.clientUrl === null)
      || !Array.isArray(value.clientGraphIds) || value.clientGraphIds.some(id => typeof id !== 'string')
      || !(typeof value.port === 'number' || value.port === null) || !Array.isArray(value.entries)
      || !Array.isArray(value.configurationEntries)
      || !(value.error === undefined || typeof value.error === 'string')) return null
    const entries = value.entries
    if (entries.length !== request.targets.length || entries.some((entry, index) => {
      const target = request.targets[index]
      return !isRecord(entry) || target === undefined || entry.id !== target.id || entry.name !== target.name
        || typeof entry.matches !== 'number' || !Number.isSafeInteger(entry.matches) || entry.matches < 0
        || !(typeof entry.disabled === 'boolean' || entry.disabled === null)
        || !(typeof entry.state === 'number' || entry.state === null)
        || !Array.isArray(entry.missingServices) || entry.missingServices.some(service => typeof service !== 'string')
    })) return null
    const configurationEntries = value.configurationEntries
    const configurationTargets = request.configurationTargets ?? []
    if (configurationEntries.length !== configurationTargets.length || configurationEntries.some((entry, index) => {
      const target = configurationTargets[index]
      return !isRecord(entry) || target === undefined || entry.id !== target.id
        || (target.name !== null && entry.name !== target.name)
        || typeof entry.name !== 'string'
        || typeof entry.matches !== 'number' || !Number.isSafeInteger(entry.matches) || entry.matches < 0
        || !(typeof entry.disabled === 'boolean' || entry.disabled === null)
        || !(typeof entry.state === 'number' || entry.state === null)
        || !Array.isArray(entry.missingServices) || entry.missingServices.some(service => typeof service !== 'string')
    })) return null
    if (value.port !== null && (!Number.isSafeInteger(value.port) || value.port <= 0 || value.port > 65_535)) return null
    if (value.clientUrl !== null && (!value.clientUrl.startsWith('/plugins/') || !value.clientUrl.includes('/client.js'))) return null
    return value as unknown as ProbeDocument
  } catch {
    return null
  }
}

function probeFailureDetail(document: ProbeDocument): string {
  if (document.error !== undefined) return document.error
  const entries = [...document.entries, ...document.configurationEntries]
    .map(entry => `${entry.id} (${entry.name}): matches=${String(entry.matches)}, disabled=${String(entry.disabled)}, state=${String(entry.state)}${entry.missingServices.length === 0 ? '' : `, missing=${entry.missingServices.join(',')}`}`)
    .join('\n')
  return [
    `Expected ${document.packageName}@${document.expectedVersion}, loaded ${document.actualVersion ?? 'unknown'}.`,
    document.clientExpected && !document.clientPresent ? 'The package declares a Web client, but it is missing from the client module graph.' : '',
    entries,
  ].filter(Boolean).join('\n')
}

export interface ClientBundleProbeResult {
  readonly ok: boolean
  readonly detail: string | null
}

function clientVmBootstrap(stateName: string): string {
  return String.raw`const ${stateName} = (() => {
  const registrations = [];
  const safeStringify = JSON.stringify.bind(JSON);
  const moduleLoader = { load(value) { registrations.push(value); } };
  const makeElement = (tagName) => {
    const attributes = Object.create(null);
    const children = [];
    const element = {
      tagName: String(tagName).toUpperCase(),
      dataset: Object.create(null),
      style: Object.create(null),
      children,
      parentNode: null,
      textContent: '',
      setAttribute(name, value) {
        const key = String(name);
        const text = String(value);
        attributes[key] = text;
        if (key.startsWith('data-')) {
          const datasetKey = key.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          this.dataset[datasetKey] = text;
        }
      },
      getAttribute(name) { return attributes[String(name)] ?? null; },
      removeAttribute(name) { delete attributes[String(name)]; },
      appendChild(child) {
        if (child !== null && (typeof child === 'object' || typeof child === 'function')) {
          children.push(child);
          child.parentNode = this;
        }
        return child;
      },
      append(...items) { for (const item of items) this.appendChild(item); },
      remove() {
        const parent = this.parentNode;
        if (parent === null || !Array.isArray(parent.children)) return;
        const index = parent.children.indexOf(this);
        if (index >= 0) parent.children.splice(index, 1);
      },
      addEventListener() {},
      removeEventListener() {},
    };
    return element;
  };
  const head = makeElement('head');
  const body = makeElement('body');
  const documentElement = makeElement('html');
  documentElement.appendChild(head);
  documentElement.appendChild(body);
  const document = {
    head,
    body,
    documentElement,
    createElement: (tagName) => makeElement(tagName),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {},
    removeEventListener() {},
  };
  const inspect = () => {
    const registration = registrations.length === 1 ? registrations[0] : null;
    let id = null;
    let factory = false;
    if (registration !== null && (typeof registration === 'object' || typeof registration === 'function')) {
      id = typeof registration.id === 'string' ? registration.id : null;
      factory = typeof registration.factory === 'function';
    }
    return safeStringify({ count: registrations.length, id, factory });
  };
  const runFactory = (allowed) => {
    if (registrations.length !== 1) throw new Error('client bundle factory cannot run without exactly one registration');
    const registration = registrations[0];
    if (registration === null || (typeof registration !== 'object' && typeof registration !== 'function') || typeof registration.factory !== 'function') {
      throw new Error('client bundle registration has no callable factory');
    }
    let opaque;
    const opaqueTarget = function () {};
    opaque = new Proxy(opaqueTarget, {
      get(target, property, receiver) {
        const descriptor = Reflect.getOwnPropertyDescriptor(target, property);
        if (descriptor !== undefined && !descriptor.configurable && 'value' in descriptor && !descriptor.writable) return Reflect.get(target, property, receiver);
        if (property === 'then') return undefined;
        if (property === Symbol.iterator) return function* () {};
        if (property === Symbol.asyncIterator) return async function* () {};
        if (property === Symbol.toPrimitive) return () => 0;
        return opaque;
      },
      apply() { return opaque; },
      getPrototypeOf() { return opaque; },
      construct(_target, _arguments, newTarget) {
        const prototype = Reflect.get(newTarget, 'prototype');
        return Object.create((typeof prototype === 'object' && prototype !== null) || typeof prototype === 'function' ? prototype : null);
      },
    });
    const require = (specifier) => {
      if (typeof specifier !== 'string' || specifier.length === 0) throw new Error('client factory called require() with a non-string module id');
      const normalized = specifier.endsWith('/client') ? specifier.slice(0, -7) : specifier;
      if (!allowed.includes(specifier) && !allowed.includes(normalized)) throw new Error('client factory dependency "' + specifier + '" is absent from the Web module graph');
      return opaque;
    };
    registration.factory(require);
  };
  globalThis.window = globalThis;
  globalThis.self = globalThis;
  globalThis.__ModuleLoader__ = moduleLoader;
  globalThis.document = document;
  globalThis.console = Object.freeze({ debug() {}, info() {}, log() {}, warn() {}, error() {} });
  globalThis.navigator = Object.freeze({ userAgent: 'dsh-plugin-console-canary' });
  globalThis.location = Object.freeze({ href: 'http://127.0.0.1/' });
  globalThis.setTimeout = () => undefined;
  globalThis.clearTimeout = () => undefined;
  globalThis.requestAnimationFrame = () => undefined;
  globalThis.cancelAnimationFrame = () => undefined;
  return Object.freeze({ inspect, runFactory });
})();`
}

function clientRequireIds(graphIds: readonly string[]): Set<string> {
  const ids = new Set<string>(CLIENT_SEED_MODULES)
  for (const id of graphIds) {
    ids.add(id)
    if (id.endsWith('/client')) ids.add(id.slice(0, -7))
    else ids.add(`${id}/client`)
  }
  return ids
}

/**
 * Parse and execute one DSH classic client bundle in a capability-limited VM.
 * The browser loader's contract is deliberately synchronous: one registration
 * and a factory whose `require` calls resolve only against platform seeds or
 * rows in the boot graph.
 */
export function validateClientBundle(
  source: string,
  packageName: string,
  graphIds: readonly string[] = [],
): ClientBundleProbeResult {
  const sandbox: Record<string, unknown> = Object.create(null) as Record<string, unknown>
  const stateName = `__dsh_canary_state_${randomUUID().replaceAll('-', '_')}`

  try {
    const context = createContext(sandbox, {
      codeGeneration: { strings: false, wasm: false },
    })
    new Script(clientVmBootstrap(stateName), { filename: `${packageName}/client.bootstrap.js` }).runInContext(context, {
      timeout: CLIENT_SCRIPT_TIMEOUT_MS,
    })
    new Script(source, { filename: `${packageName}/client.js` }).runInContext(context, {
      timeout: CLIENT_SCRIPT_TIMEOUT_MS,
    })
    const summaryValue = new Script(`${stateName}.inspect()`, {
      filename: `${packageName}/client.registrations.js`,
    }).runInContext(context, { timeout: CLIENT_SCRIPT_TIMEOUT_MS })
    if (typeof summaryValue !== 'string') {
      return { ok: false, detail: 'client bundle probe could not read its registration summary.' }
    }
    const summaryValueParsed: unknown = JSON.parse(summaryValue)
    if (!isRecord(summaryValueParsed)
      || typeof summaryValueParsed.count !== 'number' || !Number.isSafeInteger(summaryValueParsed.count)
      || !(typeof summaryValueParsed.id === 'string' || summaryValueParsed.id === null)
      || typeof summaryValueParsed.factory !== 'boolean') {
      return { ok: false, detail: 'client bundle returned an invalid registration summary.' }
    }
    const summary = summaryValueParsed
    if (summary.count !== 1) {
      return {
        ok: false,
        detail: `client bundle registered ${String(summary.count)} modules; expected exactly one registration for "${packageName}".`,
      }
    }
    if (summary.id === null) {
      return { ok: false, detail: 'client bundle called __ModuleLoader__.load with an invalid registration id.' }
    }
    if (!summary.factory) {
      return { ok: false, detail: `client bundle registration "${summary.id}" has no callable factory.` }
    }
    if (summary.id !== packageName) {
      return {
        ok: false,
        detail: `client bundle registered "${summary.id}" but the graph row expects "${packageName}".`,
      }
    }
    const allowed = [...clientRequireIds(graphIds)]
    const allowedLiteral = JSON.stringify(allowed)
    // All callbacks and objects used by the factory are created in the VM
    // bootstrap closure. Nothing from the host realm crosses this boundary.
    new Script(`${stateName}.runFactory(${allowedLiteral})`, {
      filename: `${packageName}/client.factory.js`,
    }).runInContext(context, { timeout: CLIENT_FACTORY_TIMEOUT_MS })
    return { ok: true, detail: null }
  } catch (error) {
    return {
      ok: false,
      detail: `client bundle validation failed: ${errorMessage(error)}`,
    }
  }
}

interface HttpProbeResult {
  readonly ok: boolean
  readonly detail: string | null
}

async function checkHttp(
  port: number | null,
  clientUrl: string | null,
  packageName: string,
  graphIds: readonly string[],
): Promise<HttpProbeResult> {
  if (port === null || !Number.isSafeInteger(port) || port <= 0) {
    return { ok: false, detail: 'The isolated Web server did not report a valid port.' }
  }
  try {
    const rootResponse = await fetch(`http://127.0.0.1:${String(port)}/`, {
      headers: { host: `127.0.0.1:${String(port)}` },
      signal: AbortSignal.timeout(3_000),
    })
    await rootResponse.body?.cancel()
    if (!rootResponse.ok) {
      return { ok: false, detail: `Web root returned HTTP ${String(rootResponse.status)}.` }
    }
    if (clientUrl === null) return { ok: true, detail: null }
    const bundleResponse = await fetch(`http://127.0.0.1:${String(port)}${clientUrl}`, {
      headers: { host: `127.0.0.1:${String(port)}` },
      signal: AbortSignal.timeout(3_000),
    })
    if (!bundleResponse.ok) {
      await bundleResponse.body?.cancel()
      return { ok: false, detail: `Client bundle returned HTTP ${String(bundleResponse.status)}.` }
    }
    const source = await readResponseTextBounded(bundleResponse, CLIENT_SCRIPT_MAX_BYTES)
    return validateClientBundle(source, packageName, graphIds)
  } catch {
    return { ok: false, detail: 'The Web root or client bundle could not be fetched.' }
  }
}

export async function runActivationCanary(request: ActivationCanaryRequest): Promise<ActivationCanaryResult> {
  if (request.targets.length === 0 && (request.configurationOnly !== true || (request.configurationTargets?.length ?? 0) === 0)) {
    return { status: 'failed', code: 'canary-target-failed', detail: 'The updated bundle has no verified Loader entries or explicit configuration-only declaration.' }
  }
  let prepared: Awaited<ReturnType<typeof prepareCanaryHome>>
  try {
    prepared = await prepareCanaryHome(request)
  } catch (error) {
    return {
      status: 'failed',
      code: error instanceof CanarySetupError ? error.code : 'canary-preparation-failed',
      detail: errorMessage(error),
    }
  }

  let running: ReturnType<typeof startProcess> | null = null
  let outcome: ActivationCanaryResult = { status: 'failed', code: 'canary-start-failed', detail: null }
  try {
    try {
      running = startProcess(request, prepared)
    } catch (error) {
      outcome = { status: 'failed', code: 'canary-start-failed', detail: errorMessage(error) }
    }

    if (running !== null) {
      const deadline = Date.now() + request.timeoutMs
      let document: ProbeDocument | null = null
      while (Date.now() < deadline && outcome.code === 'canary-start-failed' && outcome.detail === null) {
        try {
          document = parseProbeDocument(await readFile(prepared.resultPath, 'utf8'), request, prepared.nonce, running.child.pid)
          if (document !== null) break
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            outcome = { status: 'failed', code: 'canary-target-failed', detail: errorMessage(error) }
            break
          }
        }
        const exit = await Promise.race([running.exited, delay(POLL_MS).then(() => null)])
        if (exit !== null) {
          const startError = running.startError()
          outcome = {
            status: 'failed',
            code: startError === null ? 'canary-process-exited' : 'canary-start-failed',
            detail: startError ?? running.output() ?? `Canary exited with code ${String(exit.code)} (${String(exit.signal)}).`,
          }
          break
        }
      }

      if (document === null && outcome.code === 'canary-start-failed' && outcome.detail === null) {
        outcome = { status: 'failed', code: 'canary-timeout', detail: running.output() ?? 'The isolated DSH startup did not settle before the deadline.' }
      } else if (document !== null && !document.passed) {
        outcome = { status: 'failed', code: 'canary-target-failed', detail: probeFailureDetail(document) }
      } else if (document !== null) {
        await delay(request.stabilityMs ?? DEFAULT_STARTUP_STABILITY_MS)
        if (running.child.exitCode !== null || running.child.signalCode !== null) {
          outcome = { status: 'failed', code: 'canary-process-exited', detail: running.output() }
        } else {
          const http = await checkHttp(document.port, document.clientUrl, request.packageName, document.clientGraphIds)
          if (!http.ok) {
            outcome = {
              status: 'failed',
              code: 'canary-http-failed',
              detail: http.detail ?? 'The isolated DSH Web process activated its Loader entries but did not serve its index.',
            }
          } else {
            outcome = { status: 'passed', code: 'canary-passed', detail: null }
          }
        }
      }
    }
  } finally {
    let shutdown = true
    if (running !== null) shutdown = await terminateProcessTree(running.child, running.exited)
    let cleanup = true
    try {
      await rm(prepared.root, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 })
    } catch {
      cleanup = false
    }
    if (!shutdown) {
      outcome = { status: 'failed', code: 'canary-shutdown-failed', detail: 'The isolated DSH process could not be terminated cleanly.' }
    } else if (!cleanup) {
      outcome = { status: 'failed', code: 'canary-cleanup-failed', detail: 'The isolated DSH process stopped, but its temporary profile could not be removed.' }
    }
  }
  return outcome
}
