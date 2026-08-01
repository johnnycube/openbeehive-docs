---
sidebar_position: 5
title: "Durchsichten (Besuche)"
---

# Durchsichten (Besuche)

Eine Durchsicht ist die Aufzeichnung eines einzelnen Besuchs an einer Beute: was du gesehen hast, was du getan hast und alles, was für das nächste Mal erwähnenswert ist. Über eine Saison fügen sich diese Besuche zu einer klaren Geschichte zusammen, wie sich jedes Volk entwickelt.

Da Openbeehive offline-first arbeitet, kannst du alles direkt an der Beute ohne Empfang erfassen. Einträge werden sofort auf deinem Gerät gespeichert und synchronisieren sich im Hintergrund mit dem Server, sobald du wieder in Reichweite bist. Wie das funktioniert, erfährst du unter [Offline & Synchronisation](/using-the-app/offline-and-sync).

:::tip
Für Hinweise dazu, _wonach_ du bei einem Besuch suchen solltest und wie oft du durchsehen solltest, lies [Ein Volk durchsehen](/beekeeping/inspecting). Diese Seite behandelt, wie du es erfasst.
:::

## Eine Durchsicht beginnen

Öffne eine Beute und tippe auf **Durchsicht hinzufügen** (oder scanne das [QR-Etikett](/using-the-app/qr-labels) der Beute, um direkt dorthin zu springen). Ein neuer Besuch wird angelegt und mit dem aktuellen Datum und der aktuellen Uhrzeit versehen.

Jedes Feld ist optional. Erfasse so viel oder so wenig, wie du möchtest — ein schnelles "alles in Ordnung" ist ein vollkommen gültiger Eintrag.

## Datum und Wetter

| Feld | Hinweise |
| --- | --- |
| Datum | Standardmäßig jetzt; ändere es, wenn du einen vergangenen Besuch erfasst. |
| Wetter | Die Bedingungen zum Zeitpunkt, z. B. sonnig, bedeckt, windig. Nützlicher Kontext, da Bienen sich bei schlechtem Wetter anders verhalten. |

## Volk & Verhalten

Dieser Abschnitt erfasst den Zustand des Volkes am betreffenden Tag.

| Feld | Was es erfasst |
| --- | --- |
| Königin gesehen | Ob du die Königin tatsächlich entdeckt hast. |
| Eier gesehen | Eier sind das beste schnelle Anzeichen für eine kürzlich legende Königin. |
| Verdeckelte Brut | Ob verdeckelte Arbeiterinnenbrut vorhanden ist. |
| Jüngste Larve | Das jüngste Brutstadium, das du gefunden hast — ein feineres Signal für jüngstes Legen. |
| Besetzte Waben | Wie viele Waben die Bienen bedecken. |
| Brutwaben | Wie viele Waben Brut enthalten. |
| Futtervorräte | Deine Einschätzung der Vorräte: knapp, ausreichend oder reichlich. |
| Schwarmzellen | Ob Weiselzellen vorhanden sind, die auf Schwarmvorbereitung hindeuten. |
| Sanftmut | Wie ruhig das Volk insgesamt ist. |
| Wabensitz | Ob die Bienen ruhig auf der Wabe sitzen oder laufen und hochkochen. |
| Varroa-Zahl | Milbenzahl von einer Windel oder Auswaschung, falls du eine genommen hast. |

:::note
Du wirst selten bei jedem Besuch jedes Feld ausfüllen. Das Trio "Königin gesehen / Eier gesehen / jüngste Larve" reicht meist aus, um eine gesunde legende Königin zu bestätigen, ohne sie jedes Mal finden zu müssen.
:::

## Tätigkeiten beim Besuch

Erfasse alles, was du getan hast, während die Beute offen war. Diese Tätigkeiten fließen auch in die weiteren Aufzeichnungen der Beute ein — zum Beispiel kann entnommener Honig in die [Ernten](/using-the-app/harvests) fließen.

| Tätigkeit | Erfasst |
| --- | --- |
| Gefüttert | Gefütterte Menge, in kg. |
| Rähmchen hinzugefügt / entfernt | Rähmchen, die du eingesetzt oder entnommen hast. |
| Drohnenrahmen geschnitten | Ob du eine Drohnenbrutwabe ausgeschnitten hast (eine Maßnahme zur Varroa-Kontrolle). |
| Honigraum aufgesetzt | Ob du einen Honigraum zur Honiglagerung aufgesetzt hast. |
| Beutengewicht | Das gewogene Gewicht der Beute, falls du es verfolgst. |
| Honig geerntet | Honig, der bei diesem Besuch entnommen wurde. |

Für das größere Bild zum Milbenmanagement und zur Ernte siehe [Varroa](/beekeeping/varroa) und [Honigernte](/beekeeping/honey-harvest).

## Klima: Temperatur & Luftfeuchtigkeit

Jede Durchsicht kann Temperatur und relative Luftfeuchtigkeit erfassen, sowohl **in der
Beute** als auch **außerhalb** — nützlich, um die Wärme des Brutnests, die Belüftung und
die Überwinterung zu verfolgen.

| Feld | Erfasst | Einheit |
| --- | --- | --- |
| Beutentemperatur | Temperatur im Inneren der Beute | °C |
| Außentemperatur | Umgebungstemperatur am Bienenstand | °C |
| Beutenluftfeuchtigkeit | Relative Luftfeuchtigkeit im Inneren der Beute | % |
| Außenluftfeuchtigkeit | Relative Luftfeuchtigkeit außen | % |

Alle vier sind optional — trage ein, was du gemessen hast. Mit der Zeit erscheinen sie in den
**Entwicklungsdiagrammen** der Beute zusammen mit Gewicht und Volksstärke.

:::tip Lass Sensoren die Arbeit machen
Du musst diese Werte nicht eintippen. Eine Stockwaage oder eine Temperatur-/Feuchtigkeitssonde kann
Messwerte automatisch über die API senden — siehe
[Automatisierte Tracker](/using-the-api/automated-trackers).
:::

## Notizen und Fotos

Füge frei eingebbare **Notizen** für alles hinzu, was die strukturierten Felder nicht abdecken — eine markierte Nachschaffungszelle, eine Wesensart, die im Auge behalten werden muss, eine Erinnerung zum Umweiseln.

Hänge **Fotos** an, um Brutmuster, Krankheitsverdacht oder Weiselzellen festzuhalten. Bilder werden mit dem Besuch gespeichert und synchronisieren zusammen mit dem Rest deiner Aufzeichnungen.

:::tip
Wenn etwas nachverfolgt werden muss, erstelle aus dem Besuch eine [Aufgabe](/using-the-app/tasks), damit es nicht verloren geht.
:::

## Das Besuchsprotokoll pro Beute

Jede Durchsicht wird aufbewahrt, niemals überschrieben. Auf der Beuten-Seite erhältst du ein chronologisches **Besuchsprotokoll** — die vollständige Historie dieses Volkes, die neueste zuerst.

Dieses Protokoll lässt dich Trends auf einen Blick erkennen: Brut, die sich im Frühjahr aufbaut, Vorräte, die vor dem Winter zur Neige gehen, eine steigende Varroa-Zahl oder ein sich entwickelndes Wesensproblem. Da jeder Besuch ein reines Anhänge-Ereignis ist, verliert oder kollidiert die Synchronisation über Geräte hinweg nie eine Aufzeichnung.

## Tipps für schnelle Feldeingabe

Durchsichten finden mit Handschuhen statt, in greller Sonne, mit Bienen in der Luft. Ein paar Gewohnheiten halten die Eingabe schnell:

- **Scanne das QR-Etikett**, um die richtige Beute sofort zu öffnen — kein Scrollen durch eine Liste.
- **Erfasse unterwegs.** Tippe Felder zwischen den Waben an, statt zu versuchen, dir alles hinterher zu merken.
- **Verlass dich auf das schnelle Trio.** Eier gesehen, jüngste Larve und verdeckelte Brut bestätigen eine legende Königin schneller, als sie aufzuspüren.
- **Nutze Sprache oder kurze Notizen.** Wirf jetzt eine kurze Notiz hin; bring sie später bequem von zu Hause aus in Ordnung.
- **Mach dir keine Sorgen über Lücken.** Leere Felder sind in Ordnung. Erfasse nur, was du geprüft hast.
- **Fotografiere das Zweifelhafte.** Ein Bild eines auffälligen Brutmusters oder einer Weiselzelle ist mehr wert als eine getippte Beschreibung.

:::caution
Wenn du eine anzeigepflichtige Krankheit wie die Amerikanische oder Europäische Faulbrut vermutest, fotografiere sie, mach zu und befolge deine örtlichen Meldevorschriften. Die Meldepflichten variieren je nach Land und Region. Siehe [Krankheiten & Schädlinge](/knowledge-base/diseases-and-pests).
:::

---

Siehe auch: [Ein Volk durchsehen](/beekeeping/inspecting) für die Feldtechnik und [Beuten](/using-the-app/hives) dafür, wo das Besuchsprotokoll liegt.
