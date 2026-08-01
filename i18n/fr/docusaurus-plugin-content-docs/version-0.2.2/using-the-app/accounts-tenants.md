---
sidebar_position: 13
title: "Comptes et locataires"
---

# Comptes et locataires

La façon dont vous vous connectez à Openbeehive dépend de la configuration de
l'instance. Une instance auto-hébergée individuelle peut ne nécessiter aucune
connexion ; une instance partagée (comme le service hébergé) donne à chacun son
propre compte et vous permet d'organiser vos ruches en **locataires** entre
lesquels vous pouvez basculer.

## Se connecter

Selon l'instance, l'écran de connexion propose une ou plusieurs des options
suivantes :

- **E-mail et mot de passe** — créez un compte avec votre e-mail, puis
  connectez-vous.
- **Un fournisseur** (Google, Keycloak, …) — « Continuer avec … ».
- **Une clé d'accès** — votre empreinte digitale, votre visage, le code PIN de
  votre appareil ou une clé de sécurité.
- **Rien du tout** — une instance mono-utilisateur ouvre directement
  l'application.

Vous pouvez utiliser n'importe quelle méthode proposée par l'instance, et elles
sont liées au même compte : si vous vous êtes d'abord inscrit avec un e-mail et
un mot de passe puis que vous vous connectez ensuite avec un fournisseur qui
utilise le **même e-mail**, les deux sont liés automatiquement.

:::note First account is the admin
Sur une instance toute neuve, le **premier** compte créé devient
l'administrateur de l'instance. Toute personne qui rejoint ensuite est un
utilisateur ordinaire.
:::

Si l'instance exige la vérification de l'e-mail, vous recevrez un lien de
confirmation par e-mail après votre inscription — ouvrez-le avant votre première
connexion.

## Qu'est-ce qu'un locataire

Un **locataire** est un ensemble de ruchers et de ruches qui vont ensemble.
Chaque compte démarre avec son **locataire personnel** — vos propres ruchers.
Vous pouvez aussi appartenir à des **locataires partagés**, par exemple :

- un rucher de **club** ou d'association entretenu ensemble par plusieurs
  apiculteurs,
- une démonstration **pédagogique** ou associative,
- une seconde exploitation que vous gardez séparée de vos ruches privées.

Vos enregistrements résident toujours au sein du **locataire actif**. Changer de
locataire modifie les ruchers, les ruches et les visites que vous voyez.

## Changer de locataire

Ouvrez **Paramètres → Locataires**. Vous verrez tous les locataires auxquels
vous appartenez, avec votre rôle dans chacun. Touchez-en un pour le rendre actif
— l'application se recharge avec les ruches de ce locataire.

## Créer un locataire

Dans **Paramètres → Locataires**, donnez un nom (par ex. « Club d'apiculture »)
et créez-le. Vous en devenez l'**administrateur du locataire** (propriétaire) et
il devient votre locataire actif. Ajoutez des ruchers et des ruches comme
d'habitude ; ils appartiennent à ce locataire.

## Rôles

| Rôle | Peut faire |
| --- | --- |
| **Administrateur de l'instance** | Le premier compte sur l'instance ; un rôle à l'échelle de l'instance pour les opérateurs. |
| **Administrateur du locataire** (propriétaire) | Gère un locataire et y **invite** d'autres personnes. |
| **Membre** | Travaille avec les ruchers et les ruches du locataire. |

## Inviter des apiculteurs

Si vous êtes administrateur d'un locataire, ouvrez **Paramètres → Locataires →
Inviter un apiculteur**, saisissez son e-mail et envoyez l'invitation. La
personne reçoit un lien ; une fois qu'elle se connecte et accepte, elle rejoint
le locataire et peut y basculer depuis ses propres **Paramètres → Locataires**.

## La démo

Certaines instances exécutent un **compte de démonstration**. Lorsque vous y êtes
connecté, une bannière vous rappelle que vous explorez la démo et que ses
données **se réinitialisent toutes les heures** — alors n'hésitez pas à cliquer
partout, à ajouter des visites et à essayer des choses ; tout revient aux
données de présentation lors de la prochaine réinitialisation. Les opérateurs
peuvent l'activer via le [Mode démo](/self-hosting/demo).
