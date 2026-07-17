---
sidebar_position: 4
title: "Protocolo de sincronización"
---

# Protocolo de sincronización

Openbeehive es [offline-first](/using-the-app/offline-and-sync). Cada lectura y escritura ocurre
contra una base de datos SQLite-WASM local en el dispositivo, y un proceso en
segundo plano reconcilia ese estado local con el servidor. Esta página documenta
el protocolo de comunicación (wire protocol) que hace funcionar la reconciliación:
el servicio Connect-RPC, sus tres métodos y las reglas que ambos lados aplican al
fusionar cambios.

Si aún no has leído la [visión general del modelo de sincronización](/category/developers), empieza ahí.
Esta página asume que ya sabes que Openbeehive usa Relojes Lógicos Híbridos
(HLC), last-writer-wins por campo (LWW) para escalares, OR-Sets (add-wins) para
campos de lista y eventos append-only que nunca entran en conflicto.

## El servicio

La sincronización se expone como un servicio Connect-RPC, de modo que cada método
es accesible tanto como gRPC como HTTP/JSON simple. Hay tres métodos:

| Método | Dirección | Propósito |
| --- | --- | --- |
| `Pull` | cliente ← servidor | Obtener los cambios que el cliente aún no ha visto |
| `Push` | cliente → servidor | Enviar los cambios locales al servidor |
| `Subscribe` | servidor → cliente (flujo) | "Aviso" opcional casi en tiempo real cuando llegan nuevos cambios |

Un cliente típico hace un bucle: `Push` de su buzón de salida local, luego `Pull`
de todo lo nuevo, después espera inactivo hasta que `Subscribe` lo avisa (o se
dispara un temporizador) y repite.

## Cursores frente al HLC

La idea más importante de este protocolo es que el **cursor de sincronización no
es el HLC**.

El HLC es una *marca de tiempo lógica* asociada a cada escritura de campo. Decide
*qué valor gana* durante una fusión — responde a "¿es esta edición más reciente
que la que ya tengo?". Los HLC provienen de muchos dispositivos, pueden moverse
ligeramente desordenados respecto a la hora del reloj de pared, y no son
globalmente monótonos en el orden de llegada.

El cursor es una *secuencia de recepción asignada por el servidor* — un único
entero estrictamente creciente (`seq`) que el servidor estampa en cada cambio a
medida que es aceptado de forma duradera. Responde a una pregunta completamente
distinta: "¿qué le he entregado ya a este cliente?".

Usar la secuencia de recepción como cursor nos da dos garantías que el HLC no
puede:

- **Orden total de entrega.** Como `seq` se asigna en el orden en que el servidor
  acepta las escrituras, un cliente puede pedir "todo después de seq N" y tener la
  certeza de que no se pierde nada, incluso si esos cambios llevan HLC
  desordenados.
- **Seguridad ante repeticiones.** Un cliente puede persistir su cursor y reanudar
  exactamente desde donde lo dejó tras quedarse sin conexión, fallar o
  reinstalarse.

:::note
Nunca uses un HLC como cursor de paginación. Dos dispositivos pueden producir
legítimamente la misma región de HLC mientras están sin conexión, y los HLC no se
asignan en orden de llegada — paginar por HLC saltaría o duplicaría cambios.
Pagina por `seq`, fusiona por HLC.
:::

## Pull

`Pull` devuelve los cambios que el cliente no ha visto, en orden de `seq`, más el
cursor a usar la próxima vez.

```text
Pull(PullRequest { since_cursor: int64, limit: int32 })
  -> PullResponse { changes: Change[], next_cursor: int64, has_more: bool }
```

- `since_cursor` es el último cursor que el cliente aplicó con éxito. Envía `0`
  para una primera sincronización completa.
- `changes` se devuelven ordenados por `seq` ascendente, restringidos a los
  ámbitos que quien llama puede leer (ver **Replicación parcial**).
- `next_cursor` es el `seq` más alto incluido en esta página. Persístelo solo
  después de que toda la página se haya aplicado localmente.
- `has_more` es `true` cuando el resultado fue truncado por `limit`; el cliente
  debería hacer `Pull` de nuevo inmediatamente con el nuevo `next_cursor`.

Un único `Change` lleva lo suficiente para fusionarlo de forma independiente:

```json
{
  "entity": "hive",
  "entity_id": "01HZX...",
  "scope_id": "apiary-01HZ...",
  "kind": "field",
  "field": "name",
  "value": "Hive 3 (north row)",
  "hlc": "2026-06-19T09:14:02.117Z-0003-nodeA",
  "seq": 48213
}
```

`kind` distingue las tres estrategias de fusión: `field` (LWW escalar),
`set_add` / `set_remove` (pertenencia a OR-Set) y `event` (append-only).

## Push

`Push` envía un lote de cambios locales al servidor. El servidor aplica cada uno
con las mismas reglas de fusión que usa el cliente, asigna un `seq` nuevo a cada
cambio aceptado e informa de vuelta.

```text
Push(PushRequest { changes: Change[] })
  -> PushResponse { server_cursor: int64, conflicts: Conflict[] }
```

- El servidor valida que quien llama pueda escribir el `scope_id` de cada cambio.
- Para cada cambio de `field` escalar aplica LWW por campo: el valor entrante gana
  solo si su HLC es mayor que el HLC actualmente almacenado para ese campo.
- Las operaciones de conjunto se aplican como add/remove de OR-Set; las adiciones
  ganan sobre las eliminaciones concurrentes.
- Los cambios de tipo `event` se añaden incondicionalmente — nunca entran en
  conflicto.
- A cada cambio aceptado se le asigna un nuevo `seq` estrictamente creciente.
- `server_cursor` es el `seq` más alto asignado en este lote, de modo que el
  cliente puede avanzar rápido sin un viaje de ida y vuelta `Pull` adicional para
  sus propias escrituras.

### Conflictos

`conflicts` **no** es una lista de errores — la fusión es siempre determinista y
siempre tiene éxito. Es una lista informativa de campos en los que el servidor ya
tenía un valor con un HLC más alto, de modo que el valor que el cliente envió *no*
fue adoptado.

```json
{
  "entity_id": "01HZX...",
  "field": "queen_status",
  "rejected_hlc": "2026-06-19T09:13:55.000Z-0001-nodeB",
  "winning_hlc": "2026-06-19T09:14:10.421Z-0007-nodeA"
}
```

El cliente debería tratar un conflicto como una señal para refrescar ese campo en
el siguiente `Pull`, donde recibirá el valor ganador. No se necesita reintento.

:::tip
Como LWW es determinista y está ordenado por HLC, `Push` es idempotente:
reenviar un cambio cuyo HLC ya ha perdido (o ya ha ganado) deja el estado del
servidor sin cambios. Los clientes pueden reintentar con seguridad un `Push` tras
una conexión interrumpida.
:::

## Subscribe

`Subscribe` es un canal opcional servido en flujo desde el servidor, usado
puramente como señal de despertar. No transporta datos.

```text
Subscribe(SubscribeRequest { scopes: string[] })
  -> stream Poke { scope_id: string, server_cursor: int64 }
```

Cuando una escritura llega a uno de los ámbitos legibles del cliente, el servidor
emite un `Poke`. El cliente responde llamando a `Pull(since_cursor)` como de
costumbre. Mantener los datos reales en `Pull` significa que el flujo puede ser
con pérdidas sin afectar a la corrección — un aviso perdido solo significa que el
siguiente `Pull` disparado por temporizador se pone al día.

:::note
`Subscribe` es una optimización de latencia, no un requisito. Un cliente que solo
sondea `Pull` con un temporizador es totalmente correcto; simplemente es menos
oportuno.
:::

## Replicación parcial por ámbito
La compartición en Openbeehive es a nivel de **colmenar** mediante *ámbitos*. Un
usuario replica únicamente los datos dentro de los ámbitos que puede leer, no toda
la base de datos.

Esto se aplica en `Pull` y `Push`:

- `Pull` filtra `changes` a los ámbitos legibles de quien llama antes de paginar
  por `seq`. El cursor avanza por tanto sobre una *vista por cada llamante* de la
  secuencia global — dos usuarios que comparten un colmenar verán los cambios de
  ese colmenar en el mismo `seq`, mientras que cada uno ve también sus propios
  ámbitos privados.
- `Push` rechaza las escrituras a ámbitos que quien llama no puede escribir.

Como el cursor es la secuencia de recepción global, un cliente puede ver huecos en
los valores de `seq` que recibe (los cambios en ámbitos que no puede leer se
omiten). Los huecos son esperados e inofensivos — el cliente solo necesita el
*siguiente* cursor para pedir más.

## Lógica de fusión replicada

Las funciones de fusión — comparación de HLC, LWW por campo, resolución de OR-Set,
añadido de eventos — son **idénticas en el cliente y en el servidor**. La misma
lógica que ejecuta la PWA de SvelteKit al aplicar un `Pull` es la lógica que
ejecuta el backend de Go al aplicar un `Push`.

Este reflejo es lo que hace que el sistema esté genuinamente libre de conflictos
en lugar de meramente resolver conflictos:

- Un cambio produce el mismo resultado fusionado sin importar *dónde* se aplica ni
  en *qué orden* llega, de modo que cliente y servidor convergen sin negociación.
- El servidor no es un árbitro privilegiado que pueda anular el estado del
  dispositivo; aplica las mismas reglas deterministas y luego asigna un `seq` para
  el orden.
- Los nuevos tipos de entidad solo necesitan que sus reglas de fusión se definan
  una vez, en una semántica compartida, y ambos lados las respetan.

Para los detalles subyacentes del reloj y de las estructuras de datos, consulta la
[visión general de la arquitectura](/developers/architecture) y el
[modelo de datos](/developers/data-model). Para cómo encajan los eventos en la
ruta append-only, consulta [historial y eventos](/developers/history-and-events).
