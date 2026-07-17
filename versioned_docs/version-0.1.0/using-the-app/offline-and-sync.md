---
sidebar_position: 10
title: "Offline & sync"
---

# Offline & sync

Openbeehive is built for the apiary, not the office. Out in the field you rarely
have a reliable signal, so the app is **offline-first**: everything you do is
saved on your device straight away and synced to the server later, quietly, in
the background.

In practice this means the app never makes you wait for the network. Open a hive,
record an inspection, add a task, snap a note about the queen, all of it is
instant, signal or no signal.

## Everything is saved locally

When you install Openbeehive it keeps a complete copy of your records in a small
database on your device. Every read and every write happens against that local
copy first.

The upshot:

- **It is fast.** Opening a hive or scrolling inspections never spins on a
  loading bar.
- **It works with no signal.** A wood, a valley, a cellar full of supers,
  it makes no difference.
- **Your data is yours.** The records live on your device; the server is a
  copy for syncing and sharing, not the only home for your data.

:::tip
Because records are stored on the device, it is worth installing Openbeehive as
an app rather than using it in a browser tab. See
[Install Openbeehive](/using-the-app/install) for how to add it to your phone,
tablet or desktop.
:::

## The offline banner

When the app cannot reach the server, a small banner appears to let you know you
are working offline. This is purely informational, you can carry on exactly as
before. Keep recording inspections, ticking off tasks, logging a harvest; nothing
is blocked.

The moment your device is back online, the banner clears and any changes you made
while offline are sent up automatically. There is no "sync now" button to
remember and no risk of forgetting to save.

:::note
A persistent offline banner usually just means weak coverage out at the apiary.
If it stays up even on a good connection at home, have a look at
[Troubleshooting](/knowledge-base/troubleshooting).
:::

## Syncing across your devices

You can use Openbeehive on several devices, say a phone in the field and a
laptop at home, and they will stay in step automatically.

Each device keeps its own local copy and exchanges changes with the server in the
background. Record an inspection on your phone at the hives, and by the time you
sit down at your laptop it is already there. Edits flow both ways.

You do not have to choose a "main" device or copy anything across by hand. As
long as each device signs in to the same account, they all see the same records.

## What happens when two devices change the same thing

This is the question every beekeeper asks, and the reassuring answer is: you do
not have to think about it. Openbeehive resolves overlapping changes
**automatically**, with no "which version do you want to keep?" prompts and no
lost work.

A few examples of how it behaves:

- **You edit a hive's notes on your phone, your co-beekeeper edits the same
  notes on theirs.** The most recent edit to that field wins; the other is
  superseded cleanly.
- **You both add tasks, or both tag the hive, while offline.** Additions to
  lists are kept, so nobody's task or tag gets dropped.
- **You each log a separate inspection.** Inspections, events and similar
  records are only ever added, never overwritten, so both are kept side by side.

The result is that every device converges on the same, sensible state once they
have all synced, and you never get a corrupted or half-merged record.

:::tip
The short version: **add freely, edit confidently, never worry about losing
data.** If you are curious how this actually works under the bonnet, the
[sync protocol](/developers/sync-protocol) and
[architecture](/developers/architecture) pages explain it in detail.
:::

## Sharing an apiary

Openbeehive shares records at the **apiary** level. When you share an apiary,
everything inside it, its hives, queens, inspections, tasks, events, harvests and
treatments, is shared along with it. This keeps things simple: you grant access
to a yard, not to dozens of individual hives.

Each person you share with is given a role:

| Role | What they can do |
| --- | --- |
| **Viewer** | See the apiary and all its records. Cannot make changes. |
| **Beekeeper** | View and edit: record inspections, complete tasks, log harvests and treatments, update hives and queens. |
| **Owner** | Everything a beekeeper can do, plus manage the apiary itself and who it is shared with. |

This works well for an association teaching apiary, a mentor keeping an eye on a
new beekeeper's hives, or simply two people sharing the work in the same yard.
Shared records sync and resolve conflicts in exactly the same way as your own, so
a partner's changes appear on your devices automatically.

:::note
Sharing is per apiary, so you can share one yard with a mentor while keeping
others entirely private.
:::

## Will I ever lose data?

No. Your records are written to your device first and are not removed simply
because you are offline or because the app closes. They wait safely on the
device until they can be synced, then sync on their own.

For extra peace of mind, particularly if you self-host, it is still good
practice to keep server backups. See [Backups](/self-hosting/backups) for how.

## Related pages

- [Install Openbeehive](/using-the-app/install)
- [QR labels](/using-the-app/qr-labels)
- [Architecture](/developers/architecture)
- [Sync protocol](/developers/sync-protocol)
