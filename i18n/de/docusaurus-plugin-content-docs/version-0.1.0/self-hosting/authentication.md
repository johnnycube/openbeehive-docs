---
sidebar_position: 7
title: "Authentifizierung"
---

# Authentifizierung

Mit Openbeehive entscheidest du genau, wie viel Authentifizierung du benötigst. Eine Imkerin oder ein Imker, die oder der das Einzel-Binary allein zu Hause betreibt, kann die Anmeldung ganz überspringen. Eine gemeinsam genutzte Instanz kann Passkeys, die Anmeldung über einen Identity-Provider oder beides verlangen.

Diese Seite behandelt die drei Modi, die Session-Einstellungen, die jedes Mehrbenutzer-Setup benötigt, und wie du die Redirect-URL deines Identity-Providers einrichtest.

:::note
Authentifizierung schützt den Zugriff auf den *Server* und seine Sync-API. Die App selbst bleibt offline-first: Einmal angemeldet, liest und schreibt dein Gerät weiterhin lokal und synchronisiert im Hintergrund. Siehe [Offline & Sync](/using-the-app/offline-and-sync).
:::

## Einen Modus wählen

| Modus | Wann verwenden | Wichtige Einstellungen |
| --- | --- | --- |
| Keine Anmeldung (Einzelnutzer) | Eine Person, ein Server, hinter deinem eigenen Netzwerk oder vertrauenswürdigem Reverse Proxy | `BEEHIVE_OIDC_PROVIDERS` leer **und** `BEEHIVE_WEBAUTHN_ENABLED=false` |
| E-Mail & Passwort (App-interne Konten) | Eine gemeinsam genutzte Instanz, bei der sich Personen selbst registrieren – kein externer Identity-Provider nötig | `BEEHIVE_PASSWORD_AUTH=true` (standardmäßig aktiviert für das `cloud`-Profil) |
| Passkeys (WebAuthn) | Eine kleine Gruppe; passwortlose Anmeldung mit Gerätebiometrie oder Sicherheitsschlüsseln | `BEEHIVE_WEBAUTHN_ENABLED=true` plus `WEBAUTHN_RP_*` |
| OIDC-Provider | Du hast bereits Google, Keycloak, Authentik usw. oder möchtest zentrale Kontoverwaltung | `BEEHIVE_OIDC_PROVIDERS` plus provider-spezifische Einstellungen |

Du kannst all diese Methoden kombinieren. Der Anmeldebildschirm bietet die jeweils aktivierten Methoden an, und das Konto einer Person wird über alle Methoden hinweg geteilt – die Anmeldung über einen Provider wird mit einem bestehenden E-Mail-/Passwort-Konto mit derselben E-Mail-Adresse verknüpft.

## Modus 1: Einzelnutzer, keine Anmeldung

Dies ist das einfachste Setup und der Standardausgangspunkt für eine `selfhost`-Instanz. Lass beide Optionen aus:

```bash
BEEHIVE_OIDC_PROVIDERS=
BEEHIVE_WEBAUTHN_ENABLED=false
```

Ohne aktivierte Auth-Methoden läuft Openbeehive als Einzelnutzer-Instanz und fragt nicht nach Anmeldung. Das ist ideal für einen Hobbyisten, der das [Einzel-Binary](/self-hosting/single-binary) auf einer Heimmaschine oder hinter einem privaten Netzwerk betreibt.

:::caution
"Keine Anmeldung" bedeutet, dass jeder, der den Server erreichen kann, deine Aufzeichnungen lesen und bearbeiten kann. Verwende es nur in einem vertrauenswürdigen Netzwerk, auf `localhost` oder hinter einem Reverse Proxy, der den Zugriff selbst regelt. Wenn deine Instanz aus dem Internet erreichbar ist, aktiviere Passkeys oder OIDC.
:::

## Session-Einstellungen (erforderlich, sobald eine Anmeldung aktiviert ist)

Sobald du Passkeys oder OIDC einschaltest, gibt der Server signierte Session-Cookies aus. Du musst ein Session-Secret bereitstellen.

```bash
# Generate a strong random secret
openssl rand -base64 32
```

Setze das Ergebnis als `BEEHIVE_SESSION_SECRET` und passe optional an, wie lange Sessions dauern:

```bash
BEEHIVE_SESSION_SECRET=PUT_YOUR_GENERATED_SECRET_HERE
BEEHIVE_SESSION_TTL=720h
```

`BEEHIVE_SESSION_TTL` akzeptiert eine Go-Dauer (zum Beispiel `720h` sind 30 Tage, `24h` ist ein Tag). Wenn sie abläuft, melden sich Nutzer erneut an.

:::danger
Halte `BEEHIVE_SESSION_SECRET` geheim und stabil. Jeder, der es erfährt, kann Sessions fälschen. Wenn du es änderst, werden alle bestehenden Sessions ungültig und jeder muss sich erneut anmelden. Committe es niemals in die Versionsverwaltung.
:::

Wenn du die App über HTTPS durch einen Reverse Proxy ausliefern lässt, stelle sicher, dass `BEEHIVE_PUBLIC_BASE_URL` `https://` verwendet, damit Cookies und Redirect-URLs korrekt sind. Siehe [Reverse Proxy](/self-hosting/reverse-proxy).

## E-Mail & Passwort (App-interne Konten)

Wenn du mehrere Nutzer haben möchtest, aber keinen Identity-Provider betreibst, aktiviere die integrierten
E-Mail-/Passwort-Konten:

```bash
BEEHIVE_PASSWORD_AUTH=true
```

Dies ist **standardmäßig für das `cloud`-Profil aktiviert** und für `selfhost` deaktiviert. Wenn es
aktiviert ist, bietet der Anmeldebildschirm "Konto erstellen" und "Anmelden", und Personen können
sich [selbst registrieren](/using-the-app/accounts-tenants).

### Instanzen nur auf Einladung

Wenn du nicht möchtest, dass Fremde Konten erstellen, setze `BEEHIVE_REGISTRATION=false`,
um die offene Registrierung zu schließen. Die Admin-Ersteinrichtung funktioniert weiterhin,
sodass eine frische Instanz immer ihr Admin-Konto erstellen kann. Danach können neue Personen
nur über Einladungslinks beitreten, die ein Mandanten-Administrator in den Einstellungen
ausstellt und die zur eingeladenen E-Mail-Adresse passen müssen. Der Anmeldebildschirm zeigt
einen Hinweis, dass die Instanz nur auf Einladung zugänglich ist.

**Das erste Konto ist der Administrator.** Auf einer frischen Instanz wird die erste Person, die sich
registriert, zum Administrator der Instanz; jeder danach ist ein regulärer Nutzer. Jedes
neue Konto startet mit seinem eigenen persönlichen [Mandanten](/using-the-app/accounts-tenants).

### Optionale E-Mail-Verifizierung

Standardmäßig kann sich ein neues Konto sofort anmelden. Um zu verlangen, dass Personen zuerst ihre
E-Mail-Adresse bestätigen, aktiviere die Verifizierung:

```bash
BEEHIVE_EMAIL_VERIFICATION=true
```

Das Konto kann sich dann erst anmelden, wenn es dem Verifizierungslink folgt. Konfiguriere
SMTP, damit die E-Mail tatsächlich versendet wird:

```bash
BEEHIVE_SMTP_HOST=smtp.example.com
BEEHIVE_SMTP_PORT=587
BEEHIVE_SMTP_USER=postbox@example.com
BEEHIVE_SMTP_PASS=your-smtp-password
BEEHIVE_SMTP_FROM=Openbeehive <no-reply@example.com>
```

:::note
Wenn `BEEHIVE_SMTP_HOST` leer gelassen wird, schreibt Openbeehive den Verifizierungslink in
das Server-Log, anstatt ihn per E-Mail zu versenden – praktisch zum Testen, nicht für
die Produktion.
:::

## Modus 2: Passkeys (WebAuthn)

Passkeys lassen Personen sich mit einem Fingerabdruck, Gesichtsscan, einer Geräte-PIN oder einem Hardware-Sicherheitsschlüssel anmelden. Es gibt keine Passwörter zu verwalten.

```bash
BEEHIVE_WEBAUTHN_ENABLED=true
BEEHIVE_WEBAUTHN_RP_ID=beehive.example.com
BEEHIVE_WEBAUTHN_RP_ORIGINS=https://beehive.example.com
BEEHIVE_WEBAUTHN_RP_DISPLAY_NAME=Openbeehive
```

Was jeder Wert bedeutet:

- `BEEHIVE_WEBAUTHN_RP_ID` ist die **Relying-Party-ID**: die registrierbare Domain, die Nutzer besuchen, ohne Schema und ohne Port (zum Beispiel `beehive.example.com` oder `localhost` zum lokalen Testen). Passkeys sind an diese Domain gebunden.
- `BEEHIVE_WEBAUTHN_RP_ORIGINS` ist der vollständige Ursprung (oder kommagetrennte Ursprünge), den der Browser senden wird, einschließlich Schema und etwaigem Port, zum Beispiel `https://beehive.example.com`.
- `BEEHIVE_WEBAUTHN_RP_DISPLAY_NAME` ist der freundliche Name, der in der Passkey-Aufforderung des Browsers angezeigt wird.

:::caution
WebAuthn erfordert einen **sicheren Kontext**. Passkeys funktionieren über HTTPS oder über `http://localhost` für die Entwicklung, aber nicht über reines HTTP auf einer entfernten Adresse. Setze den Server hinter TLS, bevor du Passkeys in der Produktion aktivierst. Die `RP_ID` muss mit der Domain in deiner `BEEHIVE_PUBLIC_BASE_URL` übereinstimmen.
:::

## Modus 3: OIDC-Provider

Verbinde Openbeehive mit einem oder mehreren OpenID-Connect-Identity-Providern. Liste die gewünschten kommagetrennt auf und konfiguriere jeden nach Namen.

:::note Konten werden automatisch verknüpft
Wenn sich jemand über einen Provider anmeldet, findet oder erstellt Openbeehive das
App-interne Konto: Es gleicht zuerst die Provider-Identität ab, dann die **E-Mail-Adresse**
(wodurch ein bestehendes E-Mail-/Passwort-Konto mit diesem Provider verknüpft wird), und andernfalls
registriert es ein neues Konto. So kann sich eine Person wechselweise über einen Provider oder mit E-Mail
und Passwort anmelden, und das erste Konto auf der Instanz ist der Administrator.
:::

```bash
BEEHIVE_OIDC_PROVIDERS=google,keycloak
BEEHIVE_OIDC_REDIRECT_URL=https://beehive.example.com/auth/callback
```

`BEEHIVE_OIDC_REDIRECT_URL` ist die Adresse, an die dein Provider Nutzer nach der Authentifizierung zurücksendet. Sie muss vom Browser erreichbar sein und exakt mit dem übereinstimmen, was du beim Provider registrierst (siehe unten).

### Google

```bash
BEEHIVE_OIDC_GOOGLE_ISSUER=https://accounts.google.com
BEEHIVE_OIDC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
BEEHIVE_OIDC_GOOGLE_CLIENT_SECRET=your-client-secret
BEEHIVE_OIDC_GOOGLE_SCOPES=openid,email,profile
```

Erstelle den Client in der Google Cloud Console unter **APIs & Services -> Credentials -> OAuth client ID** (Typ: Web application).

### Keycloak und Authentik

Keycloak, Authentik und andere standardkonforme Provider verwenden die generischen provider-spezifischen Variablen. Der Provider-Name in `BEEHIVE_OIDC_PROVIDERS` wird auf das Variablenpräfix abgebildet.

```bash
BEEHIVE_OIDC_PROVIDERS=keycloak
BEEHIVE_OIDC_KEYCLOAK_ISSUER=https://id.example.com/realms/main
BEEHIVE_OIDC_KEYCLOAK_CLIENT_ID=openbeehive
BEEHIVE_OIDC_KEYCLOAK_CLIENT_SECRET=your-client-secret
```

Der Issuer ist die Basis-URL des Realms; Openbeehive ermittelt den Rest aus `<issuer>/.well-known/openid-configuration`. Authentik funktioniert genauso, indem es die OpenID-Konfigurations-URL seiner Anwendung als Issuer verwendet.

:::tip
Das Variablenpräfix ist einfach der großgeschriebene Provider-Name. Um einen weiteren Provider hinzuzufügen, füge seinen Namen zu `BEEHIVE_OIDC_PROVIDERS` hinzu und gib das passende `BEEHIVE_OIDC_<NAME>_ISSUER`, `BEEHIVE_OIDC_<NAME>_CLIENT_ID` und `BEEHIVE_OIDC_<NAME>_CLIENT_SECRET` an.
:::

### Die Redirect-URL bei deinem IdP registrieren

Füge in der Client-Konfiguration deines Providers eine autorisierte Redirect-URI hinzu, die zeichengenau mit `BEEHIVE_OIDC_REDIRECT_URL` übereinstimmt:

```text
https://beehive.example.com/auth/callback
```

Häufige Stolperfallen:

- Das Schema muss übereinstimmen (`https` in der Produktion, nicht `http`).
- Kein abschließender Schrägstrich, es sei denn, dein `BEEHIVE_OIDC_REDIRECT_URL` hat einen.
- Verwende deine öffentliche Domain, nicht einen internen Hostnamen oder `localhost`, es sei denn, du testest lokal.

Wenn die Anmeldung mit einem Redirect-Mismatch fehlschlägt, unterscheiden sich der beim IdP registrierte Wert und der Wert in `BEEHIVE_OIDC_REDIRECT_URL` irgendwo.

## Dein Setup überprüfen

Nach dem Ändern einer dieser Einstellungen starte den Server neu und lade die App in einem Browser:

1. Bei **keiner Anmeldung** öffnet sich das Dashboard direkt.
2. Bei **Passkeys oder OIDC** solltest du einen Anmeldebildschirm sehen, der jede aktivierte Methode anbietet.
3. Führe eine Anmeldung durch und bestätige, dass du das Dashboard erreichst und dass Aufzeichnungen synchronisieren.

Wenn etwas nicht funktioniert, prüfe die Server-Logs und den [Fehlerbehebungsleitfaden](/knowledge-base/troubleshooting). Für die vollständige Liste der Einstellungen siehe [Konfiguration](/self-hosting/configuration).
