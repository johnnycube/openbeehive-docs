---
sidebar_position: 6
title: "QR codes & deep links"
---

# QR codes & deep links

Every hive in Openbeehive can carry a printable QR label. Scan it in the yard
and the app opens straight at that hive, with no menus to dig through. This page
explains how the encoding works, how links resolve offline, how native deep
links are wired up, and how the in-app scanner behaves.

## What a hive QR encodes

A hive QR encodes a single URL of the form:

```text
<base>/h/<hiveId>
```

- `<base>` is your `BEEHIVE_PUBLIC_BASE_URL` (for example `https://app.openbeehive.org`).
- `<hiveId>` is the hive's stable identifier: a UUID minted on the device when
  the hive is first created.

The id is the same offline-first UUID used everywhere else in the data model. It
is generated locally, never reassigned, and survives sync untouched. That
stability is what makes a printed label safe: the QR you stick on the brood box
in spring still points at the same hive years later.

:::note
The id encodes a hive, not a permission. Knowing or guessing a hive id grants
no access on its own. See **Access is gated by sharing**.
:::

## How `/h/[id]` resolves

The `/h/[id]` route is a thin resolver, not a page of its own. When it loads it:

1. Looks up `id` in the **local** SQLite-WASM database (OPFS).
2. If the hive is present, redirects into the app at `/app/hives/[id]`.
3. If the hive is **not** present locally, it triggers a sync, then re-checks.
4. If the hive still cannot be found or you have no access to it, it says so.

Because step 1 reads from the local database, a scan resolves instantly when you
are offline, as long as the hive is already on the device. The sync in step 3 is
the only part that needs a signal, and it only runs when the hive is missing
(for example, an apiary that was just shared with you).

```text
scan QR  ->  /h/<id>  ->  local lookup
                              |
                  found ------+------ not found
                    |                    |
          /app/hives/<id>           sync, re-check
                                         |
                              found -> /app/hives/<id>
                              still missing -> "not found / not shared"
```

### Access is gated by sharing

Resolution always runs through normal sync and sharing rules. Sharing in
Openbeehive happens at the **apiary** level via scopes; a hive becomes visible to
you only because its apiary is in a scope you can sync. The `/h/[id]` route never
bypasses that.

So an id alone is harmless: if the hive's apiary is not shared with you, the sync
in step 3 returns nothing and the route reports the hive as unavailable. Treat
printed labels as convenient, not secret.

## Implementation

The QR feature is small and split across a few files:

| File | Purpose |
| --- | --- |
| `lib/qr.ts` | Build the hive URL, render QR as SVG offline, parse scanned payloads (`parseHiveId`) |
| `lib/components/QrLabel.svelte` | Printable label (QR + name + short code) with SVG download |
| `routes/h/[id]/+page.svelte` | Scan landing: resolve locally, then redirect into the app |
| `routes/app/hives/[id]/+page.svelte` | Hive detail (shows the QR label and history) |
| `routes/app/scan/+page.svelte` | In-app scanner using the camera |

QR rendering happens entirely on-device as SVG, so labels can be generated and
printed with no network connection.

## Printing labels

You can print a label for any single hive from its detail view, or generate a
**batch sheet** covering many hives at once.

| Output | Use it for |
| --- | --- |
| Single label | One hive, printed on demand (replacement, new colony) |
| Batch sheet | A grid of labels for a whole apiary or a print run |

`QrLabel` opens a clean print window containing just the QR, the hive name and a
short code, and can also download the QR as an SVG. A batch sheet is simply many
`QrLabel` components laid out in a print-grid page.

The short caption matters: it keeps a label useful even if a phone is flat. Print
onto weatherproof or laminated stock; brood boxes live outdoors and ink fades.

:::tip
Stick the label where you will actually scan it, the side of the box or the lid,
rather than a surface you have to lift the roof to read. For step-by-step
guidance aimed at beekeepers, see [QR labels](/using-the-app/qr-labels).
:::

## Native deep links

The QR points at an ordinary `https://` URL, which means it works in any camera
or browser. On mobile, Openbeehive can also register that URL space so the
installed app, rather than a browser tab, handles the link.

### Android App Links

Android verifies ownership of the link domain through a Digital Asset Links file
served at `/.well-known/assetlinks.json`, declaring the app's package and signing
fingerprint:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.openbeehive.app",
      "sha256_cert_fingerprints": ["<your-app-signing-cert-sha256>"]
    }
  }
]
```

Add an intent filter for `https://<host>/h/*`. Once verified, taps and scans open
directly in the app without a chooser dialog.

### iOS Universal Links

iOS uses an Apple App Site Association file served at
`/.well-known/apple-app-site-association` (as `application/json`, no file
extension):

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "<TEAMID>.com.openbeehive.app",
        "paths": ["/h/*"]
      }
    ]
  }
}
```

Add the Associated Domains entitlement to the app to claim the `/h/*` path space.

:::caution
Both well-known files must be served over HTTPS with the correct content type and
no redirects, from the same origin as your `BEEHIVE_PUBLIC_BASE_URL`. If you put
Openbeehive behind a reverse proxy, make sure `/.well-known/` is passed through
untouched. See [Reverse proxy](/self-hosting/reverse-proxy).
:::

### Custom scheme fallback

For contexts where an `https://` link will not route to the app, a custom scheme
is also parsed by `parseHiveId`:

```text
openbeehive://hive/<hiveId>
```

Prefer the `https://` form for printed labels, because it degrades gracefully to
the web app when the native app is absent. The custom scheme is best reserved for
in-app navigation and integrations.

## In-app scanner

The built-in scanner at `/app/scan` reads QR codes using the browser's
`BarcodeDetector` API where available (Android and Chrome). On platforms that do
not yet ship `BarcodeDetector`, notably iOS Safari, the app falls back to the
device camera app; drop in a JavaScript decoder such as `@zxing/browser` if a
fully in-app scanner is required there.

Whichever path runs, a successful decode is handled the same way: `parseHiveId`
extracts the hive id from the URL or custom scheme, and the app navigates through
the same local resolution flow described above. A scan and a tapped link are
equivalent.

:::note
The scanner needs camera permission and a secure context (HTTPS, or
`localhost` during development). If the camera does not start, check site
permissions first; see [Troubleshooting](/knowledge-base/troubleshooting).
:::

## Summary

- A hive QR encodes `<base>/h/<hiveId>`, where the id is a stable offline UUID.
- `/h/[id]` resolves from the local database first and only syncs if needed.
- Access always follows apiary-level sharing; an id grants nothing by itself.
- App Links and Universal Links route `/h/*` into the native app; an
  `openbeehive://hive/<id>` scheme is also parsed.
- The scanner uses `BarcodeDetector` with an iOS camera-app fallback.

For the wider picture, see the [Developers](/category/developers) section and the
[Data model](/developers/data-model).
