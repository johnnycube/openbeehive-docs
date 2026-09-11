---
sidebar_position: 3
title: "Data model"
---

# Data model

This page describes the core entities Openbeehive stores, how they relate, and
how **scopes** decide what syncs to whom. It is written from the offline-first
point of view: the same shape lives in the device's SQLite-WASM database and in
the server's pluggable database, and the [sync protocol](/developers/sync-protocol)
keeps them in step.

If you want the mechanics of change tracking (HLC timestamps, last-writer-wins,
OR-Sets, append-only events), read [History and events](/developers/history-and-events)
first — this page focuses on the entities themselves.

## The hierarchy

At the top sits the **Apiary** (a yard or location). Each apiary holds **Hives**;
each hive has a current **Queen** and accumulates a stream of records over time.

```text
Apiary
 ├── Hive ──────── Queen (current; queens form a succession over time)
 │     ├── Inspection   (a visit: what you saw)
 │     ├── Task         (something to do, with a due date)
 │     ├── Event        (append-only fact: requeened, split, died, moved…)
 │     ├── Harvest      (honey/wax taken off)
 │     └── Treatment    (varroa or disease treatment applied)
 │
 └── Placement (hive ↔ apiary, time-bounded — where a hive lived, and when)

ApiaryShare (apiary ↔ user — grants another beekeeper access via a scope)
```

A hive belongs to one apiary at a time, but **Placement** records the full
history of where a hive has lived, so a hive can move between yards without
losing its records.

## Entities and key fields

Every entity shares a common envelope used by sync: a stable `id` (an
offline-generated UUID), a `scope_id` (see **Scopes**),
HLC bookkeeping columns, and a soft-delete flag. The fields below are the
domain-meaningful ones.

### Apiary

The container and the unit of sharing.

| Field | Notes |
|---|---|
| `id` | UUID |
| `name` | e.g. "Home yard" |
| `location` | free-text or lat/long |
| `notes` | free-text |
| `scope_id` | equals the apiary's own `id` (see below) |

### Hive

A colony's housing within an apiary.

| Field | Notes |
|---|---|
| `id` | UUID; also encoded in the [hive QR label](/using-the-app/qr-labels) |
| `apiary_id` | current apiary (the active placement) |
| `name` / `short_code` | human label and the short code printed on the QR |
| `type` | one of Zander, Dadant, Deutsch Normal, Langstroth, Warre, Top-bar, Other — see [Hive types](/knowledge-base/hive-types) |
| `status` | e.g. active, dead, sold |
| `notes` | free-text |
| `scope_id` | the apiary id |

### Queen

The reigning queen of a hive. Queens form a **succession**: when a colony is
requeened the previous queen is closed off and a new record opens, so you keep
the full lineage.

| Field | Notes |
|---|---|
| `id` | UUID |
| `hive_id` | the hive she heads |
| `year` | introduction/birth year |
| `marking_colour` | follows the [international colour scheme](/knowledge-base/queen-marking-colours) (1/6 white, 2/7 yellow, 3/8 red, 4/9 green, 5/0 blue) |
| `origin` | bred, bought, swarm, supersedure… |
| `clipped` | wing-clipped (boolean) |
| `scope_id` | the apiary id of her hive |

### Inspection

A dated visit: the snapshot of what you observed.

| Field | Notes |
|---|---|
| `id`, `hive_id`, `date` | who and when |
| `brood`, `stores`, `temperament` | typical observations |
| `queen_seen`, `eggs_seen`, `queen_cells` | quick checks |
| `varroa_count` | mite drop / wash count if taken |
| `temp_hive`, `temp_outside` | temperature (°C) inside the hive and outside |
| `humidity_hive`, `humidity_outside` | relative humidity (%) inside the hive and outside |
| `notes` | free-text |
| `scope_id` | the apiary id |

The climate fields are plain optional scalars, so they sync per-field like any
other column and can be filled by hand or by an automated sensor — see
[Automated trackers](/using-the-api/automated-trackers).

### Task

Something to do for a hive or apiary, with a due date and a done state.

| Field | Notes |
|---|---|
| `id` | UUID |
| `hive_id` / `apiary_id` | the subject (a task may target either level) |
| `title`, `due_date`, `done` | the basics |
| `scope_id` | the apiary id |

### Event

An **append-only** fact about a hive — requeened, split, swarmed, died, moved,
fed. Events are never edited or merged; they only accumulate, which is why they
never conflict during sync. They are the backbone of the hive's timeline.

| Field | Notes |
|---|---|
| `id`, `hive_id`, `occurred_at` | when it happened |
| `kind` | the event type |
| `payload` | type-specific detail (JSON) |
| `scope_id` | the apiary id |

See [History and events](/developers/history-and-events) for the full event
catalogue and how the timeline is assembled.

### Harvest

Honey (or wax) taken off a hive.

| Field | Notes |
|---|---|
| `id`, `hive_id`, `date` | the take-off |
| `product` | honey, wax, propolis… |
| `quantity`, `unit` | e.g. 12.5 kg |
| `notes` | e.g. forage, moisture |
| `scope_id` | the apiary id |

### Treatment

A varroa or disease treatment applied to a hive.

| Field | Notes |
|---|---|
| `id`, `hive_id`, `date` | subject and application date |
| `product`, `active_ingredient` | e.g. Oxuvar / oxalic acid |
| `dose`, `method` | e.g. 50 ml, trickling |
| `batch_number` | batch / charge (often legally required) |
| `withdrawal_until` | date honey is safe to harvest again |
| `reason` | e.g. varroa |
| `note` | free-text |
| `apiary_id`, `queen_id` | frozen context at application time |
| `scope_id` | the apiary id |

:::note
Treatment and dosing rules vary by country and product approval. Openbeehive
records what you did; it does not prescribe. Always follow your local
authorisations — see [Varroa](/beekeeping/varroa).
:::

### Placement

The time-bounded link between a hive and an apiary: where a hive lived and for
how long. A new placement opens when a hive moves; the previous one closes.

| Field | Notes |
|---|---|
| `id`, `hive_id`, `apiary_id` | the link |
| `from` / `until` | interval; `until` is null while current |
| `scope_id` | the apiary id |

### ApiaryShare

Grants another beekeeper access to an apiary (and everything under it).

| Field | Notes |
|---|---|
| `id`, `apiary_id` | what is shared |
| `user_id` | who it is shared with |
| `role` | e.g. viewer, editor |

## Scopes and sync gating

Sharing happens at the **apiary** level, and a single value drives it: every
record carries a `scope_id`.

- For apiary-owned data — hives, queens, inspections, tasks, events, harvests,
  treatments, placements, and the apiary itself — `scope_id` is the **apiary's
  id**.
- For data that belongs to a single user and is never shared (e.g. personal
  preferences), `scope_id` takes the form `user:<id>`.

When two devices sync, they exchange only the scopes the user is entitled to.
The server resolves a user's scope set as:

```text
scopes(user) = { "user:<their id>" }
             ∪ { apiary.id  for each apiary they own }
             ∪ { share.apiary_id  for each ApiaryShare granting them access }
```

Adding an `ApiaryShare` therefore makes a whole apiary — every hive and every
record beneath it — appear on the recipient's devices on the next sync; revoking
it stops further changes from flowing. Because the gate is the `scope_id` column,
sharing is all-or-nothing per apiary and needs no per-record permissions.

:::tip
A hive id by itself grants nothing. Scanning a [QR label](/developers/qr-codes)
opens the app at a hive only if that hive's scope has actually synced to your
device.
:::

## Why it merges cleanly

The shapes above are chosen so that sync never needs a human to resolve a
conflict:

- **Scalar fields** (a queen's marking colour, a hive's name) use per-field
  last-writer-wins, decided by HLC timestamps.
- **List/set fields** use add-wins OR-Sets, so concurrent additions all survive.
- **Events** are append-only and immutable, so they simply accumulate.

For the full algorithm, continue to the [sync protocol](/developers/sync-protocol).
