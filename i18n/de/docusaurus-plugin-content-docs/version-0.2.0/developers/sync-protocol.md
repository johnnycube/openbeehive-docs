---
sidebar_position: 4
title: "Sync-Protokoll"
---

# Sync-Protokoll

Openbeehive ist [offline-first](/using-the-app/offline-and-sync). Jedes Lesen und Schreiben geschieht
gegen eine lokale SQLite-WASM-Datenbank auf dem Gerät, und ein Hintergrundprozess
gleicht diesen lokalen Zustand mit dem Server ab. Diese Seite dokumentiert das
Wire-Protokoll, das den Abgleich funktionieren lässt: den Connect-RPC-Dienst,
seine drei Methoden und die Regeln, die beide Seiten beim Zusammenführen von
Änderungen anwenden.

Wenn du den [Überblick über das Sync-Modell](/category/developers) noch nicht gelesen hast, beginne dort.
Diese Seite setzt voraus, dass du bereits weißt, dass Openbeehive Hybrid Logical
Clocks (HLC), feldweises Last-Writer-Wins (LWW) für Skalare, OR-Sets (Add-wins)
für Listenfelder und append-only-Ereignisse verwendet, die nie in Konflikt
geraten.

## Der Dienst

Die Synchronisierung wird als Connect-RPC-Dienst bereitgestellt, sodass jede
Methode sowohl als gRPC als auch als einfaches HTTP/JSON erreichbar ist. Es gibt
drei Methoden:

| Methode | Richtung | Zweck |
| --- | --- | --- |
| `Pull` | Client ← Server | Änderungen abrufen, die der Client noch nicht gesehen hat |
| `Push` | Client → Server | Lokale Änderungen an den Server senden |
| `Subscribe` | Server → Client (Stream) | Optionaler Nahezu-Echtzeit-"Anstupser", wenn neue Änderungen eintreffen |

Ein typischer Client schleift: `Push` seines lokalen Postausgangs, dann `Pull`
von allem Neuen, dann Ruhe, bis `Subscribe` ihn anstupst (oder ein Timer
auslöst), und wiederholt das.

## Cursor versus die HLC

Die wichtigste Idee in diesem Protokoll ist, dass der **Sync-Cursor nicht die
HLC ist**.

Die HLC ist ein *logischer Zeitstempel*, der an jeden Feldschreibvorgang
angehängt wird. Sie entscheidet, *welcher Wert gewinnt* bei einer Zusammenführung
— sie beantwortet "Ist diese Bearbeitung neuer als die, die ich bereits habe?".
HLCs stammen von vielen Geräten, können relativ zur Echtzeit leicht aus der
Reihenfolge geraten und sind in der Reihenfolge des Eintreffens nicht global
monoton.

Der Cursor ist eine *vom Server zugewiesene Empfangssequenz* — eine einzelne,
streng aufsteigende Ganzzahl (`seq`), die der Server jeder Änderung aufprägt,
sobald sie dauerhaft angenommen wird. Er beantwortet eine völlig andere Frage:
"Was habe ich diesem Client bereits übergeben?".

Die Empfangssequenz als Cursor zu verwenden, gibt uns zwei Garantien, die die HLC
nicht bieten kann:

- **Vollständige Reihenfolge der Auslieferung.** Da `seq` in der Reihenfolge
  zugewiesen wird, in der der Server Schreibvorgänge annimmt, kann ein Client
  "alles nach seq N" anfordern und sicher sein, dass ihm nichts entgeht, selbst
  wenn diese Änderungen aus der Reihenfolge geratene HLCs tragen.
- **Wiederholungssicherheit.** Ein Client kann seinen Cursor persistieren und
  genau dort fortsetzen, wo er aufgehört hat, nachdem er offline gegangen ist,
  abgestürzt ist oder neu installiert wurde.

:::note
Verwende eine HLC niemals als Paginierungs-Cursor. Zwei Geräte können offline
legitim dieselbe HLC-Region erzeugen, und HLCs werden nicht in der Reihenfolge
des Eintreffens zugewiesen — eine Paginierung nach HLC würde Änderungen
überspringen oder duplizieren. Paginiere nach `seq`, führe zusammen nach HLC.
:::

## Pull

`Pull` gibt die Änderungen zurück, die der Client noch nicht gesehen hat, in
`seq`-Reihenfolge, plus den Cursor für das nächste Mal.

```text
Pull(PullRequest { since_cursor: int64, limit: int32 })
  -> PullResponse { changes: Change[], next_cursor: int64, has_more: bool }
```

- `since_cursor` ist der letzte Cursor, den der Client erfolgreich angewendet
  hat. Sende `0` für eine erste, vollständige Synchronisierung.
- `changes` werden in aufsteigender `seq`-Reihenfolge zurückgegeben, beschränkt
  auf die Scopes, die der Aufrufer lesen darf (siehe
  **Partielle Replikation**).
- `next_cursor` ist die höchste `seq`, die in dieser Seite enthalten ist.
  Persistiere ihn erst, nachdem die gesamte Seite lokal angewendet wurde.
- `has_more` ist `true`, wenn das Ergebnis durch `limit` abgeschnitten wurde; der
  Client sollte sofort erneut `Pull` mit dem neuen `next_cursor` aufrufen.

Ein einzelner `Change` trägt genug, um ihn eigenständig zusammenzuführen:

```json
{
  "entity": "hive",
  "entity_id": "01HZX...",
  "scope_id": "apiary-01HZ...",
  "kind": "field",
  "field": "name",
  "value": "Hive 3 (north row)",
  "hlc": "2026-06-19T09:14:02.117Z-0003-nodeA",
  "seq": 48213
}
```

`kind` unterscheidet die drei Zusammenführungsstrategien: `field` (skalares LWW),
`set_add` / `set_remove` (OR-Set-Zugehörigkeit) und `event` (append-only).

## Push

`Push` sendet einen Stapel lokaler Änderungen an den Server. Der Server wendet
jede mit denselben Zusammenführungsregeln an, die der Client verwendet, weist
jeder angenommenen Änderung eine frische `seq` zu und meldet zurück.

```text
Push(PushRequest { changes: Change[] })
  -> PushResponse { server_cursor: int64, conflicts: Conflict[] }
```

- Der Server validiert, dass der Aufrufer die `scope_id` jeder Änderung schreiben
  darf.
- Für jede skalare `field`-Änderung wendet er feldweises LWW an: Der eingehende
  Wert gewinnt nur, wenn seine HLC größer ist als die HLC, die derzeit für dieses
  Feld gespeichert ist.
- Mengenoperationen werden als OR-Set-Add/Remove angewandt; Adds gewinnen über
  gleichzeitige Removes.
- `event`-Änderungen werden bedingungslos angehängt — sie geraten nie in
  Konflikt.
- Jeder angenommenen Änderung wird eine neue, streng aufsteigende `seq`
  zugewiesen.
- `server_cursor` ist die höchste in diesem Stapel zugewiesene `seq`, sodass der
  Client für seine eigenen Schreibvorgänge ohne eine zusätzliche `Pull`-Runde
  vorspulen kann.

### Konflikte

`conflicts` ist **keine** Fehlerliste — die Zusammenführung ist immer
deterministisch und gelingt immer. Es ist eine informative Liste von Feldern, in
denen der Server bereits einen Wert mit einer höheren HLC hielt, sodass der vom
Client geschobene Wert *nicht* übernommen wurde.

```json
{
  "entity_id": "01HZX...",
  "field": "queen_status",
  "rejected_hlc": "2026-06-19T09:13:55.000Z-0001-nodeB",
  "winning_hlc": "2026-06-19T09:14:10.421Z-0007-nodeA"
}
```

Der Client sollte einen Konflikt als Signal behandeln, dieses Feld beim nächsten
`Pull` zu aktualisieren, wo er den siegreichen Wert erhält. Kein erneuter Versuch
ist nötig.

:::tip
Da LWW deterministisch und HLC-geordnet ist, ist `Push` idempotent: Das erneute
Senden einer Änderung, deren HLC bereits verloren (oder bereits gewonnen) hat,
lässt den Serverzustand unverändert. Clients können einen `Push` nach einer
abgebrochenen Verbindung gefahrlos erneut versuchen.
:::

## Subscribe

`Subscribe` ist ein optionaler, vom Server gestreamter Kanal, der rein als
Aufwecksignal verwendet wird. Er trägt keine Daten.

```text
Subscribe(SubscribeRequest { scopes: string[] })
  -> stream Poke { scope_id: string, server_cursor: int64 }
```

Wenn ein Schreibvorgang in einem der lesbaren Scopes des Clients eintrifft, gibt
der Server einen `Poke` aus. Der Client reagiert, indem er wie üblich
`Pull(since_cursor)` aufruft. Die eigentlichen Daten auf `Pull` zu halten,
bedeutet, dass der Stream verlustbehaftet sein kann, ohne die Korrektheit zu
beeinträchtigen — ein verpasster Anstupser bedeutet nur, dass das nächste
timergesteuerte `Pull` aufholt.

:::note
`Subscribe` ist eine Latenzoptimierung, keine Voraussetzung. Ein Client, der nur
`Pull` per Timer abfragt, ist vollständig korrekt; er ist lediglich weniger
zeitnah.
:::

## Partielle Replikation nach Scope
Das Teilen in Openbeehive geschieht auf der Ebene des **Bienenstands** über
*Scopes*. Ein Nutzer repliziert nur die Daten innerhalb der Scopes, die er lesen
darf, nicht die gesamte Datenbank.

Dies wird bei `Pull` und `Push` erzwungen:

- `Pull` filtert `changes` auf die lesbaren Scopes des Aufrufers, bevor nach
  `seq` paginiert wird. Der Cursor schreitet daher über eine *aufruferbezogene
  Sicht* der globalen Sequenz voran — zwei Nutzer, die sich einen Bienenstand
  teilen, sehen die Änderungen dieses Bienenstands bei derselben `seq`, während
  jeder zusätzlich seine eigenen privaten Scopes sieht.
- `Push` weist Schreibvorgänge in Scopes ab, die der Aufrufer nicht schreiben
  kann.

Da der Cursor die globale Empfangssequenz ist, kann ein Client Lücken in den
empfangenen `seq`-Werten sehen (Änderungen in Scopes, die er nicht lesen kann,
werden übersprungen). Lücken sind erwartet und harmlos — der Client braucht
immer nur den *nächsten* Cursor, um mehr anzufordern.

## Gespiegelte Zusammenführungslogik

Die Zusammenführungsfunktionen — HLC-Vergleich, feldweises LWW, OR-Set-Auflösung,
Ereignis-Anhängen — sind **auf Client und Server identisch**. Dieselbe Logik, die
die SvelteKit-PWA beim Anwenden eines `Pull` ausführt, ist die Logik, die das
Go-Backend beim Anwenden eines `Push` ausführt.

Diese Spiegelung ist es, die das System wirklich konfliktfrei macht statt bloß
konfliktauflösend:

- Eine Änderung erzeugt dasselbe zusammengeführte Ergebnis, unabhängig davon,
  *wo* sie angewendet wird oder in *welcher Reihenfolge* sie eintrifft, sodass
  Client und Server ohne Verhandlung konvergieren.
- Der Server ist kein privilegierter Schiedsrichter, der den Gerätezustand
  überschreiben kann; er wendet dieselben deterministischen Regeln an und weist
  dann eine `seq` für die Reihenfolge zu.
- Neue Entitätstypen müssen ihre Zusammenführungsregeln nur einmal definieren, in
  gemeinsamer Semantik, und beide Seiten halten sie ein.

Die zugrunde liegenden Details zu Uhr und Datenstruktur findest du im
[Architekturüberblick](/developers/architecture) und im
[Datenmodell](/developers/data-model). Wie Ereignisse in den append-only-Pfad
passen, siehe [Historie und Ereignisse](/developers/history-and-events).
