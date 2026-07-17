---
sidebar_position: 2
title: "Apiari"
---

# Apiari

Un **apiario** è un luogo dove tieni le api: il tuo giardino, un orto, un tetto, un campo in affitto o una postazione remota ai margini di un bosco. In Openbeehive, l'apiario si trova al vertice dei tuoi registri. Tutto il resto vi pende sotto.

La gerarchia è semplice:

```text
Apiary  ->  Hive  ->  Queen
```

Ogni apiario contiene una o più arnie, ogni arnia ha la sua regina attuale (e quelle passate), e le tue ispezioni, attività, eventi, raccolti e trattamenti sono tutti collegati a un'arnia all'interno di un apiario. Poiché l'apiario è la radice dell'albero, è anche l'unità che condividi con altre persone. Maggiori dettagli più sotto.

## Perché gli apiari sono importanti

Raggruppare le arnie per posizione fa più che tenere le cose in ordine. Alcuni vantaggi pratici:

- **Contesto per il tuo lavoro.** Quando arrivi in una postazione, apri quell'apiario e vedi solo le arnie che hai davanti.
- **Spostamenti e logistica.** Le coordinate ti permettono di ritrovare una postazione remota, condividerne la posizione o pianificare un giro di visite.
- **Confini di condivisione.** L'accesso viene concesso per apiario, così puoi condividere una postazione con un mentore o un socio senza esporre il resto della tua attività.

:::tip
Se tieni le api in più posti, crea un apiario per ogni posizione fisica. Mantiene ispezioni, raccolti e trattamenti raggruppati dove effettivamente svolgi il lavoro.
:::

## Creare un apiario

Dalla dashboard o dall'elenco degli apiari, scegli **Nuovo apiario** e compila i dettagli. È richiesto solo un nome; tutto il resto può essere aggiunto in seguito.

| Campo | Obbligatorio | A cosa serve |
| --- | --- | --- |
| **Nome** | Sì | Un'etichetta breve e riconoscibile, ad es. "Giardino di casa" o "Postazione frutteto". |
| **Indirizzo** | No | Un indirizzo o una descrizione a testo libero per aiutare te (e chiunque condivida con te) a trovare il luogo. |
| **Nota** | No | Qualsiasi cosa utile: codici dei cancelli, note di accesso, il nome del proprietario del terreno, il parcheggio. |
| **Latitudine / Longitudine** | No | Coordinate GPS dell'apiario, in gradi decimali. |

Poiché Openbeehive è offline-first, l'apiario viene salvato direttamente nel database sul tuo dispositivo nel momento in cui lo crei. Appare immediatamente, funziona senza segnale e si sincronizza con il server in background non appena torni online. Vedi [Offline e sincronizzazione](/using-the-app/offline-and-sync) per capire come funziona.

### Impostare le coordinate GPS

Puoi digitare latitudine e longitudine a mano, oppure toccare **Usa la mia posizione** per compilarle dal GPS del tuo dispositivo. Il browser ti chiederà l'autorizzazione la prima volta.

Le coordinate sono memorizzate in gradi decimali, ad esempio una latitudine di `52.5200` e una longitudine di `13.4050`. I valori negativi sono validi: a sud dell'equatore per la latitudine, a ovest di Greenwich per la longitudine.

:::note
"Usa la mia posizione" cattura il punto in cui **tu** ti trovi, che di solito è esattamente dove sono le arnie. Se configuri l'apiario da casa per una postazione remota, digita invece le coordinate manualmente, oppure correggile alla tua prossima visita.
:::

## Aggiungere e visualizzare le arnie

Apri un apiario per vedere tutte le sue arnie a colpo d'occhio, insieme a una rapida idea di come sta ciascuna. Da qui puoi:

- **Aggiungere un'arnia** con **Nuova arnia**, scegliendone il tipo (Zander, Dadant, Deutsch Normal, Langstroth, Warre, Top-bar o Altro) e dandole un nome o un numero.
- **Aprire un'arnia** per visualizzarne regina, ispezioni, attività, eventi, raccolti e trattamenti.

Per tutto ciò che puoi registrare per una singola colonia, vedi [Arnie](/using-the-app/hives) e [Regine](/using-the-app/queens).

## Stampare le etichette QR per l'apiario

Ogni arnia può portare un'**etichetta QR** stampabile. Dalla vista dell'apiario puoi stampare le etichette per tutte le sue arnie in una sola volta, il che è molto più rapido che farlo una alla volta.

Ogni etichetta codifica un deep link a quella specifica arnia. Scansionandola con un telefono si apre Openbeehive direttamente sull'arnia, così puoi avviare un'ispezione senza cercare tra gli elenchi. Attacca l'etichetta in un punto resistente alle intemperie sul corpo o sul coperchio dell'arnia.

Per le dimensioni delle etichette, la ristampa e come vengono costruiti i link, vedi [Etichette QR](/using-the-app/qr-labels).

:::tip
Stampa nuove etichette QR ogni volta che aggiungi un lotto di nuove arnie a una postazione. Portale con te e applicale sul posto, così l'arnia fisica e i tuoi registri coincidono fin dal primo giorno.
:::

## Modificare e riorganizzare

Puoi rinominare un apiario, aggiornarne l'indirizzo, la nota e le coordinate, o correggere i dettagli in qualsiasi momento. Le modifiche si sincronizzano come tutto il resto, con last-writer-wins per campo, quindi la modifica più recente di ciascun campo prevale anche se due persone modificano contemporaneamente.

Se un'arnia si sposta in una posizione diversa, spostala nell'apiario corrispondente affinché i tuoi registri continuino a riflettere la realtà. Gli apicoltori nomadi che spostano le colonie tra siti possono mantenere un apiario per sito e riassegnare le arnie man mano che si spostano.

## Condividere un apiario

La condivisione in Openbeehive avviene a livello di **apiario** tramite gli *scope*. Quando condividi un apiario, le persone che inviti ottengono l'accesso a quella postazione e alle arnie, regine e registri al suo interno, ma non ai tuoi altri apiari.

È questo che rende pratico:

- Condividere una singola postazione con un mentore, un apprendista o un co-apicoltore.
- Gestire un apiario di un'associazione o di un club che diversi membri mantengono insieme.
- Mantenere private le tue colonie di casa pur collaborando su un sito condiviso.

Poiché la sincronizzazione è conflict-free, più persone possono lavorare nello stesso apiario condiviso, anche offline, e le loro modifiche si uniscono in modo pulito quando i dispositivi si riconnettono.

Per il modello dati alla base degli scope e per capire come funziona la condivisione conflict-free sotto il cofano, vedi [Architettura](/developers/architecture).

:::caution
Condividere un apiario concede un accesso reale ai suoi registri. Invita solo persone di cui ti fidi, e ricorda che chiunque abbia accesso può aggiungere, modificare e registrare informazioni sulle arnie di quell'apiario.
:::

## Dove andare ora

- [Arnie](/using-the-app/hives) — aggiungi colonie e registra le tue osservazioni.
- [Regine](/using-the-app/queens) — tieni traccia delle tue regine e dei colori di marcatura.
- [Etichette QR](/using-the-app/qr-labels) — stampa e usa etichette scansionabili per le arnie.
- [Offline e sincronizzazione](/using-the-app/offline-and-sync) — come i tuoi registri restano disponibili ovunque.
