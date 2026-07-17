---
sidebar_position: 2
title: "REST / HTTP + JSON"
---

# REST / HTTP + JSON

Cada método de Openbeehive se puede invocar como un sencillo **POST HTTP con un
cuerpo JSON**, gracias al [protocolo Connect](https://connectrpc.com/docs/protocol/).
Si puedes enviar una petición POST —desde curl, un script de shell, un webhook,
una función serverless o un microcontrolador— puedes usar toda la API. No se
requiere ninguna herramienta de gRPC.

## Forma de la petición

```
POST <base-url>/openbeehive.v1.<Service>/<Method>
Content-Type: application/json
```

- La **ruta de la URL** es el servicio y el método totalmente cualificados.
- El **cuerpo** es el mensaje de la petición en formato JSON (mapeo JSON de
  proto3: nombres de campo en `lowerCamelCase`, p. ej. `hiveId`, `tempHive`).
- La **respuesta** es el mensaje de respuesta en formato JSON, con HTTP `200` en
  caso de éxito.

Añade `Authorization: Bearer <token>` cuando la instancia tenga el inicio de
sesión habilitado (el servicio alojado). Una instancia autoalojada de un solo
usuario no necesita autenticación; consulta la
[introducción](/using-the-api/overview).

## Ejemplo: listar colmenares

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

## Ejemplo: registrar una inspección (con temperatura y humedad)

Esta es la llamada que realiza un [rastreador automatizado](/using-the-api/automated-trackers)
para registrar una lectura. Todos los campos de medición son opcionales; envía
solo lo que tengas.

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

Los campos climáticos son:

| Campo JSON | Significado | Unidad |
| --- | --- | --- |
| `tempHive` | Temperatura dentro de la colmena | °C |
| `tempOutside` | Temperatura exterior / ambiente | °C |
| `humidityHive` | Humedad relativa dentro de la colmena | % |
| `humidityOutside` | Humedad relativa exterior | % |

## Paginación

Los métodos de listado reciben un objeto `page` y devuelven un `nextPageToken`.
Pásalo de vuelta para obtener la página siguiente:

```bash
curl -X POST .../openbeehive.v1.InspectionService/ListInspections \
  -H "Content-Type: application/json" \
  -d '{ "hiveId": "h-7", "page": { "pageToken": "<nextPageToken>" } }'
```

## Errores

Connect asigna los errores a códigos de estado HTTP con un cuerpo JSON:

```json
{ "code": "not_found", "message": "hive h-7 not found" }
```

Códigos comunes: `invalid_argument` (400), `unauthenticated` (401),
`permission_denied` (403), `not_found` (404), `internal` (500). Consulta la
[referencia de errores de Connect](https://connectrpc.com/docs/protocol/#error-codes).

## Consejos

- Envía `{}` para los métodos que no reciben campos: un cuerpo vacío sigue siendo
  JSON válido.
- Usa `Content-Type: application/json`; esa cabecera es la que selecciona el
  protocolo HTTP/JSON en lugar de gRPC.
- Para flujos de larga duración (`SyncService.Subscribe`) usa un cliente de
  streaming; consulta [gRPC](/using-the-api/grpc).
- Para cualquier cosa no trivial, prefiere un cliente tipado y generado; la
  [página de gRPC](/using-the-api/grpc) muestra cómo generar uno a partir del
  contrato.
