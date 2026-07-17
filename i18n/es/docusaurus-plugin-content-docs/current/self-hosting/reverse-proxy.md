---
sidebar_position: 8
title: "Proxy inverso y TLS"
---

# Proxy inverso y TLS

Openbeehive escucha en HTTP plano por defecto (en `BEEHIVE_ADDR`, normalmente `:8080`). Para
cualquier despliegue al que otras personas vayan a acceder, conviene ponerlo detras de un proxy
inverso que termine el TLS y reenvie el trafico a la aplicacion. Esta pagina muestra
configuraciones funcionales para **Caddy** y **nginx**, y explica el punado de
ajustes que importan para que la sincronizacion offline-first siga funcionando.

:::tip ¿Por que un proxy?
Un proxy inverso te da HTTPS (que la PWA necesita para los service workers,
las claves de acceso y una cookie segura), un nombre de host publico limpio y un unico lugar para
gestionar certificados y encabezados. Puedes mantener Openbeehive enlazado a localhost y
dejar que el proxy de cara a internet.
:::

## Las tres cosas que hay que acertar

Antes de tocar la configuracion del proxy, establece estos en el lado de Openbeehive.

| Ajuste | Por que |
| --- | --- |
| `BEEHIVE_PUBLIC_BASE_URL` | Debe ser la **URL HTTPS publica**, p. ej. `https://bees.example.com`. Se usa para las redirecciones OIDC, los enlaces directos de los QR y las URL absolutas. Equivocarse aqui rompe el inicio de sesion y las etiquetas QR. |
| `BEEHIVE_CORS_ALLOWED_ORIGINS` | Solo es necesario si la aplicacion web se sirve desde un **origen distinto** al de la API (p. ej. la API en `api.example.com`, la aplicacion en `app.openbeehive.org`). De lo contrario, el valor por defecto esta bien. |
| `BEEHIVE_HTTP_WRITE_TIMEOUT=0` | Desactiva el tiempo de espera de escritura para que los flujos de sincronizacion **Subscribe** de larga duracion no se corten. Consulta **Transmision y tiempos de espera**. |

Si el proxy y Openbeehive se encuentran en el mismo host y sirven todo desde un
dominio, `BEEHIVE_CORS_ALLOWED_ORIGINS=*` (el valor por defecto) es todo lo que necesitas.

## Caddy

Caddy es la opcion mas sencilla: obtiene y renueva certificados TLS de Let's
Encrypt automaticamente, sin pasos adicionales.

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

Ese es todo el archivo. Recarga con `caddy reload` (o `systemctl reload caddy`)
y Caddy obtiene un certificado en la primera solicitud.

:::note
`flush_interval -1` le indica a Caddy que transmita las respuestas de inmediato en lugar de
almacenarlas en bufer, que es lo que necesita el flujo Subscribe de larga duracion. Caddy
gestiona las actualizaciones de transmision de WebSocket y HTTP/2 de forma transparente, asi que no se
requieren directivas adicionales.
:::

Luego establece en el lado de Openbeehive:

```bash
BEEHIVE_PUBLIC_BASE_URL=https://bees.example.com
BEEHIVE_HTTP_WRITE_TIMEOUT=0
```

## nginx

nginx no gestiona los certificados por si mismo, asi que emparejalo con **certbot**
(`certbot --nginx`) para emitirlos y renovarlos.

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

Prueba y recarga:

```bash
nginx -t && systemctl reload nginx
```

:::caution Almacenamiento en bufer de la transmision
Los dos ajustes que dan problemas a la gente con nginx son `proxy_buffering off` y
un `proxy_read_timeout` largo. Sin ellos, nginx almacenara en bufer el flujo de sincronizacion y
cerrara las conexiones inactivas tras 60 segundos, de modo que la sincronizacion en segundo plano sigue cayendo
y reconectandose. El `proxy_read_timeout 3600s` es una red de seguridad; la solucion real es
`BEEHIVE_HTTP_WRITE_TIMEOUT=0` en el servidor.
:::

## Transmision y tiempos de espera
La sincronizacion de Openbeehive usa un flujo **Subscribe** de larga duracion sobre Connect-RPC: el
cliente lo abre y el servidor le envia cambios durante todo el tiempo que la
conexion este viva. Como la aplicacion es offline-first, cada dispositivo lee y
escribe localmente y al instante, y luego este flujo transporta los cambios en
segundo plano — asi que es normal que permanezca abierto durante horas.

Eso confunde a los proxies y servidores HTTP que suponen que las solicitudes son cortas. Para mantener
el flujo sano:

- Establece `BEEHIVE_HTTP_WRITE_TIMEOUT=0` para que el propio Openbeehive nunca agote el tiempo de la respuesta.
- Desactiva el almacenamiento en bufer de respuestas en el proxy (`flush_interval -1` en Caddy,
  `proxy_buffering off` en nginx).
- Permite tiempos de lectura largos en el proxy (`proxy_read_timeout` de nginx); Caddy no tiene
  tiempo de espera de lectura en los flujos proxy por defecto.

Si la sincronizacion parece estancarse o reconectarse cada minuto, un ajuste de bufer o tiempo de espera
en el proxy es casi siempre la causa.

## Origenes divididos (aplicacion en un host distinto)

La mayoria de quienes hacen alojamiento propio sirven la aplicacion web y la API desde un dominio, con
`BEEHIVE_SERVE_WEB=true`. Si en cambio ejecutas la PWA en un origen separado — por ejemplo
la aplicacion alojada en `app.openbeehive.org` comunicandose con tu propia API — el navegador
bloqueara las solicitudes de origen cruzado a menos que permitas ese origen explicitamente.

```bash
BEEHIVE_PUBLIC_BASE_URL=https://api.example.com
BEEHIVE_CORS_ALLOWED_ORIGINS=https://app.openbeehive.org
BEEHIVE_CORS_ALLOW_CREDENTIALS=true
```

Enumera multiples origenes separados por comas. Evita `*` junto con
`BEEHIVE_CORS_ALLOW_CREDENTIALS=true`, ya que los navegadores rechazan esa combinacion para
solicitudes con credenciales.

## Lista de comprobacion

- [ ] `BEEHIVE_PUBLIC_BASE_URL` es la URL publica `https://`.
- [ ] `BEEHIVE_HTTP_WRITE_TIMEOUT=0` esta establecido en el servidor.
- [ ] El proxy transmite las respuestas sin bufer con tiempos de espera generosos.
- [ ] Los encabezados de WebSocket/actualizacion se transmiten (nginx).
- [ ] El TLS esta en su lugar — automatico con Caddy, mediante certbot con nginx.
- [ ] `BEEHIVE_CORS_ALLOWED_ORIGINS` se establece solo si la aplicacion esta en un origen distinto.

Para las opciones subyacentes del servidor, consulta [Configuracion](/self-hosting/configuration),
y para la configuracion del primer arranque empieza por el
[Inicio rapido](/self-hosting/quick-start). Si la sincronizacion sigue comportandose mal despues de que el
proxy sea correcto, consulta [Resolucion de problemas](/knowledge-base/troubleshooting).
