---
sidebar_position: 4
title: "Tracker automatici"
---

# Tracker automatici e sensori

Openbeehive registra **temperatura e umidità — dentro e fuori dall'arnia**,
oltre al peso dell'arnia. Puoi inserire questi dati a mano durante un'
[ispezione](/using-the-app/inspections), oppure lasciare che lo faccia
l'hardware: una bilancia per arnie, una sonda di temperatura del nido di covata o
un sensore di umidità possono inviare le letture direttamente nell'API secondo
una pianificazione. Poiché l'API è
[aperta](/using-the-api/overview), le tue api possono tenere il proprio diario.

## L'idea

Un tracker è semplicemente un piccolo client che, di tanto in tanto, invia una
lettura all'endpoint
[`CreateInspection`](/using-the-api/rest). Ogni lettura diventa un record di
ispezione sull'arnia corretta e appare immediatamente nell'app — nel registro
delle visite dell'arnia e nei suoi **grafici di sviluppo**
([Ispezioni](/using-the-app/inspections)).

```
 sensor (DHT22 / DS18B20 / load cell)
        │  reads temp / humidity / weight
        ▼
 microcontroller or Raspberry Pi
        │  HTTP POST (JSON)
        ▼
 Openbeehive  →  InspectionService.CreateInspection  →  hive record + charts
```

## I campi climatici

| Campo JSON | Significato | Unità | Sensore tipico |
| --- | --- | --- | --- |
| `tempHive` | Temperatura all'interno dell'arnia | °C | DS18B20, sonda di covata |
| `tempOutside` | Temperatura esterna / ambiente | °C | DHT22, BME280 |
| `humidityHive` | Umidità relativa all'interno dell'arnia | % | SHT31, BME280 |
| `humidityOutside` | Umidità relativa esterna | % | DHT22, BME280 |
| `weight_kg` | Peso dell'arnia | kg | bilancia a cella di carico |

Sono tutti opzionali — invia solo quelli che il tuo dispositivo misura.

## Un tracker minimale

Funziona qualsiasi linguaggio; si tratta di semplice HTTP. Una lettura ogni 15–60
minuti è più che sufficiente per il clima del nido di covata e per gli andamenti
della bilancia.

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

Su un microcontrollore (ESP32/ESP8266, MicroPython o Arduino), esegui lo stesso
POST con la tua libreria HTTP dopo aver letto i sensori.

## Autenticazione per client non presidiati

Un sensore funziona senza una persona che effettui il login, quindi oggi la
configurazione più semplice è un'**istanza self-hosted a utente singolo** senza
login configurato — il dispositivo invia i dati direttamente al tuo server, sulla
tua rete. Vedi
[Autenticazione](/self-hosting/authentication).

Se la tua istanza ha il login abilitato, invia `Authorization: Bearer <token>`.
Token API di prima classe per i dispositivi sono in roadmap; fino ad allora,
mantieni l'invio automatico su un'istanza self-hosted che controlli tu.

## Buone pratiche

- **Una mappatura arnia per dispositivo.** Mantieni un `hiveId` stabile per ogni
  sensore; lo trovi nell'app o tramite `ListHives`.
- **Cadenza ragionevole.** 15–60 min cattura gli andamenti del clima di covata e
  del peso senza intasare il registro. Ogni ora è un buon valore predefinito.
- **Buffer quando sei offline.** Se la rete o il server non sono raggiungibili,
  accoda le letture localmente sul dispositivo e reinviale più tardi — lo stesso
  principio offline-first che usa l'app.
- **Etichetta le voci automatiche.** Una `note` come `"auto"` rende facile
  distinguere le letture delle macchine dalle visite scritte a mano.
- **Attenzione alle unità.** Temperatura in °C, umidità in % (0–100), peso in kg.

## Cosa ottieni

Una volta che le letture iniziano a confluire, i
[grafici di sviluppo](/using-the-app/inspections) di ogni arnia tracciano
temperatura, umidità e peso nel tempo — così puoi vedere il nido di covata
scaldarsi in primavera, individuare la termoregolazione difettosa di una colonia
orfana o osservare il flusso di nettare sulla bilancia, tutto senza aprire
nemmeno un'arnia.
