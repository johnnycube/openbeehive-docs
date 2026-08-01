---
sidebar_position: 6
title: "Codici QR e deep link"
---

# Codici QR e deep link

Ogni arnia in Openbeehive può portare un'etichetta QR stampabile. Scansionala
sul campo e l'app si apre direttamente su quell'arnia, senza menu da esplorare.
Questa pagina spiega come funziona la codifica, come i link si risolvono offline,
come sono cablati i deep link nativi, e come si comporta lo scanner integrato
nell'app.

## Cosa codifica un QR di arnia

Un QR di arnia codifica un singolo URL della forma:

```text
<base>/h/<hiveId>
```

- `<base>` è il tuo `BEEHIVE_PUBLIC_BASE_URL` (per esempio `https://app.openbeehive.org`).
- `<hiveId>` è l'identificatore stabile dell'arnia: un UUID coniato sul
  dispositivo quando l'arnia viene creata per la prima volta.

L'id è lo stesso UUID offline-first usato ovunque nel modello dei dati. Viene
generato localmente, mai riassegnato, e sopravvive alla sincronizzazione intatto.
Questa stabilità è ciò che rende sicura un'etichetta stampata: il QR che attacchi
sul nido di covata in primavera punta ancora alla stessa arnia anni dopo.

:::note
L'id codifica un'arnia, non un permesso. Conoscere o indovinare un id di arnia non
concede di per sé alcun accesso. Vedi **L'accesso è controllato dalla condivisione**.
:::

## Come si risolve `/h/[id]`

La rotta `/h/[id]` è un sottile risolutore, non una pagina a sé stante. Quando si
carica:

1. Cerca `id` nel database SQLite-WASM **locale** (OPFS).
2. Se l'arnia è presente, reindirizza nell'app a `/app/hives/[id]`.
3. Se l'arnia **non** è presente localmente, attiva una sincronizzazione, poi
   ricontrolla.
4. Se l'arnia ancora non si trova o non hai accesso ad essa, lo segnala.

Poiché il passo 1 legge dal database locale, una scansione si risolve all'istante
quando sei offline, purché l'arnia sia già sul dispositivo. La sincronizzazione
nel passo 3 è l'unica parte che ha bisogno di un segnale, e viene eseguita solo
quando l'arnia manca (per esempio, un apiario che ti è appena stato condiviso).

```text
scan QR  ->  /h/<id>  ->  local lookup
                              |
                  found ------+------ not found
                    |                    |
          /app/hives/<id>           sync, re-check
                                         |
                              found -> /app/hives/<id>
                              still missing -> "not found / not shared"
```

### L'accesso è controllato dalla condivisione
La risoluzione passa sempre attraverso le normali regole di sincronizzazione e
condivisione. In Openbeehive la condivisione avviene a livello di **apiario**
tramite gli ambiti; un'arnia diventa visibile per te solo perché il suo apiario è
in un ambito che puoi sincronizzare. La rotta `/h/[id]` non aggira mai questo.

Quindi un id da solo è innocuo: se l'apiario dell'arnia non è condiviso con te, la
sincronizzazione nel passo 3 non restituisce nulla e la rotta segnala l'arnia come
non disponibile. Tratta le etichette stampate come pratiche, non come segrete.

## Implementazione

La funzionalità QR è piccola e suddivisa tra alcuni file:

| File | Scopo |
| --- | --- |
| `lib/qr.ts` | Costruire l'URL dell'arnia, renderizzare il QR come SVG offline, analizzare i payload scansionati (`parseHiveId`) |
| `lib/components/QrLabel.svelte` | Etichetta stampabile (QR + nome + codice breve) con download SVG |
| `routes/h/[id]/+page.svelte` | Landing di scansione: risolve localmente, poi reindirizza nell'app |
| `routes/app/hives/[id]/+page.svelte` | Dettaglio dell'arnia (mostra l'etichetta QR e la storia) |
| `routes/app/scan/+page.svelte` | Scanner integrato nell'app che usa la fotocamera |

Il rendering del QR avviene interamente sul dispositivo come SVG, così le etichette
possono essere generate e stampate senza alcuna connessione di rete.

## Stampare le etichette

Puoi stampare un'etichetta per una singola arnia dalla sua vista di dettaglio,
oppure generare un **foglio in lotto** che copre molte arnie in una volta.

| Output | Usalo per |
| --- | --- |
| Etichetta singola | Una sola arnia, stampata su richiesta (sostituzione, nuova colonia) |
| Foglio in lotto | Una griglia di etichette per un intero apiario o una tiratura di stampa |

`QrLabel` apre una finestra di stampa pulita contenente solo il QR, il nome
dell'arnia e un codice breve, e può anche scaricare il QR come SVG. Un foglio in
lotto è semplicemente molti componenti `QrLabel` disposti in una pagina con
griglia di stampa.

La breve didascalia conta: mantiene utile un'etichetta anche se un telefono è
scarico. Stampa su supporti resistenti alle intemperie o plastificati; i nidi di
covata vivono all'aperto e l'inchiostro sbiadisce.

:::tip
Attacca l'etichetta dove la scansionerai effettivamente, sul lato della cassa o
sul coperchio, anziché su una superficie che devi sollevare il tetto per leggere.
Per indicazioni passo passo rivolte agli apicoltori, vedi [Etichette
QR](/using-the-app/qr-labels).
:::

## Deep link nativi

Il QR punta a un normale URL `https://`, il che significa che funziona in
qualsiasi fotocamera o browser. Su mobile, Openbeehive può anche registrare quello
spazio di URL in modo che l'app installata, anziché una scheda del browser,
gestisca il link.

### Android App Links

Android verifica la proprietà del dominio del link tramite un file Digital Asset
Links servito su `/.well-known/assetlinks.json`, che dichiara il pacchetto
dell'app e l'impronta di firma:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.openbeehive.app",
      "sha256_cert_fingerprints": ["<your-app-signing-cert-sha256>"]
    }
  }
]
```

Aggiungi un intent filter per `https://<host>/h/*`. Una volta verificati, i tocchi
e le scansioni si aprono direttamente nell'app senza una finestra di scelta.

### iOS Universal Links

iOS usa un file Apple App Site Association servito su
`/.well-known/apple-app-site-association` (come `application/json`, senza
estensione di file):

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "<TEAMID>.com.openbeehive.app",
        "paths": ["/h/*"]
      }
    ]
  }
}
```

Aggiungi l'entitlement Associated Domains all'app per rivendicare lo spazio di
percorso `/h/*`.

:::caution
Entrambi i file well-known devono essere serviti su HTTPS con il content type
corretto e senza redirect, dalla stessa origine del tuo `BEEHIVE_PUBLIC_BASE_URL`. Se
metti Openbeehive dietro un reverse proxy, assicurati che `/.well-known/` venga
passato senza modifiche. Vedi [Reverse proxy](/self-hosting/reverse-proxy).
:::

### Fallback con schema personalizzato

Per i contesti in cui un link `https://` non instraderà all'app, anche uno schema
personalizzato viene analizzato da `parseHiveId`:

```text
openbeehive://hive/<hiveId>
```

Preferisci la forma `https://` per le etichette stampate, perché degrada con
grazia all'app web quando l'app nativa è assente. Lo schema personalizzato è
meglio riservarlo alla navigazione interna all'app e alle integrazioni.

## Scanner integrato nell'app

Lo scanner integrato su `/app/scan` legge i codici QR usando l'API
`BarcodeDetector` del browser dove disponibile (Android e Chrome). Sulle
piattaforme che non includono ancora `BarcodeDetector`, in particolare iOS Safari,
l'app ripiega sull'app fotocamera del dispositivo; inserisci un decodificatore
JavaScript come `@zxing/browser` se lì è richiesto uno scanner completamente
integrato nell'app.

Qualunque percorso venga eseguito, una decodifica riuscita viene gestita allo
stesso modo: `parseHiveId` estrae l'id dell'arnia dall'URL o dallo schema
personalizzato, e l'app naviga attraverso lo stesso flusso di risoluzione locale
descritto sopra. Una scansione e un link toccato sono equivalenti.

:::note
Lo scanner ha bisogno del permesso della fotocamera e di un contesto sicuro
(HTTPS, o `localhost` durante lo sviluppo). Se la fotocamera non si avvia,
controlla prima i permessi del sito; vedi
[Risoluzione dei problemi](/knowledge-base/troubleshooting).
:::

## Riepilogo

- Un QR di arnia codifica `<base>/h/<hiveId>`, dove l'id è un UUID offline stabile.
- `/h/[id]` si risolve prima dal database locale e sincronizza solo se necessario.
- L'accesso segue sempre la condivisione a livello di apiario; un id non concede
  nulla di per sé.
- App Links e Universal Links instradano `/h/*` nell'app nativa; viene analizzato
  anche uno schema `openbeehive://hive/<id>`.
- Lo scanner usa `BarcodeDetector` con un fallback sull'app fotocamera di iOS.

Per il quadro più ampio, vedi la sezione [Sviluppatori](/category/developers) e il
[Modello dei dati](/developers/data-model).
