---
sidebar_position: 4
title: "Reines"
---

# Reines

La reine est le cœur d'une colonie. Openbeehive vous permet de consigner qui elle est, d'où elle vient, comment elle est marquée, et quand son règne a commencé et pris fin. Parce que chaque reine est conservée dans l'enregistrement, vous construisez un historique vivant de votre cheptel au fil des saisons.

## Ce que contient un enregistrement de reine

Chaque reine appartient à une ruche et capture les détails qui comptent pour l'élevage et la tenue des registres :

| Champ | Ce qu'il signifie |
| --- | --- |
| Année | L'année où la reine a été élevée ou a commencé à diriger la colonie. Cela détermine sa couleur de marquage. |
| Numéro | Un numéro d'éleveur ou de séquence facultatif, utile si vous élevez plusieurs reines par an. |
| Origine | D'où elle vient : votre propre élevage, une reine achetée, un essaim, une supersédure, etc. |
| Race / lignée | La souche, telle que Buckfast, Carnica, Ligustica, Mellifera, ou une lignée locale. |
| Couleur de marquage | La couleur du point sur son thorax (voir ci-dessous). |
| Clippée | Indique si une aile a été clippée. |
| Notes | Tout le reste : tempérament, schéma de ponte, éleveur d'origine. |

:::tip Consigner l'origine honnêtement
Une origine claire rend vos enregistrements bien plus utiles par la suite. « Élevage personnel, fille de la n°214 » ou « Achetée à l'association locale, Buckfast » vous en dira beaucoup plus dans deux ans que « reine » ne le fera jamais.
:::

## Couleur de marquage par année

Openbeehive suit le code international des couleurs de reine, de sorte que la couleur que vous consignez correspond au point qu'utiliserait un éleveur. La couleur change tous les cinq ans selon le dernier chiffre de l'année :

| L'année se termine par | Couleur |
| --- | --- |
| 1 ou 6 | Blanc |
| 2 ou 7 | Jaune |
| 3 ou 8 | Rouge |
| 4 ou 9 | Vert |
| 5 ou 0 | Bleu |

Lorsque vous définissez l'année d'une reine, Openbeehive suggère automatiquement la couleur correspondante. Vous pouvez la remplacer si votre reine se trouve être marquée différemment, mais s'en tenir au code permet de garder votre rucher cohérent avec le monde apicole au sens large.

Pour le code complet, le moyen mnémotechnique et les références imprimables, consultez [Couleurs de marquage des reines](/knowledge-base/queen-marking-colours).

:::note
La couleur enregistre comment la reine *est* marquée, ce qui correspond normalement à son année de naissance. Si vous marquez une reine tardivement, ou achetez une reine déjà marquée, consignez la couleur qu'elle porte réellement afin que le point dans vos enregistrements corresponde au point sur l'abeille.
:::

## Remplacer une reine

Une colonie n'a jamais qu'une seule reine régnante à la fois, mais au cours de sa vie elle en aura plusieurs. Lorsqu'une reine est superséée, essaime, meurt, ou que vous remérez délibérément, vous ne supprimez pas son enregistrement. Au lieu de cela, vous commencez un nouveau règne.

Lorsque vous ajoutez une nouvelle reine à une ruche, Openbeehive :

1. Clôture le règne de la reine précédente, en enregistrant sa date de fin.
2. Ouvre le règne de la nouvelle reine à partir de sa date de début.
3. Conserve l'ancienne reine dans l'historique de la ruche, de sorte que rien n'est perdu.

Cela donne à chaque ruche un historique de reines complet et ordonné. Vous pouvez remonter dans le temps et voir exactement qui pondait au cours d'une saison donnée, combien de temps chaque reine a duré, et quelles lignées ont bien performé pour vous.

:::tip Remérage
Lorsque vous remérez, notez *pourquoi* dans l'enregistrement de la nouvelle reine ou dans une inspection : ponte médiocre, abeilles agressives, âge, ou amélioration planifiée de la lignée. Les tendances observées sur plusieurs ruches révèlent souvent plus que n'importe quelle colonie isolée.
:::

## Entrées antidatées et reine régnante

L'apiculture se déroule rarement dans un ordre parfait. Vous pourriez consigner une inspection des jours après la visite, ou ne consigner un remérage qu'une fois la nouvelle reine bien en ponte.

Openbeehive gère cela avec élégance. Chaque règne de reine a une plage temporelle, et les inspections, événements et autres enregistrements portent leur propre date. Lorsque vous antidatez une entrée, l'application la rapporte à la reine qui régnait réellement à cette date, et non simplement à la reine à la tête de la ruche aujourd'hui.

Ainsi, si vous consignez une inspection d'il y a trois semaines, elle est associée à la reine qui était en charge à ce moment-là, même si elle a depuis été remplacée. Votre historique reste exact, quel que soit le moment où vous effectuez la saisie.

:::caution Vérifiez vos dates
Parce que les enregistrements antidatés se rattachent à la reine qui régnait à ce moment-là, la date que vous saisissez a son importance. Si un remérage et une inspection tombent à des dates proches, vérifiez les dates afin que chaque enregistrement se rattache au bon règne.
:::

## Comment cela se synchronise

Les enregistrements de reines se synchronisent comme tout le reste dans Openbeehive : les modifications sont enregistrées localement et instantanément, puis fusionnées en arrière-plan. Les règnes sont un historique en ajout seul, ils n'entrent donc jamais en conflit entre appareils. Si deux personnes modifient les notes de la même reine, la modification la plus récente de chaque champ l'emporte, et les champs de type liste fusionnent plutôt que d'être écrasés.

Vous pouvez travailler au rucher sans réseau et avoir la certitude que votre historique de reines se réconciliera proprement une fois de retour en ligne. Pour en savoir plus à ce sujet, consultez [Hors ligne et synchronisation](/using-the-app/offline-and-sync).

## Pages associées

- [Ruches](/using-the-app/hives) — où vivent les reines.
- [Inspections](/using-the-app/inspections) — consigner les visites et ce que vous avez constaté.
- [Élevage de reines](/beekeeping/queen-rearing) — élever vos propres reines.
- [Couleurs de marquage des reines](/knowledge-base/queen-marking-colours) — le code international complet.
