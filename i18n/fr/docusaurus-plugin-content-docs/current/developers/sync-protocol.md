---
sidebar_position: 4
title: "Protocole de synchronisation"
---

# Protocole de synchronisation

Openbeehive est [offline-first](/using-the-app/offline-and-sync). Chaque lecture et écriture se produit
sur une base de données SQLite-WASM locale sur l'appareil, et un processus
d'arrière-plan réconcilie cet état local avec le serveur. Cette page documente le
protocole filaire qui fait fonctionner la réconciliation : le service Connect-RPC,
ses trois méthodes, et les règles que les deux côtés appliquent lors de la fusion
des changements.

Si vous n'avez pas encore lu l'[aperçu du modèle de synchronisation](/category/developers), commencez par là.
Cette page suppose que vous savez déjà qu'Openbeehive utilise des horloges
logiques hybrides (HLC), le « dernier écrivain gagne » par champ (LWW) pour les
scalaires, des OR-Sets (« l'ajout gagne ») pour les champs de liste, et des
événements en ajout seul qui n'entrent jamais en conflit.

## Le service

La synchronisation est exposée comme un service Connect-RPC, de sorte que chaque
méthode est accessible à la fois en gRPC et en HTTP/JSON simple. Il y a trois
méthodes :

| Méthode | Direction | Objet |
| --- | --- | --- |
| `Pull` | client ← serveur | Récupérer les changements que le client n'a pas encore vus |
| `Push` | client → serveur | Envoyer les changements locaux au serveur |
| `Subscribe` | serveur → client (flux) | « Coup de pouce » optionnel quasi temps réel lorsque de nouveaux changements arrivent |

Une boucle client typique : `Push` sa file d'attente locale, puis `Pull` tout ce
qui est nouveau, puis attente jusqu'à ce que `Subscribe` la pousse (ou qu'un
minuteur se déclenche) et recommence.

## Les curseurs par rapport à la HLC

L'idée la plus importante de ce protocole est que le **curseur de synchronisation
n'est pas la HLC**.

La HLC est un *horodatage logique* attaché à chaque écriture de champ. Elle décide
*quelle valeur l'emporte* lors d'une fusion — elle répond à « cette modification
est-elle plus récente que celle que j'ai déjà ? ». Les HLC proviennent de nombreux
appareils, peuvent légèrement se désordonner par rapport à l'heure murale, et ne
sont pas globalement monotones dans l'ordre d'arrivée.

Le curseur est une *séquence de réception assignée par le serveur* — un entier
unique, strictement croissant (`seq`) que le serveur estampille sur chaque
changement à mesure qu'il est accepté durablement. Il répond à une question
complètement différente : « qu'ai-je déjà remis à ce client ? ».

Utiliser la séquence de réception comme curseur nous donne deux garanties que la
HLC ne peut pas offrir :

- **Ordre total de livraison.** Parce que `seq` est assigné dans l'ordre où le
  serveur accepte les écritures, un client peut demander « tout ce qui est après
  seq N » et être certain de ne rien manquer, même si ces changements portent des
  HLC désordonnées.
- **Sûreté de rejeu.** Un client peut persister son curseur et reprendre
  exactement là où il s'était arrêté après être passé hors ligne, avoir planté ou
  avoir été réinstallé.

:::note
N'utilisez jamais une HLC comme curseur de pagination. Deux appareils peuvent
légitimement produire la même région de HLC hors ligne, et les HLC ne sont pas
assignées dans l'ordre d'arrivée — paginer par HLC sauterait ou dupliquerait des
changements. Paginez par `seq`, fusionnez par HLC.
:::

## Pull

`Pull` retourne les changements que le client n'a pas vus, dans l'ordre `seq`,
plus le curseur à utiliser la prochaine fois.

```text
Pull(PullRequest { since_cursor: int64, limit: int32 })
  -> PullResponse { changes: Change[], next_cursor: int64, has_more: bool }
```

- `since_cursor` est le dernier curseur que le client a appliqué avec succès.
  Envoyez `0` pour une première synchronisation complète.
- `changes` sont retournés ordonnés par `seq` croissant, restreints aux scopes que
  l'appelant peut lire (voir **Réplication partielle**).
- `next_cursor` est le `seq` le plus élevé inclus dans cette page. Ne le persistez
  qu'après que toute la page a été appliquée localement.
- `has_more` est `true` lorsque le résultat a été tronqué par `limit` ; le client
  devrait immédiatement refaire `Pull` avec le nouveau `next_cursor`.

Un seul `Change` porte assez d'informations pour être fusionné indépendamment :

```json
{
  "entity": "hive",
  "entity_id": "01HZX...",
  "scope_id": "apiary-01HZ...",
  "kind": "field",
  "field": "name",
  "value": "Hive 3 (north row)",
  "hlc": "2026-06-19T09:14:02.117Z-0003-nodeA",
  "seq": 48213
}
```

`kind` distingue les trois stratégies de fusion : `field` (LWW scalaire),
`set_add` / `set_remove` (appartenance à un OR-Set), et `event` (ajout seul).

## Push

`Push` envoie un lot de changements locaux au serveur. Le serveur applique
chacun d'eux avec les mêmes règles de fusion que le client utilise, assigne un
nouveau `seq` à chaque changement accepté, et fait son rapport.

```text
Push(PushRequest { changes: Change[] })
  -> PushResponse { server_cursor: int64, conflicts: Conflict[] }
```

- Le serveur valide que l'appelant peut écrire le `scope_id` de chaque changement.
- Pour chaque changement de `field` scalaire, il applique le LWW par champ : la
  valeur entrante ne l'emporte que si sa HLC est supérieure à la HLC actuellement
  stockée pour ce champ.
- Les opérations d'ensemble sont appliquées comme add/remove d'OR-Set ; les ajouts
  l'emportent sur les suppressions concurrentes.
- Les changements `event` sont ajoutés inconditionnellement — ils n'entrent jamais
  en conflit.
- Chaque changement accepté se voit assigner un nouveau `seq` strictement
  croissant.
- `server_cursor` est le `seq` le plus élevé assigné dans ce lot, de sorte que le
  client peut avancer rapidement sans un aller-retour `Pull` supplémentaire pour
  ses propres écritures.

### Conflits

`conflicts` n'est **pas** une liste d'erreurs — la fusion est toujours
déterministe et réussit toujours. C'est une liste informative de champs où le
serveur détenait déjà une valeur avec une HLC supérieure, de sorte que la valeur
poussée par le client n'a *pas* été adoptée.

```json
{
  "entity_id": "01HZX...",
  "field": "queen_status",
  "rejected_hlc": "2026-06-19T09:13:55.000Z-0001-nodeB",
  "winning_hlc": "2026-06-19T09:14:10.421Z-0007-nodeA"
}
```

Le client devrait traiter un conflit comme un signal pour rafraîchir ce champ lors
du prochain `Pull`, où il recevra la valeur gagnante. Aucune nouvelle tentative
n'est nécessaire.

:::tip
Parce que le LWW est déterministe et ordonné par HLC, `Push` est idempotent :
renvoyer un changement dont la HLC a déjà perdu (ou déjà gagné) laisse l'état du
serveur inchangé. Les clients peuvent réessayer un `Push` en toute sécurité après
une connexion interrompue.
:::

## Subscribe

`Subscribe` est un canal optionnel diffusé par le serveur, utilisé purement comme
signal de réveil. Il ne transporte pas de données.

```text
Subscribe(SubscribeRequest { scopes: string[] })
  -> stream Poke { scope_id: string, server_cursor: int64 }
```

Lorsqu'une écriture arrive dans l'un des scopes lisibles du client, le serveur
émet un `Poke`. Le client répond en appelant `Pull(since_cursor)` comme
d'habitude. Garder les données réelles sur `Pull` signifie que le flux peut être
lacunaire sans affecter la justesse — un poke manqué signifie simplement que le
prochain `Pull` déclenché par minuteur rattrape.

:::note
`Subscribe` est une optimisation de latence, pas une exigence. Un client qui ne
sonde `Pull` que par minuteur est entièrement correct ; il est simplement moins
réactif.
:::

## Réplication partielle par scope
Le partage dans Openbeehive se fait au niveau du **rucher** via des *scopes*. Un
utilisateur ne réplique que les données comprises dans les scopes qu'il peut lire,
pas la base de données entière.

Ceci est appliqué sur `Pull` et `Push` :

- `Pull` filtre `changes` selon les scopes lisibles de l'appelant avant de
  paginer par `seq`. Le curseur avance donc sur une *vue par appelant* de la
  séquence globale — deux utilisateurs partageant un rucher verront les changements
  de ce rucher au même `seq`, tandis que chacun voit également ses propres scopes
  privés.
- `Push` rejette les écritures vers les scopes que l'appelant ne peut pas écrire.

Parce que le curseur est la séquence de réception globale, un client peut voir des
lacunes dans les valeurs `seq` qu'il reçoit (les changements dans les scopes qu'il
ne peut pas lire sont sautés). Les lacunes sont attendues et inoffensives — le
client n'a jamais besoin que du *prochain* curseur pour en demander davantage.

## Logique de fusion en miroir

Les fonctions de fusion — comparaison HLC, LWW par champ, résolution d'OR-Set,
ajout d'événement — sont **identiques sur le client et le serveur**. La même
logique que la PWA SvelteKit exécute lors de l'application d'un `Pull` est la
logique que le backend Go exécute lors de l'application d'un `Push`.

Cette mise en miroir est ce qui rend le système véritablement exempt de conflit
plutôt que simplement résolveur de conflit :

- Un changement produit le même résultat fusionné quel que soit l'*endroit* où il
  est appliqué ou l'*ordre* dans lequel il arrive, de sorte que le client et le
  serveur convergent sans négociation.
- Le serveur n'est pas un arbitre privilégié qui peut écraser l'état des
  appareils ; il applique les mêmes règles déterministes, puis assigne un `seq`
  pour l'ordonnancement.
- Les nouveaux types d'entité n'ont besoin de définir leurs règles de fusion
  qu'une seule fois, dans la sémantique partagée, et les deux côtés les honorent.

Pour les détails sous-jacents de l'horloge et de la structure de données, voir
l'[aperçu de l'architecture](/developers/architecture) et le
[modèle de données](/developers/data-model). Pour la façon dont les événements
s'inscrivent dans le chemin d'ajout seul, voir
[historique et événements](/developers/history-and-events).
