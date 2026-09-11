---
sidebar_position: 9
title: "Étiquettes QR"
---

# Étiquettes QR

Une étiquette QR transforme n'importe quelle ruche en un raccourci accessible d'un
seul geste. Collez une étiquette sur le toit ou le corps de couvain, pointez votre
téléphone dessus, et Openbeehive ouvre directement l'enregistrement de cette ruche.
Plus besoin de faire défiler des listes au rucher, ni de plisser les yeux sur des
numéros manuscrits sous la pluie.

C'est particulièrement pratique lorsque vous gardez plusieurs ruches identiques,
ou lorsqu'un assistant qui ne connaît pas votre numérotation doit trouver la bonne
colonie.

## Ce que contient le code QR

Le code QR de chaque ruche encode un seul **lien profond** vers cette ruche :

```text
<base>/h/<hiveId>
```

Le `<base>` est l'adresse de votre application (pour le service hébergé, il s'agit
de `https://app.openbeehive.org` ; pour un auto-hébergement, c'est votre propre
URL). Le `<hiveId>` est l'identifiant unique de la ruche.

Le code ne contient aucune donnée d'abeilles, aucun poids de miel et aucune
information personnelle. Ce n'est qu'un lien. Si quelqu'un le scanne sans avoir
accès à vos enregistrements, il sera invité à se connecter et ne verra la ruche
que si elle a été partagée avec lui.

:::note
Le lien ouvre l'**application**, qui charge ensuite la ruche depuis votre base de
données locale. Parce qu'Openbeehive fonctionne en mode hors ligne d'abord, la
ruche s'ouvre quand même même si vous n'avez pas de réseau, une fois l'application
installée sur votre téléphone.
:::

## Imprimer une étiquette pour une ruche

1. Ouvrez la ruche depuis votre liste de **Ruchers**, ou directement depuis la ruche.
2. Choisissez **Étiquette QR** (regardez dans le menu d'actions de la ruche).
3. Un aperçu apparaît affichant le code ainsi que le nom de la ruche et le rucher,
   de sorte que vous pouvez distinguer les étiquettes avant qu'elles n'aillent sur
   les caisses.
4. Sélectionnez **Imprimer**. La boîte de dialogue d'impression de votre navigateur s'ouvre.
5. Imprimez sur une planche d'étiquettes ou du papier ordinaire, puis fixez-la à la ruche.

:::tip Faites-la durer en extérieur
Les ruches vivent au soleil, sous la pluie et dans le gel. Pour des étiquettes qui
survivent à une saison :

- Imprimez sur du support d'étiquettes résistant aux intempéries ou en vinyle, **ou**
- Imprimez sur papier et recouvrez-le de ruban adhésif d'emballage transparent ou
  d'une pochette de plastification.

Placez l'étiquette à un endroit où elle ne sera pas éraflée par les hausses qu'on
soulève et qu'on repose — le côté du corps de couvain ou sous le rebord du toit
conviennent tous deux bien.
:::

## Imprimer une planche par lot pour un rucher

Si vous configurez tout un rucher d'un coup, imprimez ensemble l'étiquette de
chaque ruche plutôt qu'une à la fois.

1. Ouvrez le **rucher** depuis votre liste de Ruchers.
2. Choisissez **Planche QR** (ou **Imprimer les étiquettes**) pour le rucher.
3. Openbeehive met en page une planche avec un code étiqueté par ruche dans ce rucher.
4. Imprimez, puis découpez et appliquez.

Cela permet aussi de garder un enregistrement soigné : une seule planche montre
chaque colonie du rucher avec son nom et son code côte à côte.

## Scanner une étiquette

Vous pouvez scanner une étiquette de deux façons.

### Avec l'appareil photo de votre téléphone

La plupart des téléphones modernes reconnaissent les codes QR dans l'application
appareil photo intégrée. Pointez l'appareil photo sur l'étiquette, attendez que le
lien apparaisse, et touchez-le. Votre téléphone ouvre le lien et Openbeehive saute
à la ruche.

Cela fonctionne pour tout le monde — un visiteur ou un coapiculteur peut scanner
une ruche partagée sans ouvrir l'application au préalable.

### Avec le scanner intégré à l'application

Openbeehive dispose aussi de son propre scanner, utile lorsque vous travaillez
déjà dans l'application et que vous voulez passer rapidement d'une ruche à l'autre.

1. Ouvrez le scanner (cherchez l'icône QR ou appareil photo dans l'application).
2. Accordez l'autorisation d'accès à l'appareil photo la première fois que vous l'utilisez.
3. Pointez sur une étiquette — la ruche s'ouvre immédiatement.

:::tip
Le scanner intégré vous garde à l'intérieur d'Openbeehive, de sorte que vous passez
d'un enregistrement de ruche au suivant sans rebondir à travers le navigateur.
:::

## Si un scan n'ouvre pas la bonne ruche

Quelques causes courantes et leurs solutions :

| Symptôme | Cause probable | Que faire |
| --- | --- | --- |
| L'appareil photo ne fait pas la mise au point sur le code | Étiquette mouillée, décolorée ou recourbée | Essuyez-la ; réimprimez si elle est usée |
| Le lien s'ouvre mais affiche « introuvable » | La ruche a été supprimée, ou elle est sur un autre compte | Vérifiez que la ruche existe toujours et que vous êtes connecté au bon compte |
| Vous demande de vous connecter | La ruche appartient au rucher de quelqu'un d'autre | Demandez-lui de partager le rucher avec vous |
| Rien ne se passe au toucher | L'application n'est pas installée sur ce téléphone | Installez Openbeehive, puis scannez de nouveau |

Le partage se fait au niveau du rucher, donc pour permettre à quelqu'un de scanner
une ruche, vous devez partager son **rucher** avec lui. Consultez
[Hors ligne et synchronisation](/using-the-app/offline-and-sync)
pour comprendre le fonctionnement du partage et des portées.

## Réimpression et changement d'étiquettes

Les étiquettes n'expirent jamais. Le lien reste valide pour toute la durée de vie
de la ruche, de sorte qu'un code imprimé aujourd'hui fonctionnera encore la saison
prochaine.

Si vous déplacez du matériel, n'oubliez pas que l'étiquette suit l'**enregistrement
de la ruche**, et non la caisse physique. Lorsque vous retirez une caisse mais
conservez la colonie comme la même ruche dans Openbeehive, l'ancienne étiquette
continue de fonctionner. Si vous démarrez un nouvel enregistrement de ruche,
générez et imprimez une nouvelle étiquette pour celui-ci.

:::caution
Ne déplacez pas une étiquette imprimée de la caisse d'une ruche vers une autre en
vous attendant à ce qu'elle pointe vers la nouvelle colonie — elle ouvrira toujours
la ruche d'origine. Imprimez plutôt une nouvelle étiquette.
:::

## Aller plus loin

Vous voulez le détail technique — comment le lien profond est analysé, comment
l'installation native intercepte l'URL, et comment générer des codes de manière
programmatique ? Consultez
[Codes QR pour les développeurs](/developers/qr-codes).
