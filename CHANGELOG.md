# Changelog

All notable changes to DSH Plugin Console are documented here. The project follows [Semantic Versioning](https://semver.org/).

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
