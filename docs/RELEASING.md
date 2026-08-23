# Release Process

## One-Time Repository Setup

1. Repository: `https://github.com/AlexYin-Tongji/dsh-plugin-console`.
2. Add this repository as the Git remote `origin`.
3. Verify `repository`, `homepage`, and `bugs` in `package.json` before every release.
4. Enable GitHub Actions and private vulnerability reporting.
5. Create an npm automation token and store it as the GitHub Actions secret `NPM_TOKEN`.
6. Add repository topics: `dsh-plugin`, `deepseek-harness`, `plugin-manager`, and `dsh-category-market`.

## Release Checklist

Run from the release branch:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm run release:verify
npm pack
tmp="$(mktemp -d)"
DSH_HOME="$tmp" dsh plugin --profile web add ./dsh-plugin-console-<version>.tgz --ignore-scripts
DSH_HOME="$tmp" dsh --profile web --dump-config
```

Then verify:

- `dsh --profile web --dump-config` contains the `dsh-plugin-console` layer;
- the tarball contains `lib/`, `LICENSE`, and `THIRD_PARTY_NOTICES.md`;
- package version matches the intended tag;
- README install commands and compatibility notes are current;
- no credentials, local profiles, caches, or `node_modules` are tracked.

## Publish

Set `package.json.version` to the new SemVer and merge that release commit to `main`. Then create and push a signed or annotated tag with the exact same version:

```sh
git tag -a v<version> -m "dsh-plugin-console v<version>"
git push origin main
git push origin v<version>
```

After the Release workflow publishes, verify what users actually receive:

- `npm view dsh-plugin-console version` and `npm view dsh-plugin-console dist-tags` report the new version as `latest`;
- a fresh install (`npm install dsh-plugin-console@latest --ignore-scripts --legacy-peer-deps` in a scratch directory, or `DSH_HOME="$(mktemp -d)" dsh plugin --profile web add dsh-plugin-console@latest`) resolves that version;
- note for release notes: re-running the bare install command `add dsh-plugin-console` does not upgrade an existing profile (pnpm keeps the already-pinned `^x.y.z` range), so announce `add dsh-plugin-console@latest` or the built-in self-update as the upgrade path.

The release workflow verifies the tag/version match and queries the exact `name@version` on npm. It publishes with provenance only when that version is absent; publishing a new version requires `NPM_TOKEN` in the repository's `npm` environment. Do not push the tag until that credential is configured. Re-running a tag whose npm version already exists succeeds without another publish attempt. A failed tag can be retried from Actions → Release with `release_ref` set to the existing tag. Create the GitHub Release from the same tag and attach the packed tarball.

## Community Submission

- Confirm the GitHub repository carries the `dsh-plugin` topic.
- Submit an entry to `awesome-dsh-plugin/awesome-dsh-plugin` with the GitHub URL, npm package name, bilingual description, category `market`, and install command.
- Include screenshots of Settings → Plugin manager and the artifact review dialog.
