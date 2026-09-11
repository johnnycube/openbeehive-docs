---
sidebar_position: 2
title: "REST / HTTP + JSON"
---

# REST / HTTP + JSON

Dank des [Connect-Protokolls](https://connectrpc.com/docs/protocol/) lässt sich
jede Openbeehive-Methode als einfacher **HTTP-POST mit JSON-Body** aufrufen. Wenn
du eine POST-Anfrage senden kannst — von curl, einem Shell-Skript, einem Webhook,
einer Serverless-Funktion oder einem Mikrocontroller —, kannst du die gesamte API
nutzen. Es ist kein gRPC-Werkzeug erforderlich.

## Aufbau der Anfrage

```
POST <base-url>/openbeehive.v1.<Service>/<Method>
Content-Type: application/json
```

- Der **URL-Pfad** ist der voll qualifizierte Service und die Methode.
- Der **Body** ist die Anfragenachricht als JSON (proto3-JSON-Mapping: Feldnamen
  in `lowerCamelCase`, z. B. `hiveId`, `tempHive`).
- Die **Antwort** ist die Antwortnachricht als JSON, bei Erfolg mit HTTP `200`.

Füge `Authorization: Bearer <token>` hinzu, wenn bei der Instanz die Anmeldung
aktiviert ist (der gehostete Dienst). Eine selbst gehostete Einzelnutzer-Instanz
benötigt keine Authentifizierung — siehe die [Übersicht](/using-the-api/overview).

## Beispiel: Bienenstände auflisten

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

## Beispiel: eine Durchsicht erfassen (mit Temperatur & Luftfeuchtigkeit)

Dies ist der Aufruf, den ein [automatisierter Tracker](/using-the-api/automated-trackers)
durchführt, um eine Messung zu protokollieren. Alle Messfelder sind optional —
sende nur, was du hast.

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

Die Klimafelder sind:

| JSON-Feld | Bedeutung | Einheit |
| --- | --- | --- |
| `tempHive` | Temperatur im Inneren des Bienenstocks | °C |
| `tempOutside` | Außen-/Umgebungstemperatur | °C |
| `humidityHive` | Relative Luftfeuchtigkeit im Inneren des Bienenstocks | % |
| `humidityOutside` | Relative Luftfeuchtigkeit außen | % |

## Paginierung

List-Methoden erwarten ein `page`-Objekt und liefern ein `nextPageToken` zurück.
Gib es zurück, um die nächste Seite abzurufen:

```bash
curl -X POST .../openbeehive.v1.InspectionService/ListInspections \
  -H "Content-Type: application/json" \
  -d '{ "hiveId": "h-7", "page": { "pageToken": "<nextPageToken>" } }'
```

## Fehler

Connect bildet Fehler auf HTTP-Statuscodes mit einem JSON-Body ab:

```json
{ "code": "not_found", "message": "hive h-7 not found" }
```

Gängige Codes: `invalid_argument` (400), `unauthenticated` (401),
`permission_denied` (403), `not_found` (404), `internal` (500). Siehe die
[Connect-Fehlerreferenz](https://connectrpc.com/docs/protocol/#error-codes).

## Tipps

- Sende `{}` für Methoden, die keine Felder erwarten — ein leerer Body ist
  weiterhin gültiges JSON.
- Verwende `Content-Type: application/json`; dieser Header ist es, der das
  HTTP/JSON-Protokoll gegenüber gRPC auswählt.
- Verwende für langlebige Streams (`SyncService.Subscribe`) einen Streaming-Client
  — siehe [gRPC](/using-the-api/grpc).
- Bevorzuge für alles Nicht-Triviale einen generierten, typisierten Client — die
  [gRPC-Seite](/using-the-api/grpc) zeigt, wie man einen aus dem Vertrag generiert.
