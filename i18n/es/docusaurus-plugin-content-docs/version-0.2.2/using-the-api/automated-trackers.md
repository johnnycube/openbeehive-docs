---
sidebar_position: 4
title: "Rastreadores automatizados"
---

# Rastreadores y sensores automatizados

Openbeehive registra la **temperatura y la humedad — dentro y fuera de la
colmena**, además del peso de la colmena. Puedes rellenar estos datos a mano
durante una [inspección](/using-the-app/inspections), o dejar que lo haga el
hardware: una báscula de colmena, una sonda de temperatura del nido de cría o un
sensor de humedad pueden enviar las lecturas directamente a la API de forma
programada. Como la API es [abierta](/using-the-api/overview), tus abejas pueden
llevar su propio diario.

## La idea

Un rastreador no es más que un pequeño cliente que, cada cierto tiempo, envía una
lectura al endpoint [`CreateInspection`](/using-the-api/rest). Cada lectura se
convierte en un registro de inspección en la colmena correspondiente, y aparece
de inmediato en la aplicación — en el registro de visitas de la colmena y en sus
**gráficos de desarrollo** ([Inspecciones](/using-the-app/inspections)).

```
 sensor (DHT22 / DS18B20 / load cell)
        │  reads temp / humidity / weight
        ▼
 microcontroller or Raspberry Pi
        │  HTTP POST (JSON)
        ▼
 Openbeehive  →  InspectionService.CreateInspection  →  hive record + charts
```

## Los campos climáticos

| Campo JSON | Significado | Unidad | Sensor típico |
| --- | --- | --- | --- |
| `tempHive` | Temperatura dentro de la colmena | °C | DS18B20, sonda de cría |
| `tempOutside` | Temperatura exterior / ambiente | °C | DHT22, BME280 |
| `humidityHive` | Humedad relativa dentro de la colmena | % | SHT31, BME280 |
| `humidityOutside` | Humedad relativa exterior | % | DHT22, BME280 |
| `weight_kg` | Peso de la colmena | kg | báscula con celda de carga |

Todos son opcionales — envía solo los que mida tu dispositivo.

## Un rastreador mínimo

Cualquier lenguaje sirve; esto es HTTP puro. Una lectura cada 15–60 minutos es
más que suficiente para el clima del nido de cría y las tendencias de la báscula.

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

En un microcontrolador (ESP32/ESP8266, MicroPython o Arduino), haz el mismo POST
con tu biblioteca HTTP después de leer los sensores.

## Autenticación para clientes desatendidos

Un sensor funciona sin que haya una persona que inicie sesión, así que la
configuración sin fricciones hoy en día es una **instancia autoalojada de un
solo usuario** sin inicio de sesión configurado — el dispositivo publica
directamente en tu propio servidor, en tu propia red. Consulta
[Autenticación](/self-hosting/authentication).

Si tu instancia tiene el inicio de sesión habilitado, envía
`Authorization: Bearer <token>`. Los tokens de API de primera clase para
dispositivos están en la hoja de ruta; hasta entonces, mantén la publicación
automatizada en una instancia autoalojada que controles.

## Buenas prácticas

- **Una asignación de colmena por dispositivo.** Mantén un `hiveId` estable por
  sensor; encuéntralo en la aplicación o mediante `ListHives`.
- **Cadencia razonable.** De 15 a 60 min captura las tendencias del clima de
  cría y del peso sin saturar el registro. Cada hora es un valor predeterminado
  acertado.
- **Almacena en búfer cuando estés sin conexión.** Si la red o el servidor están
  caídos, encola las lecturas localmente en el dispositivo y reenvíalas más
  tarde — el mismo principio offline-first que usa la aplicación.
- **Etiqueta las entradas automatizadas.** Una `note` como `"auto"` facilita
  distinguir las lecturas de máquina de las visitas escritas a mano.
- **Cuida las unidades.** Temperatura en °C, humedad en % (0–100), peso en kg.

## Lo que obtienes

Una vez que las lecturas comienzan a fluir, los
[gráficos de desarrollo](/using-the-app/inspections) de cada colmena trazan la
temperatura, la humedad y el peso a lo largo del tiempo — para que puedas ver
cómo se calienta el nido de cría en primavera, detectar la termorregulación
deficiente de una colonia sin reina o seguir la entrada de néctar en la báscula,
todo sin abrir una sola colmena.
