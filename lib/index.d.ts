import { C as OperationWarning, D as VerificationState, E as UiLocale, S as OperationResult, T as RuntimePhase, _ as InstalledState, a as BootstrapResponse, b as OperationPlan, c as CatalogPluginDetail, d as HarnessStatus, f as HarnessUpdatePlan, g as InstalledPluginSummary, h as InstalledPluginDetail, i as ArtifactManifestSummary, l as CatalogPluginSummary, m as HarnessUpdateWarning, n as ApiSuccess, o as CatalogListRequest, p as HarnessUpdateResult, r as ArtifactKind, s as CatalogListResponse, t as ApiFailure, u as CatalogStatus, v as ManagerCapabilities, w as RuntimeEntrySummary, x as OperationPlanRequest, y as OperationAction } from "./types-C7XbgQIp.js";
import z from "@deepseek-ai/schemastery";
import "yaml";
import { ProfileManifest } from "@deepseek-ai/dsh-app-boot";
import { Context } from "@deepseek-ai/cordis";

//#region src/catalog.d.ts
interface NpmArtifact {
  readonly manifest: ArtifactManifestSummary;
  readonly sourceSpec: string;
  readonly repositoryUrl: string;
  readonly integrity: string;
  readonly warnings: readonly string[];
}
interface CatalogOptions {
  readonly sourceUrl: string;
  readonly cachePath: string;
  readonly maxAgeMs: number;
  readonly timeoutMs: number;
  readonly maxCatalogBytes: number;
  readonly maxReadmeBytes: number;
  readonly fetchImpl?: typeof fetch;
  readonly now?: () => Date;
}
/** Parse the curated community feed into one deterministic, deduplicated index. */
declare function parseCatalogText(text: string): readonly CatalogPluginSummary[];
declare function queryCatalog(items: readonly CatalogPluginSummary[], request: CatalogListRequest, status: CatalogStatus): CatalogListResponse;
/** Owns the last-known-good catalog and on-demand package verification. */
declare class PluginCatalog {
  private readonly options;
  private readonly fetchImpl;
  private readonly now;
  private readonly closeController;
  private items;
  private source;
  private fetchedAt;
  private etag;
  private error;
  private refreshPromise;
  private readonly inspections;
  private disposed;
  constructor(options: CatalogOptions);
  initialize(): Promise<void>;
  status(): CatalogStatus;
  list(request: CatalogListRequest): CatalogListResponse;
  find(id: string): CatalogPluginSummary | undefined;
  findByPackage(packageName: string): CatalogPluginSummary | undefined;
  findByRepository(repository: string | null): CatalogPluginSummary | undefined;
  refresh(): Promise<CatalogStatus>;
  private refreshOnce;
  private commit;
  detail(id: string, locale: UiLocale, force?: boolean): Promise<CatalogPluginDetail | null>;
  /** Verify the latest npm manifest even when a package is absent from the community index. */
  latestNpmArtifact(packageName: string): Promise<NpmArtifact | null>;
  private operationSignal;
  private inspectNpm;
  private inspectGithub;
  close(): Promise<void>;
}
//#endregion
//#region src/profile.d.ts
interface ProfileRuntime {
  readonly profileName: string;
  readonly dir: string;
  readonly launchDependencies: Readonly<Record<string, string>>;
  readonly launchBundles: readonly string[];
}
interface PluginActivationTarget {
  readonly id: string;
  readonly name: string;
}
interface PluginConfigurationTarget {
  readonly id: string;
  readonly name: string | null;
}
interface PluginActivationDescriptor {
  readonly targets: readonly PluginActivationTarget[];
  readonly configurationTargets: readonly PluginConfigurationTarget[];
  readonly configurationOnly: boolean;
}
interface ProfileManagerOptions {
  readonly ctx: Context;
  readonly profileDir?: string;
  readonly dshBin: string;
  readonly catalog: PluginCatalog;
  readonly maxReadmeBytes?: number;
  readonly fetchImpl?: typeof fetch;
}
/** Host-owned view of one active profile. */
declare class ProfileManager {
  readonly runtime: ProfileRuntime;
  private readonly ctx;
  private readonly dshBin;
  private readonly catalog;
  private readonly maxReadmeBytes;
  private readonly fetchImpl;
  private readonly latestCache;
  private capabilitiesCache;
  private busy;
  constructor(options: ProfileManagerOptions);
  get isBusy(): boolean;
  setBusy(value: boolean): void;
  /**
   * Writability and tool availability change rarely, so the expensive probes
   * (filesystem access plus `dsh`/`pnpm --version` subprocesses) are cached
   * briefly; only `busy` is live, because it flips with every operation.
   */
  capabilities(): Promise<ManagerCapabilities>;
  fingerprint(): string;
  list(locale?: UiLocale, checkUpdates?: boolean): Promise<readonly InstalledPluginSummary[]>;
  detail(packageName: string, locale?: UiLocale): Promise<InstalledPluginDetail | null>;
  activationDescriptor(packageName: string): Promise<PluginActivationDescriptor>;
  activationTargets(packageName: string): Promise<readonly PluginActivationTarget[]>;
  setPluginPaused(packageName: string, paused: boolean): Promise<readonly PluginActivationTarget[]>;
  /** Remove persisted pause overrides that target a package being uninstalled. */
  removePluginPauseOverrides(targets: readonly PluginActivationTarget[]): Promise<void>;
  currentManifest(): Promise<ProfileManifest>;
  close(): Promise<void>;
}
//#endregion
//#region src/canary.d.ts
interface ActivationCanaryRequest {
  readonly profileDir: string;
  readonly profileName: string;
  readonly dshBin: string;
  readonly packageName: string;
  readonly expectedVersion: string;
  readonly targets: readonly PluginActivationTarget[];
  readonly configurationTargets?: readonly PluginConfigurationTarget[];
  readonly configurationOnly?: boolean;
  readonly stabilityMs?: number;
  readonly timeoutMs: number;
}
interface ActivationCanaryResult {
  readonly status: 'passed' | 'failed';
  readonly code: 'canary-passed' | 'canary-preparation-failed' | 'canary-start-failed' | 'canary-process-exited' | 'canary-timeout' | 'canary-target-failed' | 'canary-http-failed' | 'canary-shutdown-failed' | 'canary-cleanup-failed';
  readonly detail: string | null;
}
declare function runActivationCanary(request: ActivationCanaryRequest): Promise<ActivationCanaryResult>;
interface HarnessCanaryRequest {
  readonly profileDir: string;
  readonly profileName: string;
  readonly dshBin: string;
  readonly expectedEntries: readonly {
    readonly id: string;
    readonly name: string;
    readonly disabled: boolean | 'unknown';
  }[];
  readonly expectedClientPackages: readonly string[];
  readonly stabilityMs?: number;
  readonly timeoutMs: number;
}
interface HarnessCanaryResult {
  readonly status: 'passed' | 'failed';
  readonly code: 'harness-canary-passed' | 'harness-canary-preparation-failed' | 'harness-canary-start-failed' | 'harness-canary-process-exited' | 'harness-canary-timeout' | 'harness-canary-composition-failed' | 'harness-canary-http-failed' | 'harness-canary-client-failed' | 'harness-canary-shutdown-failed' | 'harness-canary-cleanup-failed';
  readonly detail: string | null;
}
declare function runHarnessUpdateCanary(request: HarnessCanaryRequest): Promise<HarnessCanaryResult>;
//#endregion
//#region src/operations.d.ts
interface CommandResult {
  readonly code: number | null;
  readonly unavailable: boolean;
  readonly timedOut: boolean;
  readonly output: string | null;
  readonly stdout?: string | null;
  readonly stdoutTruncated?: boolean;
  readonly processCleanup?: boolean;
}
interface OperationOptions {
  readonly profile: ProfileManager;
  readonly catalog: PluginCatalog;
  readonly dshBin: string;
  readonly timeoutMs?: number;
  readonly canaryTimeoutMs?: number;
  readonly runCommand?: (args: readonly string[], cwd: string, timeoutMs: number) => Promise<CommandResult>;
  readonly probeActivation?: (request: ActivationCanaryRequest) => Promise<ActivationCanaryResult>;
  readonly lockProfile?: (profileDir: string) => Promise<() => Promise<void>>;
  readonly now?: () => number;
}
/** Owns one mutation at a time and never exposes arbitrary package-manager args. */
declare class ProfileOperations {
  private readonly options;
  private readonly plans;
  private readonly runCommand;
  private readonly probeActivation;
  private readonly lockProfile;
  private readonly now;
  private readonly timeoutMs;
  private readonly canaryTimeoutMs;
  private operation;
  private disposed;
  constructor(options: OperationOptions);
  get busy(): boolean;
  plan(request: OperationPlanRequest): Promise<OperationPlan>;
  private storePlan;
  execute(planId: string): Promise<OperationResult>;
  private profileFiles;
  private prepareAndRun;
  private planStillTargetsCurrentState;
  private runPlan;
  private runIsolatedActivation;
  private rollbackActivation;
  private rollbackStateMatches;
  private rollback;
  private prunePlans;
  close(): Promise<void>;
}
//#endregion
//#region src/harness.d.ts
interface HarnessInstallation {
  readonly status: 'managed' | 'unmanaged' | 'unresolved';
  readonly installRoot: string | null;
  readonly prefix: string | null;
  readonly executablePath: string | null;
  readonly version: string | null;
  readonly message: string | null;
}
interface HarnessManagerOptions {
  readonly dshBin: string;
  readonly fetchImpl?: typeof fetch;
  readonly now?: () => number;
}
/**
 * Harness-side registry lookup: the Harness is a first-party npm package, so
 * dist-tag metadata (bounded, cached) is the update source of truth.
 */
declare class HarnessManager {
  private readonly dshBin;
  private readonly fetchImpl;
  private readonly now;
  private readonly distTagsCache;
  private distTagsInflight;
  private static readonly CACHE_KEY;
  constructor(options: HarnessManagerOptions);
  /** Resolve the installation the configured dsh binary belongs to. */
  resolve(): Promise<HarnessInstallation>;
  /**
   * All npm dist-tags of the Harness package. The newest valid semver across
   * every channel is the update candidate — the registry keeps `latest` one
   * release behind `next` during the rc series, and the updater must follow
   * the highest available version instead of a single channel. Concurrent
   * callers (background warm-up plus explicit polls) share one lookup.
   */
  private distTags;
  private fetchDistTags;
  /** Read the package version currently installed at a package root. */
  installedVersionAt(installRoot: string): Promise<string | null>;
  /**
   * Restart-aware status. `currentVersion` is captured by the caller at
   * startup (the Host keeps running the code it booted with), while
   * `installedVersion` is re-read from disk on every call. `refresh` drops
   * the cached dist-tags document so "check again" observes new releases
   * immediately.
   */
  status(currentVersion: string | null, refresh?: boolean): Promise<HarnessStatus>;
  /**
   * Non-blocking projection for first paint: serves the last known dist-tags
   * snapshot (an expired snapshot included) and revalidates in the background,
   * so a slow registry lookup never delays the response. The next explicit
   * `status` poll observes the refreshed document.
   */
  cachedStatus(currentVersion: string | null): Promise<HarnessStatus>;
  private project;
  close(): Promise<void>;
}
//#endregion
//#region src/harness-operations.d.ts
interface HarnessOperationOptions {
  readonly profile: ProfileManager;
  readonly harness: Pick<HarnessManager, 'resolve' | 'status' | 'installedVersionAt'>;
  readonly npmBin: string;
  readonly runningVersion: string | null;
  readonly lockDir: string;
  readonly timeoutMs?: number;
  readonly canaryTimeoutMs?: number;
  readonly runCommand?: (executable: string, args: readonly string[], cwd: string, timeoutMs: number) => Promise<CommandResult>;
  readonly probeActivation?: (request: HarnessCanaryRequest) => Promise<HarnessCanaryResult>;
  readonly lockProfile?: (dir: string) => Promise<() => Promise<void>>;
  readonly commandAvailable?: (command: string) => Promise<boolean>;
  readonly now?: () => number;
}
interface ComposedEntry {
  readonly id: string;
  readonly name: string;
  /** Literal boolean from the dump, or 'unknown' for unevaluatable `!!js` expressions. */
  readonly disabled: boolean | 'unknown';
}
declare function composedEntriesFromDump(output: string | null | undefined): readonly ComposedEntry[] | null;
/** Owns one Harness update at a time and never exposes arbitrary package-manager args. */
declare class HarnessOperations {
  private readonly options;
  private readonly plans;
  private readonly runCommand;
  private readonly probeActivation;
  private readonly lockProfile;
  private readonly available;
  private readonly now;
  private readonly timeoutMs;
  private readonly canaryTimeoutMs;
  private operation;
  private disposed;
  constructor(options: HarnessOperationOptions);
  private snapshot;
  plan(): Promise<HarnessUpdatePlan>;
  private blockedFromStatus;
  get busy(): boolean;
  execute(planId: string): Promise<HarnessUpdateResult>;
  private prepareAndRun;
  private rollbackFrom;
  private prunePlans;
  close(): Promise<void>;
}
//#endregion
//#region src/index.d.ts
declare const name = "plugin-console";
declare const inject: string[];
interface Config {
  readonly catalogUrl: string;
  readonly cacheMaxAgeMs: number;
  readonly requestTimeoutMs: number;
  readonly maxCatalogBytes: number;
  readonly maxReadmeBytes: number;
  readonly operationTimeoutMs: number;
  readonly canaryTimeoutMs: number;
  readonly dshBin: string;
  readonly npmBin: string;
}
declare const Config: z<Config>;
/** Mount the manager against only the active profile. */
declare function apply(ctx: Context, config: Config): Promise<void>;
declare const _default: {
  name: string;
  inject: string[];
  apply: typeof apply;
  Config: z<Config>;
};
//#endregion
export { ApiFailure, ApiSuccess, ArtifactKind, ArtifactManifestSummary, BootstrapResponse, CatalogListRequest, CatalogListResponse, CatalogPluginDetail, CatalogPluginSummary, CatalogStatus, Config, HarnessManager, HarnessOperations, HarnessStatus, HarnessUpdatePlan, HarnessUpdateResult, HarnessUpdateWarning, InstalledPluginDetail, InstalledPluginSummary, InstalledState, ManagerCapabilities, OperationAction, OperationPlan, OperationPlanRequest, OperationResult, OperationWarning, PluginCatalog, ProfileManager, ProfileOperations, RuntimeEntrySummary, RuntimePhase, UiLocale, VerificationState, apply, composedEntriesFromDump, _default as default, inject, name, parseCatalogText, queryCatalog, runActivationCanary, runHarnessUpdateCanary };
//# sourceMappingURL=index.d.ts.map