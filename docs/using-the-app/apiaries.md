---
sidebar_position: 2
title: "Apiaries"
---

# Apiaries

An **apiary** is a place where you keep bees: your garden, an allotment, a rooftop, a rented field, or a remote stand on the edge of a forest. In Openbeehive, the apiary sits at the very top of your records. Everything else hangs beneath it.

The hierarchy is simple:

```text
Apiary  ->  Hive  ->  Queen
```

Each apiary holds one or more hives, each hive has its current (and past) queens, and your inspections, tasks, events, harvests and treatments all attach to a hive within an apiary. Because the apiary is the root of the tree, it is also the unit you share with other people. More on that below.

## Why apiaries matter

Grouping hives by location does more than keep things tidy. A few practical benefits:

- **Context for your work.** When you arrive at a yard, you open that apiary and see only the hives in front of you.
- **Travel and logistics.** Coordinates let you find a remote stand again, share its location, or plan a round of visits.
- **Sharing boundaries.** Access is granted per apiary, so you can share one location with a mentor or a partner without exposing the rest of your operation.

:::tip
If you keep bees in several spots, create one apiary per physical location. It keeps inspections, harvests and treatments grouped where you actually do the work.
:::

## Creating an apiary

From the dashboard or the apiaries list, choose **New apiary** and fill in the details. Only a name is required; everything else can be added later.

| Field | Required | What it is for |
| --- | --- | --- |
| **Name** | Yes | A short, recognisable label, e.g. "Home garden" or "Orchard stand". |
| **Address** | No | A free-text address or description to help you (and anyone you share with) find the place. |
| **Note** | No | Anything useful: gate codes, access notes, the landowner's name, parking. |
| **Latitude / Longitude** | No | GPS coordinates for the apiary, in decimal degrees. |

Because Openbeehive is offline-first, the apiary is saved straight to the database on your device the moment you create it. It appears immediately, works with no signal, and syncs to the server in the background once you are online again. See [Offline and sync](/using-the-app/offline-and-sync) for how that works.

### Setting GPS coordinates

You can type latitude and longitude by hand, or tap **Use my location** to fill them from your device's GPS. Your browser will ask for permission the first time.

Coordinates are stored as decimal degrees, for example a latitude of `52.5200` and a longitude of `13.4050`. Negative values are valid: south of the equator for latitude, west of Greenwich for longitude.

:::note
"Use my location" captures where **you** are standing, which is usually exactly where the hives are. If you set the apiary up at home for a remote yard, type the coordinates in manually instead, or edit them on your next visit.
:::

## Adding and viewing hives

Open an apiary to see all of its hives at a glance, along with a quick sense of how each is doing. From here you can:

- **Add a hive** with **New hive**, choosing its type (Zander, Dadant, Deutsch Normal, Langstroth, Warre, Top-bar or Other) and giving it a name or number.
- **Open a hive** to view its queen, inspections, tasks, events, harvests and treatments.

For everything you can record against an individual colony, see [Hives](/using-the-app/hives) and [Queens](/using-the-app/queens).

## Printing QR labels for the apiary

Every hive can carry a printable **QR label**. From the apiary view you can print labels for all of its hives in one go, which is far quicker than doing them one at a time.

Each label encodes a deep link to that specific hive. Scanning it with a phone opens Openbeehive directly at the hive, so you can start an inspection without searching through lists. Stick the label somewhere weatherproof on the hive body or roof.

For label sizes, reprinting and how the links are built, see [QR labels](/using-the-app/qr-labels).

:::tip
Print fresh QR labels whenever you add a batch of new hives to a yard. Take them with you and apply them on site so the physical hive and your records line up from day one.
:::

## Editing and reorganising

You can rename an apiary, update its address, note and coordinates, or correct details at any time. Edits sync the same way as everything else, with per-field last-writer-wins, so the most recent change to each field wins even if two people edit at once.

If a hive moves to a different location, move it to the matching apiary so your records keep reflecting reality. Migratory beekeepers who move colonies between sites can keep an apiary per site and reassign hives as they travel.

## Sharing an apiary

Sharing in Openbeehive happens at the **apiary level** through *scopes*. When you share an apiary, the people you invite get access to that location and the hives, queens and records within it, but not to your other apiaries.

This is what makes it practical to:

- Share a single yard with a mentor, an apprentice or a co-beekeeper.
- Run an association or club apiary that several members maintain together.
- Keep your home colonies private while collaborating on a shared site.

Because sync is conflict-free, multiple people can work in the same shared apiary, even offline, and their changes merge cleanly when devices reconnect.

For the data model behind scopes and how conflict-free sharing works under the hood, see [Architecture](/developers/architecture).

:::caution
Sharing an apiary grants real access to its records. Only invite people you trust, and remember that anyone with access can add, edit and record against the hives in that apiary.
:::

## Where to go next

- [Hives](/using-the-app/hives) — add colonies and record against them.
- [Queens](/using-the-app/queens) — track your queens and marking colours.
- [QR labels](/using-the-app/qr-labels) — print and use scannable hive labels.
- [Offline and sync](/using-the-app/offline-and-sync) — how your records stay available everywhere.
