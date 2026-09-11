---
sidebar_position: 3
title: "Colmenas"
---

# Colmenas

Una colmena en Openbeehive representa una sola colonia de abejas que vive en una caja física. Las colmenas son el corazón de tus registros: casi todo lo que anotas en el día a día, inspecciones, tareas, cosechas y tratamientos, cuelga de una colmena.

Cada colmena pertenece a un colmenar a la vez, y cada colmena puede tener una reina. Como Openbeehive funciona con un enfoque offline-first, puedes crear y editar colmenas en el colmenar sin cobertura alguna; tus cambios se guardan al instante en el dispositivo y se sincronizan en segundo plano.

## Crear una colmena

Abre un colmenar y elige **Añadir colmena**. Una colmena nueva solo necesita un nombre para empezar, pero unos cuantos detalles adicionales harán que tus registros sean mucho más útiles más adelante.

| Campo | Qué es | Notas |
| --- | --- | --- |
| **Nombre** | Cómo identificas la colmena | Un número, un color, un apodo, cualquier cosa memorable. |
| **Tipo de colmena** | El estándar de cuadro y caja | Consulta la tabla de abajo. |
| **Estado** | El estado actual de la colonia | Por defecto, **Activa**. |
| **Foto** | Una imagen de la colmena | Útil para reconocerla de un vistazo. |

:::tip
Mantén los nombres cortos y coherentes dentro de un colmenar, por ejemplo "1", "2", "3" o "Rojo", "Azul", "Verde". Los nombres cortos se imprimen con claridad en las etiquetas QR y son rápidos de leer sobre el terreno.
:::

### Tipos de colmena

Openbeehive admite los estándares europeos e internacionales más comunes:

| Tipo | Uso habitual |
| --- | --- |
| Zander | Muy extendido en partes de Alemania y Europa central. |
| Dadant | Popular para la producción de miel, cámara de cría grande. |
| Deutsch Normal | Un estándar tradicional alemán. |
| Langstroth | El estándar más común en todo el mundo. |
| Warre | Un diseño vertical y de baja intervención. |
| Top-bar | Barras horizontales, sin cuadros. |
| Otro | Cualquier cosa no listada arriba. |

Para una descripción más completa de cada estándar, consulta [Tipos de colmena](/knowledge-base/hive-types).

### Estado

El estado describe qué está pasando con la colonia en este momento.

| Estado | Significado |
| --- | --- |
| **Activa** | Una colonia sana y con reina en uso normal. |
| **Núcleo** | Una colonia inicial pequeña (un "núcleo"), a menudo una división o una unidad de fecundación. |
| **Sin reina** | La colonia ha perdido su reina y necesita atención. |
| **Perdida** | La colonia ha muerto o se ha fugado. |
| **Disuelta** | Has unido o deshecho la colonia deliberadamente. |

:::note
Poner una colmena como **Perdida** o **Disuelta** conserva todo su historial. Los registros siguen siendo localizables; la colmena simplemente desaparece de tus listas activas.
:::

## Mover una colmena entre colmenares

Las colonias viajan. Puede que traigas un núcleo a casa, muevas colmenas al brezo o consolides dos colmenares. Para reubicar una colmena, ábrela y elige **Mover**, luego selecciona el colmenar de destino.

Mover una colmena no pierde ningún dato. La colmena conserva su nombre, reina, foto y registro completo; solo cambia su colmenar a partir de la fecha del traslado.

### Historial de ubicaciones

Cada traslado se registra como una entrada fechada en el **historial de ubicaciones** de la colmena, de modo que siempre sabes dónde estaba una colonia en cualquier momento. Esto es útil para rastrear la exposición a enfermedades, para los registros de apicultura trashumante y para entender cómo rindió una colonia en distintos emplazamientos.

:::caution
En muchas regiones, mover colmenas entre ubicaciones está sujeto a normas de sanidad y movimiento apícola, especialmente dentro de zonas de control de enfermedades o de cuarentena. Consulta los requisitos nacionales o locales antes de reubicar colonias. Consulta [Enfermedades y plagas](/knowledge-base/diseases-and-pests) para tener contexto, y sigue siempre las indicaciones de tu autoridad local.
:::

## La vista de detalle de la colmena

Abrir una colmena te da una única pantalla que reúne todo lo relacionado con esa colonia.

### De un vistazo

- **Reina actual** — quién encabeza la colonia, con su color de marcado y año. Desde aquí puedes ver su ficha, reemplazarla o marcar la colmena como sin reina. Consulta [Reinas](/using-the-app/queens).
- **Última inspección** — la fecha y un resumen de tu visita más reciente, para que veas de un vistazo cuándo se revisó por última vez la colmena. Consulta [Inspecciones](/using-the-app/inspections).
- **Estado y tipo** — mostrados de forma destacada para que el estado de la colonia nunca quede en duda.

### Estadísticas

La vista de la colmena resume la vida reciente de la colonia: número de inspecciones, el último tratamiento aplicado, totales de cosecha y tareas pendientes. Se calculan directamente de tus registros, así que se mantienen exactas conforme anotas nuevas entradas.

### Registro de visitas

Debajo del resumen está el registro de visitas: una única línea temporal cronológica de todo lo que le ha sucedido a la colmena, incluidas inspecciones, tareas, eventos, cosechas y tratamientos. Es la forma más rápida de repasar la historia de una colonia y de detectar patrones a lo largo de una temporada.

### Etiqueta QR

Cada colmena puede tener una etiqueta QR imprimible. Escanearla con el teléfono abre la aplicación directamente en esa colmena, de modo que puedes iniciar una inspección sin buscar. Imprime etiquetas desde la vista de la colmena o en lote para todo un colmenar. Consulta [Etiquetas QR](/using-the-app/qr-labels).

:::tip
Pega una etiqueta QR en el lateral de cada colmena a una altura que puedas escanear sin tener que agacharte sobre una alza llena. Convierte cada visita en un toque.
:::

## Eliminar frente a retirar una colmena

En la mayoría de los casos deberías cambiar el **estado** de una colmena en lugar de eliminarla. Poner una colonia como **Perdida** o **Disuelta** conserva todo su historial, lo cual es valioso para las comparaciones año tras año y para la trazabilidad.

Elimina una colmena solo cuando se haya creado por error. La eliminación está pensada para errores genuinos, no para colonias que han llegado a un final natural.
