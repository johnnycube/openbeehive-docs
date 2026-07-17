---
sidebar_position: 2
title: "REST / HTTP + JSON"
---

# REST / HTTP + JSON

Every Openbeehive method is callable as a plain **HTTP POST with a JSON body**,
thanks to the [Connect protocol](https://connectrpc.com/docs/protocol/). If you
can send a POST request — from curl, a shell script, a webhook, a serverless
function or a microcontroller — you can use the whole API. No gRPC tooling
required.

## Request shape

```
POST <base-url>/openbeehive.v1.<Service>/<Method>
Content-Type: application/json
```

- The **URL path** is the fully-qualified service and method.
- The **body** is the request message as JSON (proto3 JSON mapping: field names
  in `lowerCamelCase`, e.g. `hiveId`, `tempHive`).
- The **response** is the response message as JSON, with HTTP `200` on success.

Add `Authorization: Bearer <token>` when the instance has login enabled (the
hosted service). A self-hosted single-user instance needs no auth — see the
[overview](/using-the-api/overview).

## Example: list apiaries

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

## Example: record an inspection (with temperature & humidity)

This is the call an [automated tracker](/using-the-api/automated-trackers) makes
to log a reading. All measurement fields are optional — send only what you have.

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

The climate fields are:

| JSON field | Meaning | Unit |
| --- | --- | --- |
| `tempHive` | Temperature inside the hive | °C |
| `tempOutside` | Outside / ambient temperature | °C |
| `humidityHive` | Relative humidity inside the hive | % |
| `humidityOutside` | Outside relative humidity | % |

## Pagination

List methods take a `page` object and return a `nextPageToken`. Pass it back to
fetch the next page:

```bash
curl -X POST .../openbeehive.v1.InspectionService/ListInspections \
  -H "Content-Type: application/json" \
  -d '{ "hiveId": "h-7", "page": { "pageToken": "<nextPageToken>" } }'
```

## Errors

Connect maps errors to HTTP status codes with a JSON body:

```json
{ "code": "not_found", "message": "hive h-7 not found" }
```

Common codes: `invalid_argument` (400), `unauthenticated` (401),
`permission_denied` (403), `not_found` (404), `internal` (500). See the
[Connect error reference](https://connectrpc.com/docs/protocol/#error-codes).

## Tips

- Send `{}` for methods that take no fields — an empty body is still valid JSON.
- Use `Content-Type: application/json`; that header is what selects the
  HTTP/JSON protocol over gRPC.
- For long-lived streams (`SyncService.Subscribe`) use a streaming client — see
  [gRPC](/using-the-api/grpc).
- Prefer a generated, typed client for anything non-trivial — the
  [gRPC page](/using-the-api/grpc) shows how to generate one from the contract.
