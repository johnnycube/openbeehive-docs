---
sidebar_position: 5
title: "Inspections (visites)"
---

# Inspections (visites)

Une inspection est le compte rendu d'une seule visite à une ruche : ce que vous avez observé, ce que vous avez fait et tout ce qui mérite d'être retenu pour la prochaine fois. Au fil d'une saison, ces visites construisent un récit clair de l'évolution de chaque colonie.

Comme Openbeehive fonctionne en mode hors ligne d'abord, vous pouvez tout enregistrer au rucher sans aucun signal. Les saisies sont sauvegardées instantanément sur votre appareil et se synchronisent avec le serveur en arrière-plan dès que vous êtes de nouveau à portée. Consultez [Hors ligne et synchronisation](/using-the-app/offline-and-sync) pour découvrir comment cela fonctionne.

:::tip
Pour savoir _quoi_ rechercher pendant une visite et à quelle fréquence inspecter, lisez [Inspecter une colonie](/beekeeping/inspecting). Cette page explique comment l'enregistrer.
:::

## Démarrer une inspection

Ouvrez une ruche et appuyez sur **Ajouter une inspection** (ou scannez l'[étiquette QR](/using-the-app/qr-labels) de la ruche pour y accéder directement). Une nouvelle visite est créée et horodatée à la date et à l'heure actuelles.

Chaque champ est facultatif. Enregistrez autant ou aussi peu que vous le souhaitez — un rapide « tout va bien » est une saisie parfaitement valable.

## Date et météo

| Champ | Remarques |
| --- | --- |
| Date | Par défaut, l'instant présent ; modifiez-la si vous consignez une visite passée. |
| Météo | Les conditions du moment, par exemple ensoleillé, couvert, venteux. Un contexte utile, car les abeilles se comportent différemment par mauvais temps. |

## Colonie et comportement

Cette section saisit l'état de la colonie le jour même.

| Champ | Ce qu'il enregistre |
| --- | --- |
| Reine vue | Si vous avez réellement repéré la reine. |
| Œufs vus | Les œufs sont le meilleur signe rapide d'une reine ayant pondu récemment. |
| Couvain operculé | Si du couvain d'ouvrières operculé est présent. |
| Plus jeune larve | Le stade de couvain le plus jeune que vous avez trouvé — un signal plus fin d'une ponte récente. |
| Cadres occupés | Combien de cadres les abeilles couvrent. |
| Cadres de couvain | Combien de cadres contiennent du couvain. |
| Réserves de nourriture | Votre appréciation des réserves : faibles, suffisantes ou abondantes. |
| Cellules d'essaimage | Si des cellules royales suggérant une préparation à l'essaimage sont présentes. |
| Douceur | À quel point la colonie est calme dans l'ensemble. |
| Calme sur le rayon | Si les abeilles se tiennent tranquillement sur le rayon ou si elles courent et bouillonnent. |
| Comptage varroa | Comptage d'acariens à partir d'un lange ou d'un lavage, si vous en avez fait un. |

:::note
Vous remplirez rarement tous les champs à chaque visite. Le trio « reine vue / œufs vus / plus jeune larve » suffit généralement à confirmer la présence d'une reine pondeuse en bonne santé sans avoir à la retrouver à chaque fois.
:::

## Activités lors de la visite

Enregistrez tout ce que vous avez fait pendant que la ruche était ouverte. Ces activités alimentent aussi les registres plus larges de la ruche — par exemple, le miel prélevé peut alimenter les [Récoltes](/using-the-app/harvests).

| Activité | Enregistre |
| --- | --- |
| Nourrissement | Quantité nourrie, en kg. |
| Cadres ajoutés / retirés | Cadres que vous avez mis en place ou retirés. |
| Cadre à mâles découpé | Si vous avez découpé un cadre de couvain de mâles (une mesure de contrôle du varroa). |
| Hausse ajoutée | Si vous avez ajouté une hausse pour le stockage du miel. |
| Poids de la ruche | Le poids pesé de la ruche, si vous le suivez. |
| Miel récolté | Miel prélevé lors de cette visite. |

Pour une vue d'ensemble sur la gestion des acariens et la récolte, consultez [Varroa](/beekeeping/varroa) et [Récolte du miel](/beekeeping/honey-harvest).

## Climat : température et humidité

Chaque inspection peut enregistrer la température et l'humidité relative, à la fois **à l'intérieur de la
ruche** et **à l'extérieur** — utile pour suivre la chaleur du nid à couvain, la ventilation et
l'hivernage.

| Champ | Enregistre | Unité |
| --- | --- | --- |
| Température de la ruche | Température à l'intérieur de la ruche | °C |
| Température extérieure | Température ambiante au rucher | °C |
| Humidité de la ruche | Humidité relative à l'intérieur de la ruche | % |
| Humidité extérieure | Humidité relative extérieure | % |

Les quatre sont facultatifs — renseignez ce que vous avez mesuré. Au fil du temps, ils apparaissent dans les
**graphiques de développement** de la ruche, aux côtés du poids et de la force de la colonie.

:::tip Laissez les capteurs s'en charger
Vous n'avez pas besoin de saisir ces valeurs. Une balance de ruche ou une sonde de température/humidité peut
transmettre des relevés automatiquement via l'API — voir
[Trackers automatisés](/using-the-api/automated-trackers).
:::

## Notes et photos

Ajoutez des **notes** en texte libre pour tout ce que les champs structurés ne couvrent pas — une cellule de supersédure repérée, un caractère à surveiller, un rappel pour remérer.

Joignez des **photos** pour capturer les motifs de couvain, une maladie suspectée ou des cellules royales. Les images sont stockées avec la visite et se synchronisent avec le reste de vos registres.

:::tip
Si quelque chose nécessite un suivi, créez une [Tâche](/using-the-app/tasks) à partir de la visite pour ne pas l'oublier.
:::

## Le journal de visites par ruche

Chaque inspection est conservée, jamais écrasée. Sur la page de la ruche, vous disposez d'un **journal de visites** chronologique — l'historique complet de cette colonie, les plus récentes en premier.

Ce journal vous permet de repérer les tendances d'un coup d'œil : le couvain qui se développe au printemps, les réserves qui s'épuisent avant l'hiver, un comptage varroa en hausse ou un problème de caractère qui s'installe. Comme chaque visite est un événement en ajout seul, la synchronisation entre appareils ne perd ni n'entre jamais en conflit avec un enregistrement.

## Conseils pour une saisie rapide sur le terrain

Les inspections se font gants enfilés, en plein soleil, avec des abeilles dans l'air. Quelques habitudes permettent de garder la saisie rapide :

- **Scannez l'étiquette QR** pour ouvrir instantanément la bonne ruche — sans faire défiler une liste.
- **Consignez au fur et à mesure.** Renseignez les champs entre les cadres plutôt que d'essayer de tout mémoriser après coup.
- **Appuyez-vous sur le trio rapide.** Œufs vus, plus jeune larve et couvain operculé confirment une reine pondeuse plus vite que de partir à sa recherche.
- **Utilisez la voix ou des notes courtes.** Déposez une brève note maintenant ; peaufinez-la plus tard, au calme à la maison.
- **Ne vous souciez pas des blancs.** Les champs vides ne posent pas de problème. N'enregistrez que ce que vous avez vérifié.
- **Photographiez ce qui est douteux.** Une photo d'un motif de couvain inhabituel ou d'une cellule royale vaut mieux qu'une description tapée.

:::caution
Si vous soupçonnez une maladie à déclaration obligatoire telle que la loque américaine ou européenne, photographiez-la, refermez et suivez les règles de signalement locales. Les obligations de déclaration varient selon le pays et la région. Consultez [Maladies et nuisibles](/knowledge-base/diseases-and-pests).
:::

---

Voir aussi : [Inspecter une colonie](/beekeeping/inspecting) pour la technique de terrain, et [Ruches](/using-the-app/hives) pour l'emplacement du journal de visites.
