---
sidebar_position: 9
title: "QR labels"
---

# QR labels

A QR label turns any hive into a one-tap shortcut. Stick a label on the roof or
brood box, point your phone at it, and Openbeehive opens straight to that hive's
record. No scrolling through lists in the apiary, no squinting at hand-written
numbers in the rain.

This is especially handy when you keep several hives that look identical, or when
a helper who doesn't know your numbering needs to find the right colony.

## What the QR code contains

Each hive's QR code encodes a single **deep link** to that hive:

```text
<base>/h/<hiveId>
```

The `<base>` is your app address (for the hosted service this is
`https://app.openbeehive.org`; for a self-host it is your own URL). The
`<hiveId>` is the hive's unique identifier.

The code contains no bee data, no honey weights and no personal information. It
is just a link. If someone scans it without access to your records, they will be
asked to sign in and will only see the hive if it has been shared with them.

:::note
The link opens the **app**, which then loads the hive from your local database.
Because Openbeehive is offline-first, the hive still opens even if you have no
signal once the app is installed on your phone.
:::

## Printing a label for one hive

1. Open the hive from your **Apiaries** list, or from the hive directly.
2. Choose **QR label** (look under the hive's actions menu).
3. A preview appears showing the code plus the hive name and apiary, so you can
   tell labels apart before they go on the boxes.
4. Select **Print**. Your browser's print dialog opens.
5. Print onto a label sheet or plain paper, then fix it to the hive.

:::tip Make it last outdoors
Hives live in sun, rain and frost. For labels that survive a season:

- Print on weatherproof or vinyl label stock, **or**
- Print on paper and cover it with clear packing tape or a laminate pouch.

Place the label somewhere it won't be scraped by supers being lifted on and off
— the side of the brood box or under the roof lip both work well.
:::

## Printing a batch sheet for an apiary

If you are setting up a whole apiary at once, print every hive's label together
rather than one at a time.

1. Open the **apiary** from your Apiaries list.
2. Choose **QR sheet** (or **Print labels**) for the apiary.
3. Openbeehive lays out a sheet with one labelled code per hive in that apiary.
4. Print, then cut and apply.

This keeps a tidy record too: a single sheet shows every colony in the apiary
with its name and code side by side.

## Scanning a label

You can scan a label two ways.

### With your phone's camera

Most modern phones recognise QR codes in the built-in camera app. Point the
camera at the label, wait for the link to appear, and tap it. Your phone opens
the link and Openbeehive jumps to the hive.

This works for anyone — a visitor or a co-beekeeper can scan a shared hive
without opening the app first.

### With the in-app scanner

Openbeehive also has its own scanner, useful when you're already working in the
app and want to move between hives quickly.

1. Open the scanner (look for the QR or camera icon in the app).
2. Grant camera permission the first time you use it.
3. Point at a label — the hive opens immediately.

:::tip
The in-app scanner keeps you inside Openbeehive, so you go from one hive record
to the next without bouncing through the browser.
:::

## If a scan doesn't open the right hive

A few common causes and fixes:

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Camera won't focus on the code | Wet, faded or curled label | Wipe it dry; reprint if it's worn |
| Link opens but says "not found" | Hive was deleted, or it's on a different account | Check the hive still exists and that you're signed in to the right account |
| Asks you to sign in | Hive belongs to someone else's apiary | Ask them to share the apiary with you |
| Nothing happens on tap | App not installed on this phone | Install Openbeehive, then scan again |

Sharing is at the apiary level, so to let someone scan a hive you need to share
its **apiary** with them. See [Offline and sync](/using-the-app/offline-and-sync)
for how sharing and scopes work.

## Reprinting and changing labels

Labels never expire. The link stays valid for the life of the hive, so a code
printed today will still work next season.

If you move equipment around, remember the label follows the **hive record**, not
the physical box. When you retire a box but keep the colony as the same hive in
Openbeehive, the old label keeps working. If you start a fresh hive record,
generate and print a new label for it.

:::caution
Don't move a printed label from one hive's box to another and expect it to point
at the new colony — it will still open the original hive. Print a fresh label
instead.
:::

## Going deeper

Want the technical detail — how the deep link is parsed, how the native install
intercepts the URL, and how to generate codes programmatically? See
[QR codes for developers](/developers/qr-codes).
