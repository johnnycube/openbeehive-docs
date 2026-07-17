---
sidebar_position: 2
title: "Colmenares"
---

# Colmenares

Un **colmenar** es un lugar donde mantienes abejas: tu jardín, un huerto comunitario, una azotea, un campo alquilado o un emplazamiento remoto al borde de un bosque. En Openbeehive, el colmenar se sitúa en lo más alto de tus registros. Todo lo demás cuelga de él.

La jerarquía es sencilla:

```text
Apiary  ->  Hive  ->  Queen
```

Cada colmenar contiene una o más colmenas, cada colmena tiene sus reinas actuales (y pasadas), y tus inspecciones, tareas, eventos, cosechas y tratamientos se asocian todos a una colmena dentro de un colmenar. Como el colmenar es la raíz del árbol, también es la unidad que compartes con otras personas. Más sobre esto a continuación.

## Por qué importan los colmenares

Agrupar las colmenas por ubicación hace más que mantener el orden. Algunas ventajas prácticas:

- **Contexto para tu trabajo.** Cuando llegas a un emplazamiento, abres ese colmenar y ves solo las colmenas que tienes delante.
- **Desplazamientos y logística.** Las coordenadas te permiten volver a encontrar un emplazamiento remoto, compartir su ubicación o planificar una ronda de visitas.
- **Límites del uso compartido.** El acceso se concede por colmenar, así que puedes compartir una ubicación con un mentor o un socio sin exponer el resto de tu explotación.

:::tip
Si mantienes abejas en varios sitios, crea un colmenar por cada ubicación física. Mantiene las inspecciones, cosechas y tratamientos agrupados allí donde realmente trabajas.
:::

## Crear un colmenar

Desde el panel o la lista de colmenares, elige **Nuevo colmenar** y rellena los datos. Solo se requiere un nombre; todo lo demás se puede añadir después.

| Campo | Obligatorio | Para qué sirve |
| --- | --- | --- |
| **Nombre** | Sí | Una etiqueta corta y reconocible, p. ej. "Jardín de casa" o "Emplazamiento del huerto". |
| **Dirección** | No | Una dirección o descripción en texto libre que te ayude (a ti y a quien compartas) a encontrar el lugar. |
| **Nota** | No | Cualquier cosa útil: códigos de puertas, indicaciones de acceso, el nombre del propietario del terreno, aparcamiento. |
| **Latitud / Longitud** | No | Coordenadas GPS del colmenar, en grados decimales. |

Como Openbeehive funciona con un enfoque offline-first, el colmenar se guarda directamente en la base de datos de tu dispositivo en el momento en que lo creas. Aparece de inmediato, funciona sin cobertura y se sincroniza con el servidor en segundo plano una vez que vuelves a estar conectado. Consulta [Sin conexión y sincronización](/using-the-app/offline-and-sync) para ver cómo funciona.

### Establecer coordenadas GPS

Puedes escribir la latitud y la longitud a mano, o pulsar **Usar mi ubicación** para rellenarlas desde el GPS de tu dispositivo. Tu navegador pedirá permiso la primera vez.

Las coordenadas se almacenan como grados decimales, por ejemplo una latitud de `52.5200` y una longitud de `13.4050`. Los valores negativos son válidos: al sur del ecuador para la latitud, al oeste de Greenwich para la longitud.

:::note
"Usar mi ubicación" captura dónde estás **tú** parado, que normalmente es exactamente donde están las colmenas. Si configuras el colmenar desde casa para un emplazamiento remoto, escribe las coordenadas manualmente, o edítalas en tu próxima visita.
:::

## Añadir y ver colmenas

Abre un colmenar para ver todas sus colmenas de un vistazo, junto con una idea rápida de cómo va cada una. Desde aquí puedes:

- **Añadir una colmena** con **Nueva colmena**, eligiendo su tipo (Zander, Dadant, Deutsch Normal, Langstroth, Warre, Top-bar u Otro) y dándole un nombre o número.
- **Abrir una colmena** para ver su reina, inspecciones, tareas, eventos, cosechas y tratamientos.

Para todo lo que puedes registrar sobre una colonia individual, consulta [Colmenas](/using-the-app/hives) y [Reinas](/using-the-app/queens).

## Imprimir etiquetas QR para el colmenar

Cada colmena puede llevar una **etiqueta QR** imprimible. Desde la vista del colmenar puedes imprimir las etiquetas de todas sus colmenas de una sola vez, lo que es mucho más rápido que hacerlas una a una.

Cada etiqueta codifica un enlace directo a esa colmena concreta. Escanearla con un teléfono abre Openbeehive directamente en la colmena, de modo que puedes iniciar una inspección sin buscar entre listas. Pega la etiqueta en algún sitio resistente a la intemperie en el cuerpo o el techo de la colmena.

Para tamaños de etiqueta, reimpresión y cómo se construyen los enlaces, consulta [Etiquetas QR](/using-the-app/qr-labels).

:::tip
Imprime etiquetas QR nuevas cada vez que añadas un lote de colmenas nuevas a un emplazamiento. Llévalas contigo y aplícalas in situ para que la colmena física y tus registros coincidan desde el primer día.
:::

## Editar y reorganizar

Puedes renombrar un colmenar, actualizar su dirección, nota y coordenadas, o corregir detalles en cualquier momento. Las ediciones se sincronizan igual que todo lo demás, con la política de gana-el-último-que-escribe por campo, así que el cambio más reciente de cada campo prevalece aunque dos personas editen a la vez.

Si una colmena se traslada a otra ubicación, muévela al colmenar correspondiente para que tus registros sigan reflejando la realidad. Los apicultores trashumantes que mueven colonias entre emplazamientos pueden mantener un colmenar por emplazamiento y reasignar las colmenas conforme se desplazan.

## Compartir un colmenar

El uso compartido en Openbeehive ocurre a nivel de **colmenar** mediante *scopes*. Cuando compartes un colmenar, las personas que invitas obtienen acceso a esa ubicación y a las colmenas, reinas y registros que hay dentro de ella, pero no a tus otros colmenares.

Esto es lo que hace práctico:

- Compartir un único emplazamiento con un mentor, un aprendiz o un coapicultor.
- Gestionar un colmenar de asociación o club que varios miembros mantienen juntos.
- Mantener privadas las colonias de tu casa mientras colaboras en un emplazamiento compartido.

Como la sincronización está libre de conflictos, varias personas pueden trabajar en el mismo colmenar compartido, incluso sin conexión, y sus cambios se fusionan limpiamente cuando los dispositivos se reconectan.

Para el modelo de datos que hay detrás de los scopes y cómo funciona el uso compartido libre de conflictos por dentro, consulta [Arquitectura](/developers/architecture).

:::caution
Compartir un colmenar concede acceso real a sus registros. Invita solo a personas en las que confíes, y recuerda que cualquiera con acceso puede añadir, editar y registrar datos sobre las colmenas de ese colmenar.
:::

## Adónde ir después

- [Colmenas](/using-the-app/hives) — añade colonias y registra datos sobre ellas.
- [Reinas](/using-the-app/queens) — sigue a tus reinas y sus colores de marcado.
- [Etiquetas QR](/using-the-app/qr-labels) — imprime y usa etiquetas escaneables para las colmenas.
- [Sin conexión y sincronización](/using-the-app/offline-and-sync) — cómo tus registros se mantienen disponibles en todas partes.
