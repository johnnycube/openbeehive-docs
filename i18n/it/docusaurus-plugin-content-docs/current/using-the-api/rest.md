---
sidebar_position: 2
title: "REST / HTTP + JSON"
---

# REST / HTTP + JSON

Ogni metodo di Openbeehive è richiamabile come una semplice **richiesta HTTP POST con un corpo JSON**,
grazie al [protocollo Connect](https://connectrpc.com/docs/protocol/). Se sei
in grado di inviare una richiesta POST — da curl, da uno script di shell, da un webhook, da una
funzione serverless o da un microcontrollore — puoi usare l'intera API. Non è richiesto
alcuno strumento gRPC.

## Forma della richiesta

```
POST <base-url>/openbeehive.v1.<Service>/<Method>
Content-Type: application/json
```

- Il **percorso dell'URL** è il servizio e il metodo pienamente qualificati.
- Il **corpo** è il messaggio di richiesta in formato JSON (mappatura JSON proto3: nomi dei campi
  in `lowerCamelCase`, ad es. `hiveId`, `tempHive`).
- La **risposta** è il messaggio di risposta in formato JSON, con HTTP `200` in caso di successo.

Aggiungi `Authorization: Bearer <token>` quando l'istanza ha il login abilitato (il
servizio ospitato). Un'istanza self-hosted a utente singolo non richiede autenticazione — vedi la
[panoramica](/using-the-api/overview).

## Esempio: elencare gli apiari

```bash
curl -X POST \
  https://app.openbeehive.org/openbeehive.v1.ApiaryService/ListApiaries \
  -H "Content-Type: application/json" \
  -d '{}'
```

```json
{
  "apiaries": [
    { "id": "a1c…", "name": "Orchard Meadow", "lat": 48.21, "lng": 16.37 }
  ],
  "page": { "nextPageToken": "" }
}
```

## Esempio: registrare un'ispezione (con temperatura e umidità)

Questa è la chiamata che effettua un [tracker automatico](/using-the-api/automated-trackers)
per registrare una lettura. Tutti i campi di misurazione sono opzionali — invia solo ciò che hai.

```bash
curl -X POST \
  https://app.openbeehive.org/openbeehive.v1.InspectionService/CreateInspection \
  -H "Content-Type: application/json" \
  -d '{
        "hiveId": "h-7",
        "tempHive": 34.6,
        "tempOutside": 18.2,
        "humidityHive": 55,
        "humidityOutside": 70,
        "weight_kg": 41.8,
        "note": "automated reading"
      }'
```

I campi climatici sono:

| Campo JSON | Significato | Unità |
| --- | --- | --- |
| `tempHive` | Temperatura all'interno dell'arnia | °C |
| `tempOutside` | Temperatura esterna / ambiente | °C |
| `humidityHive` | Umidità relativa all'interno dell'arnia | % |
| `humidityOutside` | Umidità relativa esterna | % |

## Paginazione

I metodi di elenco accettano un oggetto `page` e restituiscono un `nextPageToken`. Restituiscilo per
recuperare la pagina successiva:

```bash
curl -X POST .../openbeehive.v1.InspectionService/ListInspections \
  -H "Content-Type: application/json" \
  -d '{ "hiveId": "h-7", "page": { "pageToken": "<nextPageToken>" } }'
```

## Errori

Connect mappa gli errori su codici di stato HTTP con un corpo JSON:

```json
{ "code": "not_found", "message": "hive h-7 not found" }
```

Codici comuni: `invalid_argument` (400), `unauthenticated` (401),
`permission_denied` (403), `not_found` (404), `internal` (500). Vedi il
[riferimento agli errori di Connect](https://connectrpc.com/docs/protocol/#error-codes).

## Suggerimenti

- Invia `{}` per i metodi che non accettano campi — un corpo vuoto è comunque un JSON valido.
- Usa `Content-Type: application/json`; è questo header a selezionare il
  protocollo HTTP/JSON rispetto a gRPC.
- Per gli stream di lunga durata (`SyncService.Subscribe`) usa un client di streaming — vedi
  [gRPC](/using-the-api/grpc).
- Preferisci un client generato e tipizzato per qualsiasi cosa non banale — la
  [pagina gRPC](/using-the-api/grpc) mostra come generarne uno dal contratto.
