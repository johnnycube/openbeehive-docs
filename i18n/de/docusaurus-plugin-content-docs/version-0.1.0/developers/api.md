---
sidebar_position: 5
title: "API (Connect-RPC)"
---

# API (Connect-RPC)

Openbeehive stellt seine Backend-API über [Connect-RPC](https://connectrpc.com/) bereit. Der Vertrag ist in Protocol Buffers definiert, und ein einziger Satz von `.proto`-Dateien treibt sowohl die gRPC- als auch die HTTP/JSON-Schnittstelle an, dazu den generierten Client- und Servercode.

Wenn du die App nur nutzen möchtest, musst du diese Seite nie anfassen. Sie ist für Selbsthoster da, die Exporte skripten möchten, und für Entwickler, die auf Openbeehive aufbauen.

## Der Proto-Vertrag ist die Quelle der Wahrheit

Alles beginnt mit dem Schema unter `proto/openbeehive/v1`. Die dort deklarierten Messages, Services und RPCs definieren die gesamte API-Oberfläche. Generierter Go- und TypeScript-Code wird aus diesen Dateien abgeleitet, niemals von Hand geschrieben, sodass Schema und Code niemals auseinanderdriften können.

Wenn du die API änderst, änderst du zuerst das Proto, regenerierst, dann implementierst du. Bearbeite generierte Dateien nicht von Hand.

## Connect-RPC: ein Vertrag, zwei Wire-Formate

Connect-RPC bedient jeden RPC über zwei kompatible Protokolle vom selben Endpunkt:

- **gRPC** für native, streamingfreundliche Clients (Go usw.).
- **HTTP/JSON** für einfache HTTP-Clients: Jeder RPC ist als `POST` mit einem JSON-Body erreichbar, sodass du ihn mit `curl` oder `fetch` aufrufen kannst.

Das bedeutet, dass du ein effizientes Binärprotokoll und ein einfaches, gut debugbares JSON-Protokoll bekommst, ohne zwei APIs zu pflegen.

## Services

Der Vertrag ist in die folgenden Services gegliedert:

| Service | Zweck |
| --- | --- |
| `Apiary` | Bienenstände erstellen, lesen, aktualisieren und löschen. |
| `Hive` | Bienenstöcke innerhalb von Bienenständen verwalten. |
| `Queen` | Königinnen verwalten, einschließlich Markierungsfarbe und Abstammung. |
| `Inspection` | Durchsichten (Besuche) erfassen und abrufen. |
| `Task` | Aufgaben verwalten. |
| `Stats` | Aggregierte Zahlen und Zusammenfassungen über deine Aufzeichnungen. |
| `Event` | Das append-only-Ereignisprotokoll lesen. |
| `Sync` | Der Endpunkt, den die Offline-first-App verwendet, um Änderungen im Hintergrund zu pushen und zu pullen. |

:::note
Dies sind die einzigen Services. Die obigen Servicenamen sind die vollständige Liste; darüber hinaus gibt es keine versteckten Endpunkte.
:::

## Wie die App die API nutzt

Openbeehive ist offline-first. Die SvelteKit-PWA liest und schreibt über ein **Local-first-Repository**, gestützt auf eine SQLite-WASM-Datenbank im Browser (OPFS). Alltägliche App-Daten machen auf dem kritischen Pfad nie eine Rundreise zum Server; sie sind lokal und sofort verfügbar und funktionieren ohne Empfang.

Der `Sync`-Service ist es, der diese lokalen Änderungen im Hintergrund zum Server (und zu anderen Geräten) trägt. Wie das konfliktfrei bleibt, findest du im [Sync-Protokoll](/developers/sync-protocol).

Die entitätsbezogenen CRUD-RPCs (`Apiary`, `Hive`, `Queen` usw.) sind **serverautoritative** Endpunkte. Die App selbst verwendet sie nicht für die gewöhnliche Aufzeichnung. Sie existieren für Dinge wie Export, Administration und Integrationen, bei denen du die autoritative Sicht des Servers statt der lokalen Kopie eines einzelnen Geräts möchtest.

:::tip
Wenn du ein Skript baust, lies bevorzugt über die CRUD- und `Stats`-Services. Eigene Datensätze über sie zu schreiben, wird unterstützt, aber nutze für die normale Imkerei die App, damit deine Änderungen durch den konfliktfreien Sync-Pfad fließen.
:::

## Die API über HTTP/JSON aufrufen

Jeder RPC bildet auf eine URL der Form ab:

```text
POST {BEEHIVE_PUBLIC_BASE_URL}/openbeehive.v1.{Service}/{Method}
```

Der Request-Body ist die Request-Message des RPC als JSON, und der Response-Body ist die Response-Message als JSON. Zwei Header sind wichtig:

- `Content-Type: application/json`
- ein Session- oder Auth-Header, es sei denn, deine selbstgehostete Instanz läuft im Einzelnutzerbetrieb ohne konfiguriertes Login.

Ein minimales Beispiel mit `curl`:

```bash
curl -X POST \
  http://localhost:8080/openbeehive.v1.Apiary/ListApiaries \
  -H "Content-Type: application/json" \
  -d '{}'
```

Die genauen Methodennamen und Request-Felder für jeden Service sind in den Proto-Dateien definiert; behandle diese als kanonische Referenz für Feldnamen und -gestalten.

:::caution
Methodennamen wie `ListApiaries` oben veranschaulichen die Aufrufkonvention. Bestätige immer den tatsächlichen RPC- und Message-Namen anhand von `proto/openbeehive/v1`, bevor du dich darauf verlässt, denn das Proto ist die einzige Quelle der Wahrheit.
:::

### Authentifizierung

Die API verwendet dieselbe sessionbasierte Authentifizierung wie die App. Wenn deine Instanz mit OIDC-Anbietern oder WebAuthn konfiguriert ist, müssen Requests eine gültige Session tragen. Wenn du ein Einzelnutzer-Selbsthosting mit leerem `BEEHIVE_OIDC_PROVIDERS` und `BEEHIVE_WEBAUTHN_ENABLED=false` betreibst, gibt es kein Login und Aufrufe sind unauthentifiziert. Die Konfigurationsdetails findest du unter [Authentifizierung](/self-hosting/authentication).

## Die Stubs mit buf regenerieren

Die Codegenerierung wird von [buf](https://buf.build/) gesteuert. Das Repository umhüllt es in einem `make`-Target:

```bash
make proto
```

Dies regeneriert sowohl den Go- als auch den TypeScript-Code aus `proto/openbeehive/v1`. Führe es jedes Mal aus, wenn du eine `.proto`-Datei änderst, und committe die regenerierte Ausgabe zusammen mit der Schemaänderung.

Du benötigst:

- Go 1.25 oder neuer
- Node 22 oder neuer
- `buf`

Nach dem Regenerieren kompiliert `make build` das Server-Binary (`./server/bin/openbeehive`). Für die vollständige Einrichtung siehe [Mitwirken](/developers/contributing).

:::note
Da Go und TypeScript aus demselben Vertrag generiert werden, sind sich Backend und Frontend stets über die Message-Gestalten einig. Eine Schemaänderung, die eines bricht, taucht im anderen zur Build-Zeit auf, nicht zur Laufzeit.
:::

## Wie es weitergeht

- [Architekturüberblick](/developers/architecture) dazu, wie die API in das weitere System passt.
- [Sync-Protokoll](/developers/sync-protocol) dazu, wie Offline-Änderungen den Server erreichen.
- [Datenmodell](/developers/data-model) zu den Entitäten hinter den Services.
