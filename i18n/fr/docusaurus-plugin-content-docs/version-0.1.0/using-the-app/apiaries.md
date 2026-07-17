---
sidebar_position: 2
title: "Ruchers"
---

# Ruchers

Un **rucher** est un endroit où vous gardez des abeilles : votre jardin, un terrain familial, un toit, un champ loué ou un emplacement isolé en bordure de forêt. Dans Openbeehive, le rucher se situe tout en haut de vos enregistrements. Tout le reste en découle.

La hiérarchie est simple :

```text
Apiary  ->  Hive  ->  Queen
```

Chaque rucher contient une ou plusieurs ruches, chaque ruche a ses reines actuelles (et passées), et vos inspections, tâches, événements, récoltes et traitements se rattachent tous à une ruche au sein d'un rucher. Comme le rucher est la racine de l'arbre, c'est aussi l'unité que vous partagez avec d'autres personnes. Plus de détails à ce sujet ci-dessous.

## Pourquoi les ruchers comptent

Regrouper les ruches par emplacement fait bien plus que mettre de l'ordre. Quelques avantages pratiques :

- **Contexte pour votre travail.** Lorsque vous arrivez sur un emplacement, vous ouvrez ce rucher et ne voyez que les ruches qui sont devant vous.
- **Déplacements et logistique.** Les coordonnées vous permettent de retrouver un emplacement isolé, de partager sa position ou de planifier une tournée de visites.
- **Limites de partage.** L'accès est accordé par rucher, vous pouvez donc partager un emplacement avec un mentor ou un partenaire sans exposer le reste de votre exploitation.

:::tip
Si vous gardez des abeilles à plusieurs endroits, créez un rucher par emplacement physique. Cela permet de regrouper les inspections, les récoltes et les traitements là où vous effectuez réellement le travail.
:::

## Créer un rucher

Depuis le tableau de bord ou la liste des ruchers, choisissez **Nouveau rucher** et renseignez les détails. Seul un nom est requis ; tout le reste peut être ajouté plus tard.

| Champ | Requis | À quoi il sert |
| --- | --- | --- |
| **Nom** | Oui | Un libellé court et reconnaissable, par exemple « Jardin de la maison » ou « Emplacement du verger ». |
| **Adresse** | Non | Une adresse ou une description en texte libre pour vous aider (ainsi que toute personne avec qui vous partagez) à trouver l'endroit. |
| **Note** | Non | Tout ce qui est utile : codes de portail, notes d'accès, nom du propriétaire, stationnement. |
| **Latitude / Longitude** | Non | Coordonnées GPS du rucher, en degrés décimaux. |

Parce qu'Openbeehive fonctionne en mode hors ligne d'abord, le rucher est enregistré directement dans la base de données de votre appareil au moment où vous le créez. Il apparaît immédiatement, fonctionne sans réseau et se synchronise avec le serveur en arrière-plan une fois que vous êtes de nouveau en ligne. Consultez [Hors ligne et synchronisation](/using-the-app/offline-and-sync) pour comprendre le fonctionnement.

### Définir les coordonnées GPS

Vous pouvez saisir la latitude et la longitude à la main, ou toucher **Utiliser ma position** pour les renseigner à partir du GPS de votre appareil. Votre navigateur demandera l'autorisation la première fois.

Les coordonnées sont stockées en degrés décimaux, par exemple une latitude de `52.5200` et une longitude de `13.4050`. Les valeurs négatives sont valides : au sud de l'équateur pour la latitude, à l'ouest de Greenwich pour la longitude.

:::note
« Utiliser ma position » capture l'endroit où **vous** vous tenez, ce qui correspond généralement exactement à l'endroit où se trouvent les ruches. Si vous configurez le rucher depuis chez vous pour un emplacement distant, saisissez plutôt les coordonnées manuellement, ou modifiez-les lors de votre prochaine visite.
:::

## Ajouter et consulter des ruches

Ouvrez un rucher pour voir toutes ses ruches d'un coup d'œil, ainsi qu'une idée rapide de l'état de chacune. À partir de là, vous pouvez :

- **Ajouter une ruche** avec **Nouvelle ruche**, en choisissant son type (Zander, Dadant, Deutsch Normal, Langstroth, Warre, Top-bar ou Autre) et en lui donnant un nom ou un numéro.
- **Ouvrir une ruche** pour consulter sa reine, ses inspections, ses tâches, ses événements, ses récoltes et ses traitements.

Pour tout ce que vous pouvez consigner pour une colonie individuelle, consultez [Ruches](/using-the-app/hives) et [Reines](/using-the-app/queens).

## Imprimer les étiquettes QR du rucher

Chaque ruche peut porter une **étiquette QR** imprimable. Depuis la vue du rucher, vous pouvez imprimer les étiquettes de toutes ses ruches en une seule fois, ce qui est bien plus rapide que de le faire une par une.

Chaque étiquette encode un lien profond vers cette ruche précise. La scanner avec un téléphone ouvre Openbeehive directement sur la ruche, de sorte que vous pouvez démarrer une inspection sans parcourir des listes. Collez l'étiquette à un endroit résistant aux intempéries sur le corps ou le toit de la ruche.

Pour les tailles d'étiquettes, la réimpression et la façon dont les liens sont construits, consultez [Étiquettes QR](/using-the-app/qr-labels).

:::tip
Imprimez de nouvelles étiquettes QR chaque fois que vous ajoutez un lot de nouvelles ruches sur un emplacement. Emportez-les avec vous et appliquez-les sur place afin que la ruche physique et vos enregistrements concordent dès le premier jour.
:::

## Modifier et réorganiser

Vous pouvez renommer un rucher, mettre à jour son adresse, sa note et ses coordonnées, ou corriger des détails à tout moment. Les modifications se synchronisent de la même manière que tout le reste, avec le principe du dernier écrivain l'emporte par champ, de sorte que la modification la plus récente de chaque champ l'emporte même si deux personnes modifient en même temps.

Si une ruche change d'emplacement, déplacez-la vers le rucher correspondant afin que vos enregistrements continuent de refléter la réalité. Les apiculteurs transhumants qui déplacent leurs colonies entre les sites peuvent conserver un rucher par site et réaffecter les ruches au fil de leurs déplacements.

## Partager un rucher

Le partage dans Openbeehive se fait au **niveau du rucher** via des *portées*. Lorsque vous partagez un rucher, les personnes que vous invitez accèdent à cet emplacement et aux ruches, reines et enregistrements qu'il contient, mais pas à vos autres ruchers.

C'est ce qui rend possible de :

- Partager un seul emplacement avec un mentor, un apprenti ou un coapiculteur.
- Gérer un rucher d'association ou de club que plusieurs membres entretiennent ensemble.
- Garder vos colonies domestiques privées tout en collaborant sur un site partagé.

Parce que la synchronisation est sans conflit, plusieurs personnes peuvent travailler dans le même rucher partagé, même hors ligne, et leurs modifications fusionnent proprement lorsque les appareils se reconnectent.

Pour le modèle de données qui sous-tend les portées et la façon dont le partage sans conflit fonctionne en coulisses, consultez [Architecture](/developers/architecture).

:::caution
Partager un rucher accorde un accès réel à ses enregistrements. N'invitez que des personnes de confiance, et n'oubliez pas que quiconque y a accès peut ajouter, modifier et consigner pour les ruches de ce rucher.
:::

## Et ensuite

- [Ruches](/using-the-app/hives) — ajoutez des colonies et consignez pour elles.
- [Reines](/using-the-app/queens) — suivez vos reines et leurs couleurs de marquage.
- [Étiquettes QR](/using-the-app/qr-labels) — imprimez et utilisez des étiquettes de ruche scannables.
- [Hors ligne et synchronisation](/using-the-app/offline-and-sync) — comment vos enregistrements restent disponibles partout.
