---
sidebar_position: 10
title: "Sin conexión y sincronización"
---

# Sin conexión y sincronización

Openbeehive está hecho para el colmenar, no para la oficina. Sobre el terreno rara vez
tienes una señal fiable, así que la aplicación es **offline-first**: todo lo que haces se
guarda en tu dispositivo de inmediato y se sincroniza con el servidor más tarde, de forma
discreta, en segundo plano.

En la práctica, esto significa que la aplicación nunca te hace esperar a la red. Abre una
colmena, registra una inspección, añade una tarea, anota una nota sobre la reina, todo
ello es instantáneo, haya cobertura o no.

## Todo se guarda localmente

Cuando instalas Openbeehive, mantiene una copia completa de tus registros en una pequeña
base de datos en tu dispositivo. Cada lectura y cada escritura se realizan primero contra
esa copia local.

La consecuencia:

- **Es rápido.** Abrir una colmena o desplazarte por las inspecciones nunca se queda
  girando en una barra de carga.
- **Funciona sin cobertura.** Un bosque, un valle, un sótano lleno de alzas,
  no hay ninguna diferencia.
- **Tus datos son tuyos.** Los registros viven en tu dispositivo; el servidor es una
  copia para sincronizar y compartir, no el único hogar de tus datos.

:::tip
Como los registros se almacenan en el dispositivo, merece la pena instalar Openbeehive
como una aplicación en lugar de usarlo en una pestaña del navegador. Consulta
[Instalar Openbeehive](/using-the-app/install) para ver cómo añadirlo a tu teléfono,
tableta o escritorio.
:::

## El banner de sin conexión

Cuando la aplicación no puede llegar al servidor, aparece un pequeño banner para avisarte
de que estás trabajando sin conexión. Esto es puramente informativo, puedes continuar
exactamente igual que antes. Sigue registrando inspecciones, marcando tareas, anotando
una cosecha; nada está bloqueado.

En el momento en que tu dispositivo vuelve a estar en línea, el banner desaparece y
cualquier cambio que hayas hecho mientras estabas sin conexión se envía automáticamente.
No hay ningún botón de "sincronizar ahora" que recordar ni riesgo de olvidarte de guardar.

:::note
Un banner de sin conexión persistente normalmente solo significa que hay poca cobertura
en el colmenar. Si se mantiene incluso con una buena conexión en casa, echa un vistazo a
[Solución de problemas](/knowledge-base/troubleshooting).
:::

## Sincronizar entre tus dispositivos

Puedes usar Openbeehive en varios dispositivos, digamos un teléfono sobre el terreno y un
portátil en casa, y se mantendrán en sintonía automáticamente.

Cada dispositivo mantiene su propia copia local e intercambia cambios con el servidor en
segundo plano. Registra una inspección en tu teléfono junto a las colmenas, y para cuando
te sientes ante tu portátil ya estará ahí. Las ediciones fluyen en ambos sentidos.

No tienes que elegir un dispositivo "principal" ni copiar nada a mano. Mientras cada
dispositivo inicie sesión en la misma cuenta, todos ven los mismos registros.

## Qué ocurre cuando dos dispositivos cambian lo mismo

Esta es la pregunta que se hace todo apicultor, y la respuesta tranquilizadora es: no
tienes que pensar en ello. Openbeehive resuelve los cambios superpuestos
**automáticamente**, sin avisos de "¿qué versión quieres conservar?" y sin trabajo
perdido.

Unos cuantos ejemplos de cómo se comporta:

- **Tú editas las notas de una colmena en tu teléfono, tu coapicultor edita las mismas
  notas en el suyo.** La edición más reciente de ese campo prevalece; la otra queda
  reemplazada limpiamente.
- **Ambos añadís tareas, o ambos etiquetáis la colmena, mientras estáis sin conexión.**
  Las adiciones a las listas se conservan, así que no se pierde la tarea ni la etiqueta de
  nadie.
- **Cada uno registra una inspección distinta.** Las inspecciones, los eventos y
  registros similares solo se añaden, nunca se sobrescriben, así que ambos se conservan
  uno al lado del otro.

El resultado es que cada dispositivo converge en el mismo estado, sensato, una vez que
todos se han sincronizado, y nunca obtienes un registro corrupto o medio fusionado.

:::tip
La versión corta: **añade con libertad, edita con confianza, no te preocupes nunca por
perder datos.** Si te pica la curiosidad por cómo funciona esto en realidad por dentro,
las páginas del [protocolo de sincronización](/developers/sync-protocol) y la
[arquitectura](/developers/architecture) lo explican en detalle.
:::

## Compartir un colmenar

Openbeehive comparte los registros a nivel de **colmenar**. Cuando compartes un colmenar,
todo lo que hay dentro de él, sus colmenas, reinas, inspecciones, tareas, eventos,
cosechas y tratamientos, se comparte junto con él. Esto mantiene las cosas sencillas:
concedes acceso a un emplazamiento, no a docenas de colmenas individuales.

A cada persona con la que compartes se le asigna un rol:

| Rol | Qué puede hacer |
| --- | --- |
| **Espectador** | Ver el colmenar y todos sus registros. No puede hacer cambios. |
| **Apicultor** | Ver y editar: registrar inspecciones, completar tareas, anotar cosechas y tratamientos, actualizar colmenas y reinas. |
| **Propietario** | Todo lo que puede hacer un apicultor, más gestionar el propio colmenar y con quién se comparte. |

Esto funciona bien para un colmenar didáctico de asociación, un mentor que vigila las
colmenas de un apicultor novato, o simplemente dos personas que comparten el trabajo en
el mismo emplazamiento. Los registros compartidos se sincronizan y resuelven los
conflictos exactamente igual que los tuyos, así que los cambios de un compañero aparecen
en tus dispositivos automáticamente.

:::note
El uso compartido es por colmenar, así que puedes compartir un emplazamiento con un
mentor mientras mantienes otros totalmente privados.
:::

## ¿Perderé datos alguna vez?

No. Tus registros se escriben primero en tu dispositivo y no se eliminan simplemente
porque estés sin conexión o porque la aplicación se cierre. Esperan a salvo en el
dispositivo hasta que se puedan sincronizar, luego se sincronizan por su cuenta.

Para mayor tranquilidad, sobre todo si te autoalojas, sigue siendo buena práctica
mantener copias de seguridad del servidor. Consulta [Copias de seguridad](/self-hosting/backups) para ver cómo.

## Páginas relacionadas

- [Instalar Openbeehive](/using-the-app/install)
- [Etiquetas QR](/using-the-app/qr-labels)
- [Arquitectura](/developers/architecture)
- [Protocolo de sincronización](/developers/sync-protocol)
