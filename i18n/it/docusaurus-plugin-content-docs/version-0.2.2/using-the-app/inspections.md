---
sidebar_position: 5
title: "Ispezioni (visite)"
---

# Ispezioni (visite)

Un'ispezione è la registrazione di una singola visita a un'arnia: ciò che hai visto, ciò che hai fatto e qualsiasi cosa valga la pena ricordare per la volta successiva. Nell'arco di una stagione queste visite si compongono in un racconto chiaro di come si sta sviluppando ogni colonia.

Poiché Openbeehive è offline-first, puoi registrare tutto accanto all'arnia senza alcun segnale. Le voci vengono salvate istantaneamente sul tuo dispositivo e si sincronizzano con il server in background non appena torni nel raggio di copertura. Vedi [Offline e sincronizzazione](/using-the-app/offline-and-sync) per capire come funziona.

:::tip
Per indicazioni su _cosa_ cercare durante una visita e con quale frequenza ispezionare, leggi [Ispezionare una colonia](/beekeeping/inspecting). Questa pagina spiega come registrarla.
:::

## Avviare un'ispezione

Apri un'arnia e tocca **Aggiungi ispezione** (oppure scansiona l'[etichetta QR](/using-the-app/qr-labels) dell'arnia per accedervi direttamente). Viene creata una nuova visita, contrassegnata con la data e l'ora correnti.

Ogni campo è facoltativo. Registra quanto preferisci, tanto o poco: un rapido "tutto a posto" è una voce perfettamente valida.

## Data e meteo

| Campo | Note |
| --- | --- |
| Data | Predefinita all'ora attuale; modificala se stai registrando una visita passata. |
| Meteo | Le condizioni del momento, ad es. soleggiato, nuvoloso, ventoso. Un contesto utile, dato che le api si comportano diversamente con il cattivo tempo. |

## Colonia e comportamento

Questa sezione registra lo stato della colonia nel giorno della visita.

| Campo | Cosa registra |
| --- | --- |
| Regina vista | Se hai effettivamente avvistato la regina. |
| Uova viste | Le uova sono il miglior segno rapido di una regina che ha deposto di recente. |
| Covata opercolata | Se è presente covata di operaie sigillata. |
| Larva più giovane | Lo stadio di covata più giovane che hai trovato, un segnale più preciso di deposizione recente. |
| Telaini occupati | Quanti telaini coprono le api. |
| Telaini di covata | Quanti telaini contengono covata. |
| Scorte di cibo | La tua valutazione delle scorte: scarse, adeguate o abbondanti. |
| Celle reali di sciamatura | Se sono presenti celle reali che suggeriscono preparativi di sciamatura. |
| Mansuetudine | Quanto è calma la colonia nel complesso. |
| Tranquillità sul favo | Se le api stanno tranquille sul favo oppure corrono e si agitano. |
| Conteggio varroa | Il conteggio degli acari da un cassetto o un lavaggio, se ne hai fatto uno. |

:::note
Raramente compilerai ogni campo a ogni visita. Il trio "regina vista / uova viste / larva più giovane" è di solito sufficiente per confermare una regina in deposizione in salute senza doverla trovare ogni volta.
:::

## Attività durante la visita

Registra tutto ciò che hai fatto mentre l'arnia era aperta. Queste attività alimentano anche i registri più ampi dell'arnia: ad esempio, il miele prelevato può confluire nei [Raccolti](/using-the-app/harvests).

| Attività | Registra |
| --- | --- |
| Nutrita | Quantità somministrata, in kg. |
| Telaini aggiunti / rimossi | I telaini che hai inserito o tolto. |
| Telaino da fuco tagliato | Se hai asportato un telaino di covata da fuco (una misura di controllo della varroa). |
| Melario aggiunto | Se hai aggiunto un melario per lo stoccaggio del miele. |
| Peso dell'arnia | Il peso misurato dell'arnia, se lo monitori. |
| Miele raccolto | Miele prelevato in questa visita. |

Per un quadro più ampio sulla gestione degli acari e sulla raccolta, vedi [Varroa](/beekeeping/varroa) e [Raccolta del miele](/beekeeping/honey-harvest).

## Clima: temperatura e umidità

Ogni ispezione può registrare temperatura e umidità relativa, sia **all'interno
dell'arnia** sia **all'esterno**, utili per monitorare il calore del nido di covata, la ventilazione e
lo svernamento.

| Campo | Registra | Unità |
| --- | --- | --- |
| Temperatura dell'arnia | Temperatura all'interno dell'arnia | °C |
| Temperatura esterna | Temperatura ambiente all'apiario | °C |
| Umidità dell'arnia | Umidità relativa all'interno dell'arnia | % |
| Umidità esterna | Umidità relativa esterna | % |

Tutti e quattro i campi sono facoltativi: compila ciò che hai misurato. Col tempo compaiono nei
**grafici di sviluppo** dell'arnia insieme al peso e alla forza della colonia.

:::tip Lascia che lo facciano i sensori
Non devi inserirli a mano. Una bilancia per arnie o una sonda di temperatura/umidità può
inviare le letture automaticamente tramite l'API: vedi
[Tracker automatizzati](/using-the-api/automated-trackers).
:::

## Note e foto

Aggiungi **note** in testo libero per tutto ciò che i campi strutturati non coprono: una cella di sostituzione contrassegnata, un carattere da tenere d'occhio, un promemoria per sostituire la regina.

Allega **foto** per catturare schemi di covata, sospette malattie o celle reali. Le immagini vengono memorizzate con la visita e si sincronizzano insieme al resto dei tuoi registri.

:::tip
Se qualcosa necessita di un seguito, crea un'[Attività](/using-the-app/tasks) a partire dalla visita, così non andrà persa.
:::

## Il registro delle visite per arnia

Ogni ispezione viene conservata, mai sovrascritta. Nella pagina dell'arnia trovi un **registro delle visite** cronologico: la cronologia completa di quella colonia, dalla più recente.

Questo registro ti permette di individuare le tendenze a colpo d'occhio: la covata che cresce in primavera, le scorte che calano prima dell'inverno, un conteggio della varroa in aumento o un problema di carattere che si sviluppa. Poiché ogni visita è un evento in sola aggiunta, la sincronizzazione tra dispositivi non perde mai un record né genera conflitti.

## Consigli per un inserimento rapido sul campo

Le ispezioni avvengono con i guanti indossati, sotto il sole battente, con le api in volo. Alcune abitudini mantengono rapido l'inserimento:

- **Scansiona l'etichetta QR** per aprire all'istante l'arnia giusta, senza scorrere un elenco.
- **Registra man mano.** Tocca i campi tra un telaino e l'altro invece di cercare di ricordare tutto dopo.
- **Affidati al trio rapido.** Uova viste, larva più giovane e covata opercolata confermano una regina in deposizione più in fretta che cercarla a tutti i costi.
- **Usa la voce o note brevi.** Lascia subito una breve nota; sistemala più tardi con calma a casa.
- **Non preoccuparti dei campi vuoti.** I campi vuoti vanno bene. Registra solo ciò che hai controllato.
- **Fotografa i casi dubbi.** Un'immagine di uno schema di covata insolito o di una cella reale vale più di una descrizione scritta.

:::caution
Se sospetti una malattia soggetta a denuncia come la peste americana o europea, fotografala, chiudi l'arnia e segui le norme di segnalazione locali. Gli obblighi di segnalazione variano da paese a paese e da regione a regione. Vedi [Malattie e parassiti](/knowledge-base/diseases-and-pests).
:::

---

Vedi anche: [Ispezionare una colonia](/beekeeping/inspecting) per la tecnica sul campo, e [Arnie](/using-the-app/hives) per dove risiede il registro delle visite.
