---
sidebar_position: 6
title: "Attività"
---

# Attività

L'apicoltura è piena di piccoli lavori facili da dimenticare: aggiungere un
melario prima dell'importazione, montare un escludi-api il giorno prima della
smielatura, trattare contro la varroa una volta tolto il miele. Le attività sono
i promemoria di Openbeehive. Annotane una con una data di scadenza, e comparirà
nella tua dashboard quando arriva il giorno.

Come tutto il resto in Openbeehive, le attività vengono memorizzate prima
localmente e sincronizzate in background, così puoi aggiungerne una in apiario
senza segnale e ti aspetterà sui tuoi altri dispositivi più tardi.

## Creare un'attività

Apri la vista Attività e scegli **Nuova attività**. Un'attività ha solo pochi campi:

| Campo | Note |
| --- | --- |
| Titolo | Una breve descrizione del lavoro, ad es. "Aggiungere secondo nido". |
| Data di scadenza | Il giorno in cui l'attività dovrebbe apparire come in scadenza. Facoltativa, ma consigliata. |
| Apiario | Collega facoltativamente l'attività a un apiario specifico. |
| Note | Qualsiasi dettaglio aggiuntivo che vuoi ricordare. |

Mantieni il titolo breve e orientato all'azione. Il campo note è il posto per i
dettagli, come quale arnia, quanto sciroppo o quale trattamento intendi usare.

:::tip
Puoi creare un'attività senza data di scadenza per i lavori "un giorno o
l'altro", come "Costruire altre due cassette nucleo durante l'inverno".
Semplicemente non comparirà nei tuoi promemoria di scadenza finché non aggiungi
una data.
:::

### Collegare un'attività a un apiario

Se colleghi un'attività a un apiario, essa viaggia insieme ai registri di quell'apiario. È
comodo quando tieni le api in più di un posto, perché puoi vedere a colpo
d'occhio a quale postazione appartiene un lavoro, ad esempio "Tagliare l'erba
attorno alle arnie" all'apiario di casa contro "Controllare la recinzione"
all'apiario esterno.

Poiché la condivisione in Openbeehive avviene a livello di apiario tramite gli
scope, un'attività collegata a un apiario condiviso è visibile a chiunque abbia
accesso a quell'apiario. Questo rende le attività un modo semplice per
coordinarsi all'interno di un piccolo gruppo o di un'associazione. Vedi
[Apiari](/using-the-app/apiaries) per maggiori informazioni sulla condivisione.

## Aperte contro completate

Ogni attività è **aperta** oppure **completata**.

- Le attività **aperte** sono ancora da fare. Compaiono nel tuo elenco di attività
  e, una volta arrivata la data di scadenza, nella dashboard.
- Le attività **completate** sono terminate. Contrassegna un'attività come
  completata spuntandola; esce dal tuo elenco attivo ma resta nei tuoi registri,
  così puoi vedere cosa è stato fatto e quando.

Puoi riaprire un'attività che hai contrassegnato come completata per errore, e
puoi modificare il titolo, la data o le note di un'attività in qualsiasi momento.

:::note
Contrassegnare un'attività come completata è un semplice cambio di stato che si
sincronizza come qualsiasi altro campo. Grazie alla sincronizzazione
conflict-free di Openbeehive, se tu e un co-apicoltore spuntate entrambi la
stessa attività su dispositivi diversi, il risultato è coerente: l'attività
risulta completata. Vedi [Offline e
sincronizzazione](/using-the-app/offline-and-sync) per capire come funziona.
:::

## Come le attività in scadenza compaiono nella dashboard

La dashboard è il tuo punto di partenza quotidiano, e le attività in scadenza
sono una delle prime cose che ti mostra. Un'attività è considerata **in
scadenza** quando la sua data di scadenza è oggi o precedente e l'attività è
ancora aperta.

- Le attività in scadenza **oggi** compaiono nei promemoria della dashboard.
- Le attività la cui data di scadenza è **passata** restano visibili (in ritardo)
  finché non le contrassegni come completate, così nulla scivola via in silenzio.
- Le attività con una data di scadenza nel **futuro** attendono in silenzio e
  compaiono il giorno stesso.

Questo significa che puoi pianificare liberamente in anticipo. Programma un
lavoro tra tre settimane e dimenticalo; ricomparirà esattamente quando ti serve.
Vedi la [Dashboard](/using-the-app/dashboard) per il quadro completo di ciò che
mostra la tua schermata iniziale.

:::tip
Per i lavori ricorrenti, l'approccio più semplice è creare l'attività successiva
quando contrassegni come completata quella attuale. Ad esempio, dopo aver
completato un'ispezione a 7 giorni, aggiungi una nuova attività per la settimana
seguente.
:::

## Esempi di tipiche attività apistiche

Le attività funzionano meglio quando sono concrete e collocate nel tempo. Ecco
alcuni esempi comuni nel corso dell'anno:

**Primavera**

- Effettuare la prima ispezione completa in una giornata mite.
- Aggiungere un escludi-regina e il primo melario prima dell'importazione
  principale.
- Controllare le scorte di cibo dopo un'ondata di freddo.

**Inizio estate**

- Ispezionare ogni 7-9 giorni durante la stagione della sciamatura.
- Aggiungere o togliere melari secondo quanto dettato dall'importazione.
- Preparare le cassette nucleo per il controllo della sciamatura o le
  sciamature artificiali.

**Tarda estate / raccolto**

- Montare gli escludi-api il giorno prima della smielatura.
- Rimuovere ed estrarre i melari di miele.
- Iniziare il trattamento contro la varroa una volta tolto il miele.

**Autunno**

- Nutrire per l'inverno e controllare le scorte complessive.
- Montare i ripari antitopo prima delle prime gelate.
- Applicare un trattamento con acido ossalico nel periodo senza covata (i tempi
  variano in base alla regione e al metodo).

**Inverno**

- Soppesare le arnie per valutare le scorte; nutrire con candito se sono leggere.
- Liberare gli ingressi dalla neve dopo forti nevicate.
- Riparare e costruire l'attrezzatura pronta per la primavera.

:::caution
I tempi dei trattamenti e i prodotti che puoi usare legalmente variano da paese a
paese e da regione a regione. Segui sempre le indicazioni locali e l'etichetta
del prodotto. La pagina [Varroa](/beekeeping/varroa) tratta i principi, ma non
sostituisce le norme in vigore dove tieni le api.
:::

## Vedi anche

- [Dashboard](/using-the-app/dashboard) — dove compaiono le attività in scadenza.
- [Ispezioni](/using-the-app/inspections) — registrare ciò che riscontri in una visita.
- [L'anno apistico](/beekeeping/beekeeping-year) — cosa fare e quando.
