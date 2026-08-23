# v0.3.1 Release Status

Repository: https://github.com/AlexYin-Tongji/dsh-plugin-console

Status: **released — `v0.3.1` tagged, CI and Release workflows green, `dsh-plugin-console@0.3.1` published to npm**

`0.3.1` is a documentation-only release: it ships the corrected upgrade instructions so npm and GitHub both serve current install/upgrade guidance. No Host or client code changes.

## What changed

- **README**: the install command now pins `@latest` (`dsh plugin --profile web add dsh-plugin-console@latest`), so fresh installs always resolve the newest release at install time, and re-running the command upgrades an existing profile.
- **Upgrade path documented**: re-running the bare install command `add dsh-plugin-console` does not upgrade — pnpm keeps the already-pinned `^x.y.z` range and reports "Already up to date". The documented upgrade paths are `add dsh-plugin-console@latest` or the built-in one-click self-update (Settings → Plugin manager → Installed), followed by a restart.
- **Troubleshooting section**: registry/mirror sync lag, pinned profile versions vs installed versions, and missing restart/refresh after updates.
- **RELEASING.md**: hardcoded example versions replaced with `<version>` placeholders; post-publish verification steps added (npm dist-tags plus a fresh-install resolution check).

## Verification

- Strict TypeScript checking passes; Host and client bundles build; all 110 tests pass across 15 test files.
- Upgrade behavior reproduced in a disposable `$DSH_HOME`: bare re-add of a profile pinned at `^0.2.2` reports "Already up to date" and stays on 0.2.2; explicit `add dsh-plugin-console@latest` upgrades to 0.3.x and rewrites the range.
- Published tarball contents verified to match the local build before tagging.

## Release Completed

- `release: v0.3.1` pushed to `main`; annotated tag `v0.3.1` pushed.
- CI (`verify`) and Release (`publish`) workflows green.
- `dsh-plugin-console@0.3.1` is the npm `latest` dist-tag; a scratch-directory fresh install resolves it.

Follow-up: the awesome-dsh-plugin catalog entry still lists the unpinned install command (`dsh plugin --profile web add dsh-plugin-console`); consider upstreaming an `@latest` variant so catalog installs self-upgrade too.
