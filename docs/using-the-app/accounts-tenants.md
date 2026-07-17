---
sidebar_position: 13
title: "Accounts & tenants"
---

# Accounts & tenants

How you sign in to Openbeehive depends on how the instance is set up. A solo
self-hosted instance may need no login at all; a shared instance (like the hosted
service) gives everyone their own account and lets you organise hives into
**tenants** you can switch between.

## Signing in

Depending on the instance, the sign-in screen offers one or more of:

- **Email & password** — create an account with your email, then sign in.
- **A provider** (Google, Keycloak, …) — "Continue with …".
- **A passkey** — your fingerprint, face, device PIN or a security key.
- **Nothing at all** — a single-user instance opens straight to the app.

You can use whichever methods the instance offers, and they're tied to the same
account: if you first registered with email and password and later sign in with a
provider that uses the **same email**, the two are linked automatically.

:::note First account is the admin
On a brand-new instance, the **first** account created becomes the instance
admin. Everyone who joins afterwards is a regular user.
:::

If the instance requires email verification, you'll get a confirmation link by
email after signing up — open it before your first sign-in.

## What a tenant is

A **tenant** is a collection of apiaries and hives that belong together. Every
account starts with its **personal tenant** — your own apiaries. You can also
belong to **shared tenants**, for example:

- a **club** or association apiary that several beekeepers tend together,
- a **teaching** or association demo,
- a second operation you keep separate from your private hives.

Your records always live inside the **active tenant**. Switching tenants changes
which apiaries, hives and inspections you see.

## Switching tenants

Open **Settings → Tenants**. You'll see every tenant you belong to, with your
role in each. Tap one to make it active — the app reloads with that tenant's
hives.

## Creating a tenant

In **Settings → Tenants**, give a name (e.g. "Beekeeping Club") and create it.
You become its **tenant admin** (owner) and it becomes your active tenant. Add
apiaries and hives as usual; they belong to this tenant.

## Roles

| Role | Can do |
| --- | --- |
| **Instance admin** | The first account on the instance; an instance-wide role for operators. |
| **Tenant admin** (owner) | Manages a tenant and **invites** others to it. |
| **Member** | Works with the tenant's apiaries and hives. |

## Inviting beekeepers

If you're a tenant admin, open **Settings → Tenants → Invite a beekeeper**, enter
their email and send the invite. They receive a link; once they sign in and
accept, they join the tenant and can switch into it from their own
**Settings → Tenants**.

## The demo

Some instances run a **demo account**. When you're signed in to it, a banner
reminds you that you're exploring the demo and that its data **resets every
hour** — so feel free to click around, add visits and try things; everything
returns to the showcase data on the next reset. Operators can enable it via
[Demo mode](/self-hosting/demo).
