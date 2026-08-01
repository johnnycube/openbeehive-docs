---
sidebar_position: 2
title: "Historie & Ereignisse"
---

# Historie & Ereignisse

Openbeehive behandelt deine Imkereiaufzeichnungen als eine Geschichte, die sich
im Laufe der Zeit entfaltet. Ein Bienenstock wird zwischen Bienenständen umgesetzt,
eine Königin regiert und wird später ersetzt, eine Ernte wird an einem bestimmten
Tag erfasst. Damit diese Historie korrekt und nützlich bleibt, hält das
Datenmodell zwei Dinge auseinander: was geschehen ist, und die Situation, die
zum Zeitpunkt des Geschehens galt.

Diese Seite erklärt, wie Ereignisse ihren Kontext einfrieren, wie Intervall-
Historien Regentschaften und Standorte festhalten, wie typisierte Detaildatensätze
an Ereignissen hängen und wie der Client all dies offline schreibt und abfragt.

## Ereignisse frieren ihren Kontext ein

Ein Ereignis ist eine append-only-Tatsache: Es hält fest, dass zu einem Zeitpunkt
etwas geschehen ist. Entscheidend ist, dass jedes Ereignis eine Momentaufnahme des
relevanten Kontexts speichert, so wie er zum Ereigniszeitpunkt war, und nicht nur
einen Verweis auf den aktuellen Zustand.

Wenn ein Ereignis geschrieben wird, ermittelt und speichert der Client:

- den Bienenstand, zu dem der Bienenstock gehörte,
- den Bienenstock selbst,
- die Königin, die an diesem Tag in diesem Bienenstock regierte.

Diese Momentaufnahme wird auf die Ereigniszeile denormalisiert. Der Vorteil ist,
dass die Historie wahrheitsgetreu bleibt, selbst nachdem sich die Welt verändert
hat. Wenn du einen Bienenstock nächsten Monat zu einem neuen Bienenstand umsetzt,
gilt die Durchsicht von letzter Woche weiterhin als an dem Bienenstand erfolgt, an
dem sie tatsächlich stattfand. Wenn du umweiselst, schreibt eine alte Ernte den
Honig weiterhin der Königin zu, die damals das Sagen hatte.

:::note
Da Ereignisse append-only sind und ihren eigenen Kontext mitführen, geraten sie
beim Synchronisieren niemals in Konflikt. Zwei Geräte können jeweils offline
Ereignisse hinzufügen, und beide Mengen werden behalten. Die konfliktfreien
Regeln findest du im [Sync-Protokoll](/developers/sync-protocol).
:::

## Die Ereignistabelle ist auch eine Faktentabelle

Dieselben Ereigniszeilen dienen zugleich als Faktentabelle für Statistiken.
Numerische Messgrößen liegen direkt am Ereignis, allen voran `amount_kg` für
Ernten, neben den eingefrorenen Dimensionen (Bienenstand, Bienenstock, Königin,
Datum, `scope_id`, Ereignistyp).

Das bedeutet, dass übliche Berichte eine einzige gruppierte Abfrage über eine
Tabelle sind, ohne dass Joins nötig wären, um eine Zahl dem Bienenstand,
Bienenstock oder der Königin zuzuordnen, die sie erzeugt hat. Der eingefrorene
Kontext ist es, der "Honig pro Bienenstand 2025" oder "Ertrag nach Königin"
von Grund auf korrekt macht.

## Intervall-Historien

Manche Tatsachen lassen sich am besten als Intervalle statt als Zeitpunkte
ausdrücken. Openbeehive verwendet halboffene Intervalle, geschrieben
`[start, end)`: Der Anfang ist eingeschlossen, das Ende ausgeschlossen. Dadurch
fügen sich Intervalle sauber aneinander, ohne Überlappung oder Lücken, wenn ein
Zeitraum genau dann endet, wenn der nächste beginnt.

| Historie | Intervall | Bedeutung |
| --- | --- | --- |
| Königin-Regentschaft | `[installed, replaced)` | Die Königin führt das Volk von ihrem Einweiselungsdatum bis ausschließlich zum Datum, an dem sie ersetzt wird. |
| Bienenstock-Standort | `[from, to)` | Der Bienenstock steht in einem bestimmten Bienenstand von `from` bis ausschließlich `to`. |

Eine aktuelle Regentschaft oder ein aktueller Standort hat ein offenes Ende
(noch kein `replaced` / `to`). Wenn eine Königin ersetzt wird, wird das Intervall
der scheidenden Königin am Einweiselungsdatum der neuen Königin geschlossen, und
die neue Regentschaft öffnet dort. Bienenstock-Umsetzungen funktionieren genauso.

:::tip
Halboffene Intervalle machen "Wer regierte am Datum D?" zu einem einfachen Test:
Finde die Zeile, in der `installed <= D` und (`replaced` null ist oder
`replaced > D`). Genau eine Zeile passt, selbst an einem Wechseltag.
:::

## Typisierte Detaildatensätze

Ereignisse gibt es in mehreren Typen, und die typspezifischen Details liegen in
eigenen Datensätzen, die mit dem Ereignis verknüpft sind:

- **Inspection**-Detail: Beobachtungen aus einem Besuch (Brut, Vorräte,
  Sanftmut, Königin gesehen und so weiter).
- **Harvest**-Detail: was entnommen wurde, einschließlich der Messgröße
  `amount_kg`, die für Statistiken verwendet wird.
- **Treatment**-Detail: das angewandte Mittel, Dosis und Zeitpunkt für eine
  Varroa- oder Krankheitsbehandlung.

Die gemeinsamen Ereignisfelder (Datum, eingefrorener Kontext, `scope_id`) an
einem Ort zu halten und die typspezifischen Felder in typisierten Datensätzen,
hält die Faktentabelle sauber und erlaubt dennoch reichhaltige, typbewusste
Formulare und Bildschirme. Die Gestalt dieser Datensätze ist im
[Datenmodell](/developers/data-model) beschrieben.

## resolveContext für rückdatierte Einträge

Imkerinnen und Imker erfassen Dinge nicht immer in dem Moment, in dem sie
geschehen. Du könntest die Durchsicht von letztem Samstag am Montagabend
eintragen. Daher muss der Kontext für das eigene Datum des Ereignisses ermittelt
werden, nicht für "jetzt".

Der Client verwendet einen Helfer, konzeptionell:

```text
resolveContext(hiveId, date) -> { apiaryId, hiveId, queenId, scopeId }
```

Er schlägt den Bienenstock nach, konsultiert dann die Intervall-Historien, um den
Bienenstand-Standort und die Königin-Regentschaft zu finden, die `date`
abdecken, und liest die `scope_id` des Bienenstocks. Das Ergebnis wird auf das
Ereignis eingefroren.

```sql
-- Find the queen reigning in a hive on a given date.
SELECT id
FROM queens
WHERE hive_id = :hiveId
  AND installed <= :date
  AND (replaced IS NULL OR replaced > :date)
LIMIT 1;
```

```sql
-- Find the apiary the hive was placed in on a given date.
SELECT apiary_id
FROM hive_placements
WHERE hive_id = :hiveId
  AND from_date <= :date
  AND (to_date IS NULL OR to_date > :date)
LIMIT 1;
```

:::caution
Ermittle den Kontext immer gegen das Ereignisdatum. Den aktuellen Bienenstand
oder die aktuelle Königin des Bienenstocks zu verwenden, würde rückdatierte
Einträge stillschweigend falsch zuordnen und deine Statistiken verfälschen.
:::

## Welche Client-Funktionen Historie schreiben

Drei Arten von Schreibvorgängen berühren die Historie, und es hilft, sie
auseinanderzuhalten:

1. **Ein Ereignis hinzufügen.** Durchsichts-, Ernte-, Behandlungs- und andere
   Ereignisschreiber rufen zuerst `resolveContext(hiveId, date)` auf und hängen
   dann das Ereignis mit seinem eingefrorenen Kontext (und `amount_kg`, wo
   zutreffend) zuzüglich des typisierten Detaildatensatzes an.
2. **Eine Königin ersetzen.** Schließt die aktuelle Regentschaft am neuen
   Einweiselungsdatum und öffnet ein neues `[installed, replaced)`-Intervall.
   Bestehende Ereignisse behalten ihre ursprünglich eingefrorene Königin.
3. **Einen Bienenstock umsetzen.** Schließt den aktuellen Standort am
   Umsetzungsdatum und öffnet ein neues `[from, to)`-Intervall im
   Zielbienenstand. Bestehende Ereignisse behalten ihren ursprünglich
   eingefrorenen Bienenstand.

Regentschaften und Standorte sind Intervallzeilen, deren Skalarfelder (das
Schließdatum) dem feldweisen Last-Writer-Wins folgen; Ereignisse sind append-only
und nach dem Schreiben unveränderlich. Neue Korrekturen werden durch das
Hinzufügen weiterer Ereignisse vorgenommen, nicht durch das Bearbeiten alter.

## Statistik-Abfragen

Da Messgrößen und Dimensionen am Ereignis eingefroren sind, gruppieren Berichte
direkt:

```sql
-- Total honey per apiary for a season.
SELECT apiary_id, SUM(amount_kg) AS total_kg
FROM events
WHERE type = 'harvest'
  AND date >= '2025-01-01' AND date < '2026-01-01'
GROUP BY apiary_id;
```

```sql
-- Yield attributed to each queen.
SELECT queen_id, SUM(amount_kg) AS total_kg
FROM events
WHERE type = 'harvest'
GROUP BY queen_id;
```

Es sind keine Joins auf den aktuellen Zustand nötig: Die eingefrorenen
`apiary_id` und `queen_id` sind bereits die richtigen für den Moment der Ernte.

## Offline und Teilen über scope_id

Jede Ereignis- und Historienzeile trägt die `scope_id` ihres Bienenstands.
Scopes sind die Einheit des Teilens in Openbeehive: Jemandem Zugriff auf einen
Bienenstand zu gewähren, teilt alle Ereignisse und Historien unter diesem Scope.

Da Schreibvorgänge lokal und sofort erfolgen, wird Historie zuerst in die
SQLite-Datenbank auf dem Gerät geschrieben und im Hintergrund synchronisiert. Der
eingefrorene Kontext sorgt dafür, dass ein offline vorgenommener, rückdatierter
Eintrag den richtigen Bienenstand, Bienenstock und die richtige Königin trägt,
selbst wenn das Gerät jüngste Änderungen von anderswo noch nicht gesehen hat;
append-only-Ereignisse führen sich ohne Konflikt zusammen, wenn sich das Gerät
wieder verbindet.

Das nutzerseitige Verhalten findest du unter
[Offline & Sync](/using-the-app/offline-and-sync) und die weitergehende
Architektur unter [Entwickler](/category/developers).
