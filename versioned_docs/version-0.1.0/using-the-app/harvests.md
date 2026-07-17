---
sidebar_position: 7
title: "Harvests & honey"
---

# Harvests & honey

Bringing in the honey is the moment the whole season pays off. Openbeehive lets you record each harvest in seconds, so that come winter you can see exactly which hives, which apiaries and which queens earned their keep.

A harvest is an **event**: an append-only record of something that happened on a given day. Once saved, it sits permanently in the hive's history and feeds straight into your season statistics.

## Recording a harvest

Open the hive you took honey from and add a new harvest. You can record as little or as much as you like, but the more you capture now, the more useful your figures will be later.

| Field | What it means |
| --- | --- |
| **Amount (kg)** | The net weight of honey taken from this hive, in kilograms. |
| **Variety** | The type or forage source, e.g. spring blossom, summer blossom, forest (honeydew), oilseed rape, heather. |
| **Water content (%)** | The moisture reading from your refractometer. |
| **Batch number** | Your own label for the jarring batch, used to trace jars back to source. |
| **Best-before** | The date you intend to print on the jars. |
| **Date** | When the honey was harvested. Defaults to today; change it if you are entering records after the fact. |

You can log more than one harvest per hive per year, for example a spring crop and a summer crop, and each is counted separately.

:::tip Water content matters
Honey should generally be below about 18% water before it is sold or stored long-term; above roughly 20% it risks fermenting. Recording the refractometer reading here means you can spot a damp batch before it spoils. Thresholds and labelling rules vary by country, so check your local food and trading-standards requirements.
:::

## How harvests feed your statistics

Every harvest you record rolls up into Openbeehive's season figures, so you never have to add up jars by hand.

- **Per-hive yield** — the total taken from a single hive across the year, and over its lifetime.
- **Per-queen yield** — honey is attributed to the queen heading the colony at the time of harvest, making it easy to compare your breeding stock.
- **Per-apiary yield** — the combined crop from a whole site, useful when deciding which locations are worth keeping.
- **Per-year totals** — your overall harvest for the season, for your own records or for any reporting you need to do.

Because these figures are built from the individual harvest events, they update the instant you save a record. There is nothing to recalculate.

## The event freezes its context

This is the important part to understand. A harvest is stored together with a **snapshot of its context at the time it happened**: which hive, which apiary and which queen the honey came from on that date.

That snapshot is permanent. If you later requeen the colony, move the hive to another apiary, or retire the hive entirely, the old harvest stays correctly attributed to the queen, apiary and hive that produced it.

:::note Why this matters
Imagine a colony heads into summer under Queen A, gives you 18 kg, and is then requeened with Queen B for a late flow that yields a further 12 kg. Both harvests live on the hive, but the 18 kg stays credited to Queen A and the 12 kg to Queen B. Your per-queen comparison reflects what each queen actually achieved, not just who happens to be in the box today.
:::

This freezing behaviour is the same for all events in Openbeehive, and it is what makes long-term, year-on-year comparisons trustworthy.

## Working offline

Like everything else in the app, harvests are saved straight to the device and work with no signal at all. Record the crop at the apiary, on the spot, and it syncs to the server in the background once you are back in range. See [Offline & sync](/using-the-app/offline-and-sync) for how this works.

Because each harvest is an append-only event, two people recording crops on the same shared apiary will never overwrite each other's entries.

## Editing and correcting

You can correct the details of a harvest, for example a mistyped weight or water reading, and the change syncs like any other edit. Deleting a harvest removes it from your totals, so only do so for genuine mistakes rather than to "tidy up" past seasons.

## Where to go next

- For the practical side of taking off and processing honey, including timing, extracting and storage, see the beekeeping guide on [Honey harvest](/beekeeping/honey-harvest).
- To label your jars back to a specific hive, see [QR labels](/using-the-app/qr-labels).
- To review your colonies and their performance, head back to the [Dashboard](/using-the-app/dashboard).
