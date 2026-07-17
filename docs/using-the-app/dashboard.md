---
sidebar_position: 1
title: "The dashboard"
---

# The dashboard

The dashboard is your home base in Openbeehive. It's the first screen you see when you open the app, and it's designed to answer a simple question: what needs my attention today?

Because Openbeehive is offline-first, everything on the dashboard is read straight from the local database on your device. It loads instantly and works whether or not you have a signal in the apiary. Changes you make sync back to the server quietly in the background.

## Stat tiles

Across the top of the dashboard you'll find a row of stat tiles giving you a quick count of what's in your records:

| Tile | What it shows |
| --- | --- |
| **Apiaries** | The number of apiaries you keep, including any shared with you. |
| **Hives** | Total hives across all your apiaries. |
| **Queens** | Queens currently recorded as heading a colony. |
| **Open tasks** | Tasks that are not yet marked done. |

Each tile is tappable and takes you to the matching section of the app, so you can jump straight from a count to the detail behind it.

## What needs doing

Below the tiles, the dashboard groups together the things that are time-sensitive.

### Due inspections

Lists hives whose next inspection is due or overdue, based on the interval you set when inspecting. This is your prompt to plan a visit. Tap a hive to open it and start a new inspection.

### Upcoming tasks

Shows tasks with a due date coming up, soonest first. Tasks can be tied to a specific hive or apiary, or stand on their own (for example, "order new frames"). Tick one off here without leaving the dashboard.

### Recent inspections

A short feed of your most recent visits, so you can see at a glance what you last found in each colony. Tap any entry to read the full inspection notes.

### Honey this season

A running total of the honey you've harvested in the current season, drawn from your harvest records. It's a quick, satisfying way to track how the year is going.

:::tip
The dashboard reflects only what's in your records. The more consistently you log inspections, tasks and harvests, the more useful these summaries become.
:::

## Finding your way around

How you navigate depends on the size of your screen. The same features are available either way; only the layout changes.

### On mobile

A **bottom tab bar** gives you one-tap access to the core areas of the app: the dashboard, your apiaries and hives, tasks, and so on. It stays fixed at the bottom of the screen so it's always within thumb's reach while you're working at the hive.

### On desktop and tablet

A **sidebar** runs down the left-hand side with the same set of destinations, plus a little more room to show labels and nested items. On wider screens this leaves the main area free for your records.

## Account and settings

Your account and settings live together in one place, reachable from the navigation. Here you can manage your profile, sign out, and reach app-wide preferences such as language and (if your server uses them) passkeys and connected sign-in providers.

If you run a single-user self-hosted instance with no login configured, the account block simply shows your local profile.

## The online/offline indicator

A small indicator shows your current connection and sync state.

- **Online** means the app is connected and syncing changes with the server.
- **Offline** means there's no connection right now. This is completely normal and nothing to worry about: you can keep adding inspections, tasks and everything else exactly as usual.

When you come back into range, Openbeehive syncs automatically. Thanks to its conflict-free design, edits made on different devices while offline are merged cleanly when they meet again.

:::note
Seeing "offline" does **not** mean you'll lose data. Everything is saved locally first. The indicator is just telling you when the background sync is paused. For more on how this works, see [Offline and sync](/using-the-app/offline-and-sync).
:::

## Changing the language

Openbeehive is available in several languages. To switch:

1. Open **Settings**.
2. Find the **Language** option.
3. Choose your preferred language.

The available languages are:

| Code | Language |
| --- | --- |
| `en` | English |
| `de` | German (Deutsch) |
| `fr` | French (Français) |
| `es` | Spanish (Español) |
| `it` | Italian (Italiano) |

The change takes effect immediately and is remembered on your device.

## Where to next

From the dashboard you can branch out into the rest of the app:

- Set up your [apiaries](/using-the-app/apiaries) and [hives](/using-the-app/hives).
- Record a visit in [inspections](/using-the-app/inspections).
- Keep on top of jobs with [tasks](/using-the-app/tasks).
- Log your crop in [harvests](/using-the-app/harvests).

For a broader tour of everything the app can do, head to the [Using the app](/category/using-the-app) overview.
