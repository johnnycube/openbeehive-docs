---
sidebar_position: 5
title: "Inspecciones (visitas)"
---

# Inspecciones (visitas)

Una inspección es el registro de una sola visita a una colmena: lo que viste, lo que hiciste y todo lo que merezca la pena recordar para la próxima vez. A lo largo de una temporada, estas visitas conforman un relato claro de cómo se desarrolla cada colonia.

Como Openbeehive funciona con prioridad sin conexión (offline-first), puedes registrarlo todo junto a la colmena sin necesidad de señal. Las entradas se guardan al instante en tu dispositivo y se sincronizan con el servidor en segundo plano en cuanto vuelves a tener cobertura. Consulta [Sin conexión y sincronización](/using-the-app/offline-and-sync) para ver cómo funciona.

:::tip
Para orientarte sobre _qué_ buscar durante una visita y con qué frecuencia inspeccionar, lee [Inspeccionar una colonia](/beekeeping/inspecting). Esta página trata sobre cómo registrarlo.
:::

## Iniciar una inspección

Abre una colmena y toca **Añadir inspección** (o escanea la [etiqueta QR](/using-the-app/qr-labels) de la colmena para ir directamente a ella). Se crea una nueva visita marcada con la fecha y hora actuales.

Todos los campos son opcionales. Registra tanto o tan poco como quieras: un rápido "todo bien" es una entrada perfectamente válida.

## Fecha y clima

| Campo | Notas |
| --- | --- |
| Fecha | Por defecto es el momento actual; cámbiala si estás registrando una visita pasada. |
| Clima | Las condiciones del momento, p. ej. soleado, nublado, ventoso. Es un contexto útil, ya que las abejas se comportan de forma diferente con mal tiempo. |

## Colonia y comportamiento

Esta sección recoge el estado de la colonia ese día.

| Campo | Qué registra |
| --- | --- |
| Reina vista | Si realmente avistaste a la reina. |
| Huevos vistos | Los huevos son la mejor señal rápida de una reina que ha puesto recientemente. |
| Cría operculada | Si hay cría de obrera sellada. |
| Larva más joven | El estadio de cría más joven que encontraste, una señal más fina de puesta reciente. |
| Cuadros ocupados | Cuántos cuadros cubren las abejas. |
| Cuadros de cría | Cuántos cuadros contienen cría. |
| Reservas de alimento | Tu valoración de las reservas: escasas, adecuadas o abundantes. |
| Realeras de enjambrazón | Si hay realeras que sugieran preparativos de enjambrazón. |
| Mansedumbre | Lo tranquila que está la colonia en general. |
| Calma sobre el panal | Si las abejas permanecen quietas sobre el panal o corren y se agitan. |
| Recuento de varroa | Recuento de ácaros de una bandeja o lavado, si lo hiciste. |

:::note
Rara vez rellenarás todos los campos en cada visita. El trío "reina vista / huevos vistos / larva más joven" suele bastar para confirmar una reina sana en puesta sin necesidad de encontrarla cada vez.
:::

## Actividades de la visita

Registra cualquier cosa que hicieras mientras la colmena estaba abierta. Estas actividades también alimentan los registros más amplios de la colmena; por ejemplo, la miel extraída puede pasar a [Cosechas](/using-the-app/harvests).

| Actividad | Registra |
| --- | --- |
| Alimentado | Cantidad alimentada, en kg. |
| Cuadros añadidos / retirados | Cuadros que pusiste o quitaste. |
| Cuadro zanganero cortado | Si recortaste un cuadro de cría de zánganos (una medida de control de varroa). |
| Alza añadida | Si añadiste un alza para el almacenamiento de miel. |
| Peso de la colmena | El peso pesado de la colmena, si lo controlas. |
| Miel cosechada | Miel extraída en esta visita. |

Para una visión más amplia sobre el manejo de ácaros y la cosecha, consulta [Varroa](/beekeeping/varroa) y [Cosecha de miel](/beekeeping/honey-harvest).

## Clima: temperatura y humedad

Cada inspección puede registrar la temperatura y la humedad relativa, tanto **dentro de la
colmena** como **fuera**, útil para seguir el calor del nido de cría, la ventilación y
la invernada.

| Campo | Registra | Unidad |
| --- | --- | --- |
| Temperatura de la colmena | Temperatura dentro de la colmena | °C |
| Temperatura exterior | Temperatura ambiente en el colmenar | °C |
| Humedad de la colmena | Humedad relativa dentro de la colmena | % |
| Humedad exterior | Humedad relativa exterior | % |

Los cuatro son opcionales: rellena lo que hayas medido. Con el tiempo aparecen en los
**gráficos de desarrollo** de la colmena junto al peso y la fuerza de la colonia.

:::tip Deja que lo hagan los sensores
No tienes que introducir estos datos a mano. Una báscula de colmena o una sonda de temperatura/humedad puede
publicar las lecturas automáticamente a través de la API; consulta
[Rastreadores automatizados](/using-the-api/automated-trackers).
:::

## Notas y fotos

Añade **notas** de texto libre para todo lo que los campos estructurados no cubran: una realera de reemplazo marcada, un mal carácter que conviene vigilar, un recordatorio para reemplazar la reina.

Adjunta **fotos** para captar patrones de cría, sospechas de enfermedad o realeras. Las imágenes se almacenan con la visita y se sincronizan junto con el resto de tus registros.

:::tip
Si algo necesita seguimiento, crea una [Tarea](/using-the-app/tasks) desde la visita para que no se pierda.
:::

## El registro de visitas por colmena

Cada inspección se conserva, nunca se sobrescribe. En la página de la colmena tienes un **registro de visitas** cronológico: el historial completo de esa colonia, de más reciente a más antigua.

Este registro te permite detectar tendencias de un vistazo: la cría aumentando en primavera, las reservas agotándose antes del invierno, un recuento de varroa creciente o un problema de carácter desarrollándose. Como cada visita es un evento de solo adición (append-only), la sincronización entre dispositivos nunca pierde ni genera conflictos en un registro.

## Consejos para una entrada rápida en el campo

Las inspecciones ocurren con guantes puestos, bajo sol intenso y con abejas en el aire. Unos pocos hábitos agilizan la entrada:

- **Escanea la etiqueta QR** para abrir la colmena correcta al instante, sin desplazarte por una lista.
- **Registra sobre la marcha.** Toca los campos entre cuadros en lugar de intentar recordarlo todo después.
- **Apóyate en el trío rápido.** Huevos vistos, larva más joven y cría operculada confirman una reina en puesta más rápido que buscarla.
- **Usa voz o notas breves.** Deja una nota corta ahora; púlela más tarde desde la comodidad de casa.
- **No te preocupes por los huecos.** Los campos vacíos están bien. Registra solo lo que comprobaste.
- **Fotografía lo dudoso.** Una foto de un patrón de cría extraño o de una realera vale más que una descripción escrita.

:::caution
Si sospechas de una enfermedad de declaración obligatoria como la loque americana o europea, fotografíala, cierra la colmena y sigue las normas de notificación locales. Las obligaciones de notificación varían según el país y la región. Consulta [Enfermedades y plagas](/knowledge-base/diseases-and-pests).
:::

---

Véase también: [Inspeccionar una colonia](/beekeeping/inspecting) para la técnica de campo, y [Colmenas](/using-the-app/hives) para saber dónde se encuentra el registro de visitas.
