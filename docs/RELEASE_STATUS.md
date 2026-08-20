# v0.3.0 Release Status

Repository: https://github.com/AlexYin-Tongji/dsh-plugin-console

Status: **implementation and local verification complete; awaiting review and release**

`0.3.0` adds the core Harness self-update goal: a one-click DeepSeek Harness update entry in the sidebar, and a guarantee that a Harness update never crashes installed plugins.

## What changed

- **Sidebar entry**: `sidebar.footer.action` icon showing the running Harness version, an update-available badge, and a popover with running/installed/latest versions, the update channel, and the reviewed plan → confirm → execute flow; after success it shows the pending-restart state, after failure it reports the rollback outcome.
- **Harness resolution**: the running `dsh` executable is resolved (PATH search + realpath) to its package root and npm global prefix (POSIX `<prefix>/lib/node_modules` and Windows `<prefix>/node_modules` layouts with the bin surface checked); pnpm-store and manual installs are detected and shown as unmanaged.
- **Update source**: npm registry dist-tag (default `latest`, configurable via `dshUpdateTag`); the target is an exact `@deepseek-ai/dsh` version installed with `npm install --global --prefix`.
- **Safety**: before mutation the full composition is snapshotted from `--dump-config` (`!!js` expressions evaluated locally); after mutation the exact package version and `dsh --version` output are verified; then the complete composed profile boots in an isolated home under the NEW Harness binary — every installed plugin's Loader entry (activation, disabled flag, missing services), client module graph row, client bundle execution, and the HTTP surface are validated. Runtime-only boot entries are tolerated; any failure reinstalls the previous Harness version and re-verifies it with a second canary.
- **Concurrency**: Harness updates share the profile busy gate and take a dedicated cross-process lock under `$DSH_HOME`.

## Verification

- Strict TypeScript checking passes.
- Host and browser client bundles build successfully.
- All 109 tests pass across 15 test files: new coverage includes Harness resolution (managed/unmanaged/unresolved/PATH), registry lookup and caching, plan blocking states, execute success, canary-failure rollback, half-applied-command rollback, no-op rollback, plan expiry, fingerprint and version-change rejection, full-profile canary pass/fail (missing entry, crashing plugin, pause overrides, missing client), the sidebar component flows, and the updated client artifact contract.
- Real DSH integration: the full-profile canary passes against the **active local web profile** (133 composed Loader entries, `dsh-plugin-console` and `dsh-ui-enhancer` client bundles) without touching its metadata or dependency tree.
- Live resolution sanity check on this machine: `dsh` → npm global prefix under nvm, `0.1.0-rc.6` installed, `0.1.0-rc.7` available on `latest` → `updateAvailable: true`.

## Remaining Release Work

1. Review the 0.3.0 diff and merge.
2. Push the release commit and annotated tag `v0.3.0`.
3. Confirm the GitHub Release workflow publishes `dsh-plugin-console@0.3.0`.
4. Optionally exercise the real update path on a disposable machine (the local suite verifies every step except the final `npm install --global` write, which was validated against stubbed npm plus the real isolated canary).
