---
sidebar_position: 1
title: "La dashboard"
---

# La dashboard

La dashboard è il tuo punto di riferimento in Openbeehive. È la prima schermata che vedi quando apri l'app, ed è progettata per rispondere a una semplice domanda: di cosa devo occuparmi oggi?

Poiché Openbeehive è offline-first, tutto ciò che vedi nella dashboard viene letto direttamente dal database locale sul tuo dispositivo. Si carica all'istante e funziona che tu abbia o meno segnale in apiario. Le modifiche che apporti vengono sincronizzate con il server silenziosamente in background.

## Riquadri statistici

Nella parte superiore della dashboard trovi una riga di riquadri statistici che ti offrono un conteggio rapido di ciò che è presente nei tuoi registri:

| Riquadro | Cosa mostra |
| --- | --- |
| **Apiari** | Il numero di apiari che gestisci, inclusi quelli condivisi con te. |
| **Arnie** | Totale delle arnie in tutti i tuoi apiari. |
| **Regine** | Regine attualmente registrate a capo di una colonia. |
| **Attività aperte** | Attività non ancora contrassegnate come completate. |

Ogni riquadro è toccabile e ti porta alla sezione corrispondente dell'app, così puoi passare direttamente da un conteggio al dettaglio che vi sta dietro.

## Cosa c'è da fare

Sotto i riquadri, la dashboard raggruppa le cose che hanno una scadenza.

### Ispezioni in scadenza

Elenca le arnie la cui prossima ispezione è in scadenza o scaduta, in base all'intervallo che imposti durante l'ispezione. È il tuo promemoria per pianificare una visita. Tocca un'arnia per aprirla e avviare una nuova ispezione.

### Attività imminenti

Mostra le attività con una data di scadenza in arrivo, prima le più vicine. Le attività possono essere collegate a un'arnia o a un apiario specifico, oppure essere autonome (ad esempio "ordinare nuovi telaini"). Spuntane una qui senza uscire dalla dashboard.

### Ispezioni recenti

Un breve elenco delle tue visite più recenti, così puoi vedere a colpo d'occhio cosa hai riscontrato l'ultima volta in ciascuna colonia. Tocca una voce qualsiasi per leggere le note complete dell'ispezione.

### Miele di questa stagione

Un totale progressivo del miele che hai raccolto nella stagione corrente, ricavato dai tuoi registri di smielatura. È un modo rapido e gratificante per monitorare come sta andando l'anno.

:::tip
La dashboard riflette solo ciò che è presente nei tuoi registri. Più costantemente registri ispezioni, attività e raccolti, più utili diventano questi riepiloghi.
:::

## Come orientarsi

Il modo in cui navighi dipende dalle dimensioni dello schermo. Le stesse funzioni sono disponibili in entrambi i casi; cambia solo il layout.

### Su dispositivi mobili

Una **barra delle schede inferiore** ti dà accesso con un tocco alle aree principali dell'app: la dashboard, i tuoi apiari e arnie, le attività e così via. Resta fissa in fondo allo schermo, sempre a portata di pollice mentre lavori all'arnia.

### Su desktop e tablet

Una **barra laterale** scorre lungo il lato sinistro con lo stesso insieme di destinazioni, oltre a un po' più di spazio per mostrare etichette ed elementi nidificati. Sugli schermi più ampi questo lascia l'area principale libera per i tuoi registri.

## Account e impostazioni

Il tuo account e le impostazioni si trovano insieme in un unico posto, raggiungibile dalla navigazione. Qui puoi gestire il tuo profilo, disconnetterti e accedere alle preferenze valide per tutta l'app, come la lingua e (se il tuo server le utilizza) le passkey e i provider di accesso collegati.

Se gestisci un'istanza self-hosted a utente singolo senza login configurato, il blocco account mostra semplicemente il tuo profilo locale.

## L'indicatore online/offline

Un piccolo indicatore mostra il tuo stato di connessione e sincronizzazione attuale.

- **Online** significa che l'app è connessa e sta sincronizzando le modifiche con il server.
- **Offline** significa che al momento non c'è connessione. Questo è del tutto normale e non c'è da preoccuparsi: puoi continuare ad aggiungere ispezioni, attività e tutto il resto esattamente come sempre.

Quando torni in copertura, Openbeehive si sincronizza automaticamente. Grazie alla sua progettazione conflict-free, le modifiche apportate su dispositivi diversi mentre eri offline vengono unite in modo pulito quando si ricongiungono.

:::note
Vedere "offline" **non** significa che perderai dati. Tutto viene salvato prima localmente. L'indicatore ti sta solo dicendo quando la sincronizzazione in background è in pausa. Per saperne di più su come funziona, vedi [Offline e sincronizzazione](/using-the-app/offline-and-sync).
:::

## Cambiare la lingua

Openbeehive è disponibile in diverse lingue. Per cambiarla:

1. Apri **Impostazioni**.
2. Trova l'opzione **Lingua**.
3. Scegli la lingua che preferisci.

Le lingue disponibili sono:

| Codice | Lingua |
| --- | --- |
| `en` | Inglese (English) |
| `de` | Tedesco (Deutsch) |
| `fr` | Francese (Français) |
| `es` | Spagnolo (Español) |
| `it` | Italiano (Italiano) |

La modifica ha effetto immediato e viene ricordata sul tuo dispositivo.

## Dove andare ora

Dalla dashboard puoi diramarti verso il resto dell'app:

- Configura i tuoi [apiari](/using-the-app/apiaries) e le tue [arnie](/using-the-app/hives).
- Registra una visita nelle [ispezioni](/using-the-app/inspections).
- Tieni sotto controllo i lavori con le [attività](/using-the-app/tasks).
- Registra il tuo raccolto nelle [smielature](/using-the-app/harvests).

Per una panoramica più ampia di tutto ciò che l'app può fare, vai alla panoramica [Usare l'app](/category/using-the-app).
