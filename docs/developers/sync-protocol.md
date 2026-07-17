---
sidebar_position: 4
title: "Sync protocol"
---

# Sync protocol

Openbeehive is [offline-first](/using-the-app/offline-and-sync). Every read and write happens
against a local SQLite-WASM database on the device, and a background process
reconciles that local state with the server. This page documents the wire
protocol that makes reconciliation work: the Connect-RPC service, its three
methods, and the rules both sides apply when merging changes.

If you have not yet read the [sync model overview](/category/developers), start there.
This page assumes you already know that Openbeehive uses Hybrid Logical Clocks
(HLC), per-field last-writer-wins (LWW) for scalars, OR-Sets (add-wins) for list
fields, and append-only events that never conflict.

## The service

Sync is exposed as a Connect-RPC service, so every method is reachable as both
gRPC and plain HTTP/JSON. There are three methods:

| Method | Direction | Purpose |
| --- | --- | --- |
| `Pull` | client ← server | Fetch changes the client has not seen yet |
| `Push` | client → server | Send local changes to the server |
| `Subscribe` | server → client (stream) | Optional near-real-time "poke" when new changes land |

A typical client loops: `Push` its local outbox, then `Pull` everything new,
then idle until `Subscribe` pokes it (or a timer fires) and repeat.

## Cursors versus the HLC

The most important idea in this protocol is that the **sync cursor is not the
HLC**.

The HLC is a *logical timestamp* attached to every field write. It decides
*which value wins* during a merge — it answers "is this edit newer than the one I
already have?". HLCs come from many devices, can move slightly out of order
relative to wall-clock time, and are not globally monotonic in arrival order.

The cursor is a *server-assigned receive sequence* — a single, strictly
increasing integer (`seq`) that the server stamps onto every change as it is
durably accepted. It answers a completely different question: "what have I
already handed to this client?".

Using the receive sequence as the cursor gives us two guarantees the HLC cannot:

- **Total order of delivery.** Because `seq` is assigned in the order the server
  accepts writes, a client can ask for "everything after seq N" and be certain
  it misses nothing, even if those changes carry out-of-order HLCs.
- **Replay safety.** A client can persist its cursor and resume from exactly
  where it left off after going offline, crashing, or reinstalling.

:::note
Never use an HLC as a pagination cursor. Two devices can legitimately produce
the same HLC region while offline, and HLCs are not assigned in arrival order —
paging by HLC would skip or duplicate changes. Page by `seq`, merge by HLC.
:::

## Pull

`Pull` returns the changes the client has not seen, in `seq` order, plus the
cursor to use next time.

```text
Pull(PullRequest { since_cursor: int64, limit: int32 })
  -> PullResponse { changes: Change[], next_cursor: int64, has_more: bool }
```

- `since_cursor` is the last cursor the client successfully applied. Send `0`
  for a first, full sync.
- `changes` are returned ordered by ascending `seq`, restricted to scopes the
  caller may read (see **Partial replication**).
- `next_cursor` is the highest `seq` included in this page. Persist it only
  after the whole page has been applied locally.
- `has_more` is `true` when the result was truncated by `limit`; the client
  should immediately `Pull` again with the new `next_cursor`.

A single `Change` carries enough to merge it independently:

```json
{
  "entity": "hive",
  "entity_id": "01HZX...",
  "scope_id": "apiary-01HZ...",
  "kind": "field",
  "field": "name",
  "value": "Hive 3 (north row)",
  "hlc": "2026-06-19T09:14:02.117Z-0003-nodeA",
  "seq": 48213
}
```

`kind` distinguishes the three merge strategies: `field` (scalar LWW),
`set_add` / `set_remove` (OR-Set membership), and `event` (append-only).

## Push

`Push` sends a batch of local changes to the server. The server applies each one
with the same merge rules the client uses, assigns a fresh `seq` to every
accepted change, and reports back.

```text
Push(PushRequest { changes: Change[] })
  -> PushResponse { server_cursor: int64, conflicts: Conflict[] }
```

- The server validates that the caller may write each change's `scope_id`.
- For each scalar `field` change it applies per-field LWW: the incoming value
  wins only if its HLC is greater than the HLC currently stored for that field.
- Set operations are applied as OR-Set add/remove; adds win over concurrent
  removes.
- `event` changes are appended unconditionally — they never conflict.
- Every accepted change is assigned a new, strictly increasing `seq`.
- `server_cursor` is the highest `seq` assigned in this batch, so the client can
  fast-forward without an extra `Pull` round-trip for its own writes.

### Conflicts

`conflicts` is **not** an error list — the merge is always deterministic and
always succeeds. It is an informational list of fields where the server already
held a value with a higher HLC, so the client's pushed value was *not* adopted.

```json
{
  "entity_id": "01HZX...",
  "field": "queen_status",
  "rejected_hlc": "2026-06-19T09:13:55.000Z-0001-nodeB",
  "winning_hlc": "2026-06-19T09:14:10.421Z-0007-nodeA"
}
```

The client should treat a conflict as a signal to refresh that field from the
next `Pull`, where it will receive the winning value. No retry is needed.

:::tip
Because LWW is deterministic and HLC-ordered, `Push` is idempotent: re-sending a
change whose HLC has already lost (or already won) leaves server state
unchanged. Clients can safely retry a `Push` after a dropped connection.
:::

## Subscribe

`Subscribe` is an optional server-streamed channel used purely as a wake-up
signal. It does not carry data.

```text
Subscribe(SubscribeRequest { scopes: string[] })
  -> stream Poke { scope_id: string, server_cursor: int64 }
```

When a write lands in one of the client's readable scopes, the server emits a
`Poke`. The client responds by calling `Pull(since_cursor)` as usual. Keeping
the actual data on `Pull` means the stream can be lossy without affecting
correctness — a missed poke just means the next timer-driven `Pull` catches up.

:::note
`Subscribe` is a latency optimisation, not a requirement. A client that only
polls `Pull` on a timer is fully correct; it is simply less timely.
:::

## Partial replication by scope

Sharing in Openbeehive is at the **apiary** level via *scopes*. A user replicates
only the data inside the scopes they may read, not the whole database.

This is enforced on `Pull` and `Push`:

- `Pull` filters `changes` to the caller's readable scopes before paging by
  `seq`. The cursor therefore advances over a *per-caller view* of the global
  sequence — two users sharing one apiary will see that apiary's changes at the
  same `seq`, while each also sees their own private scopes.
- `Push` rejects writes to scopes the caller cannot write.

Because the cursor is the global receive sequence, a client may see gaps in the
`seq` values it receives (changes in scopes it cannot read are skipped). Gaps are
expected and harmless — the client only ever needs the *next* cursor to ask for
more.

## Mirrored merge logic

The merge functions — HLC comparison, per-field LWW, OR-Set resolution, event
append — are **identical on the client and the server**. The same logic that the
SvelteKit PWA runs when applying a `Pull` is the logic the Go backend runs when
applying a `Push`.

This mirroring is what makes the system genuinely conflict-free rather than
merely conflict-resolving:

- A change produces the same merged result regardless of *where* it is applied
  or in *what order* it arrives, so client and server converge without
  negotiation.
- The server is not a privileged arbiter that can override device state; it
  applies the same deterministic rules, then assigns a `seq` for ordering.
- New entity types only need their merge rules defined once, in shared semantics,
  and both sides honour them.

For the underlying clock and data-structure details, see the
[architecture overview](/developers/architecture) and the
[data model](/developers/data-model). For how events fit the append-only path,
see [history and events](/developers/history-and-events).
