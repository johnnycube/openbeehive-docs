---
sidebar_position: 10
title: "Hors ligne et synchronisation"
---

# Hors ligne et synchronisation

Openbeehive est conçu pour le rucher, pas pour le bureau. Sur le terrain, vous avez
rarement un réseau fiable, c'est pourquoi l'application fonctionne en **mode hors
ligne d'abord** : tout ce que vous faites est enregistré immédiatement sur votre
appareil et synchronisé avec le serveur plus tard, discrètement, en arrière-plan.

En pratique, cela signifie que l'application ne vous fait jamais attendre le réseau.
Ouvrez une ruche, consignez une inspection, ajoutez une tâche, prenez une note sur
la reine, tout cela est instantané, avec ou sans réseau.

## Tout est enregistré localement

Lorsque vous installez Openbeehive, il conserve une copie complète de vos
enregistrements dans une petite base de données sur votre appareil. Chaque lecture
et chaque écriture s'effectue d'abord sur cette copie locale.

Le résultat :

- **C'est rapide.** Ouvrir une ruche ou faire défiler les inspections ne reste
  jamais bloqué sur une barre de chargement.
- **Cela fonctionne sans réseau.** Un bois, une vallée, une cave pleine de hausses,
  cela ne fait aucune différence.
- **Vos données vous appartiennent.** Les enregistrements vivent sur votre appareil ;
  le serveur est une copie pour la synchronisation et le partage, et non le seul
  foyer de vos données.

:::tip
Parce que les enregistrements sont stockés sur l'appareil, il vaut la peine
d'installer Openbeehive comme une application plutôt que de l'utiliser dans un
onglet de navigateur. Consultez
[Installer Openbeehive](/using-the-app/install) pour savoir comment l'ajouter à
votre téléphone, votre tablette ou votre ordinateur.
:::

## La bannière hors ligne

Lorsque l'application ne peut pas joindre le serveur, une petite bannière apparaît
pour vous faire savoir que vous travaillez hors ligne. C'est purement informatif,
vous pouvez continuer exactement comme avant. Continuez à consigner des inspections,
à cocher des tâches, à enregistrer une récolte ; rien n'est bloqué.

Dès que votre appareil est de nouveau en ligne, la bannière disparaît et toutes les
modifications que vous avez effectuées hors ligne sont envoyées automatiquement. Il
n'y a pas de bouton « synchroniser maintenant » à retenir ni de risque d'oublier
d'enregistrer.

:::note
Une bannière hors ligne persistante signifie généralement simplement une couverture
faible au rucher. Si elle reste affichée même avec une bonne connexion à la maison,
jetez un œil au [Dépannage](/knowledge-base/troubleshooting).
:::

## Synchroniser entre vos appareils

Vous pouvez utiliser Openbeehive sur plusieurs appareils, par exemple un téléphone
sur le terrain et un ordinateur portable à la maison, et ils resteront synchronisés
automatiquement.

Chaque appareil conserve sa propre copie locale et échange les modifications avec le
serveur en arrière-plan. Consignez une inspection sur votre téléphone aux ruches, et
au moment où vous vous asseyez devant votre ordinateur portable, elle y est déjà.
Les modifications circulent dans les deux sens.

Vous n'avez pas à choisir un appareil « principal » ni à copier quoi que ce soit à
la main. Tant que chaque appareil se connecte au même compte, ils voient tous les
mêmes enregistrements.

## Que se passe-t-il quand deux appareils modifient la même chose

C'est la question que pose chaque apiculteur, et la réponse rassurante est : vous
n'avez pas à y penser. Openbeehive résout les modifications qui se chevauchent
**automatiquement**, sans invites du type « quelle version voulez-vous garder ? » et
sans perte de travail.

Quelques exemples de son comportement :

- **Vous modifiez les notes d'une ruche sur votre téléphone, votre coapiculteur
  modifie les mêmes notes sur le sien.** La modification la plus récente de ce champ
  l'emporte ; l'autre est remplacée proprement.
- **Vous ajoutez tous deux des tâches, ou marquez tous deux la ruche, hors ligne.**
  Les ajouts aux listes sont conservés, de sorte que la tâche ou le marquage de
  personne n'est perdu.
- **Vous consignez chacun une inspection distincte.** Les inspections, les événements
  et les enregistrements similaires ne sont jamais qu'ajoutés, jamais écrasés, de
  sorte que les deux sont conservés côte à côte.

Le résultat est que chaque appareil converge vers le même état, cohérent et sensé,
une fois qu'ils se sont tous synchronisés, et vous n'obtenez jamais d'enregistrement
corrompu ou à moitié fusionné.

:::tip
La version courte : **ajoutez librement, modifiez en toute confiance, ne vous
inquiétez jamais de perdre des données.** Si vous êtes curieux de savoir comment cela
fonctionne réellement sous le capot, les pages
[protocole de synchronisation](/developers/sync-protocol) et
[architecture](/developers/architecture) l'expliquent en détail.
:::

## Partager un rucher

Openbeehive partage les enregistrements au niveau du **rucher**. Lorsque vous
partagez un rucher, tout ce qu'il contient, ses ruches, reines, inspections, tâches,
événements, récoltes et traitements, est partagé avec lui. Cela garde les choses
simples : vous accordez l'accès à un emplacement, et non à des dizaines de ruches
individuelles.

Chaque personne avec qui vous partagez se voit attribuer un rôle :

| Rôle | Ce qu'elle peut faire |
| --- | --- |
| **Observateur** | Voir le rucher et tous ses enregistrements. Ne peut pas effectuer de modifications. |
| **Apiculteur** | Voir et modifier : consigner des inspections, terminer des tâches, enregistrer des récoltes et des traitements, mettre à jour les ruches et les reines. |
| **Propriétaire** | Tout ce qu'un apiculteur peut faire, plus gérer le rucher lui-même et avec qui il est partagé. |

Cela fonctionne bien pour un rucher école d'association, un mentor gardant un œil sur
les ruches d'un nouvel apiculteur, ou simplement deux personnes partageant le travail
sur le même emplacement. Les enregistrements partagés se synchronisent et résolvent
les conflits exactement de la même manière que les vôtres, de sorte que les
modifications d'un partenaire apparaissent sur vos appareils automatiquement.

:::note
Le partage se fait par rucher, vous pouvez donc partager un emplacement avec un
mentor tout en gardant les autres entièrement privés.
:::

## Vais-je un jour perdre des données ?

Non. Vos enregistrements sont d'abord écrits sur votre appareil et ne sont pas
supprimés simplement parce que vous êtes hors ligne ou parce que l'application se
ferme. Ils attendent en sécurité sur l'appareil jusqu'à ce qu'ils puissent être
synchronisés, puis se synchronisent d'eux-mêmes.

Pour une tranquillité d'esprit supplémentaire, en particulier si vous auto-hébergez,
il reste de bonne pratique de conserver des sauvegardes serveur. Consultez
[Sauvegardes](/self-hosting/backups) pour savoir comment.

## Pages associées

- [Installer Openbeehive](/using-the-app/install)
- [Étiquettes QR](/using-the-app/qr-labels)
- [Architecture](/developers/architecture)
- [Protocole de synchronisation](/developers/sync-protocol)
