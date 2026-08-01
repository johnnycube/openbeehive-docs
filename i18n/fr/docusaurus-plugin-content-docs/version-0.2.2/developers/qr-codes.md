---
sidebar_position: 6
title: "Codes QR et liens profonds"
---

# Codes QR et liens profonds

Chaque ruche dans Openbeehive peut porter une étiquette QR imprimable. Scannez-la
au rucher et l'application s'ouvre directement sur cette ruche, sans menus à
fouiller. Cette page explique comment l'encodage fonctionne, comment les liens se
résolvent hors ligne, comment les liens profonds natifs sont câblés, et comment se
comporte le scanner intégré à l'application.

## Ce qu'encode un QR de ruche

Un QR de ruche encode une seule URL de la forme :

```text
<base>/h/<hiveId>
```

- `<base>` est votre `BEEHIVE_PUBLIC_BASE_URL` (par exemple `https://app.openbeehive.org`).
- `<hiveId>` est l'identifiant stable de la ruche : un UUID frappé sur l'appareil
  lorsque la ruche est créée pour la première fois.

L'id est le même UUID offline-first utilisé partout ailleurs dans le modèle de
données. Il est généré localement, jamais réassigné, et survit à la
synchronisation sans être touché. Cette stabilité est ce qui rend une étiquette
imprimée sûre : le QR que vous collez sur le corps de ruche au printemps pointe
toujours vers la même ruche des années plus tard.

:::note
L'id encode une ruche, pas une permission. Connaître ou deviner un id de ruche
n'accorde aucun accès en soi. Voir **L'accès est filtré par le partage**.
:::

## Comment `/h/[id]` se résout

La route `/h/[id]` est un mince résolveur, pas une page à part entière. Lorsqu'elle
se charge, elle :

1. Recherche `id` dans la base de données SQLite-WASM **locale** (OPFS).
2. Si la ruche est présente, redirige dans l'application vers `/app/hives/[id]`.
3. Si la ruche n'est **pas** présente localement, déclenche une synchronisation,
   puis revérifie.
4. Si la ruche est toujours introuvable ou si vous n'y avez pas accès, elle le
   signale.

Parce que l'étape 1 lit depuis la base de données locale, un scan se résout
instantanément lorsque vous êtes hors ligne, tant que la ruche est déjà sur
l'appareil. La synchronisation de l'étape 3 est la seule partie qui a besoin d'un
signal, et elle ne s'exécute que lorsque la ruche est manquante (par exemple, un
rucher qui vient de vous être partagé).

```text
scan QR  ->  /h/<id>  ->  local lookup
                              |
                  found ------+------ not found
                    |                    |
          /app/hives/<id>           sync, re-check
                                         |
                              found -> /app/hives/<id>
                              still missing -> "not found / not shared"
```

### L'accès est filtré par le partage
La résolution passe toujours par les règles normales de synchronisation et de
partage. Le partage dans Openbeehive se fait au niveau du **rucher** via des
scopes ; une ruche ne vous devient visible que parce que son rucher se trouve dans
un scope que vous pouvez synchroniser. La route `/h/[id]` ne contourne jamais
cela.

Ainsi, un id à lui seul est inoffensif : si le rucher de la ruche n'est pas
partagé avec vous, la synchronisation de l'étape 3 ne renvoie rien et la route
signale la ruche comme indisponible. Traitez les étiquettes imprimées comme
pratiques, pas secrètes.

## Implémentation

La fonctionnalité QR est petite et répartie sur quelques fichiers :

| Fichier | Objet |
| --- | --- |
| `lib/qr.ts` | Construire l'URL de la ruche, rendre le QR en SVG hors ligne, analyser les charges utiles scannées (`parseHiveId`) |
| `lib/components/QrLabel.svelte` | Étiquette imprimable (QR + nom + code court) avec téléchargement SVG |
| `routes/h/[id]/+page.svelte` | Page d'atterrissage du scan : résoudre localement, puis rediriger dans l'application |
| `routes/app/hives/[id]/+page.svelte` | Détail de la ruche (affiche l'étiquette QR et l'historique) |
| `routes/app/scan/+page.svelte` | Scanner intégré à l'application utilisant la caméra |

Le rendu QR se fait entièrement sur l'appareil en SVG, de sorte que les étiquettes
peuvent être générées et imprimées sans aucune connexion réseau.

## Imprimer des étiquettes

Vous pouvez imprimer une étiquette pour n'importe quelle ruche unique depuis sa
vue de détail, ou générer une **feuille de lot** couvrant plusieurs ruches à la
fois.

| Sortie | À utiliser pour |
| --- | --- |
| Étiquette unique | Une ruche, imprimée à la demande (remplacement, nouvelle colonie) |
| Feuille de lot | Une grille d'étiquettes pour tout un rucher ou un tirage |

`QrLabel` ouvre une fenêtre d'impression épurée contenant uniquement le QR, le
nom de la ruche et un code court, et peut aussi télécharger le QR en SVG. Une
feuille de lot est simplement de nombreux composants `QrLabel` disposés dans une
page en grille d'impression.

La légende courte compte : elle garde une étiquette utile même si un téléphone est
à plat. Imprimez sur un support résistant aux intempéries ou laminé ; les corps de
ruche vivent dehors et l'encre s'efface.

:::tip
Collez l'étiquette là où vous la scannerez réellement, sur le côté de la ruche ou
sur le couvercle, plutôt que sur une surface qu'il faut soulever le toit pour
lire. Pour un guide pas à pas destiné aux apiculteurs, voir
[Étiquettes QR](/using-the-app/qr-labels).
:::

## Liens profonds natifs

Le QR pointe vers une URL `https://` ordinaire, ce qui signifie qu'il fonctionne
dans n'importe quel appareil photo ou navigateur. Sur mobile, Openbeehive peut
aussi enregistrer cet espace d'URL pour que l'application installée, plutôt qu'un
onglet de navigateur, gère le lien.

### Android App Links

Android vérifie la propriété du domaine du lien via un fichier Digital Asset Links
servi à `/.well-known/assetlinks.json`, déclarant le paquet de l'application et
l'empreinte de signature :

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.openbeehive.app",
      "sha256_cert_fingerprints": ["<your-app-signing-cert-sha256>"]
    }
  }
]
```

Ajoutez un filtre d'intention pour `https://<host>/h/*`. Une fois vérifié, les
pressions et les scans s'ouvrent directement dans l'application sans boîte de
dialogue de sélection.

### iOS Universal Links

iOS utilise un fichier Apple App Site Association servi à
`/.well-known/apple-app-site-association` (en tant que `application/json`, sans
extension de fichier) :

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "<TEAMID>.com.openbeehive.app",
        "paths": ["/h/*"]
      }
    ]
  }
}
```

Ajoutez l'entitlement Associated Domains à l'application pour revendiquer l'espace
de chemin `/h/*`.

:::caution
Les deux fichiers well-known doivent être servis via HTTPS avec le bon type de
contenu et sans redirections, depuis la même origine que votre `BEEHIVE_PUBLIC_BASE_URL`.
Si vous placez Openbeehive derrière un reverse proxy, assurez-vous que
`/.well-known/` est transmis intact. Voir [Reverse proxy](/self-hosting/reverse-proxy).
:::

### Repli par schéma personnalisé

Pour les contextes où un lien `https://` ne routera pas vers l'application, un
schéma personnalisé est aussi analysé par `parseHiveId` :

```text
openbeehive://hive/<hiveId>
```

Préférez la forme `https://` pour les étiquettes imprimées, car elle se dégrade
gracieusement vers l'application web lorsque l'application native est absente. Le
schéma personnalisé est mieux réservé à la navigation interne à l'application et
aux intégrations.

## Scanner intégré à l'application

Le scanner intégré à `/app/scan` lit les codes QR en utilisant l'API
`BarcodeDetector` du navigateur lorsqu'elle est disponible (Android et Chrome).
Sur les plateformes qui ne fournissent pas encore `BarcodeDetector`, notamment
iOS Safari, l'application se replie sur l'application appareil photo de
l'appareil ; intégrez un décodeur JavaScript tel que `@zxing/browser` si un
scanner entièrement intégré à l'application y est requis.

Quel que soit le chemin exécuté, un décodage réussi est traité de la même façon :
`parseHiveId` extrait l'id de la ruche de l'URL ou du schéma personnalisé, et
l'application navigue à travers le même flux de résolution locale décrit ci-
dessus. Un scan et un lien pressé sont équivalents.

:::note
Le scanner a besoin de la permission de la caméra et d'un contexte sécurisé
(HTTPS, ou `localhost` pendant le développement). Si la caméra ne démarre pas,
vérifiez d'abord les permissions du site ; voir
[Dépannage](/knowledge-base/troubleshooting).
:::

## Résumé

- Un QR de ruche encode `<base>/h/<hiveId>`, où l'id est un UUID hors ligne
  stable.
- `/h/[id]` se résout d'abord depuis la base de données locale et ne synchronise
  que si nécessaire.
- L'accès suit toujours le partage au niveau du rucher ; un id n'accorde rien en
  soi.
- App Links et Universal Links routent `/h/*` vers l'application native ; un schéma
  `openbeehive://hive/<id>` est aussi analysé.
- Le scanner utilise `BarcodeDetector` avec un repli sur l'application appareil
  photo iOS.

Pour une vue d'ensemble plus large, voir la section [Développeurs](/category/developers) et le
[Modèle de données](/developers/data-model).
