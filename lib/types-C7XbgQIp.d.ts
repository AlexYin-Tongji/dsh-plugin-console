//#region src/types.d.ts
/** Shared JSON-safe contracts for the Host API and browser plugin. */
type UiLocale = 'zh' | 'en';
type ArtifactKind = 'npm' | 'github';
type VerificationState = 'verified' | 'invalid' | 'unavailable';
type RuntimePhase = 'pending' | 'loading' | 'active' | 'failed' | 'unloading' | null;
interface CatalogPluginSummary {
  readonly id: string;
  readonly name: string;
  readonly owner: string;
  readonly repositoryUrl: string;
  readonly pageUrl: string | null;
  readonly category: string;
  readonly description: {
    readonly zh: string;
    readonly en: string;
  };
  readonly packageName: string | null;
  readonly stars: number;
  readonly addedAt: string | null;
  readonly artifactKind: ArtifactKind;
}
interface CatalogStatus {
  readonly state: 'ready' | 'empty' | 'unavailable';
  readonly source: 'network' | 'cache' | 'none';
  readonly sourceUrl: string;
  readonly fetchedAt: string | null;
  readonly stale: boolean;
  readonly error: string | null;
}
interface CatalogListRequest {
  readonly query: string;
  readonly category: string;
  readonly page: number;
  readonly pageSize: number;
}
interface CatalogListResponse {
  readonly items: readonly CatalogPluginSummary[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly categories: readonly {
    readonly id: string;
    readonly count: number;
  }[];
  readonly status: CatalogStatus;
}
interface ArtifactManifestSummary {
  readonly packageName: string;
  readonly version: string;
  readonly description: string | null;
  readonly author: string | null;
  readonly license: string | null;
  readonly homepage: string | null;
  readonly repositoryUrl: string | null;
  readonly bundle: boolean;
  readonly client: boolean;
  readonly lifecycleScripts: readonly string[];
  readonly deprecated: string | null;
}
interface CatalogPluginDetail extends CatalogPluginSummary {
  readonly verification: VerificationState;
  readonly verificationMessage: string | null;
  readonly installSpec: string | null;
  readonly commitSha: string | null;
  readonly integrity: string | null;
  readonly manifest: ArtifactManifestSummary | null;
  readonly readme: string | null;
  readonly readmeSource: string | null;
  readonly warnings: readonly string[];
}
type InstalledState = 'active' | 'paused' | 'partially-paused' | 'installed-inactive' | 'pending-install' | 'pending-update' | 'pending-removal';
interface RuntimeEntrySummary {
  readonly entryId: string;
  readonly enabled: boolean;
  readonly phase: RuntimePhase;
}
interface InstalledPluginSummary {
  readonly packageName: string;
  readonly requestedSpec: string | null;
  readonly version: string | null;
  readonly description: string | null;
  readonly author: string | null;
  readonly license: string | null;
  readonly homepage: string | null;
  readonly repositoryUrl: string | null;
  readonly system: boolean;
  readonly directDependency: boolean;
  readonly bundle: boolean;
  readonly client: boolean;
  readonly activeAtLaunch: boolean;
  readonly activeAfterRestart: boolean;
  readonly state: InstalledState;
  readonly runtimeEntries: readonly RuntimeEntrySummary[];
  readonly latestVersion: string | null;
  readonly updateAvailable: boolean;
  readonly updateCheckError: string | null;
  readonly catalogId: string | null;
}
interface InstalledPluginDetail extends InstalledPluginSummary {
  readonly readme: string | null;
  readonly readmeFile: string | null;
  readonly keywords: readonly string[];
  readonly lifecycleScripts: readonly string[];
}
interface ManagerCapabilities {
  readonly profileName: string;
  readonly profileWritable: boolean;
  readonly dshAvailable: boolean;
  readonly pnpmAvailable: boolean;
  readonly busy: boolean;
  readonly message: string | null;
}
interface BootstrapResponse {
  readonly catalog: CatalogListResponse;
  readonly installed: readonly InstalledPluginSummary[];
  readonly capabilities: ManagerCapabilities;
  readonly harness: HarnessStatus;
}
/** Read-only projection of the DeepSeek Harness installation itself. */
interface HarnessStatus {
  /** Version of the Harness that loaded this Host process, captured at startup. */
  readonly currentVersion: string | null;
  /** Version currently installed at the resolved package root. */
  readonly installedVersion: string | null;
  /** Highest version offered across the npm dist-tags. */
  readonly latestVersion: string | null;
  /** The dist-tag channel that carries `latestVersion`. */
  readonly updateTag: string | null;
  /** Every known dist-tag channel of the Harness package. */
  readonly channels: readonly {
    readonly tag: string;
    readonly version: string;
  }[];
  /** True when the installed package is managed by npm global and an upgrade exists. */
  readonly updateAvailable: boolean;
  /** True when the installed version differs from the running one (update applied, restart pending). */
  readonly pendingRestart: boolean;
  /** Whether the running installation is an npm-global install that can be updated in place. */
  readonly managed: boolean;
  readonly packageName: string;
  readonly installRoot: string | null;
  readonly prefix: string | null;
  readonly executablePath: string | null;
  readonly installMessage: string | null;
  readonly updateCheckError: string | null;
}
type HarnessUpdateWarning = 'trusted-code' | 'restart-required' | 'canary-validation';
interface HarnessUpdatePlan {
  readonly status: 'ready' | 'blocked';
  readonly planId: string | null;
  readonly blockReason: string | null;
  readonly currentVersion: string | null;
  readonly targetVersion: string | null;
  readonly updateTag: string | null;
  readonly installRoot: string | null;
  readonly prefix: string | null;
  readonly updateCommand: string | null;
  readonly warnings: readonly HarnessUpdateWarning[];
  readonly expiresAt: string | null;
}
interface HarnessUpdateResult {
  readonly status: 'succeeded' | 'failed';
  readonly code: string;
  readonly currentVersion: string | null;
  readonly targetVersion: string | null;
  readonly restartRequired: boolean;
  readonly activation: 'unchanged' | 'pending-restart' | 'unknown';
  readonly canary: 'not-run' | 'passed' | 'failed';
  readonly processCleanup: 'not-needed' | 'succeeded' | 'failed';
  readonly rollback: 'not-needed' | 'succeeded' | 'failed';
  readonly detail: string | null;
  readonly harness: HarnessStatus;
  readonly installed: readonly InstalledPluginSummary[];
  readonly capabilities: ManagerCapabilities;
}
type OperationAction = 'install' | 'update' | 'remove' | 'pause' | 'resume';
type OperationWarning = 'trusted-code' | 'restart-required' | 'scripts-disabled' | 'canary-validation' | 'compatibility-unknown' | 'remove-data-kept' | 'self-removal' | 'uncatalogued-update';
interface OperationPlanRequest {
  readonly action: OperationAction;
  readonly catalogId?: string;
  readonly packageName?: string;
}
interface OperationPlan {
  readonly status: 'ready' | 'blocked';
  readonly planId: string | null;
  readonly blockReason: string | null;
  readonly action: OperationAction | null;
  readonly profileName: string;
  readonly catalogId: string | null;
  readonly packageName: string | null;
  readonly currentVersion: string | null;
  readonly currentSpec: string | null;
  readonly targetVersion: string | null;
  readonly sourceSpec: string | null;
  readonly artifactIntegrity: string | null;
  readonly lifecycleScripts: readonly string[];
  readonly warnings: readonly OperationWarning[];
  readonly expiresAt: string | null;
}
interface OperationResult {
  readonly status: 'succeeded' | 'failed';
  readonly code: string;
  readonly action: OperationAction | null;
  readonly packageName: string | null;
  readonly restartRequired: boolean;
  readonly activation: 'unchanged' | 'pending-restart' | 'unknown';
  readonly canary: 'not-run' | 'passed' | 'failed';
  readonly processCleanup: 'not-needed' | 'succeeded' | 'failed';
  readonly rollback: 'not-needed' | 'succeeded' | 'failed';
  readonly detail: string | null;
  readonly installed: readonly InstalledPluginSummary[];
  readonly capabilities: ManagerCapabilities;
}
interface ApiSuccess<T> {
  readonly ok: true;
  readonly value: T;
}
interface ApiFailure {
  readonly ok: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
  };
}
//#endregion
export { OperationWarning as C, VerificationState as D, UiLocale as E, OperationResult as S, RuntimePhase as T, InstalledState as _, BootstrapResponse as a, OperationPlan as b, CatalogPluginDetail as c, HarnessStatus as d, HarnessUpdatePlan as f, InstalledPluginSummary as g, InstalledPluginDetail as h, ArtifactManifestSummary as i, CatalogPluginSummary as l, HarnessUpdateWarning as m, ApiSuccess as n, CatalogListRequest as o, HarnessUpdateResult as p, ArtifactKind as r, CatalogListResponse as s, ApiFailure as t, CatalogStatus as u, ManagerCapabilities as v, RuntimeEntrySummary as w, OperationPlanRequest as x, OperationAction as y };
//# sourceMappingURL=types-C7XbgQIp.d.ts.map