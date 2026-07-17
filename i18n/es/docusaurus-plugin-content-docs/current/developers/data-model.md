---
sidebar_position: 3
title: "Modelo de datos"
---

# Modelo de datos

Esta página describe las entidades centrales que almacena Openbeehive, cómo se
relacionan y cómo los **ámbitos** (scopes) deciden qué se sincroniza y con
quién. Está escrita desde el punto de vista offline-first: la misma estructura
vive en la base de datos SQLite-WASM del dispositivo y en la base de datos
conectable del servidor, y el [protocolo de sincronización](/developers/sync-protocol)
las mantiene en sintonía.

Si quieres conocer la mecánica del seguimiento de cambios (marcas de tiempo HLC,
last-writer-wins, OR-Sets, eventos de solo anexado), lee primero
[Historial y eventos](/developers/history-and-events) — esta página se centra en
las entidades en sí.

## La jerarquía

En la cima está el **Colmenar** (un emplazamiento o ubicación). Cada colmenar
contiene **Colmenas**; cada colmena tiene una **Reina** actual y acumula un flujo
de registros con el tiempo.

```text
Apiary
 ├── Hive ──────── Queen (current; queens form a succession over time)
 │     ├── Inspection   (a visit: what you saw)
 │     ├── Task         (something to do, with a due date)
 │     ├── Event        (append-only fact: requeened, split, died, moved…)
 │     ├── Harvest      (honey/wax taken off)
 │     └── Treatment    (varroa or disease treatment applied)
 │
 └── Placement (hive ↔ apiary, time-bounded — where a hive lived, and when)

ApiaryShare (apiary ↔ user — grants another beekeeper access via a scope)
```

Una colmena pertenece a un colmenar a la vez, pero **Placement** registra el
historial completo de dónde ha vivido una colmena, de modo que una colmena puede
moverse entre emplazamientos sin perder sus registros.

## Entidades y campos clave

Cada entidad comparte un sobre común usado por la sincronización: un `id` estable
(un UUID generado offline), un `scope_id` (consulta **Ámbitos**), columnas de
contabilidad HLC y un indicador de borrado lógico. Los campos siguientes son los
relevantes a nivel de dominio.

### Apiary

El contenedor y la unidad de uso compartido.

| Campo | Notas |
|---|---|
| `id` | UUID |
| `name` | p. ej. "Emplazamiento de casa" |
| `location` | texto libre o lat/long |
| `notes` | texto libre |
| `scope_id` | igual al propio `id` del colmenar (ver abajo) |

### Hive

El alojamiento de una colonia dentro de un colmenar.

| Campo | Notas |
|---|---|
| `id` | UUID; también codificado en la [etiqueta QR de la colmena](/using-the-app/qr-labels) |
| `apiary_id` | colmenar actual (la ubicación activa) |
| `name` / `short_code` | etiqueta legible y el código corto impreso en el QR |
| `type` | uno de Zander, Dadant, Deutsch Normal, Langstroth, Warre, Top-bar, Other — ver [Tipos de colmena](/knowledge-base/hive-types) |
| `status` | p. ej. activa, muerta, vendida |
| `notes` | texto libre |
| `scope_id` | el id del colmenar |

### Queen

La reina reinante de una colmena. Las reinas forman una **sucesión**: cuando una
colonia es reemplazada de reina, la reina anterior se cierra y se abre un nuevo
registro, de modo que conservas el linaje completo.

| Campo | Notas |
|---|---|
| `id` | UUID |
| `hive_id` | la colmena que encabeza |
| `year` | año de introducción/nacimiento |
| `marking_colour` | sigue el [esquema de colores internacional](/knowledge-base/queen-marking-colours) (1/6 blanco, 2/7 amarillo, 3/8 rojo, 4/9 verde, 5/0 azul) |
| `origin` | criada, comprada, enjambre, sustitución de la reina… |
| `clipped` | con ala recortada (booleano) |
| `scope_id` | el id del colmenar de su colmena |

### Inspection

Una visita fechada: la instantánea de lo que observaste.

| Campo | Notas |
|---|---|
| `id`, `hive_id`, `date` | quién y cuándo |
| `brood`, `stores`, `temperament` | observaciones típicas |
| `queen_seen`, `eggs_seen`, `queen_cells` | comprobaciones rápidas |
| `varroa_count` | caída de ácaros / recuento por lavado si se tomó |
| `temp_hive`, `temp_outside` | temperatura (°C) dentro de la colmena y en el exterior |
| `humidity_hive`, `humidity_outside` | humedad relativa (%) dentro de la colmena y en el exterior |
| `notes` | texto libre |
| `scope_id` | el id del colmenar |

Los campos climáticos son escalares opcionales simples, por lo que se sincronizan
por campo como cualquier otra columna y pueden rellenarse a mano o mediante un
sensor automatizado — ver [Registradores automatizados](/using-the-api/automated-trackers).

### Task

Algo que hacer para una colmena o un colmenar, con una fecha de vencimiento y un
estado de completado.

| Campo | Notas |
|---|---|
| `id` | UUID |
| `hive_id` / `apiary_id` | el sujeto (una tarea puede apuntar a cualquiera de los dos niveles) |
| `title`, `due_date`, `done` | lo básico |
| `scope_id` | el id del colmenar |

### Event

Un hecho de **solo anexado** sobre una colmena — reemplazo de reina, división,
enjambrazón, muerte, traslado, alimentación. Los eventos nunca se editan ni se
fusionan; solo se acumulan, por lo que nunca entran en conflicto durante la
sincronización. Son la columna vertebral de la cronología de la colmena.

| Campo | Notas |
|---|---|
| `id`, `hive_id`, `occurred_at` | cuándo ocurrió |
| `kind` | el tipo de evento |
| `payload` | detalle específico del tipo (JSON) |
| `scope_id` | el id del colmenar |

Consulta [Historial y eventos](/developers/history-and-events) para el catálogo
completo de eventos y cómo se compone la cronología.

### Harvest

Miel (o cera) extraída de una colmena.

| Campo | Notas |
|---|---|
| `id`, `hive_id`, `date` | la extracción |
| `product` | miel, cera, propóleo… |
| `quantity`, `unit` | p. ej. 12,5 kg |
| `notes` | p. ej. floración, humedad |
| `scope_id` | el id del colmenar |

### Treatment

Un tratamiento contra varroa o enfermedades aplicado a una colmena.

| Campo | Notas |
|---|---|
| `id`, `hive_id`, `date` | sujeto y fecha de aplicación |
| `product`, `active_ingredient` | p. ej. Oxuvar / ácido oxálico |
| `dose`, `method` | p. ej. 50 ml, goteo |
| `batch_number` | lote / carga (a menudo exigido legalmente) |
| `withdrawal_until` | fecha en que la miel se puede cosechar de nuevo de forma segura |
| `reason` | p. ej. varroa |
| `note` | texto libre |
| `apiary_id`, `queen_id` | contexto congelado en el momento de la aplicación |
| `scope_id` | el id del colmenar |

:::note
Las normas de tratamiento y dosificación varían según el país y la autorización
del producto. Openbeehive registra lo que hiciste; no prescribe. Sigue siempre
las autorizaciones locales — ver [Varroa](/beekeeping/varroa).
:::

### Placement

El vínculo acotado en el tiempo entre una colmena y un colmenar: dónde vivió una
colmena y durante cuánto tiempo. Se abre una nueva ubicación cuando una colmena
se traslada; la anterior se cierra.

| Campo | Notas |
|---|---|
| `id`, `hive_id`, `apiary_id` | el vínculo |
| `from` / `until` | intervalo; `until` es nulo mientras está vigente |
| `scope_id` | el id del colmenar |

### ApiaryShare

Otorga a otro apicultor acceso a un colmenar (y a todo lo que contiene).

| Campo | Notas |
|---|---|
| `id`, `apiary_id` | lo que se comparte |
| `user_id` | con quién se comparte |
| `role` | p. ej. lector, editor |

## Ámbitos y control de la sincronización

El uso compartido ocurre a nivel de **colmenar**, y un único valor lo gobierna:
cada registro lleva un `scope_id`.

- Para los datos propiedad del colmenar — colmenas, reinas, inspecciones, tareas,
  eventos, cosechas, tratamientos, ubicaciones y el propio colmenar — `scope_id`
  es el **id del colmenar**.
- Para los datos que pertenecen a un único usuario y nunca se comparten (p. ej.
  preferencias personales), `scope_id` toma la forma `user:<id>`.

Cuando dos dispositivos se sincronizan, intercambian solo los ámbitos a los que
el usuario tiene derecho. El servidor resuelve el conjunto de ámbitos de un
usuario como:

```text
scopes(user) = { "user:<their id>" }
             ∪ { apiary.id  for each apiary they own }
             ∪ { share.apiary_id  for each ApiaryShare granting them access }
```

Por lo tanto, añadir un `ApiaryShare` hace que un colmenar entero — cada colmena y
cada registro bajo él — aparezca en los dispositivos del destinatario en la
siguiente sincronización; revocarlo detiene el flujo de más cambios. Como la
compuerta es la columna `scope_id`, el uso compartido es de todo o nada por
colmenar y no necesita permisos por registro.

:::tip
Un id de colmena por sí solo no concede nada. Escanear una
[etiqueta QR](/developers/qr-codes) abre la app en una colmena solo si el ámbito
de esa colmena se ha sincronizado realmente con tu dispositivo.
:::

## Por qué se fusiona limpiamente

Las estructuras anteriores se eligen de modo que la sincronización nunca necesite
que una persona resuelva un conflicto:

- Los **campos escalares** (el color de marcado de una reina, el nombre de una
  colmena) usan last-writer-wins por campo, decidido por las marcas de tiempo HLC.
- Los **campos de lista/conjunto** usan OR-Sets con prioridad de adición, de modo
  que todas las adiciones concurrentes sobreviven.
- Los **eventos** son de solo anexado e inmutables, así que simplemente se
  acumulan.

Para el algoritmo completo, continúa con el
[protocolo de sincronización](/developers/sync-protocol).
