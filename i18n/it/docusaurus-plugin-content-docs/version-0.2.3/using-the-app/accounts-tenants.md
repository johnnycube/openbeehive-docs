---
sidebar_position: 13
title: "Account e tenant"
---

# Account e tenant

Il modo in cui accedi a Openbeehive dipende da come è configurata l'istanza. Un'istanza
self-hosted per un singolo utente potrebbe non richiedere alcun accesso; un'istanza condivisa (come il servizio
ospitato) assegna a ciascuno il proprio account e ti permette di organizzare gli alveari in
**tenant** tra cui passare.

## Accesso

A seconda dell'istanza, la schermata di accesso offre una o più delle seguenti opzioni:

- **Email e password** — crea un account con la tua email, poi accedi.
- **Un provider** (Google, Keycloak, …) — "Continua con …".
- **Una passkey** — la tua impronta digitale, il volto, il PIN del dispositivo o una chiave di sicurezza.
- **Niente del tutto** — un'istanza a utente singolo si apre direttamente sull'app.

Puoi usare i metodi che l'istanza offre, e sono tutti collegati allo stesso
account: se ti sei registrato inizialmente con email e password e in seguito accedi con un
provider che usa la **stessa email**, i due vengono collegati automaticamente.

:::note Il primo account è l'amministratore
Su un'istanza nuova di zecca, il **primo** account creato diventa l'amministratore
dell'istanza. Tutti coloro che si uniscono in seguito sono utenti normali.
:::

Se l'istanza richiede la verifica dell'email, riceverai un link di conferma via
email dopo la registrazione — aprilo prima del tuo primo accesso.

## Cos'è un tenant

Un **tenant** è un insieme di apiari e alveari che vanno insieme. Ogni
account parte con il proprio **tenant personale** — i tuoi apiari. Puoi anche
appartenere a **tenant condivisi**, per esempio:

- un apiario di un **club** o di un'associazione che diversi apicoltori curano insieme,
- una demo **didattica** o di un'associazione,
- una seconda attività che tieni separata dai tuoi alveari privati.

I tuoi dati risiedono sempre all'interno del **tenant attivo**. Cambiare tenant modifica
quali apiari, alveari e visite vedi.

## Cambiare tenant

Apri **Impostazioni → Tenant**. Vedrai ogni tenant a cui appartieni, con il tuo
ruolo in ciascuno. Tocca uno per renderlo attivo — l'app si ricarica con gli alveari
di quel tenant.

## Creare un tenant

In **Impostazioni → Tenant**, assegna un nome (ad es. "Club di apicoltura") e crealo.
Ne diventi l'**amministratore del tenant** (proprietario) e diventa il tuo tenant attivo. Aggiungi
apiari e alveari come al solito; apparterranno a questo tenant.

## Ruoli

| Ruolo | Cosa può fare |
| --- | --- |
| **Amministratore dell'istanza** | Il primo account sull'istanza; un ruolo a livello di istanza per gli operatori. |
| **Amministratore del tenant** (proprietario) | Gestisce un tenant e **invita** altri a unirsi. |
| **Membro** | Lavora con gli apiari e gli alveari del tenant. |

## Invitare apicoltori

Se sei un amministratore del tenant, apri **Impostazioni → Tenant → Invita un apicoltore**, inserisci
la sua email e invia l'invito. Riceverà un link; una volta che accede e
accetta, si unisce al tenant e può passare ad esso dalle proprie
**Impostazioni → Tenant**.

## La demo

Alcune istanze eseguono un **account demo**. Quando sei connesso ad esso, un banner
ti ricorda che stai esplorando la demo e che i suoi dati **si azzerano ogni
ora** — quindi sentiti libero di esplorare, aggiungere visite e provare cose; tutto
torna ai dati di esempio al prossimo azzeramento. Gli operatori possono abilitarlo tramite
[Demo mode](/self-hosting/demo).
