---
sidebar_position: 5
title: "Inspections (visits)"
---

# Inspections (visits)

An inspection is the record of a single visit to a hive: what you saw, what you did, and anything worth remembering for next time. Over a season these visits build into a clear story of how each colony is developing.

Because Openbeehive is offline-first, you can record everything at the hive side with no signal. Entries are saved instantly to your device and sync to the server in the background once you are back in range. See [Offline & sync](/using-the-app/offline-and-sync) for how that works.

:::tip
For guidance on _what_ to look for during a visit and how often to inspect, read [Inspecting a colony](/beekeeping/inspecting). This page covers how to record it.
:::

## Starting an inspection

Open a hive and tap **Add inspection** (or scan the hive's [QR label](/using-the-app/qr-labels) to jump straight to it). A new visit is created and stamped with the current date and time.

Every field is optional. Record as much or as little as you like — a quick "all fine" is a perfectly valid entry.

## Date and weather

| Field | Notes |
| --- | --- |
| Date | Defaults to now; change it if you are logging a past visit. |
| Weather | The conditions at the time, e.g. sunny, overcast, windy. Useful context, since bees behave differently in poor weather. |

## Colony & behaviour

This section captures the state of the colony on the day.

| Field | What it records |
| --- | --- |
| Queen seen | Whether you actually spotted the queen. |
| Eggs seen | Eggs are the best quick sign of a recently laying queen. |
| Capped brood | Whether sealed worker brood is present. |
| Youngest larva | The youngest brood stage you found — a finer signal of recent laying. |
| Occupied frames | How many frames the bees cover. |
| Brood frames | How many frames hold brood. |
| Food stores | Your read on stores: scarce, adequate or plenty. |
| Swarm cells | Whether queen cells suggesting swarm preparation are present. |
| Gentleness | How calm the colony is overall. |
| Calmness on comb | Whether bees sit quietly on the comb or run and boil up. |
| Varroa count | Mite count from a board or wash, if you took one. |

:::note
You will rarely fill in every field on every visit. The "queen seen / eggs seen / youngest larva" trio is usually enough to confirm a healthy laying queen without finding her each time.
:::

## Activities on the visit

Record anything you did while the hive was open. These activities also feed the hive's wider records — for example, honey taken can flow into [Harvests](/using-the-app/harvests).

| Activity | Records |
| --- | --- |
| Fed | Amount fed, in kg. |
| Frames added / removed | Frames you put in or took out. |
| Drone frame cut | Whether you cut out a drone brood frame (a varroa control measure). |
| Super added | Whether you added a super for honey storage. |
| Hive weight | The weighed weight of the hive, if you track it. |
| Honey harvested | Honey taken on this visit. |

For the bigger picture on mite management and harvesting, see [Varroa](/beekeeping/varroa) and [Honey harvest](/beekeeping/honey-harvest).

## Climate: temperature & humidity

Each inspection can record temperature and relative humidity, both **inside the
hive** and **outside** — useful for tracking brood-nest warmth, ventilation and
overwintering.

| Field | Records | Unit |
| --- | --- | --- |
| Hive temperature | Temperature inside the hive | °C |
| Outside temperature | Ambient temperature at the apiary | °C |
| Hive humidity | Relative humidity inside the hive | % |
| Outside humidity | Outside relative humidity | % |

All four are optional — fill in what you measured. Over time they appear in the
hive's **development charts** alongside weight and colony strength.

:::tip Let sensors do it
You don't have to type these in. A hive scale or temperature/humidity probe can
post readings automatically through the API — see
[Automated trackers](/using-the-api/automated-trackers).
:::

## Notes and photos

Add free-text **notes** for anything the structured fields do not cover — a marked supersedure cell, a temper that needs watching, a reminder to requeen.

Attach **photos** to capture brood patterns, suspect disease, or queen cells. Images are stored with the visit and sync along with the rest of your records.

:::tip
If something needs following up, create a [Task](/using-the-app/tasks) from the visit so it does not get lost.
:::

## The visit log per hive

Every inspection is kept, never overwritten. On the hive page you get a chronological **visit log** — the full history of that colony, newest first.

This log lets you spot trends at a glance: brood building up in spring, stores running down before winter, a rising varroa count, or a temper problem developing. Because each visit is an append-only event, syncing across devices never loses or conflicts a record.

## Tips for fast field entry

Inspections happen with gloves on, in bright sun, with bees in the air. A few habits keep entry quick:

- **Scan the QR label** to open the right hive instantly — no scrolling through a list.
- **Log as you go.** Tap fields between frames rather than trying to remember everything afterwards.
- **Lean on the quick trio.** Eggs seen, youngest larva and capped brood confirm a laying queen faster than hunting her down.
- **Use voice or short notes.** Drop a brief note now; tidy it up later from the comfort of home.
- **Don't fret over blanks.** Empty fields are fine. Record only what you checked.
- **Photograph the doubtful.** A picture of an odd brood pattern or a queen cell is worth more than a typed description.

:::caution
If you suspect a notifiable disease such as American or European foulbrood, photograph it, close up, and follow your local reporting rules. Reporting obligations vary by country and region. See [Diseases & pests](/knowledge-base/diseases-and-pests).
:::

---

See also: [Inspecting a colony](/beekeeping/inspecting) for field technique, and [Hives](/using-the-app/hives) for where the visit log lives.
