# Changelog

All notable changes to the Openbeehive documentation are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Documentation content is also versioned in-site via Docusaurus (see
`versions.json`).

## [0.2.3.1] - 2026-09-11

Site only, no content change: a version switch in the navbar (with an "All
versions" entry), the `/versions` overview page, and clearer banners on older
snapshots, all translated for the five languages. The newest release is the
default everywhere.

## [0.2.3] - 2026-09-11

Documents app release 0.2.3 (first-sync feedback, progressive pulls, reload
resilience) and brings the self-hosting reference back in line with the
server's actual configuration.

### Added

- **Self-hosting → Configuration:** the HTTP timeout variables
  (`BEEHIVE_HTTP_*`), `BEEHIVE_BLOB_PUBLIC_URL`, the dedicated instance
  administrator (`BEEHIVE_ADMIN_EMAIL` / `BEEHIVE_ADMIN_PASSWORD`),
  `BEEHIVE_DEMO_AUTOLOGIN`, the per-provider `BEEHIVE_OIDC_<NAME>_*`
  variables, and the previously missing defaults for MinIO, WebAuthn and the
  OIDC redirect URL.
- **Self-hosting → Authentication:** how the administrator account is
  guaranteed on every start and why registration never grants the admin role.
- **Self-hosting → Demo:** the administrator requirement in demo mode and the
  "Showcase hosts" auto-login option.
- **Self-hosting → Storage:** serving stored files through a different public
  URL.
- **Using the app → Offline & sync:** "Your first sync on a new device"
  (skeletons, the syncing hint, progressive fills) and the volatile-storage
  warning.
- **Knowledge base → Troubleshooting:** entries for "Storage is unavailable"
  and for the syncing hint that will not go away.
- Versioned docs snapshot `0.2.3`, all five languages.

### Changed

- The first registered account is no longer described as the administrator;
  the admin comes from the environment.

## [0.2.2] - 2026-08-01

Documents app release 0.2.2 (offline-storage self-repair, sync resilience,
visible save/geocoding feedback). Docs versions now mirror the app release
they describe: this snapshot replaces the short-lived `0.2.0` docs tag,
which carried the same content under the wrong version number.

### Added

- **Using the app → Apiaries:** the map pin / address lookup and the four
  status states shown under the map (searching, location set, no match,
  search unavailable).
- **Using the app → Offline & sync:** new section "If something cannot be
  saved" — failed local writes are reported instead of failing silently, and
  demo-account changes stay on the device because the demo server is
  read-only.
- **Knowledge base → Troubleshooting:** entry for the
  `SQLITE_CANTOPEN: unable to open database file` error (storage-slot
  exhaustion) fixed by app 0.2.2's automatic pool repair.
- Versioned docs snapshot `0.2.2`, all five languages.

## [0.1.1] - 2026-07-19

### Added

- Link to the live demo at `demo.openbeehive.org` from the docs landing page
  (all five languages).

## [0.1.0] - 2026-07-17

First public release. 🐝

### Added

- Docusaurus site rebranded to the Openbeehive identity (honey/cream palette,
  hexagon logo, custom favicon and social card).
- Documentation structured into: **Using the app**, **Self-hosting**,
  **Beekeeping basics**, **Knowledge base**, and **Developers**.
- Multi-language documentation: English, German, French, Spanish, Italian
  (Docusaurus i18n, with a locale dropdown).
- Versioned docs snapshot `0.1.0`.

[0.2.2]: https://github.com/johnnycube/openbeehive-docs/releases/tag/v0.2.2
[0.1.1]: https://github.com/johnnycube/openbeehive-docs/releases/tag/v0.1.1
[0.1.0]: https://github.com/johnnycube/openbeehive-docs/releases/tag/v0.1.0
