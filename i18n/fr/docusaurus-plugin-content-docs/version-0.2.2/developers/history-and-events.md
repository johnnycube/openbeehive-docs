---
sidebar_position: 2
title: "Historique et événements"
---

# Historique et événements

Openbeehive traite vos enregistrements apicoles comme une histoire qui se
déroule dans le temps. Une ruche est déplacée entre des ruchers, une reine règne
puis est remplacée plus tard, une récolte est enregistrée un jour donné. Pour
rendre cet historique précis et utile, le modèle de données garde deux choses au
clair : ce qui s'est passé, et la situation qui était vraie au moment où cela
s'est produit.

Cette page explique comment les événements figent leur contexte, comment les
historiques par intervalle enregistrent les règnes et les placements, comment les
enregistrements de détail typés se rattachent aux événements, et comment le
client écrit et interroge tout cela hors ligne.

## Les événements figent leur contexte

Un événement est un fait en ajout seul : il enregistre que quelque chose s'est
produit à un instant donné. Surtout, chaque événement stocke un instantané du
contexte pertinent tel qu'il était au moment de l'événement, plutôt qu'un simple
pointeur vers l'état actuel.

Lorsqu'un événement est écrit, le client résout et stocke :

- le rucher auquel appartenait la ruche,
- la ruche elle-même,
- la reine qui régnait dans cette ruche à cette date.

Cet instantané est dénormalisé sur la ligne de l'événement. L'avantage est que
l'historique reste véridique même après que le monde a changé. Si vous déplacez
une ruche vers un nouveau rucher le mois prochain, l'inspection de la semaine
dernière se lit toujours comme ayant eu lieu dans le rucher où elle s'est
réellement déroulée. Si vous remérez, une ancienne récolte attribue toujours le
miel à la reine qui était en charge à l'époque.

:::note
Parce que les événements sont en ajout seul et portent leur propre contexte, ils
n'entrent jamais en conflit pendant la synchronisation. Deux appareils peuvent
chacun ajouter des événements hors ligne et les deux ensembles sont conservés.
Voir le [protocole de synchronisation](/developers/sync-protocol) pour les règles
exemptes de conflit.
:::

## La table des événements est aussi une table de faits

Les mêmes lignes d'événement font office de table de faits pour les
statistiques. Les mesures numériques vivent directement sur l'événement, la plus
importante étant `amount_kg` pour les récoltes, aux côtés des dimensions figées
(rucher, ruche, reine, date, `scope_id`, type d'événement).

Cela signifie que les rapports courants sont une simple requête groupée sur une
seule table, sans aucune jointure requise pour attribuer un nombre au rucher, à
la ruche ou à la reine qui l'a produit. Le contexte figé est ce qui rend « le
miel par rucher en 2025 » ou « le rendement par reine » correct par
construction.

## Historiques par intervalle

Certains faits s'expriment mieux comme des intervalles plutôt que comme des
points. Openbeehive utilise des intervalles semi-ouverts, notés `[start, end)` :
le début est inclus, la fin est exclue. Cela permet aux intervalles de se
juxtaposer proprement sans chevauchement ni lacune lorsqu'une période se termine
exactement au début de la suivante.

| Historique | Intervalle | Signification |
| --- | --- | --- |
| Règne d'une reine | `[installed, replaced)` | La reine est à la tête de la colonie depuis sa date d'installation jusqu'à, mais sans inclure, la date où elle est remplacée. |
| Placement d'une ruche | `[from, to)` | La ruche se trouve dans un rucher donné depuis `from` jusqu'à, mais sans inclure, `to`. |

Un règne ou un placement courant a une fin ouverte (pas encore de `replaced` /
`to`). Lorsqu'une reine est remplacée, l'intervalle de la reine sortante est
fermé à la date d'installation de la nouvelle reine, et le nouveau règne s'ouvre
à ce moment. Les déplacements de ruche fonctionnent de la même façon.

:::tip
Les intervalles semi-ouverts font de « qui régnait à la date D ? » un test
simple : trouver la ligne où `installed <= D` et (`replaced` est nul ou
`replaced > D`). Exactement une ligne correspond, même un jour de changement.
:::

## Enregistrements de détail typés

Les événements existent en plusieurs types, et les détails propres à chaque type
vivent dans leurs propres enregistrements liés à l'événement :

- Détail d'**inspection** : observations d'une visite (couvain, réserves,
  caractère, reine vue, et ainsi de suite).
- Détail de **récolte** : ce qui a été prélevé, y compris la mesure `amount_kg`
  utilisée pour les statistiques.
- Détail de **traitement** : le produit appliqué, la dose et le calendrier d'un
  traitement contre le varroa ou une maladie.

Garder les champs partagés de l'événement (date, contexte figé, `scope_id`) à un
seul endroit et les champs propres au type dans des enregistrements typés
maintient la table de faits propre tout en permettant des formulaires et des
écrans riches et conscients du type. Les formes de ces enregistrements sont
décrites dans le [modèle de données](/developers/data-model).

## resolveContext pour les entrées antidatées

Les apiculteurs n'enregistrent pas toujours les choses au moment où elles se
produisent. Vous pourriez saisir l'inspection de samedi dernier le lundi soir. Le
contexte doit donc être résolu pour la date propre de l'événement, pas pour
« maintenant ».

Le client utilise un assistant, conceptuellement :

```text
resolveContext(hiveId, date) -> { apiaryId, hiveId, queenId, scopeId }
```

Il recherche la ruche, puis consulte les historiques par intervalle pour trouver
le placement du rucher et le règne de la reine qui couvrent `date`, et lit le
`scope_id` de la ruche. Le résultat est figé sur l'événement.

```sql
-- Find the queen reigning in a hive on a given date.
SELECT id
FROM queens
WHERE hive_id = :hiveId
  AND installed <= :date
  AND (replaced IS NULL OR replaced > :date)
LIMIT 1;
```

```sql
-- Find the apiary the hive was placed in on a given date.
SELECT apiary_id
FROM hive_placements
WHERE hive_id = :hiveId
  AND from_date <= :date
  AND (to_date IS NULL OR to_date > :date)
LIMIT 1;
```

:::caution
Résolvez toujours le contexte par rapport à la date de l'événement. Utiliser le
rucher actuel ou la reine actuelle de la ruche attribuerait silencieusement de
façon erronée les entrées antidatées et corromprait vos statistiques.
:::

## Quelles fonctions client écrivent l'historique

Trois sortes d'écritures touchent l'historique, et il est utile de les garder
distinctes :

1. **Ajouter un événement.** Les écrivains d'inspection, de récolte, de
   traitement et autres événements appellent d'abord
   `resolveContext(hiveId, date)`, puis ajoutent l'événement avec son contexte
   figé (et `amount_kg` le cas échéant) plus l'enregistrement de détail typé.
2. **Remplacer une reine.** Ferme le règne actuel à la nouvelle date
   d'installation et ouvre un nouvel intervalle `[installed, replaced)`. Les
   événements existants conservent leur reine figée d'origine.
3. **Déplacer une ruche.** Ferme le placement actuel à la date du déplacement et
   ouvre un nouvel intervalle `[from, to)` dans le rucher de destination. Les
   événements existants conservent leur rucher figé d'origine.

Les règnes et les placements sont des lignes d'intervalle dont les champs
scalaires (la date de fermeture) suivent le « dernier écrivain gagne » par champ ;
les événements sont en ajout seul et immuables une fois écrits. Les nouvelles
corrections se font en ajoutant d'autres événements, pas en modifiant les
anciens.

## Requêtes statistiques

Parce que les mesures et les dimensions sont figées sur l'événement, les rapports
se groupent directement :

```sql
-- Total honey per apiary for a season.
SELECT apiary_id, SUM(amount_kg) AS total_kg
FROM events
WHERE type = 'harvest'
  AND date >= '2025-01-01' AND date < '2026-01-01'
GROUP BY apiary_id;
```

```sql
-- Yield attributed to each queen.
SELECT queen_id, SUM(amount_kg) AS total_kg
FROM events
WHERE type = 'harvest'
GROUP BY queen_id;
```

Aucune jointure vers l'état actuel n'est nécessaire : les `apiary_id` et
`queen_id` figés sont déjà les bons pour le moment de la récolte.

## Hors ligne et partage via scope_id

Chaque ligne d'événement et d'historique porte le `scope_id` de son rucher. Les
scopes sont l'unité de partage dans Openbeehive : accorder à quelqu'un l'accès à
un rucher partage tous les événements et historiques sous ce scope.

Parce que les écritures sont locales et instantanées, l'historique est d'abord
écrit dans la base de données SQLite sur l'appareil puis synchronisé en arrière-
plan. Le contexte figé signifie qu'une entrée antidatée faite hors ligne porte le
bon rucher, la bonne ruche et la bonne reine même si l'appareil n'a pas vu les
changements récents d'ailleurs ; les événements en ajout seul fusionnent sans
conflit lorsque l'appareil se reconnecte.

Voir [hors ligne et synchronisation](/using-the-app/offline-and-sync) pour le
comportement côté utilisateur et [Développeurs](/category/developers) pour
l'architecture plus large.
