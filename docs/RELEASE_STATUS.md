# v0.2.2 Release Status

Repository: https://github.com/AlexYin-Tongji/dsh-plugin-console

Status: **release candidate verified; awaiting `v0.2.2` push and tag**

`v0.2.1` is committed and pushed at `d745a56`, but its first Release workflow run was blocked before publication because the runner did not have the DSH CLI required by the new Canary tests. The workflow fix in `0.2.2` installs `@deepseek-ai/dsh@0.1.0-rc.6` and supports retrying an existing tag.

## Stability Fix

- Installs and updates run the new artifact in a physically isolated temporary DSH Web profile before being accepted.
- The canary validates the exact package version, bundle targets, Web client-module graph, served client-bundle syntax/execution/registration/dependencies, and HTTP surface on an OS-assigned loopback port; browser UI interaction is an explicit post-restart manual check.
- The canary boots the complete composed profile, including already-installed third-party bundles, so plugin-to-plugin and plugin-to-DSH startup conflicts are observed instead of hidden.
- Canary dependencies are copied into a private tree; external direct and transitive links are materialized and the final tree is checked for escaping symlinks.
- Timed-out DSH/pnpm commands terminate and verify their complete process tree before rollback begins.
- Canary failures restore the previous metadata and frozen dependency graph, then verify the old requested spec, package version, bundle, and composed profile.
- Mutation snapshots use compare-and-swap semantics, and a cross-process profile lock prevents two plugin managers from changing the same profile concurrently.
- Removal verifies that a deleted direct dependency is absent from both `dependencies` and `dsh.profile.bundles`; stale entries from older launchers are repaired atomically and rolled back together with the dependency tree if composition fails.
- Results distinguish canary status, process cleanup, pending-restart activation, unchanged state, and unknown state.
- When recovery cannot prove that the profile is safe to overwrite, the original dependency snapshot is retained under the profile for manual inspection instead of being deleted.

## Verification

- Strict TypeScript checking passes.
- Host and browser client bundles build successfully.
- All 75 tests pass across eleven test files; `0.2.2` adds one-click update, self-update, pending-state rejection, and same-version source-change recovery coverage.
- Real DSH integration tests cover canary pass, initialization crash, version mismatch, configuration-only bundles, Web client bundles, unrelated-plugin isolation, process-tree cleanup, successful update, and failed-update rollback.
- The active local Web profile passes the isolated canary without changing its metadata or source dependency tree and leaves no process or temporary-directory residue.
- The packed `dsh-plugin-console-0.2.2.tgz` installs in a fresh DSH Web profile and appears in the composed profile.

## Remaining Release Work

1. Push the release commit and annotated tag `v0.2.2`.
2. Confirm the GitHub Release workflow publishes `dsh-plugin-console@0.2.2`.
3. Retry `v0.2.1` from Actions with `release_ref=v0.2.1`, then create its GitHub Release if it is still desired.

The community entry was merged in [`awesome-dsh-plugin#1830`](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/1830) and follows npm latest automatically.
