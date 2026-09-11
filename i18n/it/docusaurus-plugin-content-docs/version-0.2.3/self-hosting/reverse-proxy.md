---
sidebar_position: 8
title: "Reverse proxy e TLS"
---

# Reverse proxy e TLS

Openbeehive è in ascolto su HTTP semplice per impostazione predefinita (su `BEEHIVE_ADDR`, tipicamente `:8080`). Per
qualsiasi deployment che altre persone raggiungeranno, conviene metterlo dietro un reverse
proxy che termina il TLS e inoltra il traffico all'app. Questa pagina mostra
configurazioni funzionanti per **Caddy** e **nginx**, e spiega le poche
impostazioni che contano affinché la sincronizzazione offline-first continui a funzionare.

:::tip Perché un proxy?
Un reverse proxy ti dà HTTPS (di cui la PWA ha bisogno per i service worker,
le passkey e un cookie sicuro), un hostname pubblico pulito e un unico posto dove
gestire certificati e header. Puoi mantenere Openbeehive legato a localhost e
lasciare che il proxy si affacci su internet.
:::

## Le tre cose da impostare correttamente

Prima di toccare la configurazione del proxy, imposta queste sul lato di Openbeehive.

| Impostazione | Perché |
| --- | --- |
| `BEEHIVE_PUBLIC_BASE_URL` | Deve essere l'**URL HTTPS pubblico**, ad es. `https://bees.example.com`. Viene usato per i redirect OIDC, i deep link QR e gli URL assoluti. Sbagliarlo interrompe il login e le etichette QR. |
| `BEEHIVE_CORS_ALLOWED_ORIGINS` | Necessario solo se la web app è servita da un'**origine diversa** da quella dell'API (ad es. API su `api.example.com`, app su `app.openbeehive.org`). Altrimenti il valore predefinito va bene. |
| `BEEHIVE_HTTP_WRITE_TIMEOUT=0` | Disabilita il write timeout così gli stream di sincronizzazione **Subscribe** di lunga durata non vengono interrotti. Vedi **Streaming e timeout**. |

Se il proxy e Openbeehive risiedono sullo stesso host e servono tutto da un
dominio, `BEEHIVE_CORS_ALLOWED_ORIGINS=*` (il valore predefinito) è tutto ciò che ti serve.

## Caddy

Caddy è l'opzione più semplice: ottiene e rinnova automaticamente i certificati TLS da Let's
Encrypt, senza passaggi extra.

```text title="Caddyfile"
bees.example.com {
    encode zstd gzip

    reverse_proxy 127.0.0.1:8080 {
        # Passa i dettagli reali del client a monte
        header_up Host {host}
        header_up X-Forwarded-Proto {scheme}

        # Non bufferizzare né far scadere le risposte di sincronizzazione in streaming
        flush_interval -1
    }
}
```

Questo è l'intero file. Ricarica con `caddy reload` (o `systemctl reload caddy`)
e Caddy recupera un certificato alla prima richiesta.

:::note
`flush_interval -1` indica a Caddy di inoltrare le risposte in streaming immediatamente anziché
bufferizzarle, che è ciò di cui ha bisogno lo stream Subscribe di lunga durata. Caddy
gestisce in modo trasparente gli upgrade di streaming WebSocket e HTTP/2, quindi non sono richieste
direttive extra.
:::

Poi imposta sul lato di Openbeehive:

```bash
BEEHIVE_PUBLIC_BASE_URL=https://bees.example.com
BEEHIVE_HTTP_WRITE_TIMEOUT=0
```

## nginx

nginx non gestisce esso stesso i certificati, quindi abbinalo a **certbot**
(`certbot --nginx`) per emetterli e rinnovarli.

```nginx title="/etc/nginx/sites-available/openbeehive.conf"
server {
    listen 443 ssl http2;
    server_name bees.example.com;

    ssl_certificate     /etc/letsencrypt/live/bees.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bees.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;

        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Pass-through dell'upgrade WebSocket / streaming
        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Mantieni aperti e non bufferizzati gli stream Subscribe di lunga durata
        proxy_buffering    off;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}

# Reindirizza HTTP semplice verso HTTPS
server {
    listen 80;
    server_name bees.example.com;
    return 301 https://$host$request_uri;
}
```

Testa e ricarica:

```bash
nginx -t && systemctl reload nginx
```

:::caution Buffering dello streaming
Le due impostazioni che mettono in difficoltà le persone con nginx sono `proxy_buffering off` e
un lungo `proxy_read_timeout`. Senza di esse, nginx bufferizzerà lo stream di sincronizzazione e
chiuderà le connessioni inattive dopo 60 secondi, così la sincronizzazione in background continua a cadere e
riconnettersi. Il `proxy_read_timeout 3600s` è una rete di sicurezza; la vera soluzione è
`BEEHIVE_HTTP_WRITE_TIMEOUT=0` sul server.
:::

## Streaming e timeout
La sincronizzazione di Openbeehive usa uno stream **Subscribe** di lunga durata su Connect-RPC: il
client lo apre e il server vi spinge le modifiche per tutto il tempo in cui la
connessione è viva. Poiché l'app è offline-first, ogni dispositivo legge e
scrive localmente e istantaneamente, poi questo stream trasporta le modifiche in
background — quindi è normale che resti aperto per ore.

Questo manda in difficoltà i proxy e i server HTTP che presumono che le richieste siano brevi. Per mantenere
lo stream integro:

- Imposta `BEEHIVE_HTTP_WRITE_TIMEOUT=0` così Openbeehive stesso non fa mai scadere la risposta.
- Disabilita il buffering delle risposte sul proxy (`flush_interval -1` in Caddy,
  `proxy_buffering off` in nginx).
- Consenti lunghi read timeout sul proxy (`proxy_read_timeout` in nginx); Caddy non ha
  read timeout sugli stream proxati per impostazione predefinita.

Se la sincronizzazione sembra bloccarsi o riconnettersi ogni minuto, è quasi sempre causata da un'impostazione di buffering o timeout
sul proxy.

## Origini separate (app su un host diverso)

La maggior parte dei self-hoster serve la web app e l'API da un unico dominio, con
`BEEHIVE_SERVE_WEB=true`. Se invece esegui la PWA su un'origine separata — ad esempio
l'app ospitata su `app.openbeehive.org` che comunica con la tua API — il browser
bloccherà le richieste cross-origin a meno che tu non consenta esplicitamente quell'origine.

```bash
BEEHIVE_PUBLIC_BASE_URL=https://api.example.com
BEEHIVE_CORS_ALLOWED_ORIGINS=https://app.openbeehive.org
BEEHIVE_CORS_ALLOW_CREDENTIALS=true
```

Elenca più origini separate da virgole. Evita `*` insieme a
`BEEHIVE_CORS_ALLOW_CREDENTIALS=true`, poiché i browser rifiutano quella combinazione per le
richieste con credenziali.

## Checklist

- [ ] `BEEHIVE_PUBLIC_BASE_URL` è l'URL pubblico `https://`.
- [ ] `BEEHIVE_HTTP_WRITE_TIMEOUT=0` è impostato sul server.
- [ ] Il proxy inoltra le risposte in streaming senza buffering con timeout generosi.
- [ ] Gli header WebSocket/upgrade sono passati (nginx).
- [ ] Il TLS è in atto — automatico con Caddy, tramite certbot con nginx.
- [ ] `BEEHIVE_CORS_ALLOWED_ORIGINS` è impostato solo se l'app è su un'origine diversa.

Per le opzioni sottostanti del server vedi [Configurazione](/self-hosting/configuration),
e per la configurazione del primo avvio parti dall'
[Avvio rapido](/self-hosting/quick-start). Se la sincronizzazione si comporta ancora male dopo che il
proxy è corretto, vedi [Risoluzione dei problemi](/knowledge-base/troubleshooting).
