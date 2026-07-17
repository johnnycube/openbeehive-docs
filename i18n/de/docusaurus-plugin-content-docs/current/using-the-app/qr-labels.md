---
sidebar_position: 9
title: "QR-Etiketten"
---

# QR-Etiketten

Ein QR-Etikett macht jede Beute zu einer Ein-Tipp-Abkürzung. Klebe ein Etikett auf
den Deckel oder den Brutraum, richte dein Smartphone darauf, und Openbeehive
öffnet direkt die Aufzeichnung dieser Beute. Kein Scrollen durch Listen am
Bienenstand, kein Blinzeln auf handgeschriebene Nummern im Regen.

Das ist besonders praktisch, wenn du mehrere Beuten hast, die identisch aussehen,
oder wenn ein Helfer, der deine Nummerierung nicht kennt, das richtige Volk finden
muss.

## Was der QR-Code enthält

Der QR-Code jeder Beute kodiert einen einzelnen **Deep Link** zu dieser Beute:

```text
<base>/h/<hiveId>
```

Die `<base>` ist deine App-Adresse (für den gehosteten Dienst ist das
`https://app.openbeehive.org`; für eine selbst gehostete Instanz deine eigene URL). Die
`<hiveId>` ist die eindeutige Kennung der Beute.

Der Code enthält keine Bienendaten, keine Honiggewichte und keine persönlichen
Informationen. Er ist nur ein Link. Wenn jemand ihn scannt, ohne Zugriff auf deine
Aufzeichnungen zu haben, wird er zur Anmeldung aufgefordert und sieht die Beute nur,
wenn sie mit ihm geteilt wurde.

:::note
Der Link öffnet die **App**, die dann die Beute aus deiner lokalen Datenbank lädt.
Da Openbeehive offline-first arbeitet, öffnet sich die Beute auch dann noch, wenn du
keinen Empfang hast, sobald die App auf deinem Smartphone installiert ist.
:::

## Ein Etikett für eine Beute drucken

1. Öffne die Beute aus deiner **Bienenstand**-Liste oder direkt aus der Beute.
2. Wähle **QR-Etikett** (sieh im Aktionsmenü der Beute nach).
3. Eine Vorschau erscheint, die den Code samt Beutennamen und Bienenstand zeigt,
   sodass du Etiketten auseinanderhalten kannst, bevor sie auf die Zargen kommen.
4. Wähle **Drucken**. Der Druckdialog deines Browsers öffnet sich.
5. Drucke auf einen Etikettenbogen oder normales Papier und befestige es dann an der Beute.

:::tip Mach es draußen haltbar
Beuten stehen in Sonne, Regen und Frost. Für Etiketten, die eine Saison überstehen:

- Drucke auf wetterfestes oder Vinyl-Etikettenmaterial **oder**
- Drucke auf Papier und decke es mit klarem Packband oder einer Laminierhülle ab.

Platziere das Etikett irgendwo, wo es nicht von auf- und abgehobenen Honigräumen
abgeschabt wird — die Seite des Brutraums oder unter der Deckelkante eignen sich beide gut.
:::

## Einen Sammelbogen für einen Bienenstand drucken

Wenn du einen ganzen Bienenstand auf einmal einrichtest, drucke die Etiketten aller
Beuten zusammen statt einzeln.

1. Öffne den **Bienenstand** aus deiner Bienenstand-Liste.
2. Wähle **QR-Bogen** (oder **Etiketten drucken**) für den Bienenstand.
3. Openbeehive legt einen Bogen mit einem beschrifteten Code pro Beute in diesem Bienenstand an.
4. Drucke, dann schneide und bringe an.

Das hält auch eine ordentliche Aufzeichnung vor: Ein einziger Bogen zeigt jedes Volk im
Bienenstand mit seinem Namen und Code nebeneinander.

## Ein Etikett scannen

Du kannst ein Etikett auf zwei Arten scannen.

### Mit der Kamera deines Smartphones

Die meisten modernen Smartphones erkennen QR-Codes in der eingebauten Kamera-App.
Richte die Kamera auf das Etikett, warte, bis der Link erscheint, und tippe ihn an.
Dein Smartphone öffnet den Link und Openbeehive springt zur Beute.

Das funktioniert für jeden — ein Besucher oder ein Mitimker kann eine geteilte Beute
scannen, ohne die App vorher zu öffnen.

### Mit dem In-App-Scanner

Openbeehive hat auch einen eigenen Scanner, nützlich, wenn du bereits in der App
arbeitest und schnell zwischen Beuten wechseln möchtest.

1. Öffne den Scanner (sieh nach dem QR- oder Kamerasymbol in der App).
2. Erteile beim ersten Mal die Kameraberechtigung.
3. Richte ihn auf ein Etikett — die Beute öffnet sich sofort.

:::tip
Der In-App-Scanner hält dich innerhalb von Openbeehive, sodass du von einer
Beutenaufzeichnung zur nächsten gehst, ohne durch den Browser zu springen.
:::

## Wenn ein Scan nicht die richtige Beute öffnet

Ein paar häufige Ursachen und Lösungen:

| Symptom | Wahrscheinliche Ursache | Was zu tun ist |
| --- | --- | --- |
| Kamera fokussiert nicht auf den Code | Nasses, verblasstes oder gewelltes Etikett | Trockenwischen; bei Abnutzung neu drucken |
| Link öffnet, sagt aber "nicht gefunden" | Beute wurde gelöscht oder ist auf einem anderen Konto | Prüfe, ob die Beute noch existiert und du im richtigen Konto angemeldet bist |
| Fordert zur Anmeldung auf | Beute gehört zum Bienenstand einer anderen Person | Bitte sie, den Bienenstand mit dir zu teilen |
| Beim Antippen passiert nichts | App auf diesem Smartphone nicht installiert | Installiere Openbeehive, dann scanne erneut |

Das Teilen geschieht auf Bienenstand-Ebene, sodass du, um jemandem das Scannen einer Beute zu
ermöglichen, ihren **Bienenstand** mit ihm teilen musst. Siehe [Offline und Synchronisation](/using-the-app/offline-and-sync)
dafür, wie Teilen und Scopes funktionieren.

## Neudruck und Etiketten ändern

Etiketten verfallen nie. Der Link bleibt für die Lebensdauer der Beute gültig, sodass ein heute
gedruckter Code auch nächste Saison noch funktioniert.

Wenn du Gerät umstellst, denke daran, dass das Etikett der **Beutenaufzeichnung** folgt, nicht
der physischen Zarge. Wenn du eine Zarge stilllegst, das Volk aber als dieselbe Beute in
Openbeehive behältst, funktioniert das alte Etikett weiter. Wenn du eine frische
Beutenaufzeichnung beginnst, erzeuge und drucke ein neues Etikett dafür.

:::caution
Versetze ein gedrucktes Etikett nicht von der Zarge einer Beute auf eine andere und erwarte,
dass es auf das neue Volk zeigt — es öffnet weiterhin die ursprüngliche Beute. Drucke
stattdessen ein frisches Etikett.
:::

## Tiefer einsteigen

Möchtest du das technische Detail — wie der Deep Link geparst wird, wie die native Installation
die URL abfängt und wie man Codes programmatisch erzeugt? Siehe
[QR-Codes für Entwickler](/developers/qr-codes).
