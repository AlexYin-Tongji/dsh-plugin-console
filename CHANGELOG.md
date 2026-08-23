# Changelog

All notable changes to DSH Plugin Console are documented here. The project follows [Semantic Versioning](https://semver.org/).

## [0.3.1] - 2026-08-23

### Changed

- README: renamed the install section to 安装与更新 and documented the real upgrade path — re-running the bare install command `dsh plugin --profile web add dsh-plugin-console` does not upgrade an existing profile because pnpm keeps the already-pinned `^x.y.z` range ("Already up to date"); the documented upgrade commands are `add dsh-plugin-console@latest` or the built-in one-click self-update, followed by a restart. Added a troubleshooting section for registry mirrors, cache lag, pinned profile versions, and missing restarts. The install command now pins `@latest`, so fresh installs always resolve the newest release at install time.
- `docs/RELEASING.md`: replaced hardcoded example versions with `<version>` placeholders and added post-publish verification steps (npm dist-tags plus a fresh-install resolution check).

No Host/client code changes in this release; it ships the corrected documentation so npm and GitHub both serve current upgrade instructions.

## [0.3.0] - 2026-08-20

### Added

- Sidebar Harness-update entry (`sidebar.footer.action`): the icon shows the running Harness version, badges a pending update, and opens a panel with running/installed/latest versions, the update channel, and a reviewed one-click update flow with confirmation, execution progress, and restart notice.
- Harness self-update operations for npm-global installations: the running `dsh` executable is resolved to its package root and npm prefix (POSIX `lib/node_modules` and Windows `node_modules` layouts), the target version is the highest valid SemVer across ALL npm dist-tags (`latest`, `next`, …) with the carrying channel reported, and updates run through `npm install --global --prefix` with exact old/new version verification and automatic reinstall of the previous version on any failure.
- Full-profile Harness canary: after an update is written, the complete composed profile (every installed plugin's Loader entry, activation state, client module graph, and HTTP surface) boots in an isolated home under the NEW Harness binary before the update is accepted; the expected composition is snapshotted from `--dump-config` (with local evaluation of `!!js` expressions) before mutation, runtime-only boot entries are tolerated, and any missing/disabled/failed entry, client-bundle failure, or crashed plugin rolls the Harness back and re-verifies the old state.
- Harness status API (`harness/status` with forced refresh), reviewed plan and execution API (`harness/plan`, `harness/execute`), bootstrap projection, restart-aware pending state, and a dedicated cross-process update lock under `$DSH_HOME`.
- New configuration: `npmBin` (env `DSH_PLUGIN_CONSOLE_NPM_BIN`).

### Changed

- Non-npm-managed Harness installations (pnpm-store layouts, manual installs, unresolvable binaries) are reported with an explanation and never offer the update button.
- The Harness update shares the profile busy gate with plugin operations, so plugin and Harness mutations can never interleave.

## [0.2.2] - 2026-08-20

### Added

- One-click updates for installed community plugins and `dsh-plugin-console` itself; the existing canary, profile lock, stale-plan checks and rollback remain on the execution path, followed by the normal restart notice.
- GitHub CI and release jobs install the pinned DSH CLI required by the isolated activation tests; release runs can be manually retried against an existing `v*` tag.

### Fixed

- Preserve update discovery after an operation by refreshing the installed projection instead of replacing it with a snapshot that omits latest-version data.
- Reject updates against pending profile changes and stale pause/remove plans whose requested source changed at the same version.
- Bound npm registry metadata responses, clean command timeout timers, terminate timed-out capability probes, and prevent catalog refresh from racing initial bootstrap.
- CI pack verification no longer re-runs the full test suite inside `npm pack --dry-run`, and rollback fixtures stop inheriting npm's dry-run flag when they are packed during a prepack run.
- Localize common command, plan, catalog and recovery failure states instead of exposing internal error codes.

## [0.2.1] - 2026-08-19

### Added

- Isolated activation canary for installs and updates: a temporary DSH Web profile starts on an OS-assigned local port, validates the exact package version, target Loader entries, client-bundle syntax/execution/registration/module dependencies and HTTP resources, and terminates before the real profile is accepted; browser UI interaction remains a manual post-restart check.

### Changed

- Failed canaries automatically restore the previous profile metadata and dependency graph without deleting the entire `node_modules` directory first.
- Operation results and confirmation UI report whether the isolated canary passed or failed.
- The canary now evaluates the complete composed profile, so initialization conflicts with existing third-party bundles are treated as update failures; uncertain recovery retains the original dependency snapshot for inspection.
- Profile locks reclaim stale directories atomically, and metadata recovery uses atomic writes.
- Removal now verifies that the package is gone from both profile dependencies and `dsh.profile.bundles`, repairing stale bundle entries left by older or replaced DSH launchers; any repair or composition failure restores the previous profile state.
- Removal success now explains that the running Host and browser still hold their startup module graph and must be restarted/refreshed; update discovery remains read-only, while installs retain visible review and confirmation controls and updates use the explicit update button as consent.

## [0.2.0] - 2026-08-19

### Added

- First-level Settings → Plugin Manager page with catalog and installed-package views.
- Persisted pause and resume operations that cover every Loader entry contributed by an installed bundle, including aggregate bundles.
- README-specific GFM renderer with sanitized common HTML, GitHub-relative links and images, and a source view.
- Explicit `dsh` and `pnpm` capability reporting, localized pause/resume states, and focused operation diagnostics.

### Changed

- Release publishing is idempotent when an npm version already exists and requires the repository `npm` environment to provide `NPM_TOKEN` for new versions.
- Profile capability checks accept optional workspace and lock files, while integrity validation follows the root pnpm importer and peer-suffixed resolutions.
- Pending installations can be removed before restart, allowing an installation to be cancelled cleanly.

### Fixed

- Install and remove operations no longer fail merely because optional profile files are absent.
- A package-manager policy failure before metadata changes no longer deletes `node_modules` during rollback.
- Pause/resume now validates the composed profile and restores the previous patch when the target entries do not match.
- README raw HTML is rendered as safe elements instead of appearing as literal source text.

### Compatibility

- DeepSeek Harness `0.1.0-rc.6`
- Cordis `4.0.1`
- Node.js `22.19+` or `24+`
- pnpm `10+`

## [0.1.0] - 2026-08-17

### Added

- Community plugin catalog synchronized from `awesome-dsh-plugin` with ETag and last-known-good caching.
- npm artifact verification covering package identity, SemVer, repository, HTTPS tarball, SHA-512 integrity, DSH bundle metadata, and lifecycle-script disclosure.
- GitHub-only plugin verification pinned to an immutable commit with declared bundle-patch checks.
- Installed-plugin inventory combining profile dependencies, bundle state, package metadata, README usage docs, Web client capability, and live Loader/Fiber state.
- Confirmation-gated install, update, and remove operations backed by the official `dsh plugin` CLI.
- Serialized profile mutation, plan/state revalidation, lockfile integrity verification, `--dump-config` composition validation, and frozen clean recovery.
- DSH Web Settings integration under Plugins → Manage, with Chinese and English interfaces.
- DSH-native untrusted Markdown rendering for plugin usage documentation.
- Loopback-only mutations and same-origin JSON API controls.
- Build, package, Host activation, client module-map, catalog security, profile confinement, concurrency, rollback, and component tests.

### Compatibility

- DeepSeek Harness `0.1.0-rc.6`
- Cordis `4.0.1`
- Node.js `22.19+` or `24+`
- pnpm `10+`
