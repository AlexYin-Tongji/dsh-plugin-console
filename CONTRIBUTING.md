# Contributing

## Prerequisites

- Node.js `22.19+` or `24+`
- pnpm `10+` (`11.22.0` is used by the lockfile)
- DeepSeek Harness `0.1.0-rc.6` for integration checks

## Setup

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm run release:verify
```

`release:verify` runs strict TypeScript checking, builds the Host/client artifacts, and then runs the complete test suite. Keep `lib/` committed: immutable GitHub installs must receive built artifacts without running a dependency build script.

## Architecture

- `src/catalog.ts`: catalog normalization, cache, npm/GitHub verification.
- `src/profile.ts`: active-profile and live Loader projection.
- `src/operations.ts`: reviewed plans, serialized mutations, validation, recovery.
- `src/index.ts`: Host route and lifecycle ownership.
- `src/client/`: Web Settings contribution and API adapter.
- `tests/`: Host, security, package, client-loader, and React behavior.

## Pull Requests

- Keep changes scoped and preserve DSH's Cordis service/effect model.
- Do not expose arbitrary shell or pnpm arguments to the browser.
- Add tests for mutation, catalog, profile, or client behavior changes.
- Rebuild and commit `lib/` when client or Host source changes.
- Update `CHANGELOG.md` for user-visible changes.
- Preserve `LICENSE` and `THIRD_PARTY_NOTICES.md`.

## Commit Style

Use concise Conventional Commit subjects where practical, for example:

```text
feat: add catalog source status
fix: reject stale operation plans
chore: prepare v0.1.0 release
```

## Attribution

Implementation patterns adapted from upstream MIT projects must be recorded in `THIRD_PARTY_NOTICES.md`; substantial adaptations should also carry a local source comment.
