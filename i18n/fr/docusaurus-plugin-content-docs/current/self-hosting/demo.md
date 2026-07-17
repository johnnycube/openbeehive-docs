---
sidebar_position: 11
title: "Mode démo"
---

# Mode démo

Le mode démo installe un **compte et un locataire de démonstration** prêts à
l'emploi afin que les visiteurs puissent essayer Openbeehive avec des données
réalistes, sans toucher aux vrais enregistrements de qui que ce soit. Il est
**désactivé par défaut** et destiné aux vitrines publiques et aux tests.

## Ce qu'il met en place

Lorsqu'il est activé, Openbeehive crée :

- un compte de démonstration (`demo@app.openbeehive.org` / `demo` par défaut),
- un **locataire** de démonstration avec **15 ruches réparties sur 4 ruchers**,
- une saison complète de données : reines, environ 75 visites (avec température,
  humidité, varroa, poids…), récoltes de miel et traitements contre le varroa.

Les données sont **régénérées toutes les heures**, afin que la vitrine ait
toujours la même apparence — un visiteur peut modifier librement, et tout revient
à l'ensemble canonique lors de la réinitialisation suivante.

Lorsqu'une personne est connectée au compte de démonstration, l'application
affiche une **bannière** lui rappelant qu'elle se trouve dans la démo et que les
données sont réinitialisées chaque heure.

## Activation

```bash
BEEHIVE_DEMO=true
```

C'est tout ce dont vous avez besoin. Activer le mode démo active automatiquement
la [connexion par e-mail/mot de passe](/self-hosting/authentication) afin que le
compte de démonstration puisse se connecter. Vous pouvez éventuellement remplacer
les identifiants :

```bash
BEEHIVE_DEMO_EMAIL=demo@app.openbeehive.org
BEEHIVE_DEMO_PASSWORD=demo
```

Redémarrez le serveur. Vous verrez une ligne de journal confirmant que la démo a
été installée, et le compte de démonstration peut se connecter immédiatement.

## Comment il est isolé

- La démo réside dans son **propre locataire** ; la réinitialisation horaire ne
  supprime et ne reconstruit que les données de **démo**, jamais celles des
  autres locataires.
- Les utilisateurs réels de la même instance ne sont pas affectés — ils ont leurs
  propres locataires.

:::caution
Le compte de démonstration est un véritable compte permettant de se connecter.
Sur une instance publique, choisissez un mot de passe de démo que vous êtes à
l'aise de partager, et ne le réutilisez pas ailleurs. Laissez
`BEEHIVE_DEMO=false` sur les instances privées qui n'ont pas besoin d'une
vitrine.
:::

## Désactivation

Définissez `BEEHIVE_DEMO=false` (ou supprimez-le) et redémarrez. Les nouvelles
connexions au compte de démonstration cessent de fonctionner ; les données de
démo existantes restent jusqu'à ce que vous les supprimiez. Le compte et le
locataire de démonstration sont nommés `demo-user` / `demo-tenant` en interne si
vous souhaitez les supprimer de la base de données.
