---
sidebar_position: 4
title: "Automatisierte Tracker"
---

# Automatisierte Tracker & Sensoren

Openbeehive erfasst **Temperatur und Luftfeuchtigkeit — innerhalb und außerhalb
des Stocks**, dazu das Stockgewicht. Du kannst diese Werte während einer
[Durchsicht](/using-the-app/inspections) von Hand eintragen oder die Hardware
übernehmen lassen: eine Stockwaage, eine Brutnest-Temperatursonde oder ein
Feuchtesensor können Messwerte planmäßig direkt in die API schieben. Da die API
[offen](/using-the-api/overview) ist, können deine Bienen ihr eigenes Tagebuch
führen.

## Die Idee

Ein Tracker ist einfach ein kleiner Client, der in regelmäßigen Abständen einen
Messwert an den [`CreateInspection`](/using-the-api/rest)-Endpunkt sendet. Jeder
Messwert wird zu einem Durchsichts-Datensatz am richtigen Stock und erscheint
sofort in der App — im Besuchsprotokoll des Stocks und in seinen
**Entwicklungsdiagrammen** ([Durchsichten](/using-the-app/inspections)).

```
 sensor (DHT22 / DS18B20 / load cell)
        │  reads temp / humidity / weight
        ▼
 microcontroller or Raspberry Pi
        │  HTTP POST (JSON)
        ▼
 Openbeehive  →  InspectionService.CreateInspection  →  hive record + charts
```

## Die Klimafelder

| JSON-Feld | Bedeutung | Einheit | Typischer Sensor |
| --- | --- | --- | --- |
| `tempHive` | Temperatur innerhalb des Stocks | °C | DS18B20, Brutsonde |
| `tempOutside` | Außen- / Umgebungstemperatur | °C | DHT22, BME280 |
| `humidityHive` | Relative Luftfeuchtigkeit im Stock | % | SHT31, BME280 |
| `humidityOutside` | Relative Luftfeuchtigkeit außen | % | DHT22, BME280 |
| `weight_kg` | Stockgewicht | kg | Wägezellen-Waage |

Alle sind optional — sende nur die, die dein Gerät misst.

## Ein minimaler Tracker

Jede Sprache funktioniert; das ist reines HTTP. Ein Messwert alle 15–60 Minuten
reicht für Brutnestklima und Waagentrends völlig aus.

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

Auf einem Mikrocontroller (ESP32/ESP8266, MicroPython oder Arduino) führst du
denselben POST mit deiner HTTP-Bibliothek aus, nachdem du die Sensoren
ausgelesen hast.

## Authentifizierung für unbeaufsichtigte Clients

Ein Sensor läuft ohne einen Menschen, der sich anmelden könnte, daher ist das
reibungsloseste Setup heute eine **selbst gehostete Einzelnutzer-Instanz** ohne
konfigurierte Anmeldung — das Gerät postet direkt an deinen eigenen Server in
deinem eigenen Netzwerk. Siehe
[Authentifizierung](/self-hosting/authentication).

Wenn bei deiner Instanz die Anmeldung aktiviert ist, sende
`Authorization: Bearer <token>`. Erstklassige API-Tokens für Geräte stehen auf
der Roadmap; bis dahin halte das automatisierte Posten auf einer selbst
gehosteten Instanz, die du kontrollierst.

## Gute Praxis

- **Eine Zuordnung von Stock zu Gerät.** Halte pro Sensor eine stabile `hiveId`;
  finde sie in der App oder über `ListHives`.
- **Sinnvolle Taktung.** 15–60 Min. erfassen Brutklima- und Gewichtstrends, ohne
  das Protokoll zu überfluten. Stündlich ist ein guter Standard.
- **Puffern bei Offline-Betrieb.** Wenn das Netzwerk oder der Server ausfällt,
  stelle die Messwerte lokal auf dem Gerät in eine Warteschlange und sende sie
  später erneut — dasselbe Offline-first-Prinzip, das auch die App verwendet.
- **Automatisierte Einträge kennzeichnen.** Eine `note` wie `"auto"` macht es
  leicht, maschinelle Messwerte von handgeschriebenen Besuchen zu unterscheiden.
- **Auf die Einheiten achten.** Temperatur in °C, Luftfeuchtigkeit in % (0–100),
  Gewicht in kg.

## Was du bekommst

Sobald Messwerte einlaufen, stellen die
[Entwicklungsdiagramme](/using-the-app/inspections) jedes Stocks Temperatur,
Luftfeuchtigkeit und Gewicht über die Zeit dar — so kannst du sehen, wie sich
das Brutnest im Frühjahr aufwärmt, die versagende Thermoregulation eines
weisellosen Volkes erkennen oder die Nektartracht auf der Waage beobachten, ganz
ohne einen einzigen Stock zu öffnen.
