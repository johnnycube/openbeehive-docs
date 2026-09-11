---
sidebar_position: 9
title: "Etichette QR"
---

# Etichette QR

Un'etichetta QR trasforma qualsiasi arnia in una scorciatoia da un solo tocco.
Attacca un'etichetta sul coperchio o sul nido, punta il telefono verso di essa e
Openbeehive si apre direttamente sul registro di quell'arnia. Niente scorrimento
di elenchi in apiario, niente occhi strizzati su numeri scritti a mano sotto la
pioggia.

È particolarmente comodo quando tieni diverse arnie che sembrano identiche, o
quando un aiutante che non conosce la tua numerazione deve trovare la colonia
giusta.

## Cosa contiene il codice QR

Il codice QR di ogni arnia codifica un singolo **deep link** a quell'arnia:

```text
<base>/h/<hiveId>
```

Il `<base>` è l'indirizzo della tua app (per il servizio ospitato è
`https://app.openbeehive.org`; per un self-host è il tuo URL). L'
`<hiveId>` è l'identificatore univoco dell'arnia.

Il codice non contiene dati sulle api, né pesi di miele, né informazioni
personali. È solo un link. Se qualcuno lo scansiona senza avere accesso ai tuoi
registri, gli verrà chiesto di accedere e vedrà l'arnia solo se è stata condivisa
con lui.

:::note
Il link apre l'**app**, che poi carica l'arnia dal tuo database locale.
Poiché Openbeehive è offline-first, l'arnia si apre comunque anche se non hai
segnale, una volta che l'app è installata sul telefono.
:::

## Stampare un'etichetta per una singola arnia

1. Apri l'arnia dal tuo elenco **Apiari**, o direttamente dall'arnia.
2. Scegli **Etichetta QR** (cercala nel menu delle azioni dell'arnia).
3. Compare un'anteprima che mostra il codice più il nome dell'arnia e l'apiario,
   così puoi distinguere le etichette prima che finiscano sulle cassette.
4. Seleziona **Stampa**. Si apre la finestra di stampa del browser.
5. Stampa su un foglio di etichette o su carta semplice, poi fissala all'arnia.

:::tip Falla durare all'aperto
Le arnie vivono sotto sole, pioggia e gelo. Per etichette che sopravvivano a una
stagione:

- Stampa su supporti di etichette resistenti alle intemperie o in vinile, **oppure**
- Stampa su carta e coprila con nastro da imballaggio trasparente o una pouch
  plastificante.

Posiziona l'etichetta in un punto in cui non venga raschiata dai melari sollevati
e rimessi — il lato del nido o sotto il bordo del coperchio funzionano entrambi
bene.
:::

## Stampare un foglio in blocco per un apiario

Se stai configurando un intero apiario in una volta sola, stampa insieme
l'etichetta di ogni arnia anziché una alla volta.

1. Apri l'**apiario** dal tuo elenco Apiari.
2. Scegli **Foglio QR** (o **Stampa etichette**) per l'apiario.
3. Openbeehive dispone un foglio con un codice etichettato per ogni arnia di
   quell'apiario.
4. Stampa, poi ritaglia e applica.

Questo mantiene anche un registro ordinato: un singolo foglio mostra ogni colonia
dell'apiario con il suo nome e codice affiancati.

## Scansionare un'etichetta

Puoi scansionare un'etichetta in due modi.

### Con la fotocamera del telefono

La maggior parte dei telefoni moderni riconosce i codici QR nell'app fotocamera
integrata. Punta la fotocamera verso l'etichetta, attendi che compaia il link e
toccalo. Il telefono apre il link e Openbeehive salta all'arnia.

Funziona per chiunque — un visitatore o un co-apicoltore può scansionare
un'arnia condivisa senza aprire prima l'app.

### Con lo scanner integrato nell'app

Openbeehive ha anche un proprio scanner, utile quando stai già lavorando
nell'app e vuoi passare rapidamente da un'arnia all'altra.

1. Apri lo scanner (cerca l'icona QR o della fotocamera nell'app).
2. Concedi l'autorizzazione alla fotocamera la prima volta che lo usi.
3. Punta verso un'etichetta — l'arnia si apre immediatamente.

:::tip
Lo scanner integrato ti mantiene all'interno di Openbeehive, così passi da un
registro di arnia al successivo senza rimbalzare attraverso il browser.
:::

## Se una scansione non apre l'arnia giusta

Alcune cause comuni e relative soluzioni:

| Sintomo | Causa probabile | Cosa fare |
| --- | --- | --- |
| La fotocamera non mette a fuoco il codice | Etichetta bagnata, sbiadita o arricciata | Asciugala; ristampala se è consumata |
| Il link si apre ma dice "non trovato" | L'arnia è stata eliminata, o è su un account diverso | Verifica che l'arnia esista ancora e di aver effettuato l'accesso con l'account giusto |
| Ti chiede di accedere | L'arnia appartiene all'apiario di qualcun altro | Chiedigli di condividere l'apiario con te |
| Non succede nulla al tocco | App non installata su questo telefono | Installa Openbeehive, poi scansiona di nuovo |

La condivisione avviene a livello di apiario, quindi per consentire a qualcuno di
scansionare un'arnia devi condividere il suo **apiario** con lui. Vedi [Offline e
sincronizzazione](/using-the-app/offline-and-sync) per capire come funzionano la
condivisione e gli scope.

## Ristampare e cambiare le etichette

Le etichette non scadono mai. Il link resta valido per tutta la vita dell'arnia,
quindi un codice stampato oggi funzionerà ancora la prossima stagione.

Se sposti l'attrezzatura, ricorda che l'etichetta segue il **registro
dell'arnia**, non la cassetta fisica. Quando ritiri una cassetta ma mantieni la
colonia come la stessa arnia in Openbeehive, la vecchia etichetta continua a
funzionare. Se avvii un nuovo registro di arnia, genera e stampa una nuova
etichetta per esso.

:::caution
Non spostare un'etichetta stampata dalla cassetta di un'arnia a un'altra
aspettandoti che punti alla nuova colonia — aprirà comunque l'arnia originale.
Stampa invece una nuova etichetta.
:::

## Approfondire

Vuoi il dettaglio tecnico — come viene analizzato il deep link, come
l'installazione nativa intercetta l'URL e come generare i codici a livello
programmatico? Vedi [Codici QR per sviluppatori](/developers/qr-codes).
