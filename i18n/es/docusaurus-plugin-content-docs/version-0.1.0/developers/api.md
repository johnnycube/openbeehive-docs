---
sidebar_position: 5
title: "API (Connect-RPC)"
---

# API (Connect-RPC)

Openbeehive expone su API de backend a través de [Connect-RPC](https://connectrpc.com/). El contrato se define en Protocol Buffers, y un único conjunto de archivos `.proto` impulsa tanto las interfaces gRPC como las HTTP/JSON, además del código de cliente y servidor generado.

Si solo quieres usar la aplicación, nunca necesitas tocar esta página. Está aquí para los que se autoalojan y quieren automatizar exportaciones, y para los desarrolladores que construyen sobre Openbeehive.

## El contrato proto es la fuente de verdad

Todo parte del esquema bajo `proto/openbeehive/v1`. Los mensajes, servicios y RPC declarados allí definen toda la superficie de la API. El código Go y TypeScript generado se deriva de estos archivos, nunca se escribe a mano, de modo que el esquema y el código no pueden divergir nunca.

Cuando cambies la API, cambia primero el proto, regenera y luego implementa. No edites los archivos generados a mano.

## Connect-RPC: un contrato, dos formatos de comunicación

Connect-RPC sirve cada RPC sobre dos protocolos compatibles desde el mismo endpoint:

- **gRPC** para clientes nativos, amigables con el streaming (Go, etc.).
- **HTTP/JSON** para clientes HTTP simples: cada RPC es accesible como un `POST` con un cuerpo JSON, de modo que puedes llamarlo con `curl` o `fetch`.

Esto significa que obtienes un protocolo binario eficiente y un protocolo JSON simple y depurable sin mantener dos APIs.

## Servicios

El contrato se organiza en los siguientes servicios:

| Servicio | Propósito |
| --- | --- |
| `Apiary` | Crear, leer, actualizar y eliminar colmenares. |
| `Hive` | Gestionar colmenas dentro de los colmenares. |
| `Queen` | Gestionar reinas, incluido el color de marcaje y el linaje. |
| `Inspection` | Registrar y recuperar inspecciones (visitas). |
| `Task` | Gestionar tareas. |
| `Stats` | Cifras agregadas y resúmenes a través de tus registros. |
| `Event` | Leer el registro de eventos append-only. |
| `Sync` | El endpoint que la app offline-first usa para enviar y descargar cambios en segundo plano. |

:::note
Estos son los únicos servicios. Los nombres de servicio anteriores son la lista completa; no hay endpoints ocultos más allá de ellos.
:::

## Cómo usa la app la API

Openbeehive es offline-first. La PWA de SvelteKit lee y escribe a través de un **repositorio local-first** respaldado por una base de datos SQLite-WASM en el navegador (OPFS). Los datos de uso diario de la app nunca hacen un viaje de ida y vuelta al servidor en la ruta crítica; son locales e instantáneos, y funcionan sin cobertura.

El servicio `Sync` es el que transporta esos cambios locales al servidor (y a otros dispositivos) en segundo plano. Para los detalles de cómo se mantiene libre de conflictos, consulta el [protocolo de sincronización](/developers/sync-protocol).

Los RPC de CRUD por entidad (`Apiary`, `Hive`, `Queen`, etc.) son endpoints con **autoridad en el servidor** (server-authoritative). La app en sí no los usa para el registro ordinario de datos. Existen para cosas como exportación, administración e integraciones, donde quieres la vista autoritativa del servidor en lugar de la copia local de un único dispositivo.

:::tip
Si estás construyendo un script, prefiere leer a través de los servicios CRUD y `Stats`. Escribir tus propios registros a través de ellos está soportado, pero para la apicultura normal usa la app, de modo que tus cambios fluyan por la ruta de sincronización libre de conflictos.
:::

## Llamar a la API por HTTP/JSON

Cada RPC se mapea a una URL de la forma:

```text
POST {BEEHIVE_PUBLIC_BASE_URL}/openbeehive.v1.{Service}/{Method}
```

El cuerpo de la petición es el mensaje de petición del RPC como JSON, y el cuerpo de la respuesta es el mensaje de respuesta como JSON. Dos cabeceras importan:

- `Content-Type: application/json`
- una cabecera de sesión o autenticación, salvo que tu instancia autoalojada se ejecute en modo de un solo usuario sin login configurado.

Un ejemplo mínimo usando `curl`:

```bash
curl -X POST \
  http://localhost:8080/openbeehive.v1.Apiary/ListApiaries \
  -H "Content-Type: application/json" \
  -d '{}'
```

Los nombres exactos de los métodos y los campos de petición de cada servicio se definen en los archivos proto; trátalos como la referencia canónica para los nombres y formas de los campos.

:::caution
Los nombres de método como `ListApiaries` anteriores son ilustrativos de la convención de llamada. Confirma siempre los nombres reales de RPC y mensaje contra `proto/openbeehive/v1` antes de depender de ellos, ya que el proto es la única fuente de verdad.
:::

### Autenticación

La API usa la misma autenticación basada en sesión que la app. Si tu instancia está configurada con proveedores OIDC o WebAuthn, las peticiones deben llevar una sesión válida. Si ejecutas un autoalojamiento de un solo usuario con `BEEHIVE_OIDC_PROVIDERS` vacío y `BEEHIVE_WEBAUTHN_ENABLED=false`, no hay login y las llamadas no están autenticadas. Consulta [autenticación](/self-hosting/authentication) para los detalles de configuración.

## Regenerar los stubs con buf

La generación de código se impulsa con [buf](https://buf.build/). El repositorio lo envuelve en un objetivo `make`:

```bash
make proto
```

Esto regenera tanto el código Go como el TypeScript a partir de `proto/openbeehive/v1`. Ejecútalo siempre que cambies un archivo `.proto`, y haz commit del resultado regenerado junto con el cambio de esquema.

Necesitarás:

- Go 1.25 o posterior
- Node 22 o posterior
- `buf`

Tras regenerar, `make build` compila el binario del servidor (`./server/bin/openbeehive`). Para la configuración completa, consulta [contribuir](/developers/contributing).

:::note
Como Go y TypeScript se generan a partir del mismo contrato, el backend y el frontend siempre coinciden en las formas de los mensajes. Un cambio de esquema que rompa uno saldrá a la luz en el otro en tiempo de compilación, no en tiempo de ejecución.
:::

## Dónde ir a continuación

- [Visión general de la arquitectura](/developers/architecture) para cómo encaja la API en el sistema más amplio.
- [Protocolo de sincronización](/developers/sync-protocol) para cómo los cambios sin conexión llegan al servidor.
- [Modelo de datos](/developers/data-model) para las entidades detrás de los servicios.
