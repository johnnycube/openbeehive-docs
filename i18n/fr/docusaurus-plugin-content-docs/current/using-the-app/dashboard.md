---
sidebar_position: 1
title: "Le tableau de bord"
---

# Le tableau de bord

Le tableau de bord est votre point d'ancrage dans Openbeehive. C'est le premier écran qui s'affiche à l'ouverture de l'application, et il est conçu pour répondre à une question simple : qu'est-ce qui requiert mon attention aujourd'hui ?

Parce qu'Openbeehive fonctionne en mode hors ligne d'abord, tout ce qui apparaît sur le tableau de bord est lu directement depuis la base de données locale de votre appareil. Il se charge instantanément et fonctionne que vous ayez du réseau au rucher ou non. Les modifications que vous effectuez se synchronisent discrètement avec le serveur en arrière-plan.

## Tuiles statistiques

En haut du tableau de bord, vous trouverez une rangée de tuiles statistiques qui vous donnent un décompte rapide de ce que contiennent vos enregistrements :

| Tuile | Ce qu'elle indique |
| --- | --- |
| **Ruchers** | Le nombre de ruchers que vous gérez, y compris ceux partagés avec vous. |
| **Ruches** | Le nombre total de ruches dans tous vos ruchers. |
| **Reines** | Les reines actuellement enregistrées à la tête d'une colonie. |
| **Tâches ouvertes** | Les tâches qui ne sont pas encore marquées comme terminées. |

Chaque tuile est cliquable et vous amène à la section correspondante de l'application, de sorte que vous pouvez passer directement d'un décompte au détail qui se cache derrière.

## Ce qui reste à faire

Sous les tuiles, le tableau de bord regroupe les éléments à caractère urgent.

### Inspections à venir

Liste les ruches dont la prochaine inspection est due ou en retard, en fonction de l'intervalle que vous avez défini lors de l'inspection. C'est votre signal pour planifier une visite. Touchez une ruche pour l'ouvrir et démarrer une nouvelle inspection.

### Tâches imminentes

Affiche les tâches dont l'échéance approche, les plus proches en premier. Les tâches peuvent être liées à une ruche ou un rucher spécifique, ou exister de manière autonome (par exemple, « commander de nouveaux cadres »). Cochez-en une ici sans quitter le tableau de bord.

### Inspections récentes

Un court fil de vos visites les plus récentes, pour voir d'un coup d'œil ce que vous avez constaté en dernier dans chaque colonie. Touchez une entrée pour lire les notes complètes de l'inspection.

### Miel de cette saison

Un total cumulé du miel que vous avez récolté au cours de la saison en cours, calculé à partir de vos enregistrements de récolte. C'est une façon rapide et gratifiante de suivre le déroulement de l'année.

:::tip
Le tableau de bord ne reflète que ce qui figure dans vos enregistrements. Plus vous consignez régulièrement les inspections, les tâches et les récoltes, plus ces résumés deviennent utiles.
:::

## Se repérer dans l'application

La façon de naviguer dépend de la taille de votre écran. Les mêmes fonctionnalités sont disponibles dans les deux cas ; seule la disposition change.

### Sur mobile

Une **barre d'onglets en bas** vous donne un accès en un seul geste aux zones principales de l'application : le tableau de bord, vos ruchers et ruches, les tâches, et ainsi de suite. Elle reste fixée en bas de l'écran pour rester toujours à portée de pouce pendant que vous travaillez à la ruche.

### Sur ordinateur et tablette

Une **barre latérale** s'étend sur le côté gauche avec le même ensemble de destinations, ainsi qu'un peu plus de place pour afficher les libellés et les éléments imbriqués. Sur les écrans plus larges, cela laisse la zone principale libre pour vos enregistrements.

## Compte et paramètres

Votre compte et vos paramètres sont réunis au même endroit, accessible depuis la navigation. Vous pouvez y gérer votre profil, vous déconnecter et accéder aux préférences globales de l'application telles que la langue et (si votre serveur les utilise) les clés d'accès et les fournisseurs de connexion associés.

Si vous exécutez une instance auto-hébergée mono-utilisateur sans connexion configurée, le bloc de compte affiche simplement votre profil local.

## L'indicateur en ligne/hors ligne

Un petit indicateur affiche l'état actuel de votre connexion et de votre synchronisation.

- **En ligne** signifie que l'application est connectée et synchronise les modifications avec le serveur.
- **Hors ligne** signifie qu'il n'y a pas de connexion pour le moment. C'est tout à fait normal et il n'y a pas lieu de s'inquiéter : vous pouvez continuer à ajouter des inspections, des tâches et tout le reste exactement comme d'habitude.

Lorsque vous revenez à portée, Openbeehive se synchronise automatiquement. Grâce à sa conception sans conflit, les modifications effectuées sur différents appareils hors ligne sont fusionnées proprement lorsqu'ils se retrouvent.

:::note
Voir « hors ligne » ne signifie **pas** que vous perdrez des données. Tout est d'abord enregistré localement. L'indicateur vous indique simplement quand la synchronisation en arrière-plan est en pause. Pour en savoir plus sur le fonctionnement, consultez [Hors ligne et synchronisation](/using-the-app/offline-and-sync).
:::

## Changer de langue

Openbeehive est disponible en plusieurs langues. Pour changer :

1. Ouvrez les **Paramètres**.
2. Trouvez l'option **Langue**.
3. Choisissez votre langue préférée.

Les langues disponibles sont :

| Code | Langue |
| --- | --- |
| `en` | Anglais (English) |
| `de` | Allemand (Deutsch) |
| `fr` | Français |
| `es` | Espagnol (Español) |
| `it` | Italien (Italiano) |

Le changement prend effet immédiatement et est mémorisé sur votre appareil.

## Et ensuite

Depuis le tableau de bord, vous pouvez vous diriger vers le reste de l'application :

- Configurez vos [ruchers](/using-the-app/apiaries) et vos [ruches](/using-the-app/hives).
- Consignez une visite dans les [inspections](/using-the-app/inspections).
- Gardez le contrôle des travaux avec les [tâches](/using-the-app/tasks).
- Consignez votre récolte dans les [récoltes](/using-the-app/harvests).

Pour un tour d'horizon plus large de tout ce que l'application peut faire, rendez-vous sur la vue d'ensemble [Utiliser l'application](/category/using-the-app).
