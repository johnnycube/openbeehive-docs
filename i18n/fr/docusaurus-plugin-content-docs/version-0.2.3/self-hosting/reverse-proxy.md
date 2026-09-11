---
sidebar_position: 8
title: "Reverse proxy et TLS"
---

# Reverse proxy et TLS

Openbeehive écoute en HTTP simple par défaut (sur `BEEHIVE_ADDR`, généralement `:8080`). Pour
tout déploiement que d'autres personnes atteindront, vous voudrez le placer derrière un reverse
proxy qui termine TLS et transmet le trafic à l'application. Cette page présente des
configurations fonctionnelles pour **Caddy** et **nginx**, et explique la poignée de
paramètres qui comptent pour que la synchronisation hors-ligne d'abord continue de fonctionner.

:::tip Pourquoi un proxy ?
Un reverse proxy vous offre HTTPS (dont la PWA a besoin pour les service workers,
les passkeys et un cookie sécurisé), un nom d'hôte public propre, et un seul endroit pour
gérer les certificats et les en-têtes. Vous pouvez garder Openbeehive lié à localhost et
laisser le proxy faire face à Internet.
:::

## Les trois choses à réussir

Avant de toucher à la configuration du proxy, définissez ceci côté Openbeehive.

| Paramètre | Pourquoi |
| --- | --- |
| `BEEHIVE_PUBLIC_BASE_URL` | Doit être l'**URL HTTPS publique**, par exemple `https://bees.example.com`. Elle est utilisée pour les redirections OIDC, les liens profonds des codes QR et les URL absolues. Une erreur ici casse la connexion et les étiquettes QR. |
| `BEEHIVE_CORS_ALLOWED_ORIGINS` | Nécessaire uniquement si l'application web est servie depuis une **origine différente** de l'API (par exemple l'API sur `api.example.com`, l'application sur `app.openbeehive.org`). Sinon, la valeur par défaut convient. |
| `BEEHIVE_HTTP_WRITE_TIMEOUT=0` | Désactive le délai d'écriture afin que les flux de synchronisation **Subscribe** de longue durée ne soient pas coupés. Voir **Flux et délais d'attente**. |

Si le proxy et Openbeehive sont sur le même hôte et servent tout depuis un seul
domaine, `BEEHIVE_CORS_ALLOWED_ORIGINS=*` (la valeur par défaut) est tout ce dont vous avez besoin.

## Caddy

Caddy est l'option la plus simple : il obtient et renouvelle automatiquement les certificats TLS de Let's
Encrypt, sans étapes supplémentaires.

```text title="Caddyfile"
bees.example.com {
    encode zstd gzip

    reverse_proxy 127.0.0.1:8080 {
        # Transmettre les vraies informations du client en amont
        header_up Host {host}
        header_up X-Forwarded-Proto {scheme}

        # Ne pas mettre en tampon ni expirer les réponses de synchronisation en flux
        flush_interval -1
    }
}
```

C'est tout le fichier. Rechargez avec `caddy reload` (ou `systemctl reload caddy`)
et Caddy récupère un certificat à la première requête.

:::note
`flush_interval -1` indique à Caddy de diffuser immédiatement les réponses plutôt que de les
mettre en tampon, ce dont le flux Subscribe de longue durée a besoin. Caddy
gère les mises à niveau de flux WebSocket et HTTP/2 de façon transparente, donc aucune
directive supplémentaire n'est requise.
:::

Définissez ensuite côté Openbeehive :

```bash
BEEHIVE_PUBLIC_BASE_URL=https://bees.example.com
BEEHIVE_HTTP_WRITE_TIMEOUT=0
```

## nginx

nginx ne gère pas les certificats lui-même, alors associez-le à **certbot**
(`certbot --nginx`) pour les émettre et les renouveler.

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

        # Passe-plat de la mise à niveau WebSocket / flux
        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Garder les flux Subscribe de longue durée ouverts et sans tampon
        proxy_buffering    off;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}

# Rediriger le HTTP simple vers HTTPS
server {
    listen 80;
    server_name bees.example.com;
    return 301 https://$host$request_uri;
}
```

Testez et rechargez :

```bash
nginx -t && systemctl reload nginx
```

:::caution Mise en tampon des flux
Les deux paramètres qui prennent les gens au dépourvu avec nginx sont `proxy_buffering off` et
un long `proxy_read_timeout`. Sans eux, nginx mettra en tampon le flux de synchronisation et
fermera les connexions inactives après 60 secondes, de sorte que la synchronisation en arrière-plan ne cesse de
décrocher et de se reconnecter. Le `proxy_read_timeout 3600s` est un filet de sécurité ; le vrai correctif est
`BEEHIVE_HTTP_WRITE_TIMEOUT=0` sur le serveur.
:::

## Flux et délais d'attente
La synchronisation d'Openbeehive utilise un flux **Subscribe** de longue durée via Connect-RPC : le
client l'ouvre et le serveur y pousse les changements aussi longtemps que la
connexion est active. Comme l'application est hors-ligne d'abord, chaque appareil lit et
écrit localement et instantanément, puis ce flux transporte les changements en
arrière-plan — il est donc normal qu'il reste ouvert pendant des heures.

Cela déstabilise les proxies et les serveurs HTTP qui supposent que les requêtes sont courtes. Pour garder
le flux sain :

- Définissez `BEEHIVE_HTTP_WRITE_TIMEOUT=0` afin qu'Openbeehive lui-même n'expire jamais la réponse.
- Désactivez la mise en tampon des réponses au niveau du proxy (`flush_interval -1` dans Caddy,
  `proxy_buffering off` dans nginx).
- Autorisez de longs délais de lecture au niveau du proxy (nginx `proxy_read_timeout`) ; Caddy n'a
  par défaut aucun délai de lecture sur les flux proxifiés.

Si la synchronisation semble se figer ou se reconnecter chaque minute, un paramètre de mise en tampon ou de délai d'attente
sur le proxy en est presque toujours la cause.

## Origines distinctes (application sur un hôte différent)

La plupart des auto-hébergeurs servent l'application web et l'API depuis un seul domaine, avec
`BEEHIVE_SERVE_WEB=true`. Si au contraire vous exécutez la PWA sur une origine distincte — par exemple
l'application hébergée sur `app.openbeehive.org` communiquant avec votre propre API — le navigateur
bloquera les requêtes cross-origin sauf si vous autorisez cette origine explicitement.

```bash
BEEHIVE_PUBLIC_BASE_URL=https://api.example.com
BEEHIVE_CORS_ALLOWED_ORIGINS=https://app.openbeehive.org
BEEHIVE_CORS_ALLOW_CREDENTIALS=true
```

Listez plusieurs origines séparées par des virgules. Évitez `*` avec
`BEEHIVE_CORS_ALLOW_CREDENTIALS=true`, car les navigateurs rejettent cette combinaison pour les
requêtes avec identifiants.

## Liste de contrôle

- [ ] `BEEHIVE_PUBLIC_BASE_URL` est l'URL `https://` publique.
- [ ] `BEEHIVE_HTTP_WRITE_TIMEOUT=0` est défini sur le serveur.
- [ ] Le proxy diffuse les réponses sans tampon avec des délais d'attente généreux.
- [ ] Les en-têtes WebSocket/upgrade sont transmis (nginx).
- [ ] TLS est en place — automatique avec Caddy, via certbot avec nginx.
- [ ] `BEEHIVE_CORS_ALLOWED_ORIGINS` n'est défini que si l'application est sur une origine différente.

Pour les options serveur sous-jacentes, voir [Configuration](/self-hosting/configuration),
et pour la configuration au premier lancement, commencez par le
[Démarrage rapide](/self-hosting/quick-start). Si la synchronisation se comporte encore mal après que le
proxy soit correct, voir [Dépannage](/knowledge-base/troubleshooting).
