---
sidebar_position: 6
title: "QR-Codes & Deep Links"
---

# QR-Codes & Deep Links

Jeder Bienenstock in Openbeehive kann ein druckbares QR-Etikett tragen. Scanne es
am Stand, und die App öffnet sich direkt bei diesem Bienenstock, ohne dass du
dich durch Menüs graben musst. Diese Seite erklärt, wie die Kodierung
funktioniert, wie Links offline aufgelöst werden, wie native Deep Links
verdrahtet sind und wie sich der In-App-Scanner verhält.

## Was ein Bienenstock-QR kodiert

Ein Bienenstock-QR kodiert eine einzelne URL der Form:

```text
<base>/h/<hiveId>
```

- `<base>` ist deine `BEEHIVE_PUBLIC_BASE_URL` (zum Beispiel `https://app.openbeehive.org`).
- `<hiveId>` ist die stabile Kennung des Bienenstocks: eine UUID, die auf dem
  Gerät erzeugt wird, wenn der Bienenstock zum ersten Mal angelegt wird.

Die ID ist dieselbe Offline-first-UUID, die überall sonst im Datenmodell
verwendet wird. Sie wird lokal erzeugt, nie neu vergeben und übersteht die
Synchronisierung unangetastet. Diese Stabilität ist es, die ein gedrucktes
Etikett sicher macht: Der QR, den du im Frühjahr auf die Brutzarge klebst, zeigt
Jahre später noch auf denselben Bienenstock.

:::note
Die ID kodiert einen Bienenstock, keine Berechtigung. Eine Bienenstock-ID zu
kennen oder zu erraten, gewährt für sich genommen keinen Zugriff. Siehe
**Zugriff wird durch Teilen gesteuert**.
:::

## Wie `/h/[id]` aufgelöst wird

Die Route `/h/[id]` ist ein schlanker Auflöser, keine eigene Seite. Beim Laden:

1. Schlägt sie `id` in der **lokalen** SQLite-WASM-Datenbank (OPFS) nach.
2. Ist der Bienenstock vorhanden, leitet sie in die App nach `/app/hives/[id]` weiter.
3. Ist der Bienenstock lokal **nicht** vorhanden, stößt sie eine Synchronisierung an und prüft dann erneut.
4. Lässt sich der Bienenstock weiterhin nicht finden oder hast du keinen Zugriff darauf, sagt sie das.

Da Schritt 1 aus der lokalen Datenbank liest, löst ein Scan sofort auf, wenn du
offline bist, solange der Bienenstock bereits auf dem Gerät ist. Die
Synchronisierung in Schritt 3 ist der einzige Teil, der Empfang braucht, und sie
läuft nur, wenn der Bienenstock fehlt (zum Beispiel ein Bienenstand, der gerade
mit dir geteilt wurde).

```text
scan QR  ->  /h/<id>  ->  local lookup
                              |
                  found ------+------ not found
                    |                    |
          /app/hives/<id>           sync, re-check
                                         |
                              found -> /app/hives/<id>
                              still missing -> "not found / not shared"
```

### Zugriff wird durch Teilen gesteuert
Die Auflösung läuft immer durch die normalen Sync- und Teilen-Regeln. Das Teilen
in Openbeehive geschieht auf der Ebene des **Bienenstands** über Scopes; ein
Bienenstock wird für dich nur dann sichtbar, weil sein Bienenstand in einem Scope
liegt, den du synchronisieren kannst. Die Route `/h/[id]` umgeht das nie.

Eine ID allein ist also harmlos: Ist der Bienenstand des Bienenstocks nicht mit
dir geteilt, liefert die Synchronisierung in Schritt 3 nichts, und die Route
meldet den Bienenstock als nicht verfügbar. Behandle gedruckte Etiketten als
praktisch, nicht als geheim.

## Implementierung

Die QR-Funktion ist klein und über ein paar Dateien verteilt:

| Datei | Zweck |
| --- | --- |
| `lib/qr.ts` | Die Bienenstock-URL bauen, QR offline als SVG rendern, gescannte Payloads parsen (`parseHiveId`) |
| `lib/components/QrLabel.svelte` | Druckbares Etikett (QR + Name + Kurzcode) mit SVG-Download |
| `routes/h/[id]/+page.svelte` | Scan-Landung: lokal auflösen, dann in die App weiterleiten |
| `routes/app/hives/[id]/+page.svelte` | Bienenstock-Detail (zeigt das QR-Etikett und die Historie) |
| `routes/app/scan/+page.svelte` | In-App-Scanner mit der Kamera |

Das QR-Rendering geschieht vollständig auf dem Gerät als SVG, sodass Etiketten
ohne Netzwerkverbindung erzeugt und gedruckt werden können.

## Etiketten drucken

Du kannst ein Etikett für jeden einzelnen Bienenstock aus seiner Detailansicht
drucken oder einen **Batch-Bogen** erzeugen, der viele Bienenstöcke auf einmal
abdeckt.

| Ausgabe | Wofür |
| --- | --- |
| Einzeletikett | Ein Bienenstock, bei Bedarf gedruckt (Ersatz, neues Volk) |
| Batch-Bogen | Ein Raster von Etiketten für einen ganzen Bienenstand oder eine Druckauflage |

`QrLabel` öffnet ein sauberes Druckfenster, das nur den QR, den Bienenstocknamen
und einen Kurzcode enthält, und kann den QR auch als SVG herunterladen. Ein
Batch-Bogen ist einfach eine Vielzahl von `QrLabel`-Komponenten, die auf einer
Druckraster-Seite angeordnet sind.

Die kurze Beschriftung ist wichtig: Sie hält ein Etikett nützlich, selbst wenn
ein Telefon leer ist. Drucke auf wetterfestes oder laminiertes Material;
Brutzargen stehen draußen und Tinte verblasst.

:::tip
Klebe das Etikett dorthin, wo du es tatsächlich scannen wirst, an die Seite der
Beute oder den Deckel, statt auf eine Fläche, für die du den Deckel anheben
musst. Eine Schritt-für-Schritt-Anleitung für Imker findest du unter
[QR-Etiketten](/using-the-app/qr-labels).
:::

## Native Deep Links

Der QR zeigt auf eine gewöhnliche `https://`-URL, was bedeutet, dass er in jeder
Kamera oder jedem Browser funktioniert. Auf Mobilgeräten kann Openbeehive diesen
URL-Raum auch registrieren, sodass die installierte App statt eines
Browser-Tabs den Link bedient.

### Android App Links

Android verifiziert den Besitz der Link-Domain über eine Digital-Asset-Links-
Datei, die unter `/.well-known/assetlinks.json` ausgeliefert wird und das Paket
und den Signatur-Fingerabdruck der App deklariert:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.openbeehive.app",
      "sha256_cert_fingerprints": ["<your-app-signing-cert-sha256>"]
    }
  }
]
```

Füge einen Intent-Filter für `https://<host>/h/*` hinzu. Nach der Verifizierung
öffnen Tippen und Scannen direkt in der App ohne einen Auswahldialog.

### iOS Universal Links

iOS verwendet eine Apple-App-Site-Association-Datei, die unter
`/.well-known/apple-app-site-association` ausgeliefert wird (als
`application/json`, ohne Dateierweiterung):

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "<TEAMID>.com.openbeehive.app",
        "paths": ["/h/*"]
      }
    ]
  }
}
```

Füge der App die Associated-Domains-Berechtigung hinzu, um den Pfadraum `/h/*`
zu beanspruchen.

:::caution
Beide Well-known-Dateien müssen über HTTPS mit dem korrekten Content-Type und
ohne Weiterleitungen vom selben Origin wie deine `BEEHIVE_PUBLIC_BASE_URL` ausgeliefert
werden. Wenn du Openbeehive hinter einen Reverse Proxy stellst, stelle sicher,
dass `/.well-known/` unangetastet durchgereicht wird. Siehe
[Reverse Proxy](/self-hosting/reverse-proxy).
:::

### Custom-Scheme-Fallback

Für Kontexte, in denen ein `https://`-Link nicht zur App leitet, wird auch ein
Custom-Scheme von `parseHiveId` geparst:

```text
openbeehive://hive/<hiveId>
```

Bevorzuge die `https://`-Form für gedruckte Etiketten, weil sie elegant auf die
Web-App zurückfällt, wenn die native App fehlt. Das Custom-Scheme bewahrt man am
besten für In-App-Navigation und Integrationen auf.

## In-App-Scanner

Der eingebaute Scanner unter `/app/scan` liest QR-Codes mit der
`BarcodeDetector`-API des Browsers, wo verfügbar (Android und Chrome). Auf
Plattformen, die `BarcodeDetector` noch nicht ausliefern, insbesondere iOS
Safari, fällt die App auf die Geräte-Kamera-App zurück; binde einen
JavaScript-Decoder wie `@zxing/browser` ein, wenn dort ein vollständig
In-App-Scanner erforderlich ist.

Welcher Pfad auch läuft, eine erfolgreiche Dekodierung wird auf dieselbe Weise
behandelt: `parseHiveId` extrahiert die Bienenstock-ID aus der URL oder dem
Custom-Scheme, und die App navigiert durch denselben oben beschriebenen lokalen
Auflösungsfluss. Ein Scan und ein angetippter Link sind gleichwertig.

:::note
Der Scanner benötigt Kameraberechtigung und einen sicheren Kontext (HTTPS oder
`localhost` während der Entwicklung). Wenn die Kamera nicht startet, prüfe
zuerst die Website-Berechtigungen; siehe
[Fehlerbehebung](/knowledge-base/troubleshooting).
:::

## Zusammenfassung

- Ein Bienenstock-QR kodiert `<base>/h/<hiveId>`, wobei die ID eine stabile Offline-UUID ist.
- `/h/[id]` löst zuerst aus der lokalen Datenbank auf und synchronisiert nur bei Bedarf.
- Der Zugriff folgt stets dem Teilen auf Bienenstand-Ebene; eine ID gewährt für sich genommen nichts.
- App Links und Universal Links leiten `/h/*` in die native App; ein
  `openbeehive://hive/<id>`-Scheme wird ebenfalls geparst.
- Der Scanner verwendet `BarcodeDetector` mit einem iOS-Kamera-App-Fallback.

Das weitere Bild findest du im Abschnitt [Entwickler](/category/developers) und im
[Datenmodell](/developers/data-model).
