---
sidebar_position: 2
title: "Storia ed eventi"
---

# Storia ed eventi

Openbeehive tratta i tuoi registri apistici come una storia che si svolge nel
tempo. Un'arnia viene spostata tra gli apiari, una regina regna e viene poi
sostituita, un raccolto viene registrato in un giorno particolare. Per rendere
questa storia accurata e utile, il modello dei dati tiene distinte due cose: cosa
è accaduto, e la situazione che era vera quando è accaduto.

Questa pagina spiega come gli eventi congelano il loro contesto, come le storie a
intervalli registrano i regni e le collocazioni, come i record di dettaglio
tipizzati si agganciano agli eventi, e come il client scrive e interroga tutto
questo offline.

## Gli eventi congelano il loro contesto

Un evento è un fatto append-only: registra che qualcosa è accaduto in un momento
nel tempo. Fondamentalmente, ogni evento memorizza un'istantanea del contesto
rilevante così com'era al momento dell'evento, anziché solo un puntatore allo
stato attuale.

Quando un evento viene scritto, il client risolve e memorizza:

- l'apiario a cui apparteneva l'arnia,
- l'arnia stessa,
- la regina che regnava in quell'arnia in quella data.

Questa istantanea viene denormalizzata sulla riga dell'evento. Il vantaggio è che
la storia rimane veritiera anche dopo che il mondo cambia. Se sposti un'arnia in
un nuovo apiario il mese prossimo, l'ispezione della scorsa settimana risulta
comunque avvenuta nell'apiario in cui ha effettivamente avuto luogo. Se sostituisci
la regina, un vecchio raccolto attribuisce ancora il miele alla regina che era al
comando in quel momento.

:::note
Poiché gli eventi sono append-only e portano con sé il proprio contesto, non
entrano mai in conflitto durante la sincronizzazione. Due dispositivi possono
aggiungere ciascuno eventi offline ed entrambi gli insiemi vengono conservati.
Consulta il [protocollo di sincronizzazione](/developers/sync-protocol) per le
regole prive di conflitti.
:::

## La tabella degli eventi è anche una tabella dei fatti

Le stesse righe degli eventi fungono anche da tabella dei fatti per le
statistiche. Le misure numeriche vivono direttamente sull'evento, in particolare
`amount_kg` per i raccolti, accanto alle dimensioni congelate (apiario, arnia,
regina, data, `scope_id`, tipo di evento).

Questo significa che i report comuni sono una singola query raggruppata su una
sola tabella, senza join necessari per attribuire un numero all'apiario, all'arnia
o alla regina che lo ha prodotto. Il contesto congelato è ciò che rende corretti
per costruzione i report "miele per apiario nel 2025" o "resa per regina".

## Storie a intervalli

Alcuni fatti si esprimono meglio come intervalli anziché come punti. Openbeehive
usa intervalli semi-aperti, scritti `[start, end)`: l'inizio è incluso, la fine è
esclusa. Questo fa sì che gli intervalli si affianchino in modo netto senza
sovrapposizioni o vuoti quando un periodo termina esattamente all'inizio del
successivo.

| Storia | Intervallo | Significato |
| --- | --- | --- |
| Regno della regina | `[installed, replaced)` | La regina è a capo della colonia dalla sua data di introduzione fino alla data in cui viene sostituita, esclusa. |
| Collocazione dell'arnia | `[from, to)` | L'arnia si trova in un dato apiario da `from` fino a `to`, escluso. |

Un regno o una collocazione corrente ha una fine aperta (ancora nessun
`replaced` / `to`). Quando una regina viene sostituita, l'intervallo della regina
uscente viene chiuso alla data di introduzione della nuova regina, e il nuovo
regno si apre lì. Gli spostamenti delle arnie funzionano allo stesso modo.

:::tip
Gli intervalli semi-aperti rendono "chi regnava nella data D?" un test semplice:
trova la riga in cui `installed <= D` e (`replaced` è null o `replaced > D`).
Corrisponde esattamente una riga, anche nel giorno del passaggio di consegne.
:::

## Record di dettaglio tipizzati

Gli eventi sono di diversi tipi, e i dettagli specifici del tipo vivono nei propri
record collegati all'evento:

- Dettaglio **ispezione**: osservazioni di una visita (covata, scorte, indole,
  regina vista, e così via).
- Dettaglio **raccolto**: cosa è stato prelevato, inclusa la misura `amount_kg`
  usata per le statistiche.
- Dettaglio **trattamento**: il prodotto applicato, la dose e i tempi per un
  trattamento contro la varroa o una malattia.

Mantenere i campi condivisi dell'evento (data, contesto congelato, `scope_id`) in
un unico posto e i campi specifici del tipo in record tipizzati mantiene pulita la
tabella dei fatti, consentendo comunque moduli e schermate ricchi e consapevoli
del tipo. Le forme di questi record sono descritte nel
[modello dei dati](/developers/data-model).

## resolveContext per le voci retrodatate

Gli apicoltori non registrano sempre le cose nel momento esatto in cui accadono.
Potresti inserire l'ispezione di sabato scorso lunedì sera. Quindi il contesto
deve essere risolto per la data propria dell'evento, non per "ora".

Il client usa una funzione di supporto, concettualmente:

```text
resolveContext(hiveId, date) -> { apiaryId, hiveId, queenId, scopeId }
```

Cerca l'arnia, poi consulta le storie a intervalli per trovare la collocazione
dell'apiario e il regno della regina che coprono `date`, e legge lo `scope_id`
dell'arnia. Il risultato viene congelato sull'evento.

```sql
-- Find the queen reigning in a hive on a given date.
SELECT id
FROM queens
WHERE hive_id = :hiveId
  AND installed <= :date
  AND (replaced IS NULL OR replaced > :date)
LIMIT 1;
```

```sql
-- Find the apiary the hive was placed in on a given date.
SELECT apiary_id
FROM hive_placements
WHERE hive_id = :hiveId
  AND from_date <= :date
  AND (to_date IS NULL OR to_date > :date)
LIMIT 1;
```

:::caution
Risolvi sempre il contesto rispetto alla data dell'evento. Usare l'apiario
attuale o la regina attuale dell'arnia attribuirebbe silenziosamente in modo
errato le voci retrodatate e corromperebbe le tue statistiche.
:::

## Quali funzioni del client scrivono la storia

Tre tipi di scrittura toccano la storia, e aiuta tenerli distinti:

1. **Aggiungere un evento.** Le funzioni di scrittura di ispezioni, raccolti,
   trattamenti e altri eventi chiamano prima `resolveContext(hiveId, date)`, poi
   aggiungono l'evento con il suo contesto congelato (e `amount_kg` dove
   applicabile) più il record di dettaglio tipizzato.
2. **Sostituire una regina.** Chiude il regno attuale alla nuova data di
   introduzione e apre un nuovo intervallo `[installed, replaced)`. Gli eventi
   esistenti mantengono la loro regina congelata originale.
3. **Spostare un'arnia.** Chiude la collocazione attuale alla data di
   spostamento e apre un nuovo intervallo `[from, to)` nell'apiario di
   destinazione. Gli eventi esistenti mantengono il loro apiario congelato
   originale.

I regni e le collocazioni sono righe a intervalli i cui campi scalari (la data di
chiusura) seguono il last-writer-wins per campo; gli eventi sono append-only e
immutabili una volta scritti. Le nuove correzioni si fanno aggiungendo ulteriori
eventi, non modificando quelli vecchi.

## Query statistiche

Poiché le misure e le dimensioni sono congelate sull'evento, i report raggruppano
direttamente:

```sql
-- Total honey per apiary for a season.
SELECT apiary_id, SUM(amount_kg) AS total_kg
FROM events
WHERE type = 'harvest'
  AND date >= '2025-01-01' AND date < '2026-01-01'
GROUP BY apiary_id;
```

```sql
-- Yield attributed to each queen.
SELECT queen_id, SUM(amount_kg) AS total_kg
FROM events
WHERE type = 'harvest'
GROUP BY queen_id;
```

Non servono join allo stato attuale: l'`apiary_id` e il `queen_id` congelati sono
già quelli corretti per il momento del raccolto.

## Offline e condivisione tramite scope_id

Ogni riga di evento e di storia porta lo `scope_id` del suo apiario. Gli ambiti
sono l'unità di condivisione in Openbeehive: concedere a qualcuno l'accesso a un
apiario condivide tutti gli eventi e le storie sotto quell'ambito.

Poiché le scritture sono locali e istantanee, la storia viene scritta prima nel
database SQLite sul dispositivo e sincronizzata in background. Il contesto
congelato fa sì che una voce retrodatata creata offline porti l'apiario, l'arnia
e la regina corretti anche se il dispositivo non ha visto le modifiche recenti da
altre parti; gli eventi append-only si uniscono senza conflitti quando il
dispositivo si riconnette.

Consulta [offline e sincronizzazione](/using-the-app/offline-and-sync) per il
comportamento rivolto all'utente e [Sviluppatori](/category/developers) per
l'architettura più ampia.
