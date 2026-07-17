---
sidebar_position: 8
title: "Reverse Proxy & TLS"
---

# Reverse Proxy & TLS

Openbeehive lauscht standardmäßig auf reinem HTTP (auf `BEEHIVE_ADDR`, typischerweise `:8080`). Für
jede Bereitstellung, die andere Personen erreichen werden, möchtest du es hinter einen Reverse
Proxy setzen, der TLS terminiert und den Verkehr an die App weiterleitet. Diese Seite zeigt
funktionierende Konfigurationen für **Caddy** und **nginx** und erklärt die wenigen
Einstellungen, die wichtig sind, damit die Offline-first-Synchronisation weiter funktioniert.

:::tip Warum ein Proxy?
Ein Reverse Proxy gibt dir HTTPS (das die PWA für Service Worker,
Passkeys und ein sicheres Cookie braucht), einen sauberen öffentlichen Hostnamen und einen einzigen Ort zum
Verwalten von Zertifikaten und Headern. Du kannst Openbeehive an localhost gebunden lassen und
den Proxy dem Internet zuwenden.
:::

## Die drei Dinge, die man richtig machen muss

Bevor du die Proxy-Konfiguration anfasst, setze diese auf der Openbeehive-Seite.

| Einstellung | Warum |
| --- | --- |
| `BEEHIVE_PUBLIC_BASE_URL` | Muss die **öffentliche HTTPS-URL** sein, z. B. `https://bees.example.com`. Sie wird für OIDC-Redirects, QR-Deeplinks und absolute URLs verwendet. Wenn dies falsch ist, brechen Anmeldung und QR-Etiketten. |
| `BEEHIVE_CORS_ALLOWED_ORIGINS` | Nur nötig, wenn die Web-App von einem **anderen Ursprung** als die API ausgeliefert wird (z. B. API auf `api.example.com`, App auf `app.openbeehive.org`). Andernfalls ist der Standard in Ordnung. |
| `BEEHIVE_HTTP_WRITE_TIMEOUT=0` | Deaktiviert den Write-Timeout, sodass langlebige **Subscribe**-Sync-Streams nicht abgeschnitten werden. Siehe **Streaming und Timeouts**. |

Wenn der Proxy und Openbeehive auf demselben Host sitzen und alles von einer
Domain ausliefern, reicht `BEEHIVE_CORS_ALLOWED_ORIGINS=*` (der Standard) aus.

## Caddy

Caddy ist die einfachste Option: Es beschafft und erneuert TLS-Zertifikate von Let's
Encrypt automatisch, ohne zusätzliche Schritte.

```text title="Caddyfile"
bees.example.com {
    encode zstd gzip

    reverse_proxy 127.0.0.1:8080 {
        # Pass the real client details upstream
        header_up Host {host}
        header_up X-Forwarded-Proto {scheme}

        # Don't buffer or time out streaming sync responses
        flush_interval -1
    }
}
```

Das ist die ganze Datei. Lade mit `caddy reload` (oder `systemctl reload caddy`) neu
und Caddy holt bei der ersten Anfrage ein Zertifikat.

:::note
`flush_interval -1` weist Caddy an, Antworten sofort zu streamen, statt sie zu
puffern, was der langlebige Subscribe-Stream benötigt. Caddy
behandelt WebSocket- und HTTP/2-Streaming-Upgrades transparent, sodass keine zusätzlichen
Direktiven erforderlich sind.
:::

Setze dann auf der Openbeehive-Seite:

```bash
BEEHIVE_PUBLIC_BASE_URL=https://bees.example.com
BEEHIVE_HTTP_WRITE_TIMEOUT=0
```

## nginx

nginx verwaltet Zertifikate nicht selbst, also kopple es mit **certbot**
(`certbot --nginx`), um sie auszustellen und zu erneuern.

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

        # WebSocket / streaming upgrade pass-through
        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Keep long-lived Subscribe streams open and unbuffered
        proxy_buffering    off;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}

# Redirect plain HTTP to HTTPS
server {
    listen 80;
    server_name bees.example.com;
    return 301 https://$host$request_uri;
}
```

Testen und neu laden:

```bash
nginx -t && systemctl reload nginx
```

:::caution Streaming-Pufferung
Die zwei Einstellungen, die Leute bei nginx stolpern lassen, sind `proxy_buffering off` und
ein langes `proxy_read_timeout`. Ohne sie puffert nginx den Sync-Stream und
schließt im Leerlauf befindliche Verbindungen nach 60 Sekunden, sodass die Hintergrund-Synchronisation immer wieder
abbricht und neu verbindet. Das `proxy_read_timeout 3600s` ist ein Sicherheitsnetz; die eigentliche Lösung ist
`BEEHIVE_HTTP_WRITE_TIMEOUT=0` auf dem Server.
:::

## Streaming und Timeouts
Die Synchronisation von Openbeehive verwendet einen langlebigen **Subscribe**-Stream über Connect-RPC: Der
Client öffnet ihn und der Server schiebt Änderungen darüber, solange die
Verbindung lebt. Da die App offline-first ist, liest und
schreibt jedes Gerät lokal und sofort, und dieser Stream trägt dann Änderungen im
Hintergrund — daher ist es normal, dass er stundenlang offen bleibt.

Das bringt Proxys und HTTP-Server durcheinander, die annehmen, dass Anfragen kurz sind. Um den
Stream gesund zu halten:

- Setze `BEEHIVE_HTTP_WRITE_TIMEOUT=0`, sodass Openbeehive selbst die Antwort niemals per Timeout beendet.
- Deaktiviere die Antwort-Pufferung am Proxy (`flush_interval -1` in Caddy,
  `proxy_buffering off` in nginx).
- Erlaube lange Read-Timeouts am Proxy (nginx `proxy_read_timeout`); Caddy hat
  standardmäßig kein Read-Timeout auf weitergeleiteten Streams.

Wenn die Synchronisation zu stocken oder jede Minute neu zu verbinden scheint, ist eine Pufferungs- oder Timeout-Einstellung
am Proxy fast immer die Ursache.

## Geteilte Ursprünge (App auf einem anderen Host)

Die meisten Self-Hoster liefern die Web-App und die API von einer Domain aus, mit
`BEEHIVE_SERVE_WEB=true`. Wenn du stattdessen die PWA auf einem separaten Ursprung betreibst — zum Beispiel
die gehostete App auf `app.openbeehive.org`, die mit deiner eigenen API spricht — wird der Browser
Cross-Origin-Anfragen blockieren, es sei denn, du erlaubst diesen Ursprung explizit.

```bash
BEEHIVE_PUBLIC_BASE_URL=https://api.example.com
BEEHIVE_CORS_ALLOWED_ORIGINS=https://app.openbeehive.org
BEEHIVE_CORS_ALLOW_CREDENTIALS=true
```

Liste mehrere Ursprünge kommagetrennt auf. Vermeide `*` zusammen mit
`BEEHIVE_CORS_ALLOW_CREDENTIALS=true`, da Browser diese Kombination für
credential-behaftete Anfragen ablehnen.

## Checkliste

- [ ] `BEEHIVE_PUBLIC_BASE_URL` ist die öffentliche `https://`-URL.
- [ ] `BEEHIVE_HTTP_WRITE_TIMEOUT=0` ist auf dem Server gesetzt.
- [ ] Der Proxy streamt Antworten ungepuffert mit großzügigen Timeouts.
- [ ] WebSocket-/Upgrade-Header werden durchgereicht (nginx).
- [ ] TLS ist eingerichtet — automatisch mit Caddy, über certbot mit nginx.
- [ ] `BEEHIVE_CORS_ALLOWED_ORIGINS` ist nur gesetzt, wenn die App auf einem anderen Ursprung liegt.

Für die zugrunde liegenden Server-Optionen siehe [Konfiguration](/self-hosting/configuration),
und für die Erstkonfiguration beginne mit dem
[Schnelleinstieg](/self-hosting/quick-start). Wenn die Synchronisation nach korrekt eingerichtetem Proxy
weiterhin Probleme macht, siehe [Fehlerbehebung](/knowledge-base/troubleshooting).
