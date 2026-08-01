# Changelog

All notable changes to the Openbeehive documentation are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Documentation content is also versioned in-site via Docusaurus (see
`versions.json`).

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
