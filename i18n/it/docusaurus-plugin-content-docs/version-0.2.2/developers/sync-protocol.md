---
sidebar_position: 4
title: "Protocollo di sincronizzazione"
---

# Protocollo di sincronizzazione

Openbeehive è [offline-first](/using-the-app/offline-and-sync). Ogni lettura e scrittura avviene
contro un database SQLite-WASM locale sul dispositivo, e un processo in background
riconcilia quello stato locale con il server. Questa pagina documenta il protocollo
di trasmissione che fa funzionare la riconciliazione: il servizio Connect-RPC, i
suoi tre metodi, e le regole che entrambe le parti applicano quando uniscono le
modifiche.

Se non hai ancora letto la [panoramica del modello di sincronizzazione](/category/developers), parti da lì.
Questa pagina presuppone che tu sappia già che Openbeehive usa gli Hybrid Logical
Clocks (HLC), il last-writer-wins (LWW) per campo per gli scalari, gli OR-Set
(add-wins) per i campi elenco, e gli eventi append-only che non entrano mai in
conflitto.

## Il servizio

La sincronizzazione è esposta come un servizio Connect-RPC, così ogni metodo è
raggiungibile sia come gRPC sia come semplice HTTP/JSON. Ci sono tre metodi:

| Metodo | Direzione | Scopo |
| --- | --- | --- |
| `Pull` | client ← server | Recupera le modifiche che il client non ha ancora visto |
| `Push` | client → server | Invia le modifiche locali al server |
| `Subscribe` | server → client (stream) | "Spinta" opzionale quasi in tempo reale quando arrivano nuove modifiche |

Un ciclo tipico del client: esegue il `Push` della sua coda di uscita locale, poi
il `Pull` di tutto ciò che è nuovo, quindi resta inattivo finché `Subscribe` non
lo sollecita (o scatta un timer) e ripete.

## I cursori contro l'HLC

L'idea più importante in questo protocollo è che il **cursore di sincronizzazione
non è l'HLC**.

L'HLC è una *marca temporale logica* allegata a ogni scrittura di campo. Decide
*quale valore vince* durante un'unione — risponde alla domanda "questa modifica è
più recente di quella che ho già?". Gli HLC provengono da molti dispositivi,
possono spostarsi leggermente fuori ordine rispetto all'orologio reale, e non sono
globalmente monotoni nell'ordine di arrivo.

Il cursore è una *sequenza di ricezione assegnata dal server* — un singolo numero
intero strettamente crescente (`seq`) che il server marca su ogni modifica quando
viene accettata in modo durevole. Risponde a una domanda completamente diversa:
"cosa ho già consegnato a questo client?".

Usare la sequenza di ricezione come cursore ci dà due garanzie che l'HLC non può
offrire:

- **Ordine totale della consegna.** Poiché `seq` viene assegnato nell'ordine in
  cui il server accetta le scritture, un client può chiedere "tutto dopo seq N" ed
  essere certo di non perdere nulla, anche se quelle modifiche portano HLC fuori
  ordine.
- **Sicurezza in caso di replay.** Un client può persistere il proprio cursore e
  riprendere esattamente da dove si era interrotto dopo essere andato offline,
  essersi bloccato o essere stato reinstallato.

:::note
Non usare mai un HLC come cursore di impaginazione. Due dispositivi possono
legittimamente produrre la stessa regione di HLC mentre sono offline, e gli HLC
non vengono assegnati nell'ordine di arrivo — impaginare per HLC salterebbe o
duplicherebbe le modifiche. Impagina per `seq`, unisci per HLC.
:::

## Pull

`Pull` restituisce le modifiche che il client non ha visto, in ordine di `seq`,
più il cursore da usare la volta successiva.

```text
Pull(PullRequest { since_cursor: int64, limit: int32 })
  -> PullResponse { changes: Change[], next_cursor: int64, has_more: bool }
```

- `since_cursor` è l'ultimo cursore che il client ha applicato con successo. Invia
  `0` per una prima sincronizzazione completa.
- `changes` viene restituito ordinato per `seq` crescente, limitato agli ambiti
  che il chiamante può leggere (vedi **Replica parziale**).
- `next_cursor` è il `seq` più alto incluso in questa pagina. Persistilo solo
  dopo che l'intera pagina è stata applicata localmente.
- `has_more` è `true` quando il risultato è stato troncato da `limit`; il client
  dovrebbe eseguire immediatamente di nuovo il `Pull` con il nuovo `next_cursor`.

Un singolo `Change` porta abbastanza informazioni per essere unito in modo
indipendente:

```json
{
  "entity": "hive",
  "entity_id": "01HZX...",
  "scope_id": "apiary-01HZ...",
  "kind": "field",
  "field": "name",
  "value": "Hive 3 (north row)",
  "hlc": "2026-06-19T09:14:02.117Z-0003-nodeA",
  "seq": 48213
}
```

`kind` distingue le tre strategie di unione: `field` (LWW scalare),
`set_add` / `set_remove` (appartenenza a un OR-Set), ed `event` (append-only).

## Push

`Push` invia un lotto di modifiche locali al server. Il server applica ciascuna
con le stesse regole di unione che usa il client, assegna un nuovo `seq` a ogni
modifica accettata, e riferisce indietro.

```text
Push(PushRequest { changes: Change[] })
  -> PushResponse { server_cursor: int64, conflicts: Conflict[] }
```

- Il server verifica che il chiamante possa scrivere lo `scope_id` di ogni
  modifica.
- Per ogni modifica scalare `field` applica il LWW per campo: il valore in arrivo
  vince solo se il suo HLC è maggiore dell'HLC attualmente memorizzato per quel
  campo.
- Le operazioni sugli insiemi vengono applicate come add/remove di OR-Set; le
  aggiunte vincono sulle rimozioni concorrenti.
- Le modifiche `event` vengono aggiunte incondizionatamente — non entrano mai in
  conflitto.
- A ogni modifica accettata viene assegnato un nuovo `seq` strettamente crescente.
- `server_cursor` è il `seq` più alto assegnato in questo lotto, così il client
  può avanzare rapidamente senza un ulteriore giro di `Pull` per le proprie
  scritture.

### Conflitti

`conflicts` **non** è un elenco di errori — l'unione è sempre deterministica e
ha sempre successo. È un elenco informativo dei campi in cui il server deteneva
già un valore con un HLC più alto, quindi il valore inviato dal client *non* è
stato adottato.

```json
{
  "entity_id": "01HZX...",
  "field": "queen_status",
  "rejected_hlc": "2026-06-19T09:13:55.000Z-0001-nodeB",
  "winning_hlc": "2026-06-19T09:14:10.421Z-0007-nodeA"
}
```

Il client dovrebbe trattare un conflitto come un segnale per aggiornare quel campo
dal `Pull` successivo, dove riceverà il valore vincente. Non è necessario alcun
nuovo tentativo.

:::tip
Poiché il LWW è deterministico e ordinato per HLC, `Push` è idempotente:
reinviare una modifica il cui HLC ha già perso (o ha già vinto) lascia invariato
lo stato del server. I client possono ritentare con sicurezza un `Push` dopo una
connessione interrotta.
:::

## Subscribe

`Subscribe` è un canale opzionale in streaming dal server usato puramente come
segnale di risveglio. Non trasporta dati.

```text
Subscribe(SubscribeRequest { scopes: string[] })
  -> stream Poke { scope_id: string, server_cursor: int64 }
```

Quando una scrittura arriva in uno degli ambiti leggibili dal client, il server
emette un `Poke`. Il client risponde chiamando `Pull(since_cursor)` come al
solito. Mantenere i dati effettivi sul `Pull` significa che lo stream può essere
soggetto a perdite senza compromettere la correttezza — un poke mancato significa
soltanto che il `Pull` successivo guidato dal timer recupera.

:::note
`Subscribe` è un'ottimizzazione della latenza, non un requisito. Un client che si
limita a interrogare il `Pull` con un timer è del tutto corretto; è semplicemente
meno tempestivo.
:::

## Replica parziale per ambito
In Openbeehive la condivisione avviene a livello di **apiario** tramite gli
*ambiti*. Un utente replica solo i dati all'interno degli ambiti che può leggere,
non l'intero database.

Questo viene applicato su `Pull` e `Push`:

- `Pull` filtra `changes` agli ambiti leggibili dal chiamante prima di impaginare
  per `seq`. Il cursore avanza quindi su una *vista per ciascun chiamante* della
  sequenza globale — due utenti che condividono un apiario vedranno le modifiche
  di quell'apiario allo stesso `seq`, mentre ciascuno vede anche i propri ambiti
  privati.
- `Push` rifiuta le scritture verso ambiti che il chiamante non può scrivere.

Poiché il cursore è la sequenza di ricezione globale, un client può vedere dei
vuoti nei valori `seq` che riceve (le modifiche negli ambiti che non può leggere
vengono saltate). I vuoti sono attesi e innocui — al client serve sempre e solo il
*prossimo* cursore per chiedere altro.

## Logica di unione rispecchiata

Le funzioni di unione — confronto HLC, LWW per campo, risoluzione OR-Set,
aggiunta di eventi — sono **identiche sul client e sul server**. La stessa logica
che la PWA SvelteKit esegue quando applica un `Pull` è la logica che il backend Go
esegue quando applica un `Push`.

Questo rispecchiamento è ciò che rende il sistema genuinamente privo di conflitti
anziché meramente risolutore di conflitti:

- Una modifica produce lo stesso risultato unito indipendentemente da *dove*
  viene applicata o in *quale ordine* arriva, così client e server convergono
  senza negoziazione.
- Il server non è un arbitro privilegiato che può ignorare lo stato del
  dispositivo; applica le stesse regole deterministiche, poi assegna un `seq` per
  l'ordinamento.
- I nuovi tipi di entità hanno bisogno solo che le loro regole di unione siano
  definite una volta, nella semantica condivisa, ed entrambe le parti le
  rispettano.

Per i dettagli sottostanti dell'orologio e delle strutture dati, vedi la
[panoramica dell'architettura](/developers/architecture) e il
[modello dei dati](/developers/data-model). Per come gli eventi si inseriscono nel
percorso append-only, vedi [storia ed eventi](/developers/history-and-events).
