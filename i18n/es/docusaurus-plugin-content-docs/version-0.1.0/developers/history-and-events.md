---
sidebar_position: 2
title: "Historial y eventos"
---

# Historial y eventos

Openbeehive trata tus registros apícolas como una historia que se desarrolla a lo
largo del tiempo. Una colmena se traslada entre colmenares, una reina reina y más
tarde es reemplazada, una cosecha se registra en un día concreto. Para que este
historial sea preciso y útil, el modelo de datos mantiene dos cosas claras: qué
ocurrió y la situación que era cierta cuando ocurrió.

Esta página explica cómo los eventos congelan su contexto, cómo los historiales
de intervalos registran reinados y emplazamientos, cómo los registros de detalle
tipados cuelgan de los eventos, y cómo el cliente escribe y consulta todo ello
sin conexión.

## Los eventos congelan su contexto

Un evento es un hecho append-only: registra que algo ocurrió en un momento del
tiempo. De forma crucial, cada evento almacena una instantánea del contexto
relevante tal como estaba en el momento del evento, en lugar de solo un puntero
al estado actual.

Cuando se escribe un evento, el cliente resuelve y almacena:

- el colmenar al que pertenecía la colmena,
- la propia colmena,
- la reina que reinaba en esa colmena en esa fecha.

Esta instantánea se desnormaliza en la fila del evento. La ventaja es que el
historial sigue siendo veraz incluso después de que el mundo cambie. Si trasladas
una colmena a un nuevo colmenar el mes que viene, la inspección de la semana
pasada sigue leyéndose como ocurrida en el colmenar donde realmente tuvo lugar.
Si cambias de reina, una cosecha antigua sigue atribuyendo la miel a la reina que
estaba al mando en ese momento.

:::note
Como los eventos son append-only y llevan su propio contexto, nunca entran en
conflicto durante la sincronización. Dos dispositivos pueden añadir eventos sin
conexión cada uno y ambos conjuntos se conservan.
Consulta el [protocolo de sincronización](/developers/sync-protocol) para las reglas libres de conflictos.
:::

## La tabla de eventos también es una tabla de hechos

Las mismas filas de eventos hacen también de tabla de hechos para las
estadísticas. Las medidas numéricas viven directamente en el evento, la más
importante `amount_kg` para las cosechas, junto a las dimensiones congeladas
(colmenar, colmena, reina, fecha, `scope_id`, tipo de evento).

Esto significa que los informes habituales son una sola consulta agrupada sobre
una única tabla, sin necesidad de joins para atribuir un número al colmenar,
colmena o reina que lo produjo. El contexto congelado es lo que hace que "miel
por colmenar en 2025" o "rendimiento por reina" sean correctos por construcción.

## Historiales de intervalos

Algunos hechos se expresan mejor como intervalos que como puntos. Openbeehive usa
intervalos semiabiertos, escritos `[start, end)`: el inicio se incluye y el final
se excluye. Esto hace que los intervalos se ensamblen limpiamente sin solapamiento
ni huecos cuando un periodo termina justo cuando empieza el siguiente.

| Historial | Intervalo | Significado |
| --- | --- | --- |
| Reinado de la reina | `[installed, replaced)` | La reina encabeza la colonia desde su fecha de instalación hasta, sin incluirla, la fecha en que es reemplazada. |
| Emplazamiento de la colmena | `[from, to)` | La colmena se encuentra en un colmenar dado desde `from` hasta, sin incluirla, `to`. |

Un reinado o emplazamiento actual tiene un final abierto (todavía sin `replaced`
/ `to`). Cuando se reemplaza una reina, el intervalo de la reina saliente se
cierra en la fecha de instalación de la nueva reina, y el nuevo reinado se abre
ahí. Los traslados de colmena funcionan de la misma manera.

:::tip
Los intervalos semiabiertos convierten "¿quién reinaba en la fecha D?" en una
prueba sencilla: encuentra la fila donde `installed <= D` y (`replaced` es nulo o
`replaced > D`). Coincide exactamente una fila, incluso en un día de relevo.
:::

## Registros de detalle tipados

Los eventos vienen en varios tipos, y los detalles específicos de cada tipo viven
en sus propios registros enlazados al evento:

- Detalle de **inspección**: observaciones de una visita (cría, reservas,
  temperamento, reina vista, etc.).
- Detalle de **cosecha**: lo que se extrajo, incluida la medida `amount_kg` usada
  para las estadísticas.
- Detalle de **tratamiento**: el producto aplicado, dosis y momento de un
  tratamiento contra varroa o enfermedad.

Mantener los campos compartidos del evento (fecha, contexto congelado,
`scope_id`) en un solo lugar y los campos específicos del tipo en registros
tipados mantiene la tabla de hechos limpia, permitiendo a la vez formularios y
pantallas ricos y conscientes del tipo. Las formas de estos registros se
describen en el [modelo de datos](/developers/data-model).

## resolveContext para entradas con fecha retroactiva

Los apicultores no siempre registran las cosas en el momento en que ocurren.
Podrías introducir la inspección del sábado pasado el lunes por la noche. Por eso
el contexto debe resolverse para la fecha propia del evento, no para "ahora".

El cliente usa un ayudante, conceptualmente:

```text
resolveContext(hiveId, date) -> { apiaryId, hiveId, queenId, scopeId }
```

Busca la colmena, luego consulta los historiales de intervalos para encontrar el
emplazamiento del colmenar y el reinado de la reina que cubren `date`, y lee el
`scope_id` de la colmena. El resultado se congela en el evento.

```sql
-- Find the queen reigning in a hive on a given date.
SELECT id
FROM queens
WHERE hive_id = :hiveId
  AND installed <= :date
  AND (replaced IS NULL OR replaced > :date)
LIMIT 1;
```

```sql
-- Find the apiary the hive was placed in on a given date.
SELECT apiary_id
FROM hive_placements
WHERE hive_id = :hiveId
  AND from_date <= :date
  AND (to_date IS NULL OR to_date > :date)
LIMIT 1;
```

:::caution
Resuelve siempre el contexto frente a la fecha del evento. Usar el colmenar
actual o la reina actual de la colmena atribuiría silenciosamente de forma
errónea las entradas con fecha retroactiva y corrompería tus estadísticas.
:::

## Qué funciones del cliente escriben historial

Tres tipos de escritura tocan el historial, y conviene mantenerlas diferenciadas:

1. **Añadir un evento.** Los escritores de inspecciones, cosechas, tratamientos y
   otros eventos llaman primero a `resolveContext(hiveId, date)`, luego añaden el
   evento con su contexto congelado (y `amount_kg` cuando corresponda) más el
   registro de detalle tipado.
2. **Reemplazar una reina.** Cierra el reinado actual en la nueva fecha de
   instalación y abre un nuevo intervalo `[installed, replaced)`. Los eventos
   existentes conservan su reina congelada original.
3. **Trasladar una colmena.** Cierra el emplazamiento actual en la fecha del
   traslado y abre un nuevo intervalo `[from, to)` en el colmenar de destino. Los
   eventos existentes conservan su colmenar congelado original.

Los reinados y emplazamientos son filas de intervalo cuyos campos escalares (la
fecha de cierre) siguen last-writer-wins por campo; los eventos son append-only e
inmutables una vez escritos. Las nuevas correcciones se hacen añadiendo más
eventos, no editando los antiguos.

## Consultas de estadísticas

Como las medidas y dimensiones están congeladas en el evento, los informes
agrupan directamente:

```sql
-- Total honey per apiary for a season.
SELECT apiary_id, SUM(amount_kg) AS total_kg
FROM events
WHERE type = 'harvest'
  AND date >= '2025-01-01' AND date < '2026-01-01'
GROUP BY apiary_id;
```

```sql
-- Yield attributed to each queen.
SELECT queen_id, SUM(amount_kg) AS total_kg
FROM events
WHERE type = 'harvest'
GROUP BY queen_id;
```

No se necesitan joins al estado actual: el `apiary_id` y el `queen_id` congelados
ya son los correctos para el momento de la cosecha.

## Sin conexión y compartición mediante scope_id

Cada fila de evento e historial lleva el `scope_id` de su colmenar. Los ámbitos
son la unidad de compartición en Openbeehive: conceder a alguien acceso a un
colmenar comparte todos los eventos e historiales bajo ese ámbito.

Como las escrituras son locales e instantáneas, el historial se escribe primero
en la base de datos SQLite del dispositivo y se sincroniza en segundo plano. El
contexto congelado significa que una entrada con fecha retroactiva hecha sin
conexión lleva el colmenar, la colmena y la reina correctos incluso si el
dispositivo no ha visto cambios recientes de otros lugares; los eventos
append-only se fusionan sin conflicto cuando el dispositivo se reconecta.

Consulta [sin conexión y sincronización](/using-the-app/offline-and-sync) para el
comportamiento de cara al usuario y [Desarrolladores](/category/developers) para
la arquitectura más amplia.
