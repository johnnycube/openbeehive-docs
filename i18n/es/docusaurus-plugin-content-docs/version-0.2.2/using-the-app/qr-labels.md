---
sidebar_position: 9
title: "Etiquetas QR"
---

# Etiquetas QR

Una etiqueta QR convierte cualquier colmena en un atajo de un solo toque. Pega una
etiqueta en el techo o la cámara de cría, apunta tu teléfono hacia ella y Openbeehive
abre directamente la ficha de esa colmena. Sin recorrer listas en el colmenar, sin
forzar la vista para leer números escritos a mano bajo la lluvia.

Esto es especialmente útil cuando mantienes varias colmenas que parecen idénticas, o
cuando un ayudante que no conoce tu numeración necesita encontrar la colonia correcta.

## Qué contiene el código QR

El código QR de cada colmena codifica un único **enlace directo** a esa colmena:

```text
<base>/h/<hiveId>
```

El `<base>` es la dirección de tu aplicación (para el servicio alojado es
`https://app.openbeehive.org`; para una instalación autoalojada es tu propia URL). El
`<hiveId>` es el identificador único de la colmena.

El código no contiene datos de abejas, ni pesos de miel, ni información personal. Es
solo un enlace. Si alguien lo escanea sin acceso a tus registros, se le pedirá que
inicie sesión y solo verá la colmena si se ha compartido con esa persona.

:::note
El enlace abre la **aplicación**, que luego carga la colmena desde tu base de datos
local. Como Openbeehive funciona con un enfoque offline-first, la colmena se abre
igualmente aunque no tengas cobertura, una vez que la aplicación está instalada en tu
teléfono.
:::

## Imprimir una etiqueta para una colmena

1. Abre la colmena desde tu lista de **Colmenares**, o desde la colmena directamente.
2. Elige **Etiqueta QR** (búscala en el menú de acciones de la colmena).
3. Aparece una vista previa que muestra el código más el nombre de la colmena y el
   colmenar, para que puedas distinguir las etiquetas antes de que vayan a las cajas.
4. Selecciona **Imprimir**. Se abre el diálogo de impresión de tu navegador.
5. Imprime en una hoja de etiquetas o en papel normal, luego fíjala a la colmena.

:::tip Haz que dure a la intemperie
Las colmenas viven en el sol, la lluvia y la escarcha. Para etiquetas que sobrevivan una
temporada:

- Imprime en papel de etiqueta resistente a la intemperie o de vinilo, **o**
- Imprime en papel y cúbrelo con cinta de embalar transparente o una funda de plastificar.

Coloca la etiqueta en algún sitio donde no la rocen las alzas al levantarlas y ponerlas
— el lateral de la cámara de cría o bajo el borde del techo funcionan bien ambos.
:::

## Imprimir una hoja por lotes para un colmenar

Si estás montando todo un colmenar de una vez, imprime juntas las etiquetas de todas las
colmenas en lugar de una a una.

1. Abre el **colmenar** desde tu lista de Colmenares.
2. Elige **Hoja QR** (o **Imprimir etiquetas**) para el colmenar.
3. Openbeehive compone una hoja con un código etiquetado por cada colmena de ese
   colmenar.
4. Imprime, luego recorta y aplica.

Esto también mantiene un registro ordenado: una sola hoja muestra cada colonia del
colmenar con su nombre y su código uno al lado del otro.

## Escanear una etiqueta

Puedes escanear una etiqueta de dos formas.

### Con la cámara de tu teléfono

La mayoría de los teléfonos modernos reconocen los códigos QR en la aplicación de cámara
integrada. Apunta la cámara a la etiqueta, espera a que aparezca el enlace y púlsalo. Tu
teléfono abre el enlace y Openbeehive salta a la colmena.

Esto funciona para cualquiera: un visitante o un coapicultor puede escanear una colmena
compartida sin abrir antes la aplicación.

### Con el escáner integrado en la aplicación

Openbeehive también tiene su propio escáner, útil cuando ya estás trabajando en la
aplicación y quieres moverte entre colmenas rápidamente.

1. Abre el escáner (busca el icono de QR o de cámara en la aplicación).
2. Concede permiso de cámara la primera vez que lo uses.
3. Apunta a una etiqueta — la colmena se abre de inmediato.

:::tip
El escáner integrado te mantiene dentro de Openbeehive, así que pasas de una ficha de
colmena a la siguiente sin rebotar por el navegador.
:::

## Si un escaneo no abre la colmena correcta

Unas cuantas causas y soluciones comunes:

| Síntoma | Causa probable | Qué hacer |
| --- | --- | --- |
| La cámara no enfoca el código | Etiqueta húmeda, descolorida o curvada | Sécala; reimprímela si está desgastada |
| El enlace abre pero dice "no encontrada" | La colmena se eliminó, o está en otra cuenta | Comprueba que la colmena sigue existiendo y que has iniciado sesión en la cuenta correcta |
| Te pide iniciar sesión | La colmena pertenece al colmenar de otra persona | Pídele que comparta el colmenar contigo |
| No pasa nada al pulsar | La aplicación no está instalada en este teléfono | Instala Openbeehive, luego vuelve a escanear |

El uso compartido es a nivel de colmenar, así que para dejar que alguien escanee una
colmena necesitas compartir su **colmenar** con esa persona. Consulta
[Sin conexión y sincronización](/using-the-app/offline-and-sync)
para ver cómo funcionan el uso compartido y los scopes.

## Reimprimir y cambiar etiquetas

Las etiquetas nunca caducan. El enlace sigue siendo válido durante toda la vida de la
colmena, así que un código impreso hoy seguirá funcionando la próxima temporada.

Si mueves equipo de un lado a otro, recuerda que la etiqueta sigue a la **ficha de la
colmena**, no a la caja física. Cuando retiras una caja pero mantienes la colonia como
la misma colmena en Openbeehive, la etiqueta antigua sigue funcionando. Si inicias una
ficha de colmena nueva, genera e imprime una etiqueta nueva para ella.

:::caution
No traslades una etiqueta impresa de la caja de una colmena a otra esperando que apunte
a la nueva colonia — seguirá abriendo la colmena original. En su lugar, imprime una
etiqueta nueva.
:::

## Profundizar más

¿Quieres el detalle técnico — cómo se analiza el enlace directo, cómo la instalación
nativa intercepta la URL y cómo generar códigos mediante programación? Consulta
[Códigos QR para desarrolladores](/developers/qr-codes).
