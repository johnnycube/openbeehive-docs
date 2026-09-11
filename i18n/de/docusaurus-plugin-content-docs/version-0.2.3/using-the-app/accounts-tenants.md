---
sidebar_position: 13
title: "Konten & Mandanten"
---

# Konten & Mandanten

Wie du dich bei Openbeehive anmeldest, hängt davon ab, wie die Instanz
eingerichtet ist. Eine einzeln betriebene, selbst gehostete Instanz benötigt
unter Umständen gar keine Anmeldung; eine gemeinsam genutzte Instanz (wie der
gehostete Dienst) gibt jedem ein eigenes Konto und ermöglicht es dir, Beuten in
**Mandanten** zu organisieren, zwischen denen du wechseln kannst.

## Anmelden

Je nach Instanz bietet der Anmeldebildschirm eine oder mehrere der folgenden
Möglichkeiten:

- **E-Mail & Passwort** — lege ein Konto mit deiner E-Mail-Adresse an und melde
  dich dann an.
- **Ein Anbieter** (Google, Keycloak, …) — „Weiter mit …".
- **Ein Passkey** — dein Fingerabdruck, dein Gesicht, die Geräte-PIN oder ein
  Sicherheitsschlüssel.
- **Gar nichts** — eine Einzelbenutzer-Instanz öffnet direkt die App.

Du kannst die Methoden nutzen, die die Instanz anbietet, und sie sind alle mit
demselben Konto verknüpft: Wenn du dich zuerst mit E-Mail und Passwort
registriert hast und dich später mit einem Anbieter anmeldest, der **dieselbe
E-Mail-Adresse** verwendet, werden die beiden automatisch verknüpft.

:::note First account is the admin
Auf einer brandneuen Instanz wird das **erste** angelegte Konto zum
Instanz-Administrator. Alle, die danach hinzukommen, sind reguläre Benutzer.
:::

Wenn die Instanz eine E-Mail-Bestätigung verlangt, erhältst du nach der
Registrierung einen Bestätigungslink per E-Mail — öffne ihn vor deiner ersten
Anmeldung.

## Was ein Mandant ist

Ein **Mandant** ist eine Sammlung von Bienenständen und Beuten, die
zusammengehören. Jedes Konto beginnt mit seinem **persönlichen Mandanten** —
deinen eigenen Bienenständen. Du kannst auch zu **gemeinsamen Mandanten**
gehören, zum Beispiel:

- ein **Verein** oder ein Vereinsbienenstand, den mehrere Imker gemeinsam
  betreuen,
- eine **Schulungs-** oder Vereinsdemo,
- ein zweiter Betrieb, den du von deinen privaten Beuten getrennt hältst.

Deine Aufzeichnungen befinden sich immer innerhalb des **aktiven Mandanten**.
Beim Wechsel des Mandanten ändert sich, welche Bienenstände, Beuten und
Durchsichten du siehst.

## Mandanten wechseln

Öffne **Einstellungen → Mandanten**. Dort siehst du jeden Mandanten, zu dem du
gehörst, samt deiner Rolle in jedem. Tippe auf einen, um ihn zu aktivieren — die
App lädt mit den Beuten dieses Mandanten neu.

## Einen Mandanten erstellen

Gib unter **Einstellungen → Mandanten** einen Namen ein (z. B. „Imkerverein") und
erstelle ihn. Du wirst zu seinem **Mandanten-Administrator** (Eigentümer) und er
wird dein aktiver Mandant. Füge wie gewohnt Bienenstände und Beuten hinzu; sie
gehören zu diesem Mandanten.

## Rollen

| Rolle | Berechtigungen |
| --- | --- |
| **Instanz-Administrator** | Das erste Konto auf der Instanz; eine instanzweite Rolle für Betreiber. |
| **Mandanten-Administrator** (Eigentümer) | Verwaltet einen Mandanten und **lädt** andere dazu ein. |
| **Mitglied** | Arbeitet mit den Bienenständen und Beuten des Mandanten. |

## Imker einladen

Wenn du Mandanten-Administrator bist, öffne **Einstellungen → Mandanten → Imker
einladen**, gib deren E-Mail-Adresse ein und sende die Einladung. Sie erhalten
einen Link; sobald sie sich anmelden und annehmen, treten sie dem Mandanten bei
und können über ihre eigenen **Einstellungen → Mandanten** dorthin wechseln.

## Die Demo

Manche Instanzen betreiben ein **Demo-Konto**. Wenn du darin angemeldet bist,
erinnert dich ein Banner daran, dass du die Demo erkundest und dass deren Daten
**jede Stunde zurückgesetzt** werden — du kannst dich also gern umsehen, Besuche
hinzufügen und Dinge ausprobieren; beim nächsten Zurücksetzen kehrt alles zu den
Vorführdaten zurück. Betreiber können sie über den
[Demo mode](/self-hosting/demo) aktivieren.
