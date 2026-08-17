# v0.1.0 Release Status

Branch: `release/v0.1.0`

Base commit: `be9dae8` (`feat: add DSH Plugin Console`)

Status: **release candidate; waiting for the final GitHub repository URL**

## Completed

- Package and product renamed consistently to `dsh-plugin-console` / DSH Plugin Console.
- DSH `0.1.0-rc.6` bundle and Web client contracts are pinned.
- Host and client build artifacts are committed.
- Strict TypeScript checking passes.
- All 16 tests pass.
- npm package name was unclaimed when checked on 2026-08-17.
- npm tarball structure and bundled notices were verified.
- Fresh-profile tarball installation and Web `--dump-config` composition were verified.
- Clean frozen profile recovery was verified against the real rc.6 CLI.
- One live npm plugin and one GitHub-only plugin passed artifact verification.
- The active local Web profile is linked to `dsh-plugin-console`; a DSH restart is still required to load the new client module.
- MIT attribution and third-party notices are included.
- CI, tag-driven npm provenance publication, Dependabot, issue forms, contribution guidance, security policy, and release documentation are present.

## Pending Repository URL

After the GitHub repository is created:

1. Add `repository`, `homepage`, and `bugs` to `package.json`.
2. Add the Git remote as `origin`.
3. Replace this status with the final repository URL and commit SHA.
4. Add the GitHub private security-advisory link to the issue-template config.
5. Run `pnpm run release:verify` and `npm pack --dry-run` again.
6. Commit the metadata on this branch and push `main` plus `release/v0.1.0`.
7. Merge the release branch, create annotated tag `v0.1.0`, and let the Release workflow publish npm provenance.
8. Create the GitHub Release and submit the plugin to the community catalog.

Do not create or push `v0.1.0` before the repository metadata is final.
