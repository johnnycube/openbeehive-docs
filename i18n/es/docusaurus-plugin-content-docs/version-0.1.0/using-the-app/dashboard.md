---
sidebar_position: 1
title: "El panel de control"
---

# El panel de control

El panel de control es tu base de operaciones en Openbeehive. Es la primera pantalla que ves al abrir la aplicación y está pensado para responder a una pregunta sencilla: ¿qué necesita mi atención hoy?

Como Openbeehive funciona con un enfoque offline-first, todo lo que aparece en el panel se lee directamente de la base de datos local de tu dispositivo. Se carga al instante y funciona tengas o no cobertura en el colmenar. Los cambios que hagas se sincronizan con el servidor de forma discreta en segundo plano.

## Mosaicos de estadísticas

En la parte superior del panel encontrarás una fila de mosaicos de estadísticas que te dan un recuento rápido de lo que contienen tus registros:

| Mosaico | Qué muestra |
| --- | --- |
| **Colmenares** | El número de colmenares que mantienes, incluidos los que se han compartido contigo. |
| **Colmenas** | Total de colmenas en todos tus colmenares. |
| **Reinas** | Reinas registradas actualmente al frente de una colonia. |
| **Tareas abiertas** | Tareas que aún no están marcadas como hechas. |

Cada mosaico se puede pulsar y te lleva a la sección correspondiente de la aplicación, de modo que puedes pasar directamente de un recuento al detalle que hay detrás.

## Qué hay que hacer

Debajo de los mosaicos, el panel agrupa las cosas que dependen del tiempo.

### Inspecciones pendientes

Lista las colmenas cuya próxima inspección está pendiente o vencida, según el intervalo que fijaste al inspeccionar. Es tu recordatorio para planificar una visita. Pulsa una colmena para abrirla e iniciar una nueva inspección.

### Tareas próximas

Muestra las tareas con una fecha de vencimiento próxima, las más cercanas primero. Las tareas pueden estar vinculadas a una colmena o colmenar concreto, o ser independientes (por ejemplo, "encargar cuadros nuevos"). Marca una como hecha aquí mismo sin salir del panel.

### Inspecciones recientes

Un breve listado de tus visitas más recientes, para que puedas ver de un vistazo qué encontraste por última vez en cada colonia. Pulsa cualquier entrada para leer las notas completas de la inspección.

### Miel esta temporada

Un total acumulado de la miel que has cosechado en la temporada actual, calculado a partir de tus registros de cosecha. Es una forma rápida y gratificante de seguir cómo va el año.

:::tip
El panel refleja únicamente lo que hay en tus registros. Cuanto más constante seas al anotar inspecciones, tareas y cosechas, más útiles serán estos resúmenes.
:::

## Cómo moverte

Cómo navegas depende del tamaño de tu pantalla. Las mismas funciones están disponibles de cualquier manera; solo cambia la disposición.

### En móvil

Una **barra de pestañas inferior** te da acceso con un solo toque a las áreas principales de la aplicación: el panel, tus colmenares y colmenas, las tareas, etc. Permanece fija en la parte inferior de la pantalla, así que siempre está al alcance del pulgar mientras trabajas junto a la colmena.

### En escritorio y tableta

Una **barra lateral** recorre el lado izquierdo con el mismo conjunto de destinos, además de un poco más de espacio para mostrar etiquetas y elementos anidados. En pantallas más anchas, esto deja el área principal libre para tus registros.

## Cuenta y ajustes

Tu cuenta y tus ajustes están juntos en un solo lugar, accesible desde la navegación. Aquí puedes gestionar tu perfil, cerrar sesión y acceder a las preferencias generales de la aplicación, como el idioma y (si tu servidor las usa) las passkeys y los proveedores de inicio de sesión conectados.

Si ejecutas una instancia autoalojada de un solo usuario sin inicio de sesión configurado, el bloque de cuenta simplemente muestra tu perfil local.

## El indicador de conexión/sin conexión

Un pequeño indicador muestra tu estado actual de conexión y sincronización.

- **Conectado** significa que la aplicación está conectada y sincronizando los cambios con el servidor.
- **Sin conexión** significa que ahora mismo no hay conexión. Esto es completamente normal y no hay de qué preocuparse: puedes seguir añadiendo inspecciones, tareas y todo lo demás exactamente igual que siempre.

Cuando vuelvas a tener cobertura, Openbeehive sincroniza automáticamente. Gracias a su diseño sin conflictos, las ediciones hechas en distintos dispositivos mientras estaban sin conexión se fusionan limpiamente cuando se reencuentran.

:::note
Ver "sin conexión" **no** significa que vayas a perder datos. Todo se guarda primero localmente. El indicador solo te avisa de cuándo la sincronización en segundo plano está en pausa. Para saber más sobre cómo funciona, consulta [Sin conexión y sincronización](/using-the-app/offline-and-sync).
:::

## Cambiar el idioma

Openbeehive está disponible en varios idiomas. Para cambiarlo:

1. Abre **Ajustes**.
2. Busca la opción **Idioma**.
3. Elige tu idioma preferido.

Los idiomas disponibles son:

| Código | Idioma |
| --- | --- |
| `en` | Inglés (English) |
| `de` | Alemán (Deutsch) |
| `fr` | Francés (Français) |
| `es` | Español |
| `it` | Italiano |

El cambio surte efecto de inmediato y se recuerda en tu dispositivo.

## Adónde ir después

Desde el panel puedes ramificarte hacia el resto de la aplicación:

- Configura tus [colmenares](/using-the-app/apiaries) y [colmenas](/using-the-app/hives).
- Registra una visita en [inspecciones](/using-the-app/inspections).
- Mantente al día con los trabajos mediante [tareas](/using-the-app/tasks).
- Anota tu cosecha en [cosechas](/using-the-app/harvests).

Para un recorrido más amplio por todo lo que la aplicación puede hacer, dirígete a la introducción de [Uso de la aplicación](/category/using-the-app).
