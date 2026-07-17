---
sidebar_position: 3
title: "Arnie"
---

# Arnie

Un'arnia in Openbeehive rappresenta una singola colonia di api che vive in una cassetta fisica. Le arnie sono il cuore dei tuoi registri: quasi tutto ciò che annoti giorno per giorno, ispezioni, attività, raccolti e trattamenti, è collegato a un'arnia.

Ogni arnia appartiene a un solo apiario alla volta, e ogni arnia può avere una regina. Poiché Openbeehive è offline-first, puoi creare e modificare le arnie in apiario anche senza alcun segnale; le tue modifiche vengono salvate all'istante sul dispositivo e sincronizzate in background.

## Creare un'arnia

Apri un apiario e scegli **Aggiungi arnia**. Una nuova arnia ha bisogno solo di un nome per iniziare, ma alcuni dettagli aggiuntivi rendono i tuoi registri molto più utili in seguito.

| Campo | Cos'è | Note |
| --- | --- | --- |
| **Nome** | Come identifichi l'arnia | Un numero, un colore, un soprannome, qualsiasi cosa memorabile. |
| **Tipo di arnia** | Lo standard di telaino e cassetta | Vedi la tabella sotto. |
| **Stato** | Lo stato attuale della colonia | Per impostazione predefinita è **Attiva**. |
| **Foto** | Un'immagine dell'arnia | Utile per riconoscerla a colpo d'occhio. |

:::tip
Mantieni i nomi brevi e coerenti all'interno di un apiario, ad esempio "1", "2", "3" oppure "Rosso", "Blu", "Verde". I nomi brevi si stampano chiaramente sulle etichette QR e sono rapidi da leggere sul campo.
:::

### Tipi di arnia

Openbeehive supporta gli standard europei e internazionali più comuni:

| Tipo | Uso tipico |
| --- | --- |
| Zander | Diffuso in alcune zone della Germania e dell'Europa centrale. |
| Dadant | Popolare per la produzione di miele, grande nido. |
| Deutsch Normal | Uno standard tradizionale tedesco. |
| Langstroth | Lo standard più comune al mondo. |
| Warre | Un design verticale a basso intervento. |
| Top-bar | Barre orizzontali senza telaino. |
| Altro | Qualsiasi cosa non elencata sopra. |

Per una descrizione più completa di ciascuno standard, vedi [Tipi di arnia](/knowledge-base/hive-types).

### Stato

Lo stato descrive cosa sta succedendo alla colonia in questo momento.

| Stato | Significato |
| --- | --- |
| **Attiva** | Una colonia sana, con regina, in normale utilizzo. |
| **Nucleo** | Una piccola colonia iniziale (un "nucleo"), spesso una sciamatura artificiale o un'unità di fecondazione. |
| **Orfana** | La colonia ha perso la regina e necessita di attenzione. |
| **Persa** | La colonia è morta o ha abbandonato l'arnia. |
| **Sciolta** | Hai deliberatamente unito o smantellato la colonia. |

:::note
Impostare un'arnia su **Persa** o **Sciolta** ne conserva tutta la cronologia. I registri restano consultabili; l'arnia semplicemente esce dai tuoi elenchi delle arnie attive.
:::

## Spostare un'arnia tra apiari

Le colonie si spostano. Potresti portare a casa un nucleo, spostare le arnie sull'erica o consolidare due apiari. Per ricollocare un'arnia, aprila e scegli **Sposta**, quindi seleziona l'apiario di destinazione.

Spostare un'arnia non comporta alcuna perdita di dati. L'arnia mantiene il suo nome, la regina, la foto e l'intero registro; cambia solo il suo apiario a partire dalla data dello spostamento.

### Cronologia delle posizioni

Ogni spostamento viene registrato come una voce datata nella **cronologia delle posizioni** dell'arnia, così sai sempre dove si trovava una colonia in qualsiasi momento. È utile per tracciare l'esposizione alle malattie, per i registri dell'apicoltura nomade e per capire come ha reso una colonia in siti diversi.

:::caution
In molte regioni, lo spostamento delle arnie tra posizioni è soggetto a norme sanitarie e di movimentazione delle api, specialmente all'interno di zone di controllo delle malattie o di quarantena. Verifica i requisiti nazionali o locali prima di ricollocare le colonie. Vedi [Malattie e parassiti](/knowledge-base/diseases-and-pests) per un quadro generale, e segui sempre le indicazioni della tua autorità locale.
:::

## La vista di dettaglio dell'arnia

Aprire un'arnia ti offre un'unica schermata che raccoglie tutto ciò che riguarda quella colonia.

### A colpo d'occhio

- **Regina attuale** — chi è a capo della colonia, con il suo colore di marcatura e l'anno. Da qui puoi visualizzare la sua scheda, sostituirla o contrassegnare l'arnia come orfana. Vedi [Regine](/using-the-app/queens).
- **Ultima ispezione** — la data e un riepilogo della tua visita più recente, così puoi vedere a colpo d'occhio quando l'arnia è stata controllata l'ultima volta. Vedi [Ispezioni](/using-the-app/inspections).
- **Stato e tipo** — mostrati in evidenza, così lo stato della colonia non è mai in dubbio.

### Statistiche

La vista dell'arnia riassume la vita recente della colonia: numero di ispezioni, l'ultimo trattamento applicato, i totali di raccolto e le attività in sospeso. Sono ricavati direttamente dai tuoi registri, quindi restano accurati man mano che inserisci nuove voci.

### Diario delle visite

Sotto il riepilogo c'è il diario delle visite: un'unica linea temporale cronologica di tutto ciò che è accaduto all'arnia, comprese ispezioni, attività, eventi, raccolti e trattamenti. È il modo più rapido per ripercorrere la storia di una colonia e individuare schemi nel corso di una stagione.

### Etichetta QR

Ogni arnia può avere un'etichetta QR stampabile. Scansionandola con il telefono si apre l'app direttamente su quell'arnia, così puoi avviare un'ispezione senza cercare. Stampa le etichette dalla vista dell'arnia o in blocco per un intero apiario. Vedi [Etichette QR](/using-the-app/qr-labels).

:::tip
Attacca un'etichetta QR sul lato di ogni arnia a un'altezza alla quale puoi scansionarla senza doverti chinare sopra un melario pieno. Trasforma ogni visita in un tocco.
:::

## Eliminare contro ritirare un'arnia

Nella maggior parte dei casi dovresti cambiare lo **stato** di un'arnia anziché eliminarla. Impostare una colonia su **Persa** o **Sciolta** ne conserva l'intera cronologia, preziosa per i confronti anno su anno e per la tracciabilità.

Elimina un'arnia solo se è stata creata per errore. L'eliminazione è pensata per gli errori veri e propri, non per le colonie giunte a una fine naturale.
