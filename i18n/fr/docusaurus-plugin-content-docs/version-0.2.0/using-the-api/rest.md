---
sidebar_position: 2
title: "REST / HTTP + JSON"
---

# REST / HTTP + JSON

Chaque méthode d'Openbeehive est appelable comme une simple **requête HTTP POST
avec un corps JSON**, grâce au [protocole Connect](https://connectrpc.com/docs/protocol/).
Si vous pouvez envoyer une requête POST — depuis curl, un script shell, un
webhook, une fonction serverless ou un microcontrôleur — vous pouvez utiliser
toute l'API. Aucun outillage gRPC n'est requis.

## Forme de la requête

```
POST <base-url>/openbeehive.v1.<Service>/<Method>
Content-Type: application/json
```

- Le **chemin de l'URL** est le nom complet du service et de la méthode.
- Le **corps** est le message de requête au format JSON (mapping JSON proto3 :
  noms de champs en `lowerCamelCase`, par ex. `hiveId`, `tempHive`).
- La **réponse** est le message de réponse au format JSON, avec un code HTTP
  `200` en cas de succès.

Ajoutez `Authorization: Bearer <token>` lorsque l'instance a l'authentification
activée (le service hébergé). Une instance auto-hébergée mono-utilisateur ne
nécessite aucune authentification — voir l'[aperçu](/using-the-api/overview).

## Exemple : lister les ruchers

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

## Exemple : enregistrer une inspection (avec température et humidité)

C'est l'appel qu'effectue un [enregistreur automatisé](/using-the-api/automated-trackers)
pour consigner une mesure. Tous les champs de mesure sont optionnels — n'envoyez
que ce dont vous disposez.

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

Les champs climatiques sont :

| Champ JSON | Signification | Unité |
| --- | --- | --- |
| `tempHive` | Température à l'intérieur de la ruche | °C |
| `tempOutside` | Température extérieure / ambiante | °C |
| `humidityHive` | Humidité relative à l'intérieur de la ruche | % |
| `humidityOutside` | Humidité relative extérieure | % |

## Pagination

Les méthodes de listage prennent un objet `page` et renvoient un
`nextPageToken`. Renvoyez-le pour récupérer la page suivante :

```bash
curl -X POST .../openbeehive.v1.InspectionService/ListInspections \
  -H "Content-Type: application/json" \
  -d '{ "hiveId": "h-7", "page": { "pageToken": "<nextPageToken>" } }'
```

## Erreurs

Connect associe les erreurs à des codes d'état HTTP avec un corps JSON :

```json
{ "code": "not_found", "message": "hive h-7 not found" }
```

Codes courants : `invalid_argument` (400), `unauthenticated` (401),
`permission_denied` (403), `not_found` (404), `internal` (500). Voir la
[référence des erreurs Connect](https://connectrpc.com/docs/protocol/#error-codes).

## Astuces

- Envoyez `{}` pour les méthodes qui ne prennent aucun champ — un corps vide
  reste un JSON valide.
- Utilisez `Content-Type: application/json` ; c'est cet en-tête qui sélectionne
  le protocole HTTP/JSON plutôt que gRPC.
- Pour les flux de longue durée (`SyncService.Subscribe`), utilisez un client de
  streaming — voir [gRPC](/using-the-api/grpc).
- Préférez un client généré et typé pour tout ce qui n'est pas trivial — la
  [page gRPC](/using-the-api/grpc) montre comment en générer un à partir du
  contrat.
