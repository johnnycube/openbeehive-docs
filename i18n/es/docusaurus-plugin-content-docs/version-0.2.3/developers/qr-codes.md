---
sidebar_position: 6
title: "Códigos QR y deep links"
---

# Códigos QR y deep links

Cada colmena en Openbeehive puede llevar una etiqueta QR imprimible. Escanéala en
el colmenar y la app se abre directamente en esa colmena, sin menús que excavar.
Esta página explica cómo funciona la codificación, cómo se resuelven los enlaces
sin conexión, cómo se conectan los deep links nativos y cómo se comporta el
escáner dentro de la app.

## Qué codifica un QR de colmena

Un QR de colmena codifica una única URL de la forma:

```text
<base>/h/<hiveId>
```

- `<base>` es tu `BEEHIVE_PUBLIC_BASE_URL` (por ejemplo `https://app.openbeehive.org`).
- `<hiveId>` es el identificador estable de la colmena: un UUID acuñado en el
  dispositivo cuando se crea la colmena por primera vez.

El id es el mismo UUID offline-first usado en todas partes del modelo de datos. Se
genera localmente, nunca se reasigna y sobrevive intacto a la sincronización. Esa
estabilidad es lo que hace que una etiqueta impresa sea segura: el QR que pegas en
la cámara de cría en primavera sigue apuntando a la misma colmena años después.

:::note
El id codifica una colmena, no un permiso. Conocer o adivinar un id de colmena no
concede acceso por sí solo. Consulta **El acceso está controlado por la compartición**.
:::

## Cómo se resuelve `/h/[id]`

La ruta `/h/[id]` es un resolvedor ligero, no una página por sí misma. Cuando se
carga:

1. Busca el `id` en la base de datos SQLite-WASM **local** (OPFS).
2. Si la colmena está presente, redirige a la app en `/app/hives/[id]`.
3. Si la colmena **no** está presente localmente, dispara una sincronización y
   luego vuelve a comprobar.
4. Si la colmena sigue sin encontrarse o no tienes acceso a ella, lo indica.

Como el paso 1 lee de la base de datos local, un escaneo se resuelve al instante
cuando estás sin conexión, siempre que la colmena ya esté en el dispositivo. La
sincronización del paso 3 es la única parte que necesita cobertura, y solo se
ejecuta cuando la colmena falta (por ejemplo, un colmenar que se acaba de
compartir contigo).

```text
scan QR  ->  /h/<id>  ->  local lookup
                              |
                  found ------+------ not found
                    |                    |
          /app/hives/<id>           sync, re-check
                                         |
                              found -> /app/hives/<id>
                              still missing -> "not found / not shared"
```

### El acceso está controlado por la compartición
La resolución siempre pasa por las reglas normales de sincronización y
compartición. La compartición en Openbeehive ocurre a nivel de **colmenar**
mediante ámbitos; una colmena se vuelve visible para ti solo porque su colmenar
está en un ámbito que puedes sincronizar. La ruta `/h/[id]` nunca lo evita.

Así que un id por sí solo es inofensivo: si el colmenar de la colmena no está
compartido contigo, la sincronización del paso 3 no devuelve nada y la ruta indica
que la colmena no está disponible. Trata las etiquetas impresas como cómodas, no
como secretas.

## Implementación

La función de QR es pequeña y está repartida en unos pocos archivos:

| Archivo | Propósito |
| --- | --- |
| `lib/qr.ts` | Construir la URL de la colmena, renderizar el QR como SVG sin conexión, analizar las cargas escaneadas (`parseHiveId`) |
| `lib/components/QrLabel.svelte` | Etiqueta imprimible (QR + nombre + código corto) con descarga de SVG |
| `routes/h/[id]/+page.svelte` | Aterrizaje del escaneo: resolver localmente, luego redirigir a la app |
| `routes/app/hives/[id]/+page.svelte` | Detalle de la colmena (muestra la etiqueta QR y el historial) |
| `routes/app/scan/+page.svelte` | Escáner dentro de la app usando la cámara |

El renderizado del QR ocurre enteramente en el dispositivo como SVG, de modo que
las etiquetas pueden generarse e imprimirse sin conexión de red.

## Imprimir etiquetas

Puedes imprimir una etiqueta para cualquier colmena individual desde su vista de
detalle, o generar una **hoja por lotes** que cubra muchas colmenas a la vez.

| Salida | Úsala para |
| --- | --- |
| Etiqueta individual | Una colmena, impresa a demanda (reemplazo, nueva colonia) |
| Hoja por lotes | Una cuadrícula de etiquetas para todo un colmenar o una tirada de impresión |

`QrLabel` abre una ventana de impresión limpia que contiene solo el QR, el nombre
de la colmena y un código corto, y también puede descargar el QR como SVG. Una
hoja por lotes es simplemente muchos componentes `QrLabel` dispuestos en una
página de cuadrícula de impresión.

El subtítulo corto importa: mantiene útil una etiqueta incluso si un teléfono está
sin batería. Imprime sobre material resistente a la intemperie o plastificado; las
cámaras de cría viven a la intemperie y la tinta se desvanece.

:::tip
Pega la etiqueta donde realmente la vayas a escanear, el lateral de la caja o la
tapa, en lugar de una superficie que tengas que levantar el techo para leer. Para
una guía paso a paso dirigida a apicultores, consulta [etiquetas QR](/using-the-app/qr-labels).
:::

## Deep links nativos

El QR apunta a una URL `https://` ordinaria, lo que significa que funciona en
cualquier cámara o navegador. En móvil, Openbeehive también puede registrar ese
espacio de URL para que la app instalada, en lugar de una pestaña del navegador,
gestione el enlace.

### App Links de Android

Android verifica la propiedad del dominio del enlace mediante un archivo Digital
Asset Links servido en `/.well-known/assetlinks.json`, declarando el paquete de la
app y la huella de firma:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.openbeehive.app",
      "sha256_cert_fingerprints": ["<your-app-signing-cert-sha256>"]
    }
  }
]
```

Añade un filtro de intención para `https://<host>/h/*`. Una vez verificado, las
pulsaciones y los escaneos abren directamente en la app sin un diálogo de
selección.

### Universal Links de iOS

iOS usa un archivo Apple App Site Association servido en
`/.well-known/apple-app-site-association` (como `application/json`, sin extensión
de archivo):

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "<TEAMID>.com.openbeehive.app",
        "paths": ["/h/*"]
      }
    ]
  }
}
```

Añade la habilitación (entitlement) de Associated Domains a la app para reclamar
el espacio de rutas `/h/*`.

:::caution
Ambos archivos well-known deben servirse por HTTPS con el tipo de contenido
correcto y sin redirecciones, desde el mismo origen que tu `BEEHIVE_PUBLIC_BASE_URL`. Si
pones Openbeehive detrás de un proxy inverso, asegúrate de que `/.well-known/` se
pasa intacto. Consulta [Proxy inverso](/self-hosting/reverse-proxy).
:::

### Esquema personalizado de reserva

Para contextos donde un enlace `https://` no enrutará a la app, `parseHiveId`
también analiza un esquema personalizado:

```text
openbeehive://hive/<hiveId>
```

Prefiere la forma `https://` para las etiquetas impresas, porque degrada
elegantemente a la app web cuando la app nativa no está presente. El esquema
personalizado es mejor reservarlo para la navegación dentro de la app y las
integraciones.

## Escáner dentro de la app

El escáner integrado en `/app/scan` lee códigos QR usando la API
`BarcodeDetector` del navegador donde está disponible (Android y Chrome). En
plataformas que aún no incluyen `BarcodeDetector`, en particular iOS Safari, la
app recurre a la app de cámara del dispositivo; incorpora un decodificador de
JavaScript como `@zxing/browser` si allí se requiere un escáner totalmente dentro
de la app.

Sea cual sea la ruta que se ejecute, una decodificación exitosa se gestiona del
mismo modo: `parseHiveId` extrae el id de colmena de la URL o del esquema
personalizado, y la app navega por el mismo flujo de resolución local descrito
arriba. Un escaneo y un enlace pulsado son equivalentes.

:::note
El escáner necesita permiso de cámara y un contexto seguro (HTTPS, o `localhost`
durante el desarrollo). Si la cámara no se inicia, comprueba primero los permisos
del sitio; consulta [Resolución de problemas](/knowledge-base/troubleshooting).
:::

## Resumen

- Un QR de colmena codifica `<base>/h/<hiveId>`, donde el id es un UUID offline
  estable.
- `/h/[id]` se resuelve primero desde la base de datos local y solo sincroniza si
  hace falta.
- El acceso siempre sigue la compartición a nivel de colmenar; un id no concede
  nada por sí solo.
- Los App Links y Universal Links enrutan `/h/*` a la app nativa; también se
  analiza un esquema `openbeehive://hive/<id>`.
- El escáner usa `BarcodeDetector` con una reserva a la app de cámara en iOS.

Para una visión más amplia, consulta la sección [Desarrolladores](/category/developers) y el
[Modelo de datos](/developers/data-model).
