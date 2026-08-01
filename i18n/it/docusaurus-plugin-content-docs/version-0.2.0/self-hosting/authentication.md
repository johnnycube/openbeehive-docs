---
sidebar_position: 7
title: "Autenticazione"
---

# Autenticazione

Openbeehive ti permette di scegliere esattamente quanta autenticazione ti serve. Un apicoltore singolo che esegue il binario unico a casa può saltare del tutto l'accesso. Un'istanza condivisa può richiedere passkey, l'accesso tramite un provider di identità, o entrambi.

Questa pagina illustra le tre modalità, le impostazioni di sessione necessarie a ogni configurazione multiutente, e come configurare l'URL di reindirizzamento del tuo provider di identità.

:::note
L'autenticazione protegge l'accesso al *server* e alla sua API di sincronizzazione. L'app stessa resta offline-first: una volta effettuato l'accesso, il tuo dispositivo continua a leggere e scrivere localmente e si sincronizza in background. Vedi [Offline e sincronizzazione](/using-the-app/offline-and-sync).
:::

## Scegliere una modalità

| Modalità | Quando usarla | Impostazioni chiave |
| --- | --- | --- |
| Nessun accesso (utente singolo) | Una persona, un server, dietro la tua rete o un reverse proxy fidato | `BEEHIVE_OIDC_PROVIDERS` vuoto **e** `BEEHIVE_WEBAUTHN_ENABLED=false` |
| Email e password (account in-app) | Un'istanza condivisa in cui le persone si registrano da sole — non serve alcun provider di identità esterno | `BEEHIVE_PASSWORD_AUTH=true` (attivo per impostazione predefinita nel profilo `cloud`) |
| Passkey (WebAuthn) | Un piccolo gruppo; accesso senza password con dati biometrici del dispositivo o chiavi di sicurezza | `BEEHIVE_WEBAUTHN_ENABLED=true` più `WEBAUTHN_RP_*` |
| Provider OIDC | Hai già Google, Keycloak, Authentik, ecc., oppure vuoi un controllo centralizzato degli account | `BEEHIVE_OIDC_PROVIDERS` più le impostazioni per ciascun provider |

Puoi combinarle tutte. La schermata di accesso offre i metodi che sono abilitati, e l'account di una persona è condiviso tra i metodi — accedere con un provider si collega a un account email/password esistente con la stessa email.

## Modalità 1: utente singolo, nessun accesso

Questa è la configurazione più semplice e il punto di partenza predefinito per un'istanza `selfhost`. Lascia entrambe le opzioni disattivate:

```bash
BEEHIVE_OIDC_PROVIDERS=
BEEHIVE_WEBAUTHN_ENABLED=false
```

Senza alcun metodo di autenticazione abilitato, Openbeehive funziona come istanza a utente singolo e non richiede l'accesso. È ideale per un hobbista che esegue il [binario unico](/self-hosting/single-binary) su una macchina di casa o dietro una rete privata.

:::caution
"Nessun accesso" significa che chiunque possa raggiungere il server può leggere e modificare i tuoi dati. Usalo solo su una rete fidata, su `localhost`, o dietro un reverse proxy che gestisce esso stesso l'accesso. Se la tua istanza è raggiungibile da internet, abilita le passkey o OIDC.
:::

## Impostazioni di sessione (richieste una volta abilitato un qualsiasi accesso)

Non appena attivi le passkey o OIDC, il server emette cookie di sessione firmati. Devi fornire un segreto di sessione.

```bash
# Genera un segreto casuale robusto
openssl rand -base64 32
```

Imposta il risultato come `BEEHIVE_SESSION_SECRET` e, facoltativamente, regola la durata delle sessioni:

```bash
BEEHIVE_SESSION_SECRET=PUT_YOUR_GENERATED_SECRET_HERE
BEEHIVE_SESSION_TTL=720h
```

`BEEHIVE_SESSION_TTL` accetta una durata in formato Go (per esempio `720h` sono 30 giorni, `24h` è un giorno). Alla scadenza, gli utenti devono accedere di nuovo.

:::danger
Mantieni `BEEHIVE_SESSION_SECRET` segreto e stabile. Chiunque lo scopra può falsificare le sessioni. Se lo cambi, tutte le sessioni esistenti vengono invalidate e tutti devono accedere di nuovo. Non inserirlo mai nel controllo di versione.
:::

Se servi l'app tramite HTTPS attraverso un reverse proxy, assicurati che `BEEHIVE_PUBLIC_BASE_URL` usi `https://` in modo che i cookie e gli URL di reindirizzamento siano corretti. Vedi [Reverse proxy](/self-hosting/reverse-proxy).

## Email e password (account in-app)

Quando vuoi più utenti ma non gestisci un provider di identità, abilita gli account
email/password integrati:

```bash
BEEHIVE_PASSWORD_AUTH=true
```

Questo è **attivo per impostazione predefinita nel profilo `cloud`** e disattivato per `selfhost`. Con esso
abilitato, la schermata di accesso offre "crea account" e "accedi", e le persone possono
[registrarsi da sole](/using-the-app/accounts-tenants).

### Istanze solo su invito

Se non vuoi che estranei creino account, imposta `BEEHIVE_REGISTRATION=false` per
chiudere la registrazione aperta. La configurazione dell'amministratore al primo avvio
continua a funzionare, quindi un'istanza nuova può sempre creare il proprio account
amministratore. Dopo di che, le nuove persone possono unirsi solo tramite link di invito,
che un amministratore del tenant emette dalle Impostazioni e che devono corrispondere
all'indirizzo email invitato. La schermata di accesso mostra un avviso che l'istanza è
solo su invito.

**Il primo account è quello dell'amministratore.** Su un'istanza nuova la prima persona a
registrarsi diventa l'amministratore dell'istanza; tutti gli altri dopo di lei sono utenti normali. Ogni
nuovo account inizia con il proprio [tenant](/using-the-app/accounts-tenants) personale.

### Verifica email facoltativa

Per impostazione predefinita un nuovo account può accedere immediatamente. Per richiedere alle persone di confermare
prima il proprio indirizzo email, attiva la verifica:

```bash
BEEHIVE_EMAIL_VERIFICATION=true
```

L'account non può quindi accedere finché non segue il link di verifica. Configura
SMTP affinché l'email venga effettivamente inviata:

```bash
BEEHIVE_SMTP_HOST=smtp.example.com
BEEHIVE_SMTP_PORT=587
BEEHIVE_SMTP_USER=postbox@example.com
BEEHIVE_SMTP_PASS=your-smtp-password
BEEHIVE_SMTP_FROM=Openbeehive <no-reply@example.com>
```

:::note
Se `BEEHIVE_SMTP_HOST` viene lasciato vuoto, Openbeehive scrive il link di verifica nel
log del server invece di inviarlo via email — comodo per i test, non per la
produzione.
:::

## Modalità 2: passkey (WebAuthn)

Le passkey permettono alle persone di accedere con un'impronta digitale, una scansione del volto, un PIN del dispositivo o una chiave di sicurezza hardware. Non ci sono password da gestire.

```bash
BEEHIVE_WEBAUTHN_ENABLED=true
BEEHIVE_WEBAUTHN_RP_ID=beehive.example.com
BEEHIVE_WEBAUTHN_RP_ORIGINS=https://beehive.example.com
BEEHIVE_WEBAUTHN_RP_DISPLAY_NAME=Openbeehive
```

Cosa significa ciascun valore:

- `BEEHIVE_WEBAUTHN_RP_ID` è il **relying party ID**: il dominio registrabile che gli utenti visitano, senza schema e senza porta (per esempio `beehive.example.com`, oppure `localhost` per i test locali). Le passkey sono associate a questo dominio.
- `BEEHIVE_WEBAUTHN_RP_ORIGINS` è l'origine completa (o le origini separate da virgola) che il browser invierà, incluso lo schema ed eventuale porta, per esempio `https://beehive.example.com`.
- `BEEHIVE_WEBAUTHN_RP_DISPLAY_NAME` è il nome descrittivo mostrato nella richiesta di passkey del browser.

:::caution
WebAuthn richiede un **contesto sicuro**. Le passkey funzionano su HTTPS, oppure su `http://localhost` per lo sviluppo, ma non su HTTP semplice verso un indirizzo remoto. Metti il server dietro TLS prima di abilitare le passkey in produzione. L'`RP_ID` deve corrispondere al dominio nel tuo `BEEHIVE_PUBLIC_BASE_URL`.
:::

## Modalità 3: provider OIDC

Collega Openbeehive a uno o più provider di identità OpenID Connect. Elenca quelli che vuoi, separati da virgola, e configura ciascuno per nome.

:::note Gli account si collegano automaticamente
Quando qualcuno accede tramite un provider, Openbeehive trova o crea il suo
account in-app: confronta prima l'identità del provider, poi l'**indirizzo email**
(collegando un account email/password esistente a quel provider), e altrimenti
registra un nuovo account. Quindi una persona può accedere indifferentemente con un provider o con email
e password, e il primo account dell'istanza è quello dell'amministratore.
:::

```bash
BEEHIVE_OIDC_PROVIDERS=google,keycloak
BEEHIVE_OIDC_REDIRECT_URL=https://beehive.example.com/auth/callback
```

`BEEHIVE_OIDC_REDIRECT_URL` è l'indirizzo a cui il tuo provider rimanda gli utenti dopo che si sono autenticati. Deve essere raggiungibile dal browser e deve corrispondere esattamente a quello che registri presso il provider (vedi sotto).

### Google

```bash
BEEHIVE_OIDC_GOOGLE_ISSUER=https://accounts.google.com
BEEHIVE_OIDC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
BEEHIVE_OIDC_GOOGLE_CLIENT_SECRET=your-client-secret
BEEHIVE_OIDC_GOOGLE_SCOPES=openid,email,profile
```

Crea il client nella Google Cloud Console sotto **APIs & Services -> Credentials -> OAuth client ID** (tipo: applicazione Web).

### Keycloak e Authentik

Keycloak, Authentik e altri provider conformi agli standard usano le variabili generiche per ciascun provider. Il nome del provider in `BEEHIVE_OIDC_PROVIDERS` corrisponde al prefisso della variabile.

```bash
BEEHIVE_OIDC_PROVIDERS=keycloak
BEEHIVE_OIDC_KEYCLOAK_ISSUER=https://id.example.com/realms/main
BEEHIVE_OIDC_KEYCLOAK_CLIENT_ID=openbeehive
BEEHIVE_OIDC_KEYCLOAK_CLIENT_SECRET=your-client-secret
```

L'issuer è l'URL di base del realm; Openbeehive scopre il resto da `<issuer>/.well-known/openid-configuration`. Authentik funziona allo stesso modo usando l'URL di configurazione OpenID della sua applicazione come issuer.

:::tip
Il prefisso della variabile è semplicemente il nome del provider in maiuscolo. Per aggiungere un altro provider, aggiungi il suo nome a `BEEHIVE_OIDC_PROVIDERS` e fornisci i corrispondenti `BEEHIVE_OIDC_<NAME>_ISSUER`, `BEEHIVE_OIDC_<NAME>_CLIENT_ID` e `BEEHIVE_OIDC_<NAME>_CLIENT_SECRET`.
:::

### Registrare l'URL di reindirizzamento presso il tuo IdP

Nella configurazione del client del tuo provider, aggiungi un URI di reindirizzamento autorizzato che corrisponda a `BEEHIVE_OIDC_REDIRECT_URL` carattere per carattere:

```text
https://beehive.example.com/auth/callback
```

Errori comuni:

- Lo schema deve corrispondere (`https` in produzione, non `http`).
- Nessuna barra finale a meno che il tuo `BEEHIVE_OIDC_REDIRECT_URL` non ne abbia una.
- Usa il tuo dominio pubblico, non un hostname interno o `localhost`, a meno che tu non stia facendo test in locale.

Se l'accesso fallisce con un errore di mancata corrispondenza del reindirizzamento, il valore registrato presso l'IdP e il valore in `BEEHIVE_OIDC_REDIRECT_URL` differiscono da qualche parte.

## Verificare la configurazione

Dopo aver modificato una qualsiasi di queste impostazioni, riavvia il server e carica l'app in un browser:

1. Con **nessun accesso**, la dashboard si apre direttamente.
2. Con **passkey o OIDC**, dovresti vedere una schermata di accesso che offre ciascun metodo abilitato.
3. Completa un accesso e verifica di raggiungere la dashboard e che i dati si sincronizzino.

Se qualcosa non funziona, controlla i log del server e la guida alla [Risoluzione dei problemi](/knowledge-base/troubleshooting). Per l'elenco completo delle impostazioni, vedi [Configurazione](/self-hosting/configuration).
