# v0.1.0 Release Status

Branch: `release/v0.1.0`

Repository: https://github.com/AlexYin-Tongji/dsh-plugin-console

Base branch: `main` (`feat: add DSH Plugin Console`)

Status: **release candidate; repository metadata is final, awaiting merge/tag/publication**

## Completed

- Package and product renamed consistently to `dsh-plugin-console` / DSH Plugin Console.
- GitHub repository, homepage, issue, security-advisory, and badge URLs are configured.
- npm author metadata is `AlexYin-Tongji`; Git commits retain the authorized local identity `alex <yinwy@seer-robotics.ai>`.
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

## Pending Publication

1. Push `main` and `release/v0.1.0` to `origin`.
2. Enable GitHub Actions and private vulnerability reporting.
3. Create the GitHub `npm` environment and configure `NPM_TOKEN` (or npm trusted publishing).
4. Review and merge `release/v0.1.0` into `main`.
5. Create annotated tag `v0.1.0`; the Release workflow will verify and publish npm provenance.
6. Create the GitHub Release and submit the plugin to the community catalog.

Do not create or push `v0.1.0` before npm publication credentials are configured.
