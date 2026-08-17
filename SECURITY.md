# Security Policy

## Supported Versions

Until the first stable release, only the latest published `0.1.x` version receives security fixes.

| Version | Supported |
| --- | --- |
| Latest `0.1.x` | Yes |
| Older prereleases | No |

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
- restores profile metadata and performs a clean frozen reinstall after an indeterminate or failed mutation.

Plugin-created data is not removed automatically because ownership cannot be inferred safely.
