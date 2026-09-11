---
sidebar_position: 1
title: "Das Dashboard"
---

# Das Dashboard

Das Dashboard ist deine Schaltzentrale in Openbeehive. Es ist der erste Bildschirm, den du beim Öffnen der App siehst, und es ist darauf ausgelegt, eine einfache Frage zu beantworten: Was braucht heute meine Aufmerksamkeit?

Da Openbeehive offline-first arbeitet, wird alles auf dem Dashboard direkt aus der lokalen Datenbank auf deinem Gerät gelesen. Es lädt sofort und funktioniert, egal ob du am Bienenstand Empfang hast oder nicht. Änderungen, die du vornimmst, synchronisieren sich im Hintergrund unauffällig mit dem Server.

## Statistik-Kacheln

Am oberen Rand des Dashboards findest du eine Reihe von Statistik-Kacheln, die dir einen schnellen Überblick über den Inhalt deiner Aufzeichnungen geben:

| Kachel | Was sie zeigt |
| --- | --- |
| **Bienenstände** | Die Anzahl der Bienenstände, die du betreust, einschließlich der mit dir geteilten. |
| **Beuten** | Gesamtzahl der Beuten über alle deine Bienenstände hinweg. |
| **Königinnen** | Königinnen, die aktuell als Weisel eines Volkes erfasst sind. |
| **Offene Aufgaben** | Aufgaben, die noch nicht als erledigt markiert sind. |

Jede Kachel ist antippbar und bringt dich zum passenden Bereich der App, sodass du direkt von einer Zahl zu den dahinterstehenden Details springen kannst.

## Was zu tun ist

Unterhalb der Kacheln fasst das Dashboard die zeitkritischen Dinge zusammen.

### Fällige Durchsichten

Listet Beuten auf, deren nächste Durchsicht fällig oder überfällig ist, basierend auf dem Intervall, das du bei der Durchsicht festgelegt hast. Das ist deine Erinnerung, einen Besuch zu planen. Tippe auf eine Beute, um sie zu öffnen und eine neue Durchsicht zu beginnen.

### Anstehende Aufgaben

Zeigt Aufgaben mit nahendem Fälligkeitsdatum, die frühesten zuerst. Aufgaben können an eine bestimmte Beute oder einen Bienenstand gebunden sein oder für sich allein stehen (zum Beispiel "neue Rähmchen bestellen"). Hake eine direkt hier ab, ohne das Dashboard zu verlassen.

### Letzte Durchsichten

Ein kurzer Verlauf deiner jüngsten Besuche, sodass du auf einen Blick siehst, was du zuletzt in jedem Volk vorgefunden hast. Tippe auf einen Eintrag, um die vollständigen Durchsichtsnotizen zu lesen.

### Honig in dieser Saison

Eine laufende Summe des Honigs, den du in der aktuellen Saison geerntet hast, gespeist aus deinen Ernteaufzeichnungen. Eine schnelle und befriedigende Art, den Verlauf des Jahres zu verfolgen.

:::tip
Das Dashboard spiegelt nur das wider, was in deinen Aufzeichnungen steht. Je konsequenter du Durchsichten, Aufgaben und Ernten erfasst, desto nützlicher werden diese Übersichten.
:::

## Navigation

Wie du navigierst, hängt von der Größe deines Bildschirms ab. Dieselben Funktionen stehen in beiden Fällen zur Verfügung; nur das Layout ändert sich.

### Auf dem Mobilgerät

Eine **untere Tab-Leiste** gibt dir mit einem Tipp Zugriff auf die Kernbereiche der App: das Dashboard, deine Bienenstände und Beuten, Aufgaben und so weiter. Sie bleibt fest am unteren Bildschirmrand, sodass sie beim Arbeiten an der Beute stets in Daumenreichweite ist.

### Auf Desktop und Tablet

Eine **Seitenleiste** läuft am linken Rand entlang und bietet dieselben Ziele, plus etwas mehr Platz für Beschriftungen und verschachtelte Einträge. Auf breiteren Bildschirmen bleibt so der Hauptbereich für deine Aufzeichnungen frei.

## Konto und Einstellungen

Dein Konto und deine Einstellungen liegen an einem Ort beisammen, erreichbar über die Navigation. Hier kannst du dein Profil verwalten, dich abmelden und app-weite Einstellungen wie Sprache und (sofern dein Server sie nutzt) Passkeys und verbundene Anmeldeanbieter erreichen.

Wenn du eine selbst gehostete Einzelnutzer-Instanz ohne konfigurierte Anmeldung betreibst, zeigt der Konto-Block einfach dein lokales Profil an.

## Die Online-/Offline-Anzeige

Eine kleine Anzeige zeigt deinen aktuellen Verbindungs- und Synchronisationsstatus.

- **Online** bedeutet, die App ist verbunden und synchronisiert Änderungen mit dem Server.
- **Offline** bedeutet, dass gerade keine Verbindung besteht. Das ist völlig normal und kein Grund zur Sorge: Du kannst weiterhin Durchsichten, Aufgaben und alles andere genau wie gewohnt hinzufügen.

Sobald du wieder in Reichweite bist, synchronisiert Openbeehive automatisch. Dank des konfliktfreien Designs werden Bearbeitungen, die offline auf verschiedenen Geräten vorgenommen wurden, sauber zusammengeführt, wenn sie wieder aufeinandertreffen.

:::note
"Offline" zu sehen bedeutet **nicht**, dass du Daten verlierst. Alles wird zuerst lokal gespeichert. Die Anzeige sagt dir lediglich, wann die Hintergrund-Synchronisation pausiert ist. Mehr dazu, wie das funktioniert, findest du unter [Offline und Synchronisation](/using-the-app/offline-and-sync).
:::

## Die Sprache ändern

Openbeehive ist in mehreren Sprachen verfügbar. So wechselst du:

1. Öffne die **Einstellungen**.
2. Suche die Option **Sprache**.
3. Wähle deine bevorzugte Sprache.

Die verfügbaren Sprachen sind:

| Code | Sprache |
| --- | --- |
| `en` | Englisch |
| `de` | Deutsch (German) |
| `fr` | Französisch (Français) |
| `es` | Spanisch (Español) |
| `it` | Italienisch (Italiano) |

Die Änderung wird sofort wirksam und auf deinem Gerät gespeichert.

## Wie es weitergeht

Vom Dashboard aus kannst du in den Rest der App verzweigen:

- Richte deine [Bienenstände](/using-the-app/apiaries) und [Beuten](/using-the-app/hives) ein.
- Erfasse einen Besuch in den [Durchsichten](/using-the-app/inspections).
- Behalte den Überblick über anstehende Arbeiten mit [Aufgaben](/using-the-app/tasks).
- Erfasse deine Ernte unter [Ernten](/using-the-app/harvests).

Für einen breiteren Rundgang durch alles, was die App kann, geht es zur Übersicht [Die App nutzen](/category/using-the-app).
