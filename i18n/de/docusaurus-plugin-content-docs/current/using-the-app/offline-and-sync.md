---
sidebar_position: 10
title: "Offline & Synchronisation"
---

# Offline & Synchronisation

Openbeehive ist für den Bienenstand gebaut, nicht für das Büro. Draußen im Feld hast
du selten zuverlässigen Empfang, deshalb ist die App **offline-first**: Alles, was du
tust, wird sofort auf deinem Gerät gespeichert und später unauffällig im Hintergrund
mit dem Server synchronisiert.

In der Praxis bedeutet das, dass die App dich nie auf das Netzwerk warten lässt.
Öffne eine Beute, erfasse eine Durchsicht, füge eine Aufgabe hinzu, mach schnell eine
Notiz über die Königin, alles ist sofort da, mit oder ohne Empfang.

## Alles wird lokal gespeichert

Wenn du Openbeehive installierst, behält es eine vollständige Kopie deiner
Aufzeichnungen in einer kleinen Datenbank auf deinem Gerät. Jeder Lese- und jeder
Schreibvorgang erfolgt zuerst gegen diese lokale Kopie.

Das Ergebnis:

- **Es ist schnell.** Eine Beute zu öffnen oder durch Durchsichten zu scrollen dreht
  nie an einem Ladebalken.
- **Es funktioniert ohne Empfang.** Ein Wald, ein Tal, ein Keller voller Honigräume,
  es macht keinen Unterschied.
- **Deine Daten gehören dir.** Die Aufzeichnungen leben auf deinem Gerät; der Server
  ist eine Kopie zum Synchronisieren und Teilen, nicht das einzige Zuhause deiner Daten.

:::tip
Da Aufzeichnungen auf dem Gerät gespeichert werden, lohnt es sich, Openbeehive als
App zu installieren, statt es in einem Browser-Tab zu nutzen. Siehe
[Openbeehive installieren](/using-the-app/install) dafür, wie du es zu deinem
Smartphone, Tablet oder Desktop hinzufügst.
:::

## Das Offline-Banner

Wenn die App den Server nicht erreichen kann, erscheint ein kleines Banner, um dich
wissen zu lassen, dass du offline arbeitest. Das ist rein informativ, du kannst genau
wie zuvor weitermachen. Erfasse weiter Durchsichten, hake Aufgaben ab, erfasse eine
Ernte; nichts ist blockiert.

In dem Moment, in dem dein Gerät wieder online ist, verschwindet das Banner und alle
Änderungen, die du offline vorgenommen hast, werden automatisch hochgesendet. Es gibt
keine "Jetzt synchronisieren"-Schaltfläche, an die du denken musst, und kein Risiko, das
Speichern zu vergessen.

:::note
Ein dauerhaftes Offline-Banner bedeutet meist einfach schwachen Empfang draußen am
Bienenstand. Wenn es selbst bei guter Verbindung zu Hause bestehen bleibt, wirf einen
Blick auf die [Fehlerbehebung](/knowledge-base/troubleshooting).
:::

## Synchronisation über deine Geräte

Du kannst Openbeehive auf mehreren Geräten nutzen, etwa einem Smartphone im Feld und
einem Laptop zu Hause, und sie bleiben automatisch im Gleichschritt.

Jedes Gerät behält seine eigene lokale Kopie und tauscht Änderungen im Hintergrund mit
dem Server aus. Erfasse eine Durchsicht auf deinem Smartphone an den Beuten, und wenn
du dich an deinen Laptop setzt, ist sie bereits da. Bearbeitungen fließen in beide
Richtungen.

Du musst kein "Haupt"-Gerät wählen oder etwas von Hand übertragen. Solange sich jedes
Gerät beim selben Konto anmeldet, sehen sie alle dieselben Aufzeichnungen.

## Was passiert, wenn zwei Geräte dasselbe ändern

Das ist die Frage, die jeder Imker stellt, und die beruhigende Antwort lautet: Du musst
nicht darüber nachdenken. Openbeehive löst überlappende Änderungen **automatisch** auf,
ohne "Welche Version möchtest du behalten?"-Abfragen und ohne verlorene Arbeit.

Ein paar Beispiele, wie es sich verhält:

- **Du bearbeitest die Notizen einer Beute auf deinem Smartphone, dein Mitimker
  bearbeitet dieselben Notizen auf seinem.** Die jüngste Bearbeitung dieses Feldes
  gewinnt; die andere wird sauber überschrieben.
- **Ihr fügt beide Aufgaben hinzu oder markiert beide die Beute, während ihr offline
  seid.** Ergänzungen zu Listen werden bewahrt, sodass niemandes Aufgabe oder Markierung verloren geht.
- **Ihr erfasst jeweils eine separate Durchsicht.** Durchsichten, Ereignisse und
  ähnliche Aufzeichnungen werden immer nur hinzugefügt, nie überschrieben, sodass beide
  nebeneinander bewahrt werden.

Das Ergebnis ist, dass jedes Gerät auf denselben, sinnvollen Zustand konvergiert, sobald
sie alle synchronisiert haben, und du nie eine beschädigte oder halb zusammengeführte
Aufzeichnung erhältst.

:::tip
Die Kurzfassung: **füge frei hinzu, bearbeite zuversichtlich, sorge dich nie um
Datenverlust.** Wenn du neugierig bist, wie das tatsächlich unter der Haube
funktioniert, erklären die Seiten zum [Sync-Protokoll](/developers/sync-protocol) und zur
[Architektur](/developers/architecture) es im Detail.
:::

## Einen Bienenstand teilen

Openbeehive teilt Aufzeichnungen auf **Bienenstand**-Ebene. Wenn du einen Bienenstand
teilst, wird alles darin, seine Beuten, Königinnen, Durchsichten, Aufgaben, Ereignisse,
Ernten und Behandlungen, mit ihm geteilt. Das hält die Dinge einfach: Du gewährst Zugriff
auf einen Standort, nicht auf dutzende einzelne Beuten.

Jeder Person, mit der du teilst, wird eine Rolle zugewiesen:

| Rolle | Was sie tun kann |
| --- | --- |
| **Betrachter** | Den Bienenstand und alle seine Aufzeichnungen ansehen. Kann keine Änderungen vornehmen. |
| **Imker** | Ansehen und bearbeiten: Durchsichten erfassen, Aufgaben erledigen, Ernten und Behandlungen erfassen, Beuten und Königinnen aktualisieren. |
| **Besitzer** | Alles, was ein Imker tun kann, plus den Bienenstand selbst verwalten und mit wem er geteilt wird. |

Das funktioniert gut für einen Lehrbienenstand eines Vereins, einen Mentor, der die Beuten
eines neuen Imkers im Auge behält, oder einfach zwei Personen, die sich die Arbeit am selben
Standort teilen. Geteilte Aufzeichnungen synchronisieren und lösen Konflikte genau auf
dieselbe Weise wie deine eigenen, sodass die Änderungen eines Partners automatisch auf deinen
Geräten erscheinen.

:::note
Das Teilen erfolgt pro Bienenstand, sodass du einen Standort mit einem Mentor teilen
kannst, während du andere vollständig privat hältst.
:::

## Werde ich jemals Daten verlieren?

Nein. Deine Aufzeichnungen werden zuerst auf dein Gerät geschrieben und nicht einfach
entfernt, weil du offline bist oder weil die App geschlossen wird. Sie warten sicher auf
dem Gerät, bis sie synchronisiert werden können, und synchronisieren dann von selbst.

Für zusätzliche Sicherheit, besonders wenn du selbst hostest, ist es dennoch gute Praxis,
Server-Backups vorzuhalten. Siehe [Backups](/self-hosting/backups) dafür, wie.

## Verwandte Seiten

- [Openbeehive installieren](/using-the-app/install)
- [QR-Etiketten](/using-the-app/qr-labels)
- [Architektur](/developers/architecture)
- [Sync-Protokoll](/developers/sync-protocol)
