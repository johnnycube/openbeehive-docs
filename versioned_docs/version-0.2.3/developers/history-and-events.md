---
sidebar_position: 2
title: "History & events"
---

# History & events

Openbeehive treats your beekeeping records as a story that unfolds over time. A
hive is moved between apiaries, a queen reigns and is later replaced, a harvest
is recorded on a particular day. To make this history accurate and useful, the
data model keeps two things straight: what happened, and the situation that was
true when it happened.

This page explains how events freeze their context, how interval histories
record reigns and placements, how typed detail records hang off events, and how
the client writes and queries all of it offline.

## Events freeze their context

An event is an append-only fact: it records that something occurred at a moment
in time. Crucially, each event stores a snapshot of the relevant context as it
was at event time, rather than only a pointer to the current state.

When an event is written, the client resolves and stores:

- the apiary the hive belonged to,
- the hive itself,
- the queen reigning in that hive on that date.

This snapshot is denormalised onto the event row. The benefit is that history
stays truthful even after the world changes. If you move a hive to a new apiary
next month, last week's inspection still reads as having happened in the apiary
where it actually took place. If you requeen, an old harvest still attributes
honey to the queen who was in charge at the time.

:::note
Because events are append-only and carry their own context, they never conflict
during sync. Two devices can each add events offline and both sets are kept.
See the [sync protocol](/developers/sync-protocol) for the conflict-free rules.
:::

## The event table is also a fact table

The same event rows double as a fact table for statistics. Numeric measures live
directly on the event, most importantly `amount_kg` for harvests, alongside the
frozen dimensions (apiary, hive, queen, date, `scope_id`, event type).

This means common reports are a single grouped query over one table, with no
joins required to attribute a number to the apiary, hive or queen that produced
it. The frozen context is what makes "honey per apiary in 2025" or "yield by
queen" correct by construction.

## Interval histories

Some facts are best expressed as intervals rather than points. Openbeehive uses
half-open intervals, written `[start, end)`: the start is included, the end is
excluded. This makes intervals tile cleanly without overlap or gaps when one
period ends exactly as the next begins.

| History | Interval | Meaning |
| --- | --- | --- |
| Queen reign | `[installed, replaced)` | The queen heads the colony from her install date up to, but not including, the date she is replaced. |
| Hive placement | `[from, to)` | The hive sits in a given apiary from `from` up to, but not including, `to`. |

A current reign or placement has an open end (no `replaced` / `to` yet). When a
queen is replaced, the outgoing queen's interval is closed at the new queen's
install date, and the new reign opens there. Hive moves work the same way.

:::tip
Half-open intervals make "who reigned on date D?" a simple test: find the row
where `installed <= D` and (`replaced` is null or `replaced > D`). Exactly one
row matches, even on a changeover day.
:::

## Typed detail records

Events come in several types, and the type-specific details live in their own
records linked to the event:

- **Inspection** detail: observations from a visit (brood, stores, temperament,
  queen seen, and so on).
- **Harvest** detail: what was taken, including the `amount_kg` measure used for
  stats.
- **Treatment** detail: the product applied, dose and timing for a varroa or
  disease treatment.

Keeping the shared event fields (date, frozen context, `scope_id`) in one place
and the type-specific fields in typed records keeps the fact table clean while
still allowing rich, type-aware forms and screens. The shapes of these records
are described in the [data model](/developers/data-model).

## resolveContext for back-dated entries

Beekeepers do not always record things the moment they happen. You might enter
last Saturday's inspection on Monday evening. So the context must be resolved for
the event's own date, not for "now".

The client uses a helper, conceptually:

```text
resolveContext(hiveId, date) -> { apiaryId, hiveId, queenId, scopeId }
```

It looks up the hive, then consults the interval histories to find the apiary
placement and the queen reign that cover `date`, and reads the hive's
`scope_id`. The result is frozen onto the event.

```sql
-- Find the queen reigning in a hive on a given date.
SELECT id
FROM queens
WHERE hive_id = :hiveId
  AND installed <= :date
  AND (replaced IS NULL OR replaced > :date)
LIMIT 1;
```

```sql
-- Find the apiary the hive was placed in on a given date.
SELECT apiary_id
FROM hive_placements
WHERE hive_id = :hiveId
  AND from_date <= :date
  AND (to_date IS NULL OR to_date > :date)
LIMIT 1;
```

:::caution
Always resolve context against the event date. Using the hive's current apiary or
current queen would silently misattribute back-dated entries and corrupt your
statistics.
:::

## Which client functions write history

Three kinds of write touch history, and it helps to keep them distinct:

1. **Adding an event.** Inspection, harvest, treatment and other event writers
   call `resolveContext(hiveId, date)` first, then append the event with its
   frozen context (and `amount_kg` where applicable) plus the typed detail
   record.
2. **Replacing a queen.** Closes the current reign at the new install date and
   opens a new `[installed, replaced)` interval. Existing events keep their
   original frozen queen.
3. **Moving a hive.** Closes the current placement at the move date and opens a
   new `[from, to)` interval in the destination apiary. Existing events keep
   their original frozen apiary.

Reigns and placements are interval rows whose scalar fields (the closing date)
follow per-field last-writer-wins; events are append-only and immutable once
written. New corrections are made by adding further events, not editing old ones.

## Stats queries

Because measures and dimensions are frozen on the event, reports group directly:

```sql
-- Total honey per apiary for a season.
SELECT apiary_id, SUM(amount_kg) AS total_kg
FROM events
WHERE type = 'harvest'
  AND date >= '2025-01-01' AND date < '2026-01-01'
GROUP BY apiary_id;
```

```sql
-- Yield attributed to each queen.
SELECT queen_id, SUM(amount_kg) AS total_kg
FROM events
WHERE type = 'harvest'
GROUP BY queen_id;
```

No joins to current state are needed: the frozen `apiary_id` and `queen_id` are
already the correct ones for the moment of harvest.

## Offline and sharing via scope_id

Every event and history row carries the `scope_id` of its apiary. Scopes are the
unit of sharing in Openbeehive: granting someone access to an apiary shares all
the events and histories under that scope.

Because writes are local and instant, history is written into the on-device
SQLite database first and synced in the background. The frozen context means a
back-dated entry made offline carries the right apiary, hive and queen even if
the device has not seen recent changes from elsewhere; append-only events merge
without conflict when the device reconnects.

See [offline & sync](/using-the-app/offline-and-sync) for the user-facing
behaviour and [Developers](/category/developers) for the wider architecture.
