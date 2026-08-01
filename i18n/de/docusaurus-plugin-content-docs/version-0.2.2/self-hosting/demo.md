---
sidebar_position: 11
title: "Demo-Modus"
---

# Demo-Modus

Der Demo-Modus installiert ein vorgefertigtes **Demo-Konto und einen Demo-Mandanten**, damit
Besucher Openbeehive mit realistischen Daten ausprobieren können, ohne die echten Aufzeichnungen
anderer zu berühren. Er ist **standardmäßig deaktiviert** und für öffentliche Präsentationen
und Tests gedacht.

## Was er einrichtet

Wenn aktiviert, erstellt Openbeehive:

- ein Demo-Konto (`demo@app.openbeehive.org` / `demo` standardmäßig),
- einen Demo-**Mandanten** mit **15 Völkern auf 4 Bienenständen**,
- eine ganze Saison an Daten: Königinnen, ~75 Durchsichten (mit Temperatur, Luftfeuchtigkeit,
  Varroa, Gewicht …), Honigernten und Varroabehandlungen.

Die Daten werden **jede Stunde neu aufgesetzt**, sodass die Präsentation immer gleich aussieht –
ein Besucher kann frei bearbeiten, und beim nächsten Zurücksetzen kehrt alles zum
ursprünglichen Datensatz zurück.

Wenn jemand im Demo-Konto angemeldet ist, zeigt die App ein **Banner**, das daran erinnert, dass
man sich in der Demo befindet und dass die Daten stündlich zurückgesetzt werden.

## Aktivierung

```bash
BEEHIVE_DEMO=true
```

Mehr ist nicht nötig. Das Aktivieren des Demo-Modus schaltet automatisch die
[Anmeldung per E-Mail/Passwort](/self-hosting/authentication) ein, damit sich das Demo-Konto
anmelden kann. Optional können die Zugangsdaten überschrieben werden:

```bash
BEEHIVE_DEMO_EMAIL=demo@app.openbeehive.org
BEEHIVE_DEMO_PASSWORD=demo
```

Starten Sie den Server neu. Sie sehen eine Log-Zeile, die bestätigt, dass die Demo installiert
wurde, und das Demo-Konto kann sich sofort anmelden.

## Wie sie isoliert ist

- Die Demo lebt in ihrem **eigenen Mandanten**; das stündliche Zurücksetzen löscht und
  erstellt nur **Demo-Daten** neu, niemals andere Mandanten.
- Echte Benutzer auf derselben Instanz sind nicht betroffen – sie haben ihre eigenen Mandanten.

:::caution
Das Demo-Konto ist ein echtes, anmeldbares Konto. Wählen Sie auf einer öffentlichen Instanz ein
Demo-Passwort, das Sie bedenkenlos teilen können, und verwenden Sie es nirgendwo sonst. Lassen
Sie `BEEHIVE_DEMO=false` auf privaten Instanzen, die keine Präsentation benötigen.
:::

## Deaktivierung

Setzen Sie `BEEHIVE_DEMO=false` (oder entfernen Sie die Variable) und starten Sie neu. Neue
Anmeldungen am Demo-Konto funktionieren dann nicht mehr; vorhandene Demo-Daten bleiben bestehen,
bis Sie sie entfernen. Das Demo-Konto und der Demo-Mandant heißen intern `demo-user` /
`demo-tenant`, falls Sie sie aus der Datenbank löschen möchten.
