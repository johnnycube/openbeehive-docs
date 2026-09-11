---
sidebar_position: 4
title: "Capteurs automatisés"
---

# Capteurs automatisés et trackers

Openbeehive enregistre la **température et l'humidité — à l'intérieur de la ruche
et à l'extérieur**, ainsi que le poids de la ruche. Vous pouvez saisir ces
valeurs à la main lors d'une
[inspection](/using-the-app/inspections), ou laisser le matériel s'en charger :
une balance de ruche, une sonde de température du couvain ou un capteur
d'humidité peuvent transmettre les relevés directement à l'API selon un
calendrier. Comme l'API est
[ouverte](/using-the-api/overview), vos abeilles peuvent tenir leur propre
journal.

## Le principe

Un tracker n'est qu'un petit client qui, de temps en temps, envoie un relevé au
point d'accès [`CreateInspection`](/using-the-api/rest). Chaque relevé devient un
enregistrement d'inspection sur la bonne ruche, et apparaît immédiatement dans
l'application — dans le journal des visites de la ruche et dans ses **graphiques
de développement** ([Inspections](/using-the-app/inspections)).

```
 sensor (DHT22 / DS18B20 / load cell)
        │  reads temp / humidity / weight
        ▼
 microcontroller or Raspberry Pi
        │  HTTP POST (JSON)
        ▼
 Openbeehive  →  InspectionService.CreateInspection  →  hive record + charts
```

## Les champs climatiques

| Champ JSON | Signification | Unité | Capteur typique |
| --- | --- | --- | --- |
| `tempHive` | Température à l'intérieur de la ruche | °C | DS18B20, sonde de couvain |
| `tempOutside` | Température extérieure / ambiante | °C | DHT22, BME280 |
| `humidityHive` | Humidité relative à l'intérieur de la ruche | % | SHT31, BME280 |
| `humidityOutside` | Humidité relative extérieure | % | DHT22, BME280 |
| `weight_kg` | Poids de la ruche | kg | balance à cellule de charge |

Tous sont optionnels — envoyez uniquement ceux que votre appareil mesure.

## Un tracker minimal

N'importe quel langage convient ; il s'agit de simple HTTP. Un relevé toutes les
15 à 60 minutes suffit amplement pour le climat du couvain et les tendances de la
balance.

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

Sur un microcontrôleur (ESP32/ESP8266, MicroPython ou Arduino), effectuez la même
requête POST avec votre bibliothèque HTTP après avoir lu les capteurs.

## Authentification pour les clients autonomes

Un capteur fonctionne sans humain pour se connecter ; la configuration la plus
simple aujourd'hui est donc une **instance auto-hébergée mono-utilisateur** sans
authentification configurée — l'appareil publie directement sur votre propre
serveur, sur votre propre réseau. Voir
[Authentification](/self-hosting/authentication).

Si l'authentification est activée sur votre instance, envoyez
`Authorization: Bearer <token>`. Des jetons d'API de premier ordre pour les
appareils sont prévus dans la feuille de route ; en attendant, conservez la
publication automatisée sur une instance auto-hébergée que vous contrôlez.

## Bonnes pratiques

- **Une ruche par appareil.** Conservez un `hiveId` stable par capteur ;
  retrouvez-le dans l'application ou via `ListHives`.
- **Une cadence raisonnable.** 15 à 60 min capturent les tendances du climat du
  couvain et du poids sans saturer le journal. Une fois par heure est une bonne
  valeur par défaut.
- **Mettez en mémoire tampon hors ligne.** Si le réseau ou le serveur est
  indisponible, mettez les relevés en file d'attente localement sur l'appareil et
  renvoyez-les plus tard — le même principe « offline-first » qu'utilise
  l'application.
- **Étiquetez les entrées automatisées.** Une `note` telle que `"auto"` permet de
  distinguer facilement les relevés machine des visites saisies à la main.
- **Attention aux unités.** Température en °C, humidité en % (0–100), poids en kg.

## Ce que vous obtenez

Une fois les relevés arrivés, les
[graphiques de développement](/using-the-app/inspections) de chaque ruche tracent
la température, l'humidité et le poids dans le temps — vous pouvez ainsi voir le
nid à couvain se réchauffer au printemps, repérer la thermorégulation défaillante
d'une colonie orpheline, ou suivre la miellée sur la balance, le tout sans ouvrir
une seule ruche.
