# Security Policy

## Supported Versions

Until the first stable release, only the latest published `0.2.x` version receives security fixes.

| Version | Supported |
| --- | --- |
| Latest `0.2.x` | Yes |
| `0.1.x` and older prereleases | No |

## Reporting a Vulnerability

Please use the repository's private GitHub Security Advisory flow instead of opening a public issue. Include:

- affected version and DSH version;
- reproduction steps;
- whether the issue can mutate a profile, execute package code, expose credentials, or bypass origin/loopback checks;
- relevant logs with tokens and filesystem identities removed.

Do not include API keys, registry credentials, private repository URLs, or complete profile backups.

## Security Model

DSH plugins execute as trusted code inside the Harness Host process. A catalog listing or a successful manifest/integrity check is not a security endorsement.

DSH Plugin Console deliberately:

- treats catalogs as discovery sources rather than command sources;
- generates typed package operations itself;
- disables lifecycle scripts during automatic installation;
- pins GitHub sources and exact npm versions;
- verifies npm lockfile integrity after installation;
- restricts mutation requests to same-origin loopback clients;
- serializes mutations and revalidates state immediately before execution;
- validates the resulting DSH composition;
- materializes a physically separate dependency tree and starts the updated bundle in an isolated temporary DSH/HOME/TMP on an OS-assigned loopback port;
- validates the exact package version, declared target Loader entries, client-module graph, client bundle response, and HTTP surface before accepting an install or update; browser-side UI interaction remains an explicit post-restart manual check;
- terminates the isolated process tree before returning and rolls back only when profile metadata still matches the operation's post-mutation snapshot;
- restores profile metadata atomically, performs a frozen reinstall without first deleting the whole dependency tree, and verifies the old version/spec and composition after a failed canary; if that verification is not possible, the dependency snapshot is retained for inspection.

The activation canary executes the updated plugin code to detect initialization failures. Its filesystem roots and dependency copy are isolated, but it is not an operating-system sandbox: trusted plugin code can still use inherited credentials, network access, or absolute paths. Plugin-created data is not removed automatically because ownership cannot be inferred safely.
