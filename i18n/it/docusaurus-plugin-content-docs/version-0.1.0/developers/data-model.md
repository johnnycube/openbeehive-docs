---
sidebar_position: 3
title: "Modello dei dati"
---

# Modello dei dati

Questa pagina descrive le entità principali che Openbeehive memorizza, come si
relazionano tra loro e come gli **scope** decidono cosa viene sincronizzato e con
chi. È scritta dal punto di vista offline-first: la stessa struttura risiede nel
database SQLite-WASM del dispositivo e nel database modulare del server, e il
[protocollo di sincronizzazione](/developers/sync-protocol) li mantiene allineati.

Se ti interessano i meccanismi del tracciamento delle modifiche (timestamp HLC,
last-writer-wins, OR-Set, eventi append-only), leggi prima
[Storico ed eventi](/developers/history-and-events) — questa pagina si concentra
sulle entità stesse.

## La gerarchia

In cima si trova l'**Apiario** (una postazione o un luogo). Ogni apiario contiene
**Arnie**; ogni arnia ha una **Regina** attuale e accumula nel tempo un flusso di
registrazioni.

```text
Apiary
 ├── Hive ──────── Queen (current; queens form a succession over time)
 │     ├── Inspection   (a visit: what you saw)
 │     ├── Task         (something to do, with a due date)
 │     ├── Event        (append-only fact: requeened, split, died, moved…)
 │     ├── Harvest      (honey/wax taken off)
 │     └── Treatment    (varroa or disease treatment applied)
 │
 └── Placement (hive ↔ apiary, time-bounded — where a hive lived, and when)

ApiaryShare (apiary ↔ user — grants another beekeeper access via a scope)
```

Un'arnia appartiene a un solo apiario alla volta, ma **Placement** registra lo
storico completo dei luoghi in cui un'arnia ha vissuto, così un'arnia può spostarsi
tra le postazioni senza perdere le sue registrazioni.

## Entità e campi chiave

Ogni entità condivide un involucro comune usato dalla sincronizzazione: un `id`
stabile (un UUID generato offline), uno `scope_id` (vedi **Scope**), colonne di
gestione HLC e un flag di cancellazione logica. I campi elencati di seguito sono
quelli con significato di dominio.

### Apiary

Il contenitore e l'unità di condivisione.

| Campo | Note |
|---|---|
| `id` | UUID |
| `name` | es. "Postazione di casa" |
| `location` | testo libero oppure lat/long |
| `notes` | testo libero |
| `scope_id` | coincide con l'`id` dell'apiario stesso (vedi sotto) |

### Hive

L'alloggiamento di una colonia all'interno di un apiario.

| Campo | Note |
|---|---|
| `id` | UUID; codificato anche nell'[etichetta QR dell'arnia](/using-the-app/qr-labels) |
| `apiary_id` | apiario attuale (la collocazione attiva) |
| `name` / `short_code` | etichetta leggibile e codice breve stampato sul QR |
| `type` | uno tra Zander, Dadant, Deutsch Normal, Langstroth, Warre, Top-bar, Other — vedi [Tipi di arnia](/knowledge-base/hive-types) |
| `status` | es. attiva, morta, venduta |
| `notes` | testo libero |
| `scope_id` | l'id dell'apiario |

### Queen

La regina regnante di un'arnia. Le regine formano una **successione**: quando una
colonia viene risottoposta a nuova regina, la regina precedente viene chiusa e si
apre una nuova registrazione, così mantieni l'intera discendenza.

| Campo | Note |
|---|---|
| `id` | UUID |
| `hive_id` | l'arnia che guida |
| `year` | anno di introduzione/nascita |
| `marking_colour` | segue lo [schema internazionale dei colori](/knowledge-base/queen-marking-colours) (1/6 bianco, 2/7 giallo, 3/8 rosso, 4/9 verde, 5/0 blu) |
| `origin` | allevata, acquistata, sciame, sostituzione spontanea… |
| `clipped` | con ali tarpate (booleano) |
| `scope_id` | l'id dell'apiario della sua arnia |

### Inspection

Una visita datata: l'istantanea di ciò che hai osservato.

| Campo | Note |
|---|---|
| `id`, `hive_id`, `date` | chi e quando |
| `brood`, `stores`, `temperament` | osservazioni tipiche |
| `queen_seen`, `eggs_seen`, `queen_cells` | controlli rapidi |
| `varroa_count` | caduta di acari / conteggio da lavaggio, se rilevato |
| `temp_hive`, `temp_outside` | temperatura (°C) all'interno dell'arnia e all'esterno |
| `humidity_hive`, `humidity_outside` | umidità relativa (%) all'interno dell'arnia e all'esterno |
| `notes` | testo libero |
| `scope_id` | l'id dell'apiario |

I campi climatici sono semplici scalari opzionali, quindi si sincronizzano per
campo come qualsiasi altra colonna e possono essere compilati a mano o da un
sensore automatico — vedi [Tracker automatici](/using-the-api/automated-trackers).

### Task

Qualcosa da fare per un'arnia o un apiario, con una data di scadenza e uno stato
di completamento.

| Campo | Note |
|---|---|
| `id` | UUID |
| `hive_id` / `apiary_id` | il soggetto (un task può riferirsi a uno dei due livelli) |
| `title`, `due_date`, `done` | gli elementi di base |
| `scope_id` | l'id dell'apiario |

### Event

Un fatto **append-only** relativo a un'arnia — nuova regina, divisione, sciamatura,
morte, spostamento, nutrizione. Gli eventi non vengono mai modificati né uniti; si
limitano ad accumularsi, motivo per cui non entrano mai in conflitto durante la
sincronizzazione. Sono la spina dorsale della cronologia dell'arnia.

| Campo | Note |
|---|---|
| `id`, `hive_id`, `occurred_at` | quando è accaduto |
| `kind` | il tipo di evento |
| `payload` | dettaglio specifico del tipo (JSON) |
| `scope_id` | l'id dell'apiario |

Vedi [Storico ed eventi](/developers/history-and-events) per il catalogo completo
degli eventi e per il modo in cui viene assemblata la cronologia.

### Harvest

Miele (o cera) prelevato da un'arnia.

| Campo | Note |
|---|---|
| `id`, `hive_id`, `date` | il prelievo |
| `product` | miele, cera, propoli… |
| `quantity`, `unit` | es. 12,5 kg |
| `notes` | es. fonte di bottinatura, umidità |
| `scope_id` | l'id dell'apiario |

### Treatment

Un trattamento contro la varroa o una malattia applicato a un'arnia.

| Campo | Note |
|---|---|
| `id`, `hive_id`, `date` | soggetto e data di applicazione |
| `product`, `active_ingredient` | es. Oxuvar / acido ossalico |
| `dose`, `method` | es. 50 ml, gocciolamento |
| `batch_number` | lotto / carica (spesso obbligatorio per legge) |
| `withdrawal_until` | data a partire dalla quale il miele può essere raccolto in sicurezza |
| `reason` | es. varroa |
| `note` | testo libero |
| `apiary_id`, `queen_id` | contesto fissato al momento dell'applicazione |
| `scope_id` | l'id dell'apiario |

:::note
Le regole di trattamento e dosaggio variano in base al paese e all'autorizzazione
del prodotto. Openbeehive registra ciò che hai fatto; non prescrive nulla. Segui
sempre le autorizzazioni locali — vedi [Varroa](/beekeeping/varroa).
:::

### Placement

Il collegamento limitato nel tempo tra un'arnia e un apiario: dove un'arnia ha
vissuto e per quanto tempo. Una nuova collocazione si apre quando un'arnia si
sposta; la precedente si chiude.

| Campo | Note |
|---|---|
| `id`, `hive_id`, `apiary_id` | il collegamento |
| `from` / `until` | intervallo; `until` è null finché è in corso |
| `scope_id` | l'id dell'apiario |

### ApiaryShare

Concede a un altro apicoltore l'accesso a un apiario (e a tutto ciò che vi è
contenuto).

| Campo | Note |
|---|---|
| `id`, `apiary_id` | cosa viene condiviso |
| `user_id` | con chi viene condiviso |
| `role` | es. visualizzatore, editor |

## Scope e controllo della sincronizzazione

La condivisione avviene a livello di **apiario**, e un unico valore la governa:
ogni registrazione porta uno `scope_id`.

- Per i dati di proprietà dell'apiario — arnie, regine, ispezioni, task, eventi,
  raccolti, trattamenti, collocazioni e l'apiario stesso — lo `scope_id` è l'**id
  dell'apiario**.
- Per i dati che appartengono a un singolo utente e non vengono mai condivisi (es.
  le preferenze personali), lo `scope_id` assume la forma `user:<id>`.

Quando due dispositivi si sincronizzano, si scambiano solo gli scope a cui l'utente
ha diritto. Il server risolve l'insieme degli scope di un utente come:

```text
scopes(user) = { "user:<their id>" }
             ∪ { apiary.id  for each apiary they own }
             ∪ { share.apiary_id  for each ApiaryShare granting them access }
```

Aggiungere un `ApiaryShare` fa quindi comparire un intero apiario — ogni arnia e
ogni registrazione sotto di esso — sui dispositivi del destinatario alla
sincronizzazione successiva; revocarlo interrompe il flusso di ulteriori modifiche.
Poiché il controllo è la colonna `scope_id`, la condivisione è tutto-o-niente per
apiario e non richiede permessi per singola registrazione.

:::tip
L'id di un'arnia da solo non concede nulla. La scansione di un'[etichetta QR](/developers/qr-codes)
apre l'app su un'arnia solo se lo scope di quell'arnia è stato effettivamente
sincronizzato sul tuo dispositivo.
:::

## Perché si fonde in modo pulito

Le strutture descritte sopra sono scelte in modo che la sincronizzazione non
richieda mai l'intervento di una persona per risolvere un conflitto:

- I **campi scalari** (il colore di marcatura di una regina, il nome di un'arnia)
  usano il last-writer-wins per campo, deciso dai timestamp HLC.
- I **campi lista/insieme** usano OR-Set add-wins, così le aggiunte concorrenti
  sopravvivono tutte.
- Gli **eventi** sono append-only e immutabili, quindi si limitano ad accumularsi.

Per l'algoritmo completo, prosegui con il
[protocollo di sincronizzazione](/developers/sync-protocol).
