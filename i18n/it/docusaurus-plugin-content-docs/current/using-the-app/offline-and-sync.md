---
sidebar_position: 10
title: "Offline e sincronizzazione"
---

# Offline e sincronizzazione

Openbeehive è costruita per l'apiario, non per l'ufficio. Sul campo raramente hai
un segnale affidabile, quindi l'app è **offline-first**: tutto ciò che fai viene
salvato subito sul tuo dispositivo e sincronizzato con il server più tardi, in
silenzio, in background.

In pratica questo significa che l'app non ti fa mai aspettare la rete. Apri
un'arnia, registra un'ispezione, aggiungi un'attività, scatta una nota sulla
regina: tutto è istantaneo, con o senza segnale.

## Tutto viene salvato localmente

Quando installi Openbeehive, essa mantiene una copia completa dei tuoi registri
in un piccolo database sul tuo dispositivo. Ogni lettura e ogni scrittura avviene
prima su quella copia locale.

Il risultato:

- **È veloce.** Aprire un'arnia o scorrere le ispezioni non si blocca mai su una
  barra di caricamento.
- **Funziona senza segnale.** Un bosco, una valle, una cantina piena di melari:
  non fa alcuna differenza.
- **I tuoi dati sono tuoi.** I registri vivono sul tuo dispositivo; il server è
  una copia per la sincronizzazione e la condivisione, non l'unica sede dei tuoi
  dati.

:::tip
Poiché i registri sono memorizzati sul dispositivo, vale la pena installare
Openbeehive come app anziché usarla in una scheda del browser. Vedi
[Installare Openbeehive](/using-the-app/install) per come aggiungerla al tuo
telefono, tablet o desktop.
:::

## Il banner offline

Quando l'app non riesce a raggiungere il server, compare un piccolo banner per
farti sapere che stai lavorando offline. È puramente informativo: puoi continuare
esattamente come prima. Continua a registrare ispezioni, a spuntare attività, a
registrare un raccolto; nulla è bloccato.

Nel momento in cui il tuo dispositivo torna online, il banner sparisce e tutte le
modifiche fatte mentre eri offline vengono inviate automaticamente. Non c'è alcun
pulsante "sincronizza ora" da ricordare e nessun rischio di dimenticarsi di
salvare.

:::note
Un banner offline persistente di solito significa solo copertura debole là in
apiario. Se resta visibile anche con una buona connessione a casa, dai
un'occhiata a [Risoluzione dei problemi](/knowledge-base/troubleshooting).
:::

## Sincronizzazione tra i tuoi dispositivi

Puoi usare Openbeehive su diversi dispositivi, ad esempio un telefono sul campo e
un portatile a casa, e resteranno allineati automaticamente.

Ogni dispositivo mantiene la propria copia locale e scambia le modifiche con il
server in background. Registra un'ispezione sul telefono in apiario e, quando ti
siedi al portatile, è già lì. Le modifiche fluiscono in entrambe le direzioni.

Non devi scegliere un dispositivo "principale" né copiare nulla a mano. Finché
ogni dispositivo accede allo stesso account, vedono tutti gli stessi registri.

## Cosa succede quando due dispositivi cambiano la stessa cosa

Questa è la domanda che ogni apicoltore si pone, e la risposta rassicurante è:
non devi pensarci. Openbeehive risolve le modifiche sovrapposte
**automaticamente**, senza richieste del tipo "quale versione vuoi mantenere?" e
senza perdita di lavoro.

Alcuni esempi di come si comporta:

- **Tu modifichi le note di un'arnia sul telefono, il tuo co-apicoltore modifica
  le stesse note sul suo.** La modifica più recente a quel campo prevale; l'altra
  viene superata in modo pulito.
- **Aggiungete entrambi delle attività, o etichettate entrambi l'arnia, mentre
  siete offline.** Le aggiunte agli elenchi vengono conservate, così l'attività o
  l'etichetta di nessuno viene persa.
- **Ciascuno di voi registra un'ispezione separata.** Ispezioni, eventi e registri
  simili vengono solo aggiunti, mai sovrascritti, così entrambi vengono mantenuti
  affiancati.

Il risultato è che ogni dispositivo converge sullo stesso stato sensato una volta
che si sono tutti sincronizzati, e non ottieni mai un registro corrotto o unito a
metà.

:::tip
In breve: **aggiungi liberamente, modifica con sicurezza, non preoccuparti mai di
perdere dati.** Se sei curioso di sapere come funziona davvero sotto il cofano,
le pagine sul [protocollo di sincronizzazione](/developers/sync-protocol) e
sull'[architettura](/developers/architecture) lo spiegano in dettaglio.
:::

## Condividere un apiario

Openbeehive condivide i registri a livello di **apiario**. Quando condividi un
apiario, tutto ciò che contiene, le sue arnie, regine, ispezioni, attività,
eventi, raccolti e trattamenti, viene condiviso insieme ad esso. Questo mantiene
le cose semplici: concedi l'accesso a una postazione, non a decine di singole
arnie.

A ogni persona con cui condividi viene assegnato un ruolo:

| Ruolo | Cosa può fare |
| --- | --- |
| **Visualizzatore** | Vedere l'apiario e tutti i suoi registri. Non può apportare modifiche. |
| **Apicoltore** | Visualizzare e modificare: registrare ispezioni, completare attività, registrare raccolti e trattamenti, aggiornare arnie e regine. |
| **Proprietario** | Tutto ciò che può fare un apicoltore, più la gestione dell'apiario stesso e di chi vi ha accesso. |

Questo funziona bene per un apiario didattico di un'associazione, per un mentore
che tiene d'occhio le arnie di un nuovo apicoltore, o semplicemente per due
persone che condividono il lavoro nella stessa postazione. I registri condivisi
si sincronizzano e risolvono i conflitti esattamente come i tuoi, così le
modifiche di un partner compaiono automaticamente sui tuoi dispositivi.

:::note
La condivisione avviene per apiario, così puoi condividere una postazione con un
mentore mantenendo le altre completamente private.
:::

## Perderò mai dei dati?

No. I tuoi registri vengono scritti prima sul tuo dispositivo e non vengono
rimossi semplicemente perché sei offline o perché l'app si chiude. Attendono al
sicuro sul dispositivo finché non possono essere sincronizzati, poi si
sincronizzano da soli.

Per una tranquillità in più, in particolare se fai self-hosting, è comunque buona
pratica mantenere backup del server. Vedi [Backup](/self-hosting/backups) per come
farlo.

## Pagine correlate

- [Installare Openbeehive](/using-the-app/install)
- [Etichette QR](/using-the-app/qr-labels)
- [Architettura](/developers/architecture)
- [Protocollo di sincronizzazione](/developers/sync-protocol)
