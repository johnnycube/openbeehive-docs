---
sidebar_position: 5
title: "API (Connect-RPC)"
---

# API (Connect-RPC)

Openbeehive espone la sua API di backend attraverso [Connect-RPC](https://connectrpc.com/). Il contratto è definito in Protocol Buffers, e un unico insieme di file `.proto` guida sia l'interfaccia gRPC sia quella HTTP/JSON, oltre al codice client e server generato.

Se vuoi solo usare l'app, non hai mai bisogno di toccare questa pagina. È qui per i self-hoster che vogliono creare script di esportazione, e per gli sviluppatori che costruiscono sopra Openbeehive.

## Il contratto proto è la fonte di verità

Tutto parte dallo schema sotto `proto/openbeehive/v1`. I messaggi, i servizi e gli RPC dichiarati lì definiscono l'intera superficie dell'API. Il codice Go e TypeScript generato deriva da questi file, mai scritto a mano, così lo schema e il codice non possono mai divergere.

Quando modifichi l'API, modifichi prima il proto, rigeneri, poi implementi. Non modificare i file generati a mano.

## Connect-RPC: un contratto, due formati di trasmissione

Connect-RPC serve ogni RPC su due protocolli compatibili dallo stesso endpoint:

- **gRPC** per client nativi, adatti allo streaming (Go, ecc.).
- **HTTP/JSON** per client HTTP semplici: ogni RPC è raggiungibile come un `POST` con un corpo JSON, così puoi chiamarlo con `curl` o `fetch`.

Questo significa che ottieni un protocollo binario efficiente e un protocollo JSON semplice e facile da debuggare, senza dover mantenere due API.

## Servizi

Il contratto è organizzato nei seguenti servizi:

| Servizio | Scopo |
| --- | --- |
| `Apiary` | Creare, leggere, aggiornare ed eliminare apiari. |
| `Hive` | Gestire le arnie all'interno degli apiari. |
| `Queen` | Gestire le regine, incluso il colore di marcatura e la discendenza. |
| `Inspection` | Registrare e recuperare le ispezioni (visite). |
| `Task` | Gestire le attività. |
| `Stats` | Cifre aggregate e riepiloghi sui tuoi record. |
| `Event` | Leggere il registro degli eventi append-only. |
| `Sync` | L'endpoint che l'app offline-first usa per inviare e scaricare le modifiche in background. |

:::note
Questi sono gli unici servizi. I nomi dei servizi sopra sono l'elenco completo; non ci sono endpoint nascosti oltre a questi.
:::

## Come l'app usa l'API

Openbeehive è offline-first. La PWA SvelteKit legge e scrive attraverso un **repository local-first** supportato da un database SQLite-WASM nel browser (OPFS). I dati quotidiani dell'app non fanno mai un viaggio di andata e ritorno verso il server nel percorso critico; sono locali e istantanei, e funzionano senza alcun segnale.

Il servizio `Sync` è ciò che trasporta quelle modifiche locali al server (e agli altri dispositivi) in background. Per i dettagli su come tutto questo resta privo di conflitti, vedi il [protocollo di sincronizzazione](/developers/sync-protocol).

Gli RPC CRUD per ciascuna entità (`Apiary`, `Hive`, `Queen` e così via) sono endpoint **server-authoritative**. L'app stessa non li usa per la normale tenuta dei record. Esistono per cose come l'esportazione, l'amministrazione e le integrazioni, dove vuoi la vista autorevole del server anziché la copia locale di un singolo dispositivo.

:::tip
Se stai costruendo uno script, preferisci la lettura attraverso i servizi CRUD e `Stats`. Scrivere i tuoi record attraverso di essi è supportato, ma per la normale apicoltura usa l'app, così le tue modifiche fluiscono attraverso il percorso di sincronizzazione privo di conflitti.
:::

## Chiamare l'API tramite HTTP/JSON

Ogni RPC corrisponde a un URL della forma:

```text
POST {BEEHIVE_PUBLIC_BASE_URL}/openbeehive.v1.{Service}/{Method}
```

Il corpo della richiesta è il messaggio di richiesta dell'RPC in JSON, e il corpo della risposta è il messaggio di risposta in JSON. Due header sono importanti:

- `Content-Type: application/json`
- un header di sessione o di autenticazione, a meno che la tua istanza self-host non funzioni in modalità single-user senza login configurato.

Un esempio minimo usando `curl`:

```bash
curl -X POST \
  http://localhost:8080/openbeehive.v1.Apiary/ListApiaries \
  -H "Content-Type: application/json" \
  -d '{}'
```

I nomi esatti dei metodi e i campi delle richieste per ciascun servizio sono definiti nei file proto; trattali come il riferimento canonico per i nomi e le forme dei campi.

:::caution
Nomi di metodo come `ListApiaries` qui sopra sono illustrativi della convenzione di chiamata. Conferma sempre l'effettivo nome dell'RPC e del messaggio rispetto a `proto/openbeehive/v1` prima di farvi affidamento, poiché il proto è l'unica fonte di verità.
:::

### Autenticazione

L'API usa la stessa autenticazione basata su sessione dell'app. Se la tua istanza è configurata con provider OIDC o WebAuthn, le richieste devono portare una sessione valida. Se esegui un self-host single-user con `BEEHIVE_OIDC_PROVIDERS` vuoto e `BEEHIVE_WEBAUTHN_ENABLED=false`, non c'è login e le chiamate non sono autenticate. Vedi [autenticazione](/self-hosting/authentication) per i dettagli di configurazione.

## Rigenerare gli stub con buf

La generazione del codice è guidata da [buf](https://buf.build/). Il repository lo incapsula in un target `make`:

```bash
make proto
```

Questo rigenera sia il codice Go sia quello TypeScript da `proto/openbeehive/v1`. Eseguilo ogni volta che modifichi un file `.proto`, e fai il commit dell'output rigenerato insieme alla modifica dello schema.

Avrai bisogno di:

- Go 1.25 o più recente
- Node 22 o più recente
- `buf`

Dopo la rigenerazione, `make build` compila il binario del server (`./server/bin/openbeehive`). Per la configurazione completa, vedi [contribuire](/developers/contributing).

:::note
Poiché Go e TypeScript sono generati dallo stesso contratto, il backend e il frontend concordano sempre sulle forme dei messaggi. Una modifica dello schema che ne rompe uno emergerà nell'altro al momento della build, non in fase di esecuzione.
:::

## Dove andare adesso

- [Panoramica dell'architettura](/developers/architecture) per come l'API si inserisce nel sistema più ampio.
- [Protocollo di sincronizzazione](/developers/sync-protocol) per come le modifiche offline raggiungono il server.
- [Modello dei dati](/developers/data-model) per le entità dietro i servizi.
