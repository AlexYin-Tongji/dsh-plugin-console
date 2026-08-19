# Changelog

All notable changes to DSH Plugin Console are documented here. The project follows [Semantic Versioning](https://semver.org/).

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
