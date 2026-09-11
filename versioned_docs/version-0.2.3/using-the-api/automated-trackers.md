---
sidebar_position: 4
title: "Automated trackers"
---

# Automated trackers & sensors

Openbeehive records **temperature and humidity — inside the hive and outside**,
plus hive weight. You can fill these in by hand during an
[inspection](/using-the-app/inspections), or let hardware do it: a hive scale, a
brood-nest temperature probe, or a humidity sensor can push readings straight
into the API on a schedule. Because the API is
[open](/using-the-api/overview), your bees can keep their own diary.

## The idea

A tracker is just a small client that, every so often, sends a reading to the
[`CreateInspection`](/using-the-api/rest) endpoint. Each reading becomes an
inspection record on the right hive, and immediately shows up in the app — on
the hive's visit log and in its **development charts**
([Inspections](/using-the-app/inspections)).

```
 sensor (DHT22 / DS18B20 / load cell)
        │  reads temp / humidity / weight
        ▼
 microcontroller or Raspberry Pi
        │  HTTP POST (JSON)
        ▼
 Openbeehive  →  InspectionService.CreateInspection  →  hive record + charts
```

## The climate fields

| JSON field | Meaning | Unit | Typical sensor |
| --- | --- | --- | --- |
| `tempHive` | Temperature inside the hive | °C | DS18B20, brood probe |
| `tempOutside` | Outside / ambient temperature | °C | DHT22, BME280 |
| `humidityHive` | Relative humidity inside the hive | % | SHT31, BME280 |
| `humidityOutside` | Outside relative humidity | % | DHT22, BME280 |
| `weight_kg` | Hive weight | kg | load-cell scale |

All are optional — send only the ones your device measures.

## A minimal tracker

Any language works; this is plain HTTP. A reading every 15–60 minutes is plenty
for brood-nest climate and scale trends.

```bash
#!/usr/bin/env bash
# Post one reading for hive h-7. Run from cron, a timer, or your device loop.
BASE="https://bees.example.com"   # your self-hosted instance
HIVE="h-7"

curl -fsS -X POST \
  "$BASE/openbeehive.v1.InspectionService/CreateInspection" \
  -H "Content-Type: application/json" \
  -d "{
        \"hiveId\": \"$HIVE\",
        \"tempHive\": $(read_sensor brood_temp),
        \"tempOutside\": $(read_sensor ambient_temp),
        \"humidityHive\": $(read_sensor brood_rh),
        \"humidityOutside\": $(read_sensor ambient_rh),
        \"weight_kg\": $(read_sensor scale),
        \"note\": \"auto\"
      }"
```

On a microcontroller (ESP32/ESP8266, MicroPython or Arduino), do the same POST
with your HTTP library after reading the sensors.

## Authentication for unattended clients

A sensor runs without a human to log in, so the friction-free setup today is a
**self-hosted, single-user instance** with no login configured — the device
posts directly to your own server on your own network. See
[Authentication](/self-hosting/authentication).

If your instance has login enabled, send `Authorization: Bearer <token>`.
First-class API tokens for devices are on the roadmap; until then keep automated
posting on a self-hosted instance you control.

## Good practice

- **One hive per device mapping.** Keep a stable `hiveId` per sensor; find it in
  the app or via `ListHives`.
- **Sensible cadence.** 15–60 min captures brood-climate and weight trends
  without flooding the log. Hourly is a good default.
- **Buffer when offline.** If the network or server is down, queue readings
  locally on the device and re-send later — the same offline-first principle the
  app uses.
- **Tag automated entries.** A `note` like `"auto"` makes machine readings easy
  to tell apart from hand-written visits.
- **Mind the units.** Temperature in °C, humidity in % (0–100), weight in kg.

## What you get

Once readings flow in, each hive's
[development charts](/using-the-app/inspections) plot temperature, humidity and
weight over time — so you can see the brood nest warm up in spring, spot a
queenless colony's failing thermoregulation, or watch the nectar flow on the
scale, all without opening a single hive.
