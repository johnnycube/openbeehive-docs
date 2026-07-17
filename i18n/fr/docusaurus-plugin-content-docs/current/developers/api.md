---
sidebar_position: 5
title: "API (Connect-RPC)"
---

# API (Connect-RPC)

Openbeehive expose l'API de son backend via [Connect-RPC](https://connectrpc.com/). Le contrat est défini en Protocol Buffers, et un seul ensemble de fichiers `.proto` pilote à la fois les interfaces gRPC et HTTP/JSON, ainsi que le code client et serveur généré.

Si vous voulez seulement utiliser l'application, vous n'avez jamais besoin de toucher à cette page. Elle est là pour les auto-hébergeurs qui veulent scripter des exports, et pour les développeurs qui construisent par-dessus Openbeehive.

## Le contrat proto est la source de vérité

Tout part du schéma sous `proto/openbeehive/v1`. Les messages, services et RPC qui y sont déclarés définissent toute la surface de l'API. Le code Go et TypeScript généré est dérivé de ces fichiers, jamais écrit à la main, de sorte que le schéma et le code ne peuvent jamais diverger.

Lorsque vous modifiez l'API, vous modifiez d'abord le proto, vous régénérez, puis vous implémentez. Ne modifiez pas les fichiers générés à la main.

## Connect-RPC : un contrat, deux formats filaires

Connect-RPC sert chaque RPC via deux protocoles compatibles depuis le même point de terminaison :

- **gRPC** pour les clients natifs adaptés au streaming (Go, etc.).
- **HTTP/JSON** pour les clients HTTP simples : chaque RPC est accessible comme un `POST` avec un corps JSON, de sorte que vous pouvez l'appeler avec `curl` ou `fetch`.

Cela signifie que vous obtenez un protocole binaire efficace et un protocole JSON simple et débogable sans maintenir deux API.

## Services

Le contrat est organisé en services suivants :

| Service | Objet |
| --- | --- |
| `Apiary` | Créer, lire, mettre à jour et supprimer des ruchers. |
| `Hive` | Gérer les ruches au sein des ruchers. |
| `Queen` | Gérer les reines, y compris la couleur de marquage et la lignée. |
| `Inspection` | Enregistrer et récupérer les inspections (visites). |
| `Task` | Gérer les tâches. |
| `Stats` | Chiffres agrégés et résumés sur l'ensemble de vos enregistrements. |
| `Event` | Lire le journal d'événements en ajout seul. |
| `Sync` | Le point de terminaison que l'application offline-first utilise pour pousser et récupérer les changements en arrière-plan. |

:::note
Ce sont les seuls services. Les noms de service ci-dessus constituent la liste complète ; il n'y a aucun point de terminaison caché au-delà de ceux-ci.
:::

## Comment l'application utilise l'API

Openbeehive est offline-first. La PWA SvelteKit lit et écrit via un **dépôt local-first** adossé à une base de données SQLite-WASM dans le navigateur (OPFS). Les données quotidiennes de l'application ne font jamais d'aller-retour vers le serveur sur le chemin critique ; elles sont locales et instantanées, et fonctionnent sans signal.

Le service `Sync` est ce qui transporte ces changements locaux vers le serveur (et les autres appareils) en arrière-plan. Pour les détails sur la façon dont cela reste exempt de conflit, voir le [protocole de synchronisation](/developers/sync-protocol).

Les RPC CRUD par entité (`Apiary`, `Hive`, `Queen`, et ainsi de suite) sont des points de terminaison **faisant autorité côté serveur**. L'application elle-même ne les utilise pas pour la tenue d'enregistrements ordinaire. Ils existent pour des choses comme l'export, l'administration et les intégrations, où vous voulez la vue faisant autorité du serveur plutôt que la copie locale d'un seul appareil.

:::tip
Si vous construisez un script, préférez la lecture via les services CRUD et `Stats`. Écrire vos propres enregistrements via eux est pris en charge, mais pour l'apiculture normale, utilisez l'application, afin que vos changements circulent par le chemin de synchronisation exempt de conflit.
:::

## Appeler l'API via HTTP/JSON

Chaque RPC correspond à une URL de la forme :

```text
POST {BEEHIVE_PUBLIC_BASE_URL}/openbeehive.v1.{Service}/{Method}
```

Le corps de la requête est le message de requête du RPC en JSON, et le corps de la réponse est le message de réponse en JSON. Deux en-têtes comptent :

- `Content-Type: application/json`
- un en-tête de session ou d'authentification, sauf si votre instance auto-hébergée fonctionne en mono-utilisateur sans connexion configurée.

Un exemple minimal utilisant `curl` :

```bash
curl -X POST \
  http://localhost:8080/openbeehive.v1.Apiary/ListApiaries \
  -H "Content-Type: application/json" \
  -d '{}'
```

Les noms de méthode exacts et les champs de requête de chaque service sont définis dans les fichiers proto ; traitez ceux-ci comme la référence canonique pour les noms et les formes des champs.

:::caution
Les noms de méthode tels que `ListApiaries` ci-dessus illustrent la convention d'appel. Confirmez toujours les noms réels de RPC et de message par rapport à `proto/openbeehive/v1` avant de vous y fier, puisque le proto est la source unique de vérité.
:::

### Authentification

L'API utilise la même authentification basée sur la session que l'application. Si votre instance est configurée avec des fournisseurs OIDC ou WebAuthn, les requêtes doivent porter une session valide. Si vous exécutez un auto-hébergement mono-utilisateur avec `BEEHIVE_OIDC_PROVIDERS` vide et `BEEHIVE_WEBAUTHN_ENABLED=false`, il n'y a pas de connexion et les appels ne sont pas authentifiés. Voir [authentification](/self-hosting/authentication) pour les détails de configuration.

## Régénérer les stubs avec buf

La génération de code est pilotée par [buf](https://buf.build/). Le dépôt l'enveloppe dans une cible `make` :

```bash
make proto
```

Cela régénère à la fois le code Go et le code TypeScript depuis `proto/openbeehive/v1`. Exécutez-le chaque fois que vous modifiez un fichier `.proto`, et validez la sortie régénérée en même temps que le changement de schéma.

Vous aurez besoin de :

- Go 1.25 ou plus récent
- Node 22 ou plus récent
- `buf`

Après la régénération, `make build` compile le binaire du serveur (`./server/bin/openbeehive`). Pour la configuration complète, voir [contribuer](/developers/contributing).

:::note
Parce que Go et TypeScript sont générés à partir du même contrat, le backend et le frontend s'accordent toujours sur les formes des messages. Un changement de schéma qui casse l'un fera surface dans l'autre au moment de la compilation, pas à l'exécution.
:::

## Où aller ensuite

- [Aperçu de l'architecture](/developers/architecture) pour comprendre comment l'API s'inscrit dans le système plus large.
- [Protocole de synchronisation](/developers/sync-protocol) pour comprendre comment les changements hors ligne atteignent le serveur.
- [Modèle de données](/developers/data-model) pour les entités derrière les services.
