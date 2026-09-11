---
sidebar_position: 3
title: "Datenmodell"
---

# Datenmodell

Diese Seite beschreibt die zentralen Entitäten, die Openbeehive speichert, wie
sie zueinander in Beziehung stehen und wie **Scopes** entscheiden, was für wen
synchronisiert wird. Sie ist aus der Offline-First-Perspektive geschrieben:
dieselbe Struktur lebt in der SQLite-WASM-Datenbank des Geräts und in der
austauschbaren Datenbank des Servers, und das [Sync-Protokoll](/developers/sync-protocol)
hält sie im Gleichschritt.

Wenn Sie sich für die Mechanik der Änderungsverfolgung interessieren
(HLC-Zeitstempel, Last-Writer-Wins, OR-Sets, Append-only-Events), lesen Sie
zuerst [Historie und Events](/developers/history-and-events) — diese Seite
konzentriert sich auf die Entitäten selbst.

## Die Hierarchie

An der Spitze steht der **Bienenstand** (Apiary) (ein Standort oder Platz). Jeder
Bienenstand enthält **Beuten** (Hives); jede Beute hat eine aktuelle **Königin**
(Queen) und sammelt im Laufe der Zeit eine Folge von Datensätzen an.

```text
Apiary
 ├── Hive ──────── Queen (current; queens form a succession over time)
 │     ├── Inspection   (a visit: what you saw)
 │     ├── Task         (something to do, with a due date)
 │     ├── Event        (append-only fact: requeened, split, died, moved…)
 │     ├── Harvest      (honey/wax taken off)
 │     └── Treatment    (varroa or disease treatment applied)
 │
 └── Placement (hive ↔ apiary, time-bounded — where a hive lived, and when)

ApiaryShare (apiary ↔ user — grants another beekeeper access via a scope)
```

Eine Beute gehört zu einem Zeitpunkt zu genau einem Bienenstand, aber
**Placement** erfasst die vollständige Historie, wo eine Beute gestanden hat, so
dass eine Beute zwischen Ständen wandern kann, ohne ihre Datensätze zu verlieren.

## Entitäten und Schlüsselfelder

Jede Entität teilt sich eine gemeinsame Hülle, die für die Synchronisation
verwendet wird: eine stabile `id` (eine offline erzeugte UUID), eine `scope_id`
(siehe **Scopes**), HLC-Verwaltungsspalten und ein Soft-Delete-Flag. Die unten
aufgeführten Felder sind die fachlich bedeutsamen.

### Apiary

Der Container und die Einheit der Freigabe.

| Feld | Hinweise |
|---|---|
| `id` | UUID |
| `name` | z. B. "Hausstand" |
| `location` | Freitext oder Breiten-/Längengrad |
| `notes` | Freitext |
| `scope_id` | entspricht der eigenen `id` des Bienenstands (siehe unten) |

### Hive

Die Behausung eines Volkes innerhalb eines Bienenstands.

| Feld | Hinweise |
|---|---|
| `id` | UUID; auch im [Beuten-QR-Etikett](/using-the-app/qr-labels) kodiert |
| `apiary_id` | aktueller Bienenstand (das aktive Placement) |
| `name` / `short_code` | menschenlesbares Label und der auf dem QR aufgedruckte Kurzcode |
| `type` | eines von Zander, Dadant, Deutsch Normal, Langstroth, Warré, Top-bar, Other — siehe [Beutentypen](/knowledge-base/hive-types) |
| `status` | z. B. aktiv, eingegangen, verkauft |
| `notes` | Freitext |
| `scope_id` | die Bienenstand-id |

### Queen

Die regierende Königin einer Beute. Königinnen bilden eine **Abfolge**: wird ein
Volk umgeweiselt, wird die vorherige Königin abgeschlossen und ein neuer
Datensatz eröffnet, so dass Sie die vollständige Abstammung behalten.

| Feld | Hinweise |
|---|---|
| `id` | UUID |
| `hive_id` | die Beute, die sie anführt |
| `year` | Einweiselungs-/Geburtsjahr |
| `marking_colour` | folgt dem [internationalen Farbschema](/knowledge-base/queen-marking-colours) (1/6 weiß, 2/7 gelb, 3/8 rot, 4/9 grün, 5/0 blau) |
| `origin` | gezüchtet, gekauft, Schwarm, Nachschaffung… |
| `clipped` | Flügel beschnitten (boolesch) |
| `scope_id` | die Bienenstand-id ihrer Beute |

### Inspection

Ein datierter Besuch: die Momentaufnahme dessen, was Sie beobachtet haben.

| Feld | Hinweise |
|---|---|
| `id`, `hive_id`, `date` | wer und wann |
| `brood`, `stores`, `temperament` | typische Beobachtungen |
| `queen_seen`, `eggs_seen`, `queen_cells` | Schnellprüfungen |
| `varroa_count` | Milbenfall / Auswaschzahl, falls erhoben |
| `temp_hive`, `temp_outside` | Temperatur (°C) im Inneren der Beute und außen |
| `humidity_hive`, `humidity_outside` | relative Luftfeuchtigkeit (%) im Inneren der Beute und außen |
| `notes` | Freitext |
| `scope_id` | die Bienenstand-id |

Die Klimafelder sind einfache optionale Skalare, sie synchronisieren also pro
Feld wie jede andere Spalte und können von Hand oder durch einen automatisierten
Sensor befüllt werden — siehe
[Automatisierte Tracker](/using-the-api/automated-trackers).

### Task

Etwas, das für eine Beute oder einen Bienenstand zu erledigen ist, mit einem
Fälligkeitsdatum und einem Erledigt-Status.

| Feld | Hinweise |
|---|---|
| `id` | UUID |
| `hive_id` / `apiary_id` | der Gegenstand (eine Aufgabe kann auf beiden Ebenen ansetzen) |
| `title`, `due_date`, `done` | die Grundlagen |
| `scope_id` | die Bienenstand-id |

### Event

Eine **Append-only**-Tatsache über eine Beute — umgeweiselt, geteilt,
geschwärmt, eingegangen, gewandert, gefüttert. Events werden nie bearbeitet oder
zusammengeführt; sie sammeln sich nur an, weshalb sie bei der Synchronisation nie
in Konflikt geraten. Sie sind das Rückgrat der Beuten-Zeitleiste.

| Feld | Hinweise |
|---|---|
| `id`, `hive_id`, `occurred_at` | wann es geschah |
| `kind` | der Event-Typ |
| `payload` | typspezifisches Detail (JSON) |
| `scope_id` | die Bienenstand-id |

Siehe [Historie und Events](/developers/history-and-events) für den vollständigen
Event-Katalog und wie die Zeitleiste zusammengesetzt wird.

### Harvest

Honig (oder Wachs), der einer Beute entnommen wurde.

| Feld | Hinweise |
|---|---|
| `id`, `hive_id`, `date` | die Entnahme |
| `product` | Honig, Wachs, Propolis… |
| `quantity`, `unit` | z. B. 12,5 kg |
| `notes` | z. B. Tracht, Feuchtigkeit |
| `scope_id` | die Bienenstand-id |

### Treatment

Eine Varroa- oder Krankheitsbehandlung, die an einer Beute durchgeführt wurde.

| Feld | Hinweise |
|---|---|
| `id`, `hive_id`, `date` | Gegenstand und Anwendungsdatum |
| `product`, `active_ingredient` | z. B. Oxuvar / Oxalsäure |
| `dose`, `method` | z. B. 50 ml, Träufeln |
| `batch_number` | Charge (oft gesetzlich vorgeschrieben) |
| `withdrawal_until` | Datum, ab dem Honig wieder unbedenklich geerntet werden kann |
| `reason` | z. B. Varroa |
| `note` | Freitext |
| `apiary_id`, `queen_id` | eingefrorener Kontext zum Anwendungszeitpunkt |
| `scope_id` | die Bienenstand-id |

:::note
Behandlungs- und Dosierungsvorschriften unterscheiden sich je nach Land und
Produktzulassung. Openbeehive erfasst, was Sie getan haben; es schreibt nichts
vor. Befolgen Sie stets Ihre lokalen Zulassungen — siehe [Varroa](/beekeeping/varroa).
:::

### Placement

Die zeitlich begrenzte Verbindung zwischen einer Beute und einem Bienenstand: wo
eine Beute stand und wie lange. Ein neues Placement wird eröffnet, wenn eine
Beute wandert; das vorherige wird geschlossen.

| Feld | Hinweise |
|---|---|
| `id`, `hive_id`, `apiary_id` | die Verbindung |
| `from` / `until` | Intervall; `until` ist null, solange aktuell |
| `scope_id` | die Bienenstand-id |

### ApiaryShare

Gewährt einer anderen Imkerin oder einem anderen Imker Zugriff auf einen
Bienenstand (und alles darunter).

| Feld | Hinweise |
|---|---|
| `id`, `apiary_id` | was geteilt wird |
| `user_id` | mit wem es geteilt wird |
| `role` | z. B. Betrachter, Bearbeiter |

## Scopes und Sync-Gating

Die Freigabe geschieht auf **Bienenstand**-Ebene, und ein einziger Wert steuert
sie: jeder Datensatz trägt eine `scope_id`.

- Für bienenstandseigene Daten — Beuten, Königinnen, Inspektionen, Aufgaben,
  Events, Ernten, Behandlungen, Placements und der Bienenstand selbst — ist die
  `scope_id` die **id des Bienenstands**.
- Für Daten, die einer einzelnen Nutzerin oder einem einzelnen Nutzer gehören und
  nie geteilt werden (z. B. persönliche Einstellungen), nimmt die `scope_id` die
  Form `user:<id>` an.

Wenn zwei Geräte synchronisieren, tauschen sie nur die Scopes aus, zu denen die
Nutzerin oder der Nutzer berechtigt ist. Der Server löst die Scope-Menge einer
Nutzerin oder eines Nutzers wie folgt auf:

```text
scopes(user) = { "user:<their id>" }
             ∪ { apiary.id  for each apiary they own }
             ∪ { share.apiary_id  for each ApiaryShare granting them access }
```

Das Hinzufügen eines `ApiaryShare` lässt daher einen ganzen Bienenstand — jede
Beute und jeden Datensatz darunter — bei der nächsten Synchronisation auf den
Geräten des Empfängers erscheinen; das Widerrufen stoppt das weitere Fließen von
Änderungen. Da das Tor die Spalte `scope_id` ist, ist die Freigabe pro
Bienenstand alles oder nichts und benötigt keine Berechtigungen pro Datensatz.

:::tip
Eine Beuten-id allein gewährt nichts. Das Scannen eines
[QR-Etiketts](/developers/qr-codes) öffnet die App an einer Beute nur dann, wenn
der Scope dieser Beute tatsächlich auf Ihr Gerät synchronisiert wurde.
:::

## Warum es sauber zusammenführt

Die obigen Strukturen sind so gewählt, dass die Synchronisation nie einen
Menschen zum Auflösen eines Konflikts braucht:

- **Skalare Felder** (die Markierungsfarbe einer Königin, der Name einer Beute)
  verwenden Last-Writer-Wins pro Feld, entschieden durch HLC-Zeitstempel.
- **Listen-/Mengenfelder** verwenden Add-Wins-OR-Sets, so dass gleichzeitige
  Hinzufügungen alle erhalten bleiben.
- **Events** sind Append-only und unveränderlich, sie sammeln sich also einfach
  an.

Für den vollständigen Algorithmus geht es weiter zum
[Sync-Protokoll](/developers/sync-protocol).
