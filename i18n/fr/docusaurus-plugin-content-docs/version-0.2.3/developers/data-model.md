---
sidebar_position: 3
title: "Modèle de données"
---

# Modèle de données

Cette page décrit les entités principales que stocke Openbeehive, comment elles
sont liées, et comment les **scopes** déterminent ce qui est synchronisé et avec
qui. Elle est rédigée du point de vue de l'approche hors-ligne d'abord : la même
structure réside dans la base de données SQLite-WASM de l'appareil et dans la
base de données enfichable du serveur, et le [protocole de synchronisation](/developers/sync-protocol)
les maintient cohérentes.

Si vous voulez comprendre les mécanismes du suivi des changements (horodatages
HLC, dernier écrivain gagne, OR-Sets, événements en ajout seul), lisez d'abord
[Historique et événements](/developers/history-and-events) — cette page se
concentre sur les entités elles-mêmes.

## La hiérarchie

Au sommet se trouve le **Rucher** (Apiary, un emplacement ou un terrain). Chaque
rucher contient des **Ruches** ; chaque ruche possède une **Reine** actuelle et
accumule un flux d'enregistrements au fil du temps.

```text
Apiary
 ├── Hive ──────── Queen (current; queens form a succession over time)
 │     ├── Inspection   (a visit: what you saw)
 │     ├── Task         (something to do, with a due date)
 │     ├── Event        (append-only fact: requeened, split, died, moved…)
 │     ├── Harvest      (honey/wax taken off)
 │     └── Treatment    (varroa or disease treatment applied)
 │
 └── Placement (hive ↔ apiary, time-bounded — where a hive lived, and when)

ApiaryShare (apiary ↔ user — grants another beekeeper access via a scope)
```

Une ruche appartient à un seul rucher à la fois, mais **Placement** enregistre
l'historique complet des emplacements où une ruche a vécu, de sorte qu'une ruche
peut se déplacer d'un terrain à l'autre sans perdre ses enregistrements.

## Entités et champs clés

Chaque entité partage une enveloppe commune utilisée par la synchronisation : un
`id` stable (un UUID généré hors ligne), un `scope_id` (voir **Scopes**), des
colonnes de gestion HLC, et un indicateur de suppression douce. Les champs
ci-dessous sont ceux qui ont un sens métier.

### Apiary

Le conteneur et l'unité de partage.

| Champ | Notes |
|---|---|
| `id` | UUID |
| `name` | par ex. « Rucher de la maison » |
| `location` | texte libre ou latitude/longitude |
| `notes` | texte libre |
| `scope_id` | égale l'`id` propre du rucher (voir ci-dessous) |

### Hive

Le logement d'une colonie au sein d'un rucher.

| Champ | Notes |
|---|---|
| `id` | UUID ; également encodé dans l'[étiquette QR de la ruche](/using-the-app/qr-labels) |
| `apiary_id` | rucher actuel (le placement actif) |
| `name` / `short_code` | étiquette lisible et code court imprimé sur le QR |
| `type` | l'un de Zander, Dadant, Deutsch Normal, Langstroth, Warre, Top-bar, Other — voir [Types de ruches](/knowledge-base/hive-types) |
| `status` | par ex. active, morte, vendue |
| `notes` | texte libre |
| `scope_id` | l'id du rucher |

### Queen

La reine régnante d'une ruche. Les reines forment une **succession** : lorsqu'une
colonie est remérée, la reine précédente est clôturée et un nouvel enregistrement
s'ouvre, ce qui permet de conserver la lignée complète.

| Champ | Notes |
|---|---|
| `id` | UUID |
| `hive_id` | la ruche qu'elle dirige |
| `year` | année d'introduction / de naissance |
| `marking_colour` | suit le [code couleur international](/knowledge-base/queen-marking-colours) (1/6 blanc, 2/7 jaune, 3/8 rouge, 4/9 vert, 5/0 bleu) |
| `origin` | élevée, achetée, essaim, supersédure… |
| `clipped` | aile coupée (booléen) |
| `scope_id` | l'id du rucher de sa ruche |

### Inspection

Une visite datée : l'instantané de ce que vous avez observé.

| Champ | Notes |
|---|---|
| `id`, `hive_id`, `date` | qui et quand |
| `brood`, `stores`, `temperament` | observations typiques |
| `queen_seen`, `eggs_seen`, `queen_cells` | vérifications rapides |
| `varroa_count` | chute / comptage de varroas si effectué |
| `temp_hive`, `temp_outside` | température (°C) à l'intérieur de la ruche et à l'extérieur |
| `humidity_hive`, `humidity_outside` | humidité relative (%) à l'intérieur de la ruche et à l'extérieur |
| `notes` | texte libre |
| `scope_id` | l'id du rucher |

Les champs climatiques sont de simples scalaires optionnels ; ils sont donc
synchronisés champ par champ comme toute autre colonne et peuvent être remplis à
la main ou par un capteur automatisé — voir
[Trackers automatisés](/using-the-api/automated-trackers).

### Task

Quelque chose à faire pour une ruche ou un rucher, avec une date d'échéance et un
état d'achèvement.

| Champ | Notes |
|---|---|
| `id` | UUID |
| `hive_id` / `apiary_id` | le sujet (une tâche peut cibler l'un ou l'autre niveau) |
| `title`, `due_date`, `done` | l'essentiel |
| `scope_id` | l'id du rucher |

### Event

Un fait en **ajout seul** concernant une ruche — remérée, divisée, essaimée,
morte, déplacée, nourrie. Les événements ne sont jamais modifiés ni fusionnés ;
ils ne font que s'accumuler, ce qui explique qu'ils n'entrent jamais en conflit
lors de la synchronisation. Ils constituent l'épine dorsale de la chronologie de
la ruche.

| Champ | Notes |
|---|---|
| `id`, `hive_id`, `occurred_at` | quand cela s'est produit |
| `kind` | le type d'événement |
| `payload` | détail spécifique au type (JSON) |
| `scope_id` | l'id du rucher |

Voir [Historique et événements](/developers/history-and-events) pour le catalogue
complet des événements et la manière dont la chronologie est assemblée.

### Harvest

Le miel (ou la cire) récolté sur une ruche.

| Champ | Notes |
|---|---|
| `id`, `hive_id`, `date` | la récolte |
| `product` | miel, cire, propolis… |
| `quantity`, `unit` | par ex. 12.5 kg |
| `notes` | par ex. miellée, humidité |
| `scope_id` | l'id du rucher |

### Treatment

Un traitement contre le varroa ou une maladie appliqué à une ruche.

| Champ | Notes |
|---|---|
| `id`, `hive_id`, `date` | sujet et date d'application |
| `product`, `active_ingredient` | par ex. Oxuvar / acide oxalique |
| `dose`, `method` | par ex. 50 ml, dégouttement |
| `batch_number` | lot / charge (souvent exigé par la loi) |
| `withdrawal_until` | date à laquelle le miel peut à nouveau être récolté sans danger |
| `reason` | par ex. varroa |
| `note` | texte libre |
| `apiary_id`, `queen_id` | contexte figé au moment de l'application |
| `scope_id` | l'id du rucher |

:::note
Les règles de traitement et de dosage varient selon le pays et l'homologation du
produit. Openbeehive enregistre ce que vous avez fait ; il ne prescrit rien.
Respectez toujours vos autorisations locales — voir [Varroa](/beekeeping/varroa).
:::

### Placement

Le lien limité dans le temps entre une ruche et un rucher : où une ruche a vécu
et pendant combien de temps. Un nouveau placement s'ouvre lorsqu'une ruche se
déplace ; le précédent se clôture.

| Champ | Notes |
|---|---|
| `id`, `hive_id`, `apiary_id` | le lien |
| `from` / `until` | intervalle ; `until` est null tant que le placement est en cours |
| `scope_id` | l'id du rucher |

### ApiaryShare

Accorde à un autre apiculteur l'accès à un rucher (et à tout ce qu'il contient).

| Champ | Notes |
|---|---|
| `id`, `apiary_id` | ce qui est partagé |
| `user_id` | avec qui c'est partagé |
| `role` | par ex. lecteur, éditeur |

## Scopes et contrôle de la synchronisation

Le partage se fait au niveau du **rucher**, et une seule valeur le pilote :
chaque enregistrement porte un `scope_id`.

- Pour les données appartenant à un rucher — ruches, reines, inspections, tâches,
  événements, récoltes, traitements, placements, et le rucher lui-même — le
  `scope_id` est l'**id du rucher**.
- Pour les données qui appartiennent à un seul utilisateur et ne sont jamais
  partagées (par ex. les préférences personnelles), le `scope_id` prend la forme
  `user:<id>`.

Lorsque deux appareils se synchronisent, ils n'échangent que les scopes auxquels
l'utilisateur a droit. Le serveur résout l'ensemble des scopes d'un utilisateur
ainsi :

```text
scopes(user) = { "user:<their id>" }
             ∪ { apiary.id  for each apiary they own }
             ∪ { share.apiary_id  for each ApiaryShare granting them access }
```

Ajouter un `ApiaryShare` fait donc apparaître un rucher entier — chaque ruche et
chaque enregistrement qu'il contient — sur les appareils du destinataire lors de
la prochaine synchronisation ; le révoquer empêche les changements ultérieurs de
circuler. Comme le contrôle repose sur la colonne `scope_id`, le partage est tout
ou rien par rucher et ne nécessite aucune autorisation par enregistrement.

:::tip
Un id de ruche à lui seul n'accorde aucun accès. Scanner une [étiquette QR](/developers/qr-codes)
ouvre l'application sur une ruche uniquement si le scope de cette ruche a
effectivement été synchronisé sur votre appareil.
:::

## Pourquoi la fusion se fait proprement

Les structures ci-dessus sont conçues pour que la synchronisation n'ait jamais
besoin d'un humain pour résoudre un conflit :

- Les **champs scalaires** (la couleur de marquage d'une reine, le nom d'une
  ruche) utilisent le principe du dernier écrivain gagne, champ par champ,
  déterminé par les horodatages HLC.
- Les **champs de type liste/ensemble** utilisent des OR-Sets « add-wins », de
  sorte que les ajouts concurrents sont tous conservés.
- Les **événements** sont en ajout seul et immuables ; ils s'accumulent donc
  simplement.

Pour l'algorithme complet, poursuivez avec le [protocole de synchronisation](/developers/sync-protocol).
