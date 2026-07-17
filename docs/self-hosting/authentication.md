---
sidebar_position: 7
title: "Authentication"
---

# Authentication

Openbeehive lets you choose exactly how much authentication you need. A solo beekeeper running the single binary at home can skip login entirely. A shared instance can require passkeys, sign-in through an identity provider, or both.

This page covers the three modes, the session settings every multi-user setup needs, and how to wire up your identity provider's redirect URL.

:::note
Authentication protects access to the *server* and its sync API. The app itself remains offline-first: once signed in, your device keeps reading and writing locally and syncs in the background. See [Offline & sync](/using-the-app/offline-and-sync).
:::

## Choosing a mode

| Mode | When to use it | Key settings |
| --- | --- | --- |
| No login (single user) | One person, one server, behind your own network or trusted reverse proxy | `BEEHIVE_OIDC_PROVIDERS` empty **and** `BEEHIVE_WEBAUTHN_ENABLED=false` |
| Email & password (in-app accounts) | A shared instance where people self-register — no external identity provider needed | `BEEHIVE_PASSWORD_AUTH=true` (on by default for the `cloud` profile) |
| Passkeys (WebAuthn) | A small group; passwordless sign-in with device biometrics or security keys | `BEEHIVE_WEBAUTHN_ENABLED=true` plus `WEBAUTHN_RP_*` |
| OIDC providers | You already have Google, Keycloak, Authentik, etc., or want central account control | `BEEHIVE_OIDC_PROVIDERS` plus per-provider settings |

You can combine all of these. The sign-in screen offers whichever methods are enabled, and a person's account is shared across methods — signing in with a provider links to an existing email/password account with the same email.

## Mode 1: single user, no login

This is the simplest setup and the default starting point for a `selfhost` instance. Leave both options off:

```bash
BEEHIVE_OIDC_PROVIDERS=
BEEHIVE_WEBAUTHN_ENABLED=false
```

With no auth methods enabled, Openbeehive runs as a single-user instance and does not prompt for sign-in. This is ideal for a hobbyist running the [single binary](/self-hosting/single-binary) on a home machine or behind a private network.

:::caution
"No login" means anyone who can reach the server can read and edit your records. Only use it on a trusted network, on `localhost`, or behind a reverse proxy that handles access itself. If your instance is reachable from the internet, enable passkeys or OIDC.
:::

## Session settings (required once any login is enabled)

As soon as you turn on passkeys or OIDC, the server issues signed session cookies. You must provide a session secret.

```bash
# Generate a strong random secret
openssl rand -base64 32
```

Set the result as `BEEHIVE_SESSION_SECRET`, and optionally adjust how long sessions last:

```bash
BEEHIVE_SESSION_SECRET=PUT_YOUR_GENERATED_SECRET_HERE
BEEHIVE_SESSION_TTL=720h
```

`BEEHIVE_SESSION_TTL` accepts a Go duration (for example `720h` is 30 days, `24h` is one day). When it expires, users sign in again.

:::danger
Keep `BEEHIVE_SESSION_SECRET` secret and stable. Anyone who learns it can forge sessions. If you change it, all existing sessions are invalidated and everyone must sign in again. Never commit it to version control.
:::

If you serve the app over HTTPS through a reverse proxy, make sure `BEEHIVE_PUBLIC_BASE_URL` uses `https://` so cookies and redirect URLs are correct. See [Reverse proxy](/self-hosting/reverse-proxy).

## Email & password (in-app accounts)

When you want several users but don't run an identity provider, enable built-in
email/password accounts:

```bash
BEEHIVE_PASSWORD_AUTH=true
```

This is **on by default for the `cloud` profile** and off for `selfhost`. With it
enabled, the sign-in screen offers "create account" and "sign in", and people can
[register themselves](/using-the-app/accounts-tenants).

### Invite-only instances

If you don't want strangers creating accounts, set `BEEHIVE_REGISTRATION=false`
to close open registration. The first-run admin setup still works, so a fresh
instance can always create its admin account. After that, new people can only
join via invite links, which a tenant admin issues from Settings and which must
match the invited email address. The sign-in screen shows a notice that the
instance is invite-only.

**The first account is the admin.** On a fresh instance the first person to
register becomes the instance admin; everyone after them is a regular user. Each
new account starts with its own personal [tenant](/using-the-app/accounts-tenants).

### Optional email verification

By default a new account can sign in immediately. To require people to confirm
their email address first, turn on verification:

```bash
BEEHIVE_EMAIL_VERIFICATION=true
```

The account then can't sign in until it follows the verification link. Configure
SMTP so the email is actually sent:

```bash
BEEHIVE_SMTP_HOST=smtp.example.com
BEEHIVE_SMTP_PORT=587
BEEHIVE_SMTP_USER=postbox@example.com
BEEHIVE_SMTP_PASS=your-smtp-password
BEEHIVE_SMTP_FROM=Openbeehive <no-reply@example.com>
```

:::note
If `BEEHIVE_SMTP_HOST` is left empty, Openbeehive writes the verification link to
the server log instead of emailing it — convenient for testing, not for
production.
:::

## Mode 2: passkeys (WebAuthn)

Passkeys let people sign in with a fingerprint, face scan, device PIN, or a hardware security key. There are no passwords to manage.

```bash
BEEHIVE_WEBAUTHN_ENABLED=true
BEEHIVE_WEBAUTHN_RP_ID=beehive.example.com
BEEHIVE_WEBAUTHN_RP_ORIGINS=https://beehive.example.com
BEEHIVE_WEBAUTHN_RP_DISPLAY_NAME=Openbeehive
```

What each value means:

- `BEEHIVE_WEBAUTHN_RP_ID` is the **relying party ID**: the registrable domain users visit, with no scheme and no port (for example `beehive.example.com`, or `localhost` for local testing). Passkeys are bound to this domain.
- `BEEHIVE_WEBAUTHN_RP_ORIGINS` is the full origin (or comma-separated origins) the browser will send, including scheme and any port, for example `https://beehive.example.com`.
- `BEEHIVE_WEBAUTHN_RP_DISPLAY_NAME` is the friendly name shown in the browser's passkey prompt.

:::caution
WebAuthn requires a **secure context**. Passkeys work over HTTPS, or over `http://localhost` for development, but not over plain HTTP on a remote address. Put the server behind TLS before enabling passkeys in production. The `RP_ID` must match the domain in your `BEEHIVE_PUBLIC_BASE_URL`.
:::

## Mode 3: OIDC providers

Connect Openbeehive to one or more OpenID Connect identity providers. List the ones you want, comma-separated, and configure each by name.

:::note Accounts link automatically
When someone signs in through a provider, Openbeehive finds or creates their
in-app account: it matches the provider identity first, then the **email address**
(linking an existing email/password account to that provider), and otherwise
registers a new account. So a person can sign in with a provider or with email
and password interchangeably, and the first account on the instance is the admin.
:::

```bash
BEEHIVE_OIDC_PROVIDERS=google,keycloak
BEEHIVE_OIDC_REDIRECT_URL=https://beehive.example.com/auth/callback
```

`BEEHIVE_OIDC_REDIRECT_URL` is the address your provider sends users back to after they authenticate. It must be reachable by the browser and must exactly match what you register with the provider (see below).

### Google

```bash
BEEHIVE_OIDC_GOOGLE_ISSUER=https://accounts.google.com
BEEHIVE_OIDC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
BEEHIVE_OIDC_GOOGLE_CLIENT_SECRET=your-client-secret
BEEHIVE_OIDC_GOOGLE_SCOPES=openid,email,profile
```

Create the client in the Google Cloud Console under **APIs & Services -> Credentials -> OAuth client ID** (type: Web application).

### Keycloak and Authentik

Keycloak, Authentik, and other standards-compliant providers use the generic per-provider variables. The provider name in `BEEHIVE_OIDC_PROVIDERS` maps to the variable prefix.

```bash
BEEHIVE_OIDC_PROVIDERS=keycloak
BEEHIVE_OIDC_KEYCLOAK_ISSUER=https://id.example.com/realms/main
BEEHIVE_OIDC_KEYCLOAK_CLIENT_ID=openbeehive
BEEHIVE_OIDC_KEYCLOAK_CLIENT_SECRET=your-client-secret
```

The issuer is the realm's base URL; Openbeehive discovers the rest from `<issuer>/.well-known/openid-configuration`. Authentik works the same way using its application's OpenID configuration URL as the issuer.

:::tip
The variable prefix is just the upper-cased provider name. To add another provider, add its name to `BEEHIVE_OIDC_PROVIDERS` and supply the matching `BEEHIVE_OIDC_<NAME>_ISSUER`, `BEEHIVE_OIDC_<NAME>_CLIENT_ID`, and `BEEHIVE_OIDC_<NAME>_CLIENT_SECRET`.
:::

### Registering the redirect URL with your IdP

In your provider's client configuration, add an authorised redirect URI that matches `BEEHIVE_OIDC_REDIRECT_URL` character-for-character:

```text
https://beehive.example.com/auth/callback
```

Common pitfalls:

- The scheme must match (`https` in production, not `http`).
- No trailing slash unless your `BEEHIVE_OIDC_REDIRECT_URL` has one.
- Use your public domain, not an internal hostname or `localhost`, unless you are testing locally.

If sign-in fails with a redirect mismatch, the value registered at the IdP and the value in `BEEHIVE_OIDC_REDIRECT_URL` differ somewhere.

## Verifying your setup

After changing any of these settings, restart the server and load the app in a browser:

1. With **no login**, the dashboard opens directly.
2. With **passkeys or OIDC**, you should see a sign-in screen offering each enabled method.
3. Complete a sign-in and confirm you reach the dashboard and that records sync.

If something does not work, check the server logs and the [Troubleshooting](/knowledge-base/troubleshooting) guide. For the full list of settings, see [Configuration](/self-hosting/configuration).
