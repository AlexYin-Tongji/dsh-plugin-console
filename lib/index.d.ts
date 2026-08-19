import { C as VerificationState, S as UiLocale, _ as OperationPlanRequest, a as BootstrapResponse, b as RuntimeEntrySummary, c as CatalogPluginDetail, d as InstalledPluginDetail, f as InstalledPluginSummary, g as OperationPlan, h as OperationAction, i as ArtifactManifestSummary, l as CatalogPluginSummary, m as ManagerCapabilities, n as ApiSuccess, o as CatalogListRequest, p as InstalledState, r as ArtifactKind, s as CatalogListResponse, t as ApiFailure, u as CatalogStatus, v as OperationResult, x as RuntimePhase, y as OperationWarning } from "./types-CEotyhPd.js";
import z from "@deepseek-ai/schemastery";
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
  private busy;
  constructor(options: ProfileManagerOptions);
  get isBusy(): boolean;
  setBusy(value: boolean): void;
  capabilities(): Promise<ManagerCapabilities>;
  fingerprint(): string;
  list(locale?: UiLocale, checkUpdates?: boolean): Promise<readonly InstalledPluginSummary[]>;
  detail(packageName: string, locale?: UiLocale): Promise<InstalledPluginDetail | null>;
  setPluginPaused(packageName: string, paused: boolean): Promise<readonly PluginActivationTarget[]>;
  currentManifest(): Promise<ProfileManifest>;
  close(): Promise<void>;
}
//#endregion
//#region src/operations.d.ts
interface CommandResult {
  readonly code: number | null;
  readonly unavailable: boolean;
  readonly timedOut: boolean;
  readonly output: string | null;
  readonly stdout?: string | null;
  readonly stdoutTruncated?: boolean;
}
interface OperationOptions {
  readonly profile: ProfileManager;
  readonly catalog: PluginCatalog;
  readonly dshBin: string;
  readonly timeoutMs?: number;
  readonly runCommand?: (args: readonly string[], cwd: string, timeoutMs: number) => Promise<CommandResult>;
  readonly now?: () => number;
}
/** Owns one mutation at a time and never exposes arbitrary package-manager args. */
declare class ProfileOperations {
  private readonly options;
  private readonly plans;
  private readonly runCommand;
  private readonly now;
  private readonly timeoutMs;
  private operation;
  private disposed;
  constructor(options: OperationOptions);
  get busy(): boolean;
  plan(request: OperationPlanRequest): Promise<OperationPlan>;
  private storePlan;
  execute(planId: string): Promise<OperationResult>;
  private prepareAndRun;
  private planStillTargetsCurrentState;
  private runPlan;
  private rollbackActivation;
  private rollback;
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
  readonly dshBin: string;
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
export { ApiFailure, ApiSuccess, ArtifactKind, ArtifactManifestSummary, BootstrapResponse, CatalogListRequest, CatalogListResponse, CatalogPluginDetail, CatalogPluginSummary, CatalogStatus, Config, InstalledPluginDetail, InstalledPluginSummary, InstalledState, ManagerCapabilities, OperationAction, OperationPlan, OperationPlanRequest, OperationResult, OperationWarning, PluginCatalog, ProfileManager, ProfileOperations, RuntimeEntrySummary, RuntimePhase, UiLocale, VerificationState, apply, _default as default, inject, name, parseCatalogText, queryCatalog };
//# sourceMappingURL=index.d.ts.map