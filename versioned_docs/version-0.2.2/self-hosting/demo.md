---
sidebar_position: 11
title: "Demo mode"
---

# Demo mode

Demo mode installs a ready-made **demo account and tenant** so visitors can try
Openbeehive with realistic data, without touching anyone's real records. It's
**off by default** and meant for public showcases and testing.

## What it sets up

When enabled, Openbeehive creates:

- a demo account (`demo@app.openbeehive.org` / `demo` by default),
- a demo **tenant** with **15 hives across 4 apiaries**,
- a full season of data: queens, ~75 inspections (with temperature, humidity,
  varroa, weight…), honey harvests and varroa treatments.

The data is **re-seeded every hour**, so the showcase always looks the same — a
visitor can edit freely and everything returns to the canonical set on the next
reset.

When someone is signed in to the demo account, the app shows a **banner**
reminding them they're in the demo and that data resets hourly.

## Enabling it

```bash
BEEHIVE_DEMO=true
```

That's all you need. Enabling demo mode automatically turns on
[email/password sign-in](/self-hosting/authentication) so the demo account can log
in. Optionally override the credentials:

```bash
BEEHIVE_DEMO_EMAIL=demo@app.openbeehive.org
BEEHIVE_DEMO_PASSWORD=demo
```

Restart the server. You'll see a log line confirming the demo was installed, and
the demo account can sign in immediately.

## How it's isolated

- The demo lives in its **own tenant**; the hourly reset only deletes and
  rebuilds **demo** data, never other tenants.
- Real users on the same instance are unaffected — they have their own tenants.

:::caution
The demo account is a real, sign-in-able account. On a public instance, pick a
demo password you're comfortable sharing, and don't reuse it elsewhere. Leave
`BEEHIVE_DEMO=false` on private instances that don't need a showcase.
:::

## Turning it off

Set `BEEHIVE_DEMO=false` (or remove it) and restart. New sign-ins to the demo
account stop working; existing demo data remains until you remove it. The demo
account and tenant are named `demo-user` / `demo-tenant` internally if you want
to delete them from the database.
