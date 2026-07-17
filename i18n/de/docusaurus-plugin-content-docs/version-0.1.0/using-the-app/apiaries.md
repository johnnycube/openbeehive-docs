---
sidebar_position: 2
title: "Bienenstände"
---

# Bienenstände

Ein **Bienenstand** ist ein Ort, an dem du Bienen hältst: dein Garten, eine Parzelle, ein Dach, ein gepachtetes Feld oder ein abgelegener Standort am Waldrand. In Openbeehive steht der Bienenstand ganz oben in deinen Aufzeichnungen. Alles andere ordnet sich darunter ein.

Die Hierarchie ist einfach:

```text
Apiary  ->  Hive  ->  Queen
```

Jeder Bienenstand enthält eine oder mehrere Beuten, jede Beute hat ihre aktuelle (und vergangene) Königinnen, und deine Durchsichten, Aufgaben, Ereignisse, Ernten und Behandlungen hängen alle an einer Beute innerhalb eines Bienenstands. Da der Bienenstand die Wurzel des Baums ist, ist er auch die Einheit, die du mit anderen Personen teilst. Mehr dazu weiter unten.

## Warum Bienenstände wichtig sind

Beuten nach Standort zu gruppieren sorgt nicht nur für Ordnung. Ein paar praktische Vorteile:

- **Kontext für deine Arbeit.** Wenn du an einem Standort ankommst, öffnest du diesen Bienenstand und siehst nur die Beuten vor dir.
- **Anfahrt und Logistik.** Koordinaten helfen dir, einen abgelegenen Standort wiederzufinden, seinen Standort zu teilen oder eine Besuchsrunde zu planen.
- **Freigabe-Grenzen.** Der Zugriff wird pro Bienenstand gewährt, sodass du einen Standort mit einem Mentor oder Partner teilen kannst, ohne den Rest deines Betriebs offenzulegen.

:::tip
Wenn du an mehreren Stellen Bienen hältst, lege pro physischem Standort einen Bienenstand an. So bleiben Durchsichten, Ernten und Behandlungen dort gruppiert, wo du tatsächlich arbeitest.
:::

## Einen Bienenstand anlegen

Wähle vom Dashboard oder der Bienenstand-Liste **Neuer Bienenstand** und fülle die Details aus. Nur ein Name ist erforderlich; alles andere kann später ergänzt werden.

| Feld | Erforderlich | Wofür es ist |
| --- | --- | --- |
| **Name** | Ja | Eine kurze, wiedererkennbare Bezeichnung, z. B. "Hausgarten" oder "Streuobststand". |
| **Adresse** | Nein | Eine frei eingebbare Adresse oder Beschreibung, die dir (und allen, mit denen du teilst) hilft, den Ort zu finden. |
| **Notiz** | Nein | Alles Nützliche: Torcodes, Zugangshinweise, der Name des Grundbesitzers, Parkmöglichkeiten. |
| **Breitengrad / Längengrad** | Nein | GPS-Koordinaten für den Bienenstand, in Dezimalgrad. |

Da Openbeehive offline-first arbeitet, wird der Bienenstand in dem Moment, in dem du ihn anlegst, direkt in die Datenbank auf deinem Gerät gespeichert. Er erscheint sofort, funktioniert ohne Empfang und synchronisiert sich im Hintergrund mit dem Server, sobald du wieder online bist. Wie das funktioniert, erfährst du unter [Offline und Synchronisation](/using-the-app/offline-and-sync).

### GPS-Koordinaten festlegen

Du kannst Breiten- und Längengrad von Hand eingeben oder auf **Meinen Standort verwenden** tippen, um sie aus dem GPS deines Geräts zu übernehmen. Dein Browser fragt beim ersten Mal nach Erlaubnis.

Koordinaten werden als Dezimalgrad gespeichert, zum Beispiel ein Breitengrad von `52.5200` und ein Längengrad von `13.4050`. Negative Werte sind gültig: südlich des Äquators beim Breitengrad, westlich von Greenwich beim Längengrad.

:::note
"Meinen Standort verwenden" erfasst, wo **du** gerade stehst, was üblicherweise genau dort ist, wo die Beuten stehen. Wenn du den Bienenstand zu Hause für einen abgelegenen Standort einrichtest, gib die Koordinaten stattdessen manuell ein oder bearbeite sie bei deinem nächsten Besuch.
:::

## Beuten hinzufügen und anzeigen

Öffne einen Bienenstand, um alle seine Beuten auf einen Blick zu sehen, samt einem schnellen Eindruck, wie es jeder geht. Von hier aus kannst du:

- **Eine Beute hinzufügen** mit **Neue Beute**, ihren Typ wählen (Zander, Dadant, Deutsch Normal, Langstroth, Warre, Top-bar oder Sonstige) und ihr einen Namen oder eine Nummer geben.
- **Eine Beute öffnen**, um ihre Königin, Durchsichten, Aufgaben, Ereignisse, Ernten und Behandlungen anzusehen.

Für alles, was du zu einem einzelnen Volk erfassen kannst, siehe [Beuten](/using-the-app/hives) und [Königinnen](/using-the-app/queens).

## QR-Etiketten für den Bienenstand drucken

Jede Beute kann ein druckbares **QR-Etikett** tragen. Aus der Bienenstand-Ansicht kannst du Etiketten für alle seine Beuten auf einmal drucken, was weit schneller geht als einzeln.

Jedes Etikett kodiert einen Deep Link zu genau dieser Beute. Wenn du es mit einem Smartphone scannst, öffnet sich Openbeehive direkt bei der Beute, sodass du eine Durchsicht starten kannst, ohne Listen zu durchsuchen. Klebe das Etikett an eine wettergeschützte Stelle am Beutenkörper oder Deckel.

Für Etikettengrößen, Neudruck und wie die Links aufgebaut sind, siehe [QR-Etiketten](/using-the-app/qr-labels).

:::tip
Drucke frische QR-Etiketten, wann immer du einen Schwung neuer Beuten zu einem Standort hinzufügst. Nimm sie mit und bringe sie vor Ort an, damit die physische Beute und deine Aufzeichnungen vom ersten Tag an übereinstimmen.
:::

## Bearbeiten und umorganisieren

Du kannst einen Bienenstand umbenennen, seine Adresse, Notiz und Koordinaten aktualisieren oder Details jederzeit korrigieren. Bearbeitungen synchronisieren sich genauso wie alles andere, mit feldweisem Last-Writer-Wins, sodass die jeweils jüngste Änderung an jedem Feld gewinnt, selbst wenn zwei Personen gleichzeitig bearbeiten.

Wenn eine Beute an einen anderen Standort umzieht, verschiebe sie zum passenden Bienenstand, damit deine Aufzeichnungen die Realität weiterhin abbilden. Wanderimker, die Völker zwischen Standorten bewegen, können pro Standort einen Bienenstand führen und Beuten beim Wandern neu zuordnen.

## Einen Bienenstand teilen

Das Teilen in Openbeehive geschieht auf **Bienenstand-Ebene** über *Scopes*. Wenn du einen Bienenstand teilst, erhalten die eingeladenen Personen Zugriff auf diesen Standort und die darin enthaltenen Beuten, Königinnen und Aufzeichnungen, aber nicht auf deine anderen Bienenstände.

Das macht es praktikabel:

- Einen einzelnen Standort mit einem Mentor, einem Lehrling oder einem Mitimker zu teilen.
- Einen Vereins- oder Clubbienenstand zu betreiben, den mehrere Mitglieder gemeinsam pflegen.
- Deine Völker zu Hause privat zu halten, während du an einem gemeinsamen Standort zusammenarbeitest.

Da die Synchronisation konfliktfrei ist, können mehrere Personen im selben geteilten Bienenstand arbeiten, sogar offline, und ihre Änderungen werden sauber zusammengeführt, wenn die Geräte sich wieder verbinden.

Für das Datenmodell hinter den Scopes und wie konfliktfreies Teilen im Hintergrund funktioniert, siehe [Architektur](/developers/architecture).

:::caution
Einen Bienenstand zu teilen gewährt echten Zugriff auf seine Aufzeichnungen. Lade nur Personen ein, denen du vertraust, und bedenke, dass jeder mit Zugriff zu den Beuten in diesem Bienenstand hinzufügen, bearbeiten und erfassen kann.
:::

## Wie es weitergeht

- [Beuten](/using-the-app/hives) — Völker hinzufügen und zu ihnen erfassen.
- [Königinnen](/using-the-app/queens) — deine Königinnen und Markierungsfarben verfolgen.
- [QR-Etiketten](/using-the-app/qr-labels) — scanbare Beuten-Etiketten drucken und nutzen.
- [Offline und Synchronisation](/using-the-app/offline-and-sync) — wie deine Aufzeichnungen überall verfügbar bleiben.
