# Release Process

## One-Time Repository Setup

1. Create the GitHub repository `dsh-plugin-console`.
2. Add the remote as `origin`.
3. Add `repository`, `homepage`, and `bugs` fields to `package.json` using the final URL.
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
DSH_HOME="$tmp" dsh plugin --profile web add ./dsh-plugin-console-0.1.0.tgz --ignore-scripts
DSH_HOME="$tmp" dsh --profile web --dump-config
```

Then verify:

- `dsh --profile web --dump-config` contains the `dsh-plugin-console` layer;
- the tarball contains `lib/`, `LICENSE`, and `THIRD_PARTY_NOTICES.md`;
- package version matches the intended tag;
- README install commands and compatibility notes are current;
- no credentials, local profiles, caches, or `node_modules` are tracked.

## Publish

Merge the release branch to `main`, then create and push the signed or annotated tag:

```sh
git tag -a v0.1.0 -m "dsh-plugin-console v0.1.0"
git push origin main
git push origin v0.1.0
```

The release workflow verifies the tag/version match and publishes to npm with provenance. After npm publication, create the GitHub Release from the same tag and attach the packed tarball if desired.

## Community Submission

- Confirm the GitHub repository carries the `dsh-plugin` topic.
- Submit an entry to `awesome-dsh-plugin/awesome-dsh-plugin` with the GitHub URL, npm package name, bilingual description, category `market`, and install command.
- Include screenshots of Settings → Plugins → Manage and the artifact review dialog.
