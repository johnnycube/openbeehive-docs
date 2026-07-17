---
sidebar_position: 3
title: "Hives"
---

# Hives

A hive in Openbeehive represents a single colony of bees living in a physical box. Hives are the heart of your records: almost everything you log day to day, inspections, tasks, harvests and treatments, hangs off a hive.

Each hive belongs to one apiary at a time, and each hive can have a queen. Because Openbeehive is offline-first, you can create and edit hives at the apiary with no signal at all; your changes save instantly to the device and sync in the background.

## Creating a hive

Open an apiary and choose **Add hive**. A new hive needs only a name to get started, but a few extra details make your records far more useful later.

| Field | What it is | Notes |
| --- | --- | --- |
| **Name** | How you identify the hive | A number, a colour, a nickname, anything memorable. |
| **Hive type** | The frame and box standard | See the table below. |
| **Status** | The current state of the colony | Defaults to **Active**. |
| **Photo** | A picture of the hive | Handy for spotting it at a glance. |

:::tip
Keep names short and consistent across an apiary, for example "1", "2", "3" or "Red", "Blue", "Green". Short names print clearly on QR labels and are quick to read in the field.
:::

### Hive types

Openbeehive supports the common European and international standards:

| Type | Typical use |
| --- | --- |
| Zander | Widespread in parts of Germany and central Europe. |
| Dadant | Popular for honey production, large brood box. |
| Deutsch Normal | A traditional German standard. |
| Langstroth | The most common standard worldwide. |
| Warre | A vertical, low-intervention design. |
| Top-bar | Horizontal, frameless bars. |
| Other | Anything not listed above. |

For a fuller description of each standard, see [Hive types](/knowledge-base/hive-types).

### Status

The status describes what is happening with the colony right now.

| Status | Meaning |
| --- | --- |
| **Active** | A healthy, queenright colony in normal use. |
| **Nucleus** | A small starter colony (a "nuc"), often a split or a mating unit. |
| **Queenless** | The colony has lost its queen and needs attention. |
| **Lost** | The colony has died out or absconded. |
| **Dissolved** | You have deliberately united or broken up the colony. |

:::note
Setting a hive to **Lost** or **Dissolved** keeps all its history. The records stay searchable; the hive simply drops out of your active lists.
:::

## Moving a hive between apiaries

Colonies travel. You might bring a nuc home, move hives to the heather, or consolidate two apiaries. To relocate a hive, open it and choose **Move**, then pick the destination apiary.

Moving a hive does not lose any data. The hive keeps its name, queen, photo and full record; only its apiary changes from the move date onward.

### Location history

Every move is recorded as a dated entry in the hive's **location history**, so you always know where a colony was at any point in time. This is useful for tracing disease exposure, for migratory beekeeping records, and for understanding how a colony performed at different sites.

:::caution
In many regions, moving hives between locations is subject to bee health and movement rules, especially within disease control or quarantine zones. Check your national or local requirements before relocating colonies. See [Diseases and pests](/knowledge-base/diseases-and-pests) for background, and always follow your local authority's guidance.
:::

## The hive detail view

Opening a hive gives you a single screen that pulls together everything about that colony.

### At a glance

- **Current queen** — who is heading the colony, with her marking colour and year. From here you can view her record, replace her, or mark the hive queenless. See [Queens](/using-the-app/queens).
- **Last inspection** — the date and a summary of your most recent visit, so you can see at a glance when the hive was last checked. See [Inspections](/using-the-app/inspections).
- **Status and type** — shown prominently so the state of the colony is never in doubt.

### Stats

The hive view summarises the colony's recent life: number of inspections, the last treatment applied, harvest totals, and outstanding tasks. These are drawn straight from your records, so they stay accurate as you log new entries.

### Visit log

Below the summary is the visit log: a single chronological timeline of everything that has happened to the hive, including inspections, tasks, events, harvests and treatments. It is the quickest way to review a colony's story and to spot patterns over a season.

### QR label

Each hive can have a printable QR label. Scanning it on your phone opens the app straight at that hive, so you can start an inspection without searching. Print labels from the hive view or in bulk for a whole apiary. See [QR labels](/using-the-app/qr-labels).

:::tip
Stick a QR label on the side of each hive at a height you can scan without bending over a full super. It turns every visit into a tap.
:::

## Deleting versus retiring a hive

In most cases you should change a hive's **status** rather than delete it. Setting a colony to **Lost** or **Dissolved** keeps its full history, which is valuable for year-on-year comparisons and for traceability.

Delete a hive only when it was created by mistake. Deletion is meant for genuine errors, not for colonies that have come to a natural end.
