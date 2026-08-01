---
sidebar_position: 11
title: "Modalità demo"
---

# Modalità demo

La modalità demo installa un **account e tenant demo** già pronti, così i
visitatori possono provare Openbeehive con dati realistici, senza toccare i dati
reali di nessuno. È **disattivata per impostazione predefinita** ed è pensata per
vetrine pubbliche e test.

## Cosa configura

Quando è abilitata, Openbeehive crea:

- un account demo (`demo@app.openbeehive.org` / `demo` per impostazione predefinita),
- un **tenant** demo con **15 arnie distribuite in 4 apiari**,
- un'intera stagione di dati: regine, ~75 ispezioni (con temperatura, umidità,
  varroa, peso…), raccolti di miele e trattamenti contro la varroa.

I dati vengono **rigenerati ogni ora**, così la vetrina appare sempre uguale: un
visitatore può modificare liberamente e tutto torna all'insieme canonico al
successivo ripristino.

Quando qualcuno ha effettuato l'accesso con l'account demo, l'app mostra un
**banner** che ricorda di trovarsi nella demo e che i dati vengono ripristinati
ogni ora.

## Come abilitarla

```bash
BEEHIVE_DEMO=true
```

È tutto ciò che serve. Abilitare la modalità demo attiva automaticamente
l'[accesso con email/password](/self-hosting/authentication) in modo che l'account
demo possa effettuare il login. Facoltativamente puoi sovrascrivere le credenziali:

```bash
BEEHIVE_DEMO_EMAIL=demo@app.openbeehive.org
BEEHIVE_DEMO_PASSWORD=demo
```

Riavvia il server. Vedrai una riga di log che conferma l'installazione della demo
e l'account demo potrà effettuare l'accesso immediatamente.

## Come è isolata

- La demo risiede nel **proprio tenant**; il ripristino orario elimina e
  ricostruisce solo i dati **demo**, mai gli altri tenant.
- Gli utenti reali sulla stessa istanza non vengono interessati: hanno i propri
  tenant.

:::caution
L'account demo è un account reale con cui si può effettuare l'accesso. Su
un'istanza pubblica, scegli una password demo che sei disposto a condividere e
non riutilizzarla altrove. Lascia `BEEHIVE_DEMO=false` sulle istanze private che
non necessitano di una vetrina.
:::

## Come disattivarla

Imposta `BEEHIVE_DEMO=false` (o rimuovilo) e riavvia. I nuovi accessi all'account
demo smetteranno di funzionare; i dati demo esistenti restano finché non li
rimuovi. L'account e il tenant demo sono denominati internamente `demo-user` /
`demo-tenant` se vuoi eliminarli dal database.
