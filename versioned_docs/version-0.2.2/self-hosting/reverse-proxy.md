---
sidebar_position: 8
title: "Reverse proxy & TLS"
---

# Reverse proxy & TLS

Openbeehive listens on plain HTTP by default (on `BEEHIVE_ADDR`, typically `:8080`). For
any deployment that other people will reach, you want to put it behind a reverse
proxy that terminates TLS and forwards traffic to the app. This page shows
working configurations for **Caddy** and **nginx**, and explains the handful of
settings that matter for offline-first sync to keep working.

:::tip Why a proxy?
A reverse proxy gives you HTTPS (which the PWA needs for service workers,
passkeys and a secure cookie), a clean public hostname, and a single place to
handle certificates and headers. You can keep Openbeehive bound to localhost and
let the proxy face the internet.
:::

## The three things to get right

Before touching proxy config, set these on the Openbeehive side.

| Setting | Why |
| --- | --- |
| `BEEHIVE_PUBLIC_BASE_URL` | Must be the **public HTTPS URL**, e.g. `https://bees.example.com`. It is used for OIDC redirects, QR deep links and absolute URLs. Getting this wrong breaks login and QR labels. |
| `BEEHIVE_CORS_ALLOWED_ORIGINS` | Only needed if the web app is served from a **different origin** than the API (e.g. API at `api.example.com`, app at `app.openbeehive.org`). Otherwise the default is fine. |
| `BEEHIVE_HTTP_WRITE_TIMEOUT=0` | Disables the write timeout so long-lived **Subscribe** sync streams are not cut off. See **Streaming and timeouts**. |

If the proxy and Openbeehive sit on the same host and serve everything from one
domain, `BEEHIVE_CORS_ALLOWED_ORIGINS=*` (the default) is all you need.

## Caddy

Caddy is the simplest option: it obtains and renews TLS certificates from Let's
Encrypt automatically, with no extra steps.

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

That is the whole file. Reload with `caddy reload` (or `systemctl reload caddy`)
and Caddy fetches a certificate on first request.

:::note
`flush_interval -1` tells Caddy to stream responses immediately rather than
buffering them, which is what the long-lived Subscribe stream needs. Caddy
handles WebSocket and HTTP/2 streaming upgrades transparently, so no extra
directives are required.
:::

Then set on the Openbeehive side:

```bash
BEEHIVE_PUBLIC_BASE_URL=https://bees.example.com
BEEHIVE_HTTP_WRITE_TIMEOUT=0
```

## nginx

nginx does not manage certificates itself, so pair it with **certbot**
(`certbot --nginx`) to issue and renew them.

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

Test and reload:

```bash
nginx -t && systemctl reload nginx
```

:::caution Streaming buffering
The two settings that catch people out with nginx are `proxy_buffering off` and
a long `proxy_read_timeout`. Without them, nginx will buffer the sync stream and
close idle connections after 60 seconds, so background sync keeps dropping and
reconnecting. The `proxy_read_timeout 3600s` is a safety net; the real fix is
`BEEHIVE_HTTP_WRITE_TIMEOUT=0` on the server.
:::

## Streaming and timeouts

Openbeehive's sync uses a long-lived **Subscribe** stream over Connect-RPC: the
client opens it and the server pushes changes down it for as long as the
connection is alive. Because the app is offline-first, every device reads and
writes locally and instantly, then this stream carries changes in the
background — so it is normal for it to stay open for hours.

That trips up proxies and HTTP servers that assume requests are short. To keep
the stream healthy:

- Set `BEEHIVE_HTTP_WRITE_TIMEOUT=0` so Openbeehive itself never times out the response.
- Disable response buffering at the proxy (`flush_interval -1` in Caddy,
  `proxy_buffering off` in nginx).
- Allow long read timeouts at the proxy (nginx `proxy_read_timeout`); Caddy has
  no read timeout on proxied streams by default.

If sync seems to stall or reconnect every minute, a buffering or timeout setting
on the proxy is almost always the cause.

## Split origins (app on a different host)

Most self-hosters serve the web app and the API from one domain, with
`BEEHIVE_SERVE_WEB=true`. If instead you run the PWA on a separate origin — for example
the hosted app at `app.openbeehive.org` talking to your own API — the browser
will block cross-origin requests unless you allow that origin explicitly.

```bash
BEEHIVE_PUBLIC_BASE_URL=https://api.example.com
BEEHIVE_CORS_ALLOWED_ORIGINS=https://app.openbeehive.org
BEEHIVE_CORS_ALLOW_CREDENTIALS=true
```

List multiple origins comma-separated. Avoid `*` together with
`BEEHIVE_CORS_ALLOW_CREDENTIALS=true`, as browsers reject that combination for
credentialed requests.

## Checklist

- [ ] `BEEHIVE_PUBLIC_BASE_URL` is the public `https://` URL.
- [ ] `BEEHIVE_HTTP_WRITE_TIMEOUT=0` is set on the server.
- [ ] Proxy streams responses unbuffered with generous timeouts.
- [ ] WebSocket/upgrade headers are passed through (nginx).
- [ ] TLS is in place — automatic with Caddy, via certbot with nginx.
- [ ] `BEEHIVE_CORS_ALLOWED_ORIGINS` is set only if the app is on a different origin.

For the underlying server options see [Configuration](/self-hosting/configuration),
and for first-run setup start with the
[Quick start](/self-hosting/quick-start). If sync still misbehaves after the
proxy is correct, see [Troubleshooting](/knowledge-base/troubleshooting).
