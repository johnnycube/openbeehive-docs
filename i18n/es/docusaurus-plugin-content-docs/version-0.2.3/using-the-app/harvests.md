---
sidebar_position: 7
title: "Cosechas y miel"
---

# Cosechas y miel

Recoger la miel es el momento en que toda la temporada da sus frutos. Openbeehive te permite registrar cada cosecha en segundos, de modo que al llegar el invierno puedas ver exactamente qué colmenas, qué colmenares y qué reinas se ganaron su sustento.

Una cosecha es un **evento**: un registro de solo adición de algo que ocurrió un día dado. Una vez guardada, queda permanentemente en el historial de la colmena y alimenta directamente las estadísticas de tu temporada.

## Registrar una cosecha

Abre la colmena de la que extrajiste la miel y añade una nueva cosecha. Puedes registrar tan poco o tanto como quieras, pero cuanto más captures ahora, más útiles serán tus cifras después.

| Campo | Qué significa |
| --- | --- |
| **Cantidad (kg)** | El peso neto de miel extraída de esta colmena, en kilogramos. |
| **Variedad** | El tipo o la fuente de pecoreo, p. ej. flor de primavera, flor de verano, bosque (mielada), colza, brezo. |
| **Contenido de agua (%)** | La lectura de humedad de tu refractómetro. |
| **Número de lote** | Tu propia etiqueta para el lote de envasado, usada para rastrear los tarros hasta su origen. |
| **Consumir preferentemente antes de** | La fecha que piensas imprimir en los tarros. |
| **Fecha** | Cuándo se cosechó la miel. Por defecto, hoy; cámbiala si introduces los registros después. |

Puedes anotar más de una cosecha por colmena y año, por ejemplo una cosecha de primavera y una de verano, y cada una se contabiliza por separado.

:::tip El contenido de agua importa
La miel debería estar generalmente por debajo de alrededor del 18 % de agua antes de venderse o almacenarse a largo plazo; por encima de aproximadamente el 20 % corre el riesgo de fermentar. Registrar aquí la lectura del refractómetro te permite detectar un lote húmedo antes de que se estropee. Los umbrales y las normas de etiquetado varían según el país, así que consulta los requisitos locales de seguridad alimentaria y normas comerciales.
:::

## Cómo alimentan las cosechas tus estadísticas

Cada cosecha que registras se acumula en las cifras de temporada de Openbeehive, así que nunca tienes que sumar tarros a mano.

- **Rendimiento por colmena** — el total extraído de una sola colmena a lo largo del año, y durante toda su vida.
- **Rendimiento por reina** — la miel se atribuye a la reina que encabezaba la colonia en el momento de la cosecha, lo que facilita comparar tu material genético.
- **Rendimiento por colmenar** — la cosecha combinada de todo un emplazamiento, útil para decidir qué ubicaciones merece la pena mantener.
- **Totales por año** — tu cosecha global de la temporada, para tus propios registros o para cualquier informe que necesites hacer.

Como estas cifras se construyen a partir de los eventos de cosecha individuales, se actualizan en el instante en que guardas un registro. No hay nada que recalcular.

## El evento congela su contexto

Esta es la parte importante de entender. Una cosecha se almacena junto con una **instantánea de su contexto en el momento en que ocurrió**: de qué colmena, qué colmenar y qué reina procedía la miel en esa fecha.

Esa instantánea es permanente. Si más tarde cambias la reina de la colonia, mueves la colmena a otro colmenar o retiras la colmena por completo, la cosecha antigua sigue atribuida correctamente a la reina, el colmenar y la colmena que la produjeron.

:::note Por qué importa esto
Imagina que una colonia entra en el verano bajo la Reina A, te da 18 kg y luego se le cambia la reina por la Reina B para una mielada tardía que rinde otros 12 kg. Ambas cosechas viven en la colmena, pero los 18 kg siguen acreditados a la Reina A y los 12 kg a la Reina B. Tu comparación por reina refleja lo que cada reina logró realmente, no simplemente quién está hoy en la caja.
:::

Este comportamiento de congelación es el mismo para todos los eventos en Openbeehive, y es lo que hace fiables las comparaciones a largo plazo, año tras año.

## Trabajar sin conexión

Como todo lo demás en la aplicación, las cosechas se guardan directamente en el dispositivo y funcionan sin cobertura alguna. Registra la cosecha en el colmenar, sobre la marcha, y se sincroniza con el servidor en segundo plano una vez que vuelves a tener cobertura. Consulta [Sin conexión y sincronización](/using-the-app/offline-and-sync) para ver cómo funciona esto.

Como cada cosecha es un evento de solo adición, dos personas registrando cosechas en el mismo colmenar compartido nunca sobrescribirán las entradas de la otra.

## Editar y corregir

Puedes corregir los detalles de una cosecha, por ejemplo un peso o una lectura de agua mal escritos, y el cambio se sincroniza como cualquier otra edición. Eliminar una cosecha la quita de tus totales, así que hazlo solo por errores genuinos y no para "ordenar" temporadas pasadas.

## Adónde ir después

- Para el lado práctico de retirar y procesar la miel, incluidos el momento, la extracción y el almacenamiento, consulta la guía apícola sobre [Cosecha de miel](/beekeeping/honey-harvest).
- Para etiquetar tus tarros vinculándolos a una colmena concreta, consulta [Etiquetas QR](/using-the-app/qr-labels).
- Para revisar tus colonias y su rendimiento, vuelve al [Panel](/using-the-app/dashboard).
