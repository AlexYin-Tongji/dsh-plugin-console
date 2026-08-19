# v0.2.0 Release Status

Branch: `main`

Repository: https://github.com/AlexYin-Tongji/dsh-plugin-console

Status: **release commit and npm credential ready; awaiting `main` and `v0.2.0` push**

## Completed

- Package version and changelog are updated to `0.2.0`.
- Plugin management is a first-level Settings section with install, update, remove, pause, and resume operations.
- Aggregate bundles pause and resume every Loader entry contributed by their bundle patch.
- README previews render GFM and sanitized common HTML with immutable GitHub-relative links and images.
- Package-manager policy failures that leave profile metadata unchanged no longer trigger destructive dependency recovery.
- Pending installations can be removed before restart.
- Host and client build artifacts are committed with the package.
- Strict TypeScript checking and all 29 tests pass.
- Release publication skips an npm publish only when the exact version already exists.
- A valid `NPM_TOKEN` is configured in the GitHub `npm` environment.
- The repository carries the required `dsh-plugin` topic and meets the community age and commit-count requirements.

## Remaining Release Work

1. Push annotated tag `v0.2.0` and confirm the Release workflow publishes `dsh-plugin-console@0.2.0`.
2. Create the GitHub Release and attach `dsh-plugin-console-0.2.0.tgz`.
3. Submit the plugin entry to `awesome-dsh-plugin/awesome-dsh-plugin`.
