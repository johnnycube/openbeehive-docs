---
sidebar_position: 7
title: "Authentification"
---

# Authentification

Openbeehive vous laisse choisir exactement le niveau d'authentification dont vous avez besoin. Un apiculteur seul qui exécute le binaire unique chez lui peut se passer complètement de connexion. Une instance partagée peut exiger des clés d'accès, une connexion via un fournisseur d'identité, ou les deux.

Cette page couvre les trois modes, les paramètres de session que toute configuration multi-utilisateurs nécessite, et la manière de configurer l'URL de redirection de votre fournisseur d'identité.

:::note
L'authentification protège l'accès au *serveur* et à son API de synchronisation. L'application elle-même reste « offline-first » : une fois connecté, votre appareil continue à lire et écrire localement et se synchronise en arrière-plan. Voir [Hors ligne et synchronisation](/using-the-app/offline-and-sync).
:::

## Choisir un mode

| Mode | Quand l'utiliser | Paramètres clés |
| --- | --- | --- |
| Sans connexion (utilisateur unique) | Une seule personne, un seul serveur, derrière votre propre réseau ou un proxy inverse de confiance | `BEEHIVE_OIDC_PROVIDERS` vide **et** `BEEHIVE_WEBAUTHN_ENABLED=false` |
| E-mail et mot de passe (comptes intégrés) | Une instance partagée où les personnes s'inscrivent elles-mêmes — aucun fournisseur d'identité externe nécessaire | `BEEHIVE_PASSWORD_AUTH=true` (activé par défaut pour le profil `cloud`) |
| Clés d'accès (WebAuthn) | Un petit groupe ; connexion sans mot de passe avec la biométrie de l'appareil ou des clés de sécurité | `BEEHIVE_WEBAUTHN_ENABLED=true` plus `WEBAUTHN_RP_*` |
| Fournisseurs OIDC | Vous disposez déjà de Google, Keycloak, Authentik, etc., ou vous souhaitez un contrôle centralisé des comptes | `BEEHIVE_OIDC_PROVIDERS` plus les paramètres propres à chaque fournisseur |

Vous pouvez combiner toutes ces méthodes. L'écran de connexion propose celles qui sont activées, et le compte d'une personne est partagé entre les méthodes — se connecter avec un fournisseur lie le compte à un compte e-mail/mot de passe existant ayant la même adresse e-mail.

## Mode 1 : utilisateur unique, sans connexion

C'est la configuration la plus simple et le point de départ par défaut d'une instance `selfhost`. Laissez les deux options désactivées :

```bash
BEEHIVE_OIDC_PROVIDERS=
BEEHIVE_WEBAUTHN_ENABLED=false
```

Sans aucune méthode d'authentification activée, Openbeehive fonctionne comme une instance mono-utilisateur et ne demande pas de connexion. C'est idéal pour un amateur qui exécute le [binaire unique](/self-hosting/single-binary) sur une machine domestique ou derrière un réseau privé.

:::caution
« Sans connexion » signifie que toute personne pouvant atteindre le serveur peut lire et modifier vos enregistrements. Utilisez ce mode uniquement sur un réseau de confiance, sur `localhost`, ou derrière un proxy inverse qui gère lui-même l'accès. Si votre instance est accessible depuis Internet, activez les clés d'accès ou OIDC.
:::

## Paramètres de session (requis dès qu'une connexion est activée)

Dès que vous activez les clés d'accès ou OIDC, le serveur émet des cookies de session signés. Vous devez fournir un secret de session.

```bash
# Générer un secret aléatoire robuste
openssl rand -base64 32
```

Définissez le résultat dans `BEEHIVE_SESSION_SECRET`, et ajustez éventuellement la durée des sessions :

```bash
BEEHIVE_SESSION_SECRET=PUT_YOUR_GENERATED_SECRET_HERE
BEEHIVE_SESSION_TTL=720h
```

`BEEHIVE_SESSION_TTL` accepte une durée Go (par exemple `720h` correspond à 30 jours, `24h` à un jour). À son expiration, les utilisateurs se reconnectent.

:::danger
Gardez `BEEHIVE_SESSION_SECRET` secret et stable. Quiconque en prend connaissance peut falsifier des sessions. Si vous le modifiez, toutes les sessions existantes sont invalidées et chacun doit se reconnecter. Ne le validez jamais dans un système de gestion de versions.
:::

Si vous servez l'application via HTTPS à travers un proxy inverse, assurez-vous que `BEEHIVE_PUBLIC_BASE_URL` utilise `https://` afin que les cookies et les URL de redirection soient corrects. Voir [Proxy inverse](/self-hosting/reverse-proxy).

## E-mail et mot de passe (comptes intégrés)

Lorsque vous voulez plusieurs utilisateurs sans exécuter de fournisseur d'identité, activez les comptes
e-mail/mot de passe intégrés :

```bash
BEEHIVE_PASSWORD_AUTH=true
```

Cette option est **activée par défaut pour le profil `cloud`** et désactivée pour `selfhost`. Une fois
activée, l'écran de connexion propose « créer un compte » et « se connecter », et les personnes peuvent
[s'inscrire elles-mêmes](/using-the-app/accounts-tenants).

### Instances sur invitation uniquement

Si vous ne voulez pas que des inconnus créent des comptes, réglez `BEEHIVE_REGISTRATION=false`
pour fermer l'inscription libre. La configuration de l'administrateur au premier démarrage
fonctionne toujours, de sorte qu'une instance neuve peut toujours créer son compte administrateur.
Ensuite, les nouvelles personnes ne peuvent rejoindre l'instance que via des liens d'invitation,
qu'un administrateur de locataire émet depuis les Paramètres et qui doivent correspondre à
l'adresse e-mail invitée. L'écran de connexion affiche un avis indiquant que l'instance est
sur invitation uniquement.

**Le premier compte est celui de l'administrateur.** Sur une instance neuve, la première personne à
s'inscrire devient l'administrateur de l'instance ; toutes les suivantes sont des utilisateurs ordinaires. Chaque
nouveau compte démarre avec son propre [locataire](/using-the-app/accounts-tenants) personnel.

### Vérification facultative de l'e-mail

Par défaut, un nouveau compte peut se connecter immédiatement. Pour exiger des personnes qu'elles confirment
d'abord leur adresse e-mail, activez la vérification :

```bash
BEEHIVE_EMAIL_VERIFICATION=true
```

Le compte ne peut alors pas se connecter tant qu'il n'a pas suivi le lien de vérification. Configurez
le SMTP pour que l'e-mail soit réellement envoyé :

```bash
BEEHIVE_SMTP_HOST=smtp.example.com
BEEHIVE_SMTP_PORT=587
BEEHIVE_SMTP_USER=postbox@example.com
BEEHIVE_SMTP_PASS=your-smtp-password
BEEHIVE_SMTP_FROM=Openbeehive <no-reply@example.com>
```

:::note
Si `BEEHIVE_SMTP_HOST` est laissé vide, Openbeehive écrit le lien de vérification dans
le journal du serveur au lieu de l'envoyer par e-mail — pratique pour les tests, mais pas pour la
production.
:::

## Mode 2 : clés d'accès (WebAuthn)

Les clés d'accès permettent aux personnes de se connecter avec une empreinte digitale, une reconnaissance faciale, un code PIN de l'appareil ou une clé de sécurité matérielle. Il n'y a aucun mot de passe à gérer.

```bash
BEEHIVE_WEBAUTHN_ENABLED=true
BEEHIVE_WEBAUTHN_RP_ID=beehive.example.com
BEEHIVE_WEBAUTHN_RP_ORIGINS=https://beehive.example.com
BEEHIVE_WEBAUTHN_RP_DISPLAY_NAME=Openbeehive
```

Signification de chaque valeur :

- `BEEHIVE_WEBAUTHN_RP_ID` est l'**identifiant de la partie de confiance** : le domaine enregistrable que les utilisateurs visitent, sans schéma ni port (par exemple `beehive.example.com`, ou `localhost` pour des tests locaux). Les clés d'accès sont liées à ce domaine.
- `BEEHIVE_WEBAUTHN_RP_ORIGINS` est l'origine complète (ou les origines séparées par des virgules) que le navigateur enverra, schéma et port éventuel compris, par exemple `https://beehive.example.com`.
- `BEEHIVE_WEBAUTHN_RP_DISPLAY_NAME` est le nom convivial affiché dans l'invite de clé d'accès du navigateur.

:::caution
WebAuthn nécessite un **contexte sécurisé**. Les clés d'accès fonctionnent via HTTPS, ou via `http://localhost` pour le développement, mais pas via du HTTP simple sur une adresse distante. Placez le serveur derrière TLS avant d'activer les clés d'accès en production. Le `RP_ID` doit correspondre au domaine de votre `BEEHIVE_PUBLIC_BASE_URL`.
:::

## Mode 3 : fournisseurs OIDC

Connectez Openbeehive à un ou plusieurs fournisseurs d'identité OpenID Connect. Indiquez ceux que vous voulez, séparés par des virgules, et configurez chacun par son nom.

:::note Les comptes se lient automatiquement
Lorsqu'une personne se connecte via un fournisseur, Openbeehive trouve ou crée son
compte intégré : il fait d'abord correspondre l'identité du fournisseur, puis l'**adresse e-mail**
(en liant un compte e-mail/mot de passe existant à ce fournisseur), et sinon
enregistre un nouveau compte. Une personne peut donc se connecter indifféremment avec un fournisseur ou avec un e-mail
et un mot de passe, et le premier compte de l'instance est celui de l'administrateur.
:::

```bash
BEEHIVE_OIDC_PROVIDERS=google,keycloak
BEEHIVE_OIDC_REDIRECT_URL=https://beehive.example.com/auth/callback
```

`BEEHIVE_OIDC_REDIRECT_URL` est l'adresse vers laquelle votre fournisseur renvoie les utilisateurs après leur authentification. Elle doit être accessible par le navigateur et correspondre exactement à ce que vous enregistrez auprès du fournisseur (voir ci-dessous).

### Google

```bash
BEEHIVE_OIDC_GOOGLE_ISSUER=https://accounts.google.com
BEEHIVE_OIDC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
BEEHIVE_OIDC_GOOGLE_CLIENT_SECRET=your-client-secret
BEEHIVE_OIDC_GOOGLE_SCOPES=openid,email,profile
```

Créez le client dans la Google Cloud Console sous **APIs & Services -> Credentials -> OAuth client ID** (type : Web application).

### Keycloak et Authentik

Keycloak, Authentik et les autres fournisseurs conformes aux normes utilisent les variables génériques propres à chaque fournisseur. Le nom du fournisseur dans `BEEHIVE_OIDC_PROVIDERS` correspond au préfixe de la variable.

```bash
BEEHIVE_OIDC_PROVIDERS=keycloak
BEEHIVE_OIDC_KEYCLOAK_ISSUER=https://id.example.com/realms/main
BEEHIVE_OIDC_KEYCLOAK_CLIENT_ID=openbeehive
BEEHIVE_OIDC_KEYCLOAK_CLIENT_SECRET=your-client-secret
```

L'émetteur est l'URL de base du realm ; Openbeehive découvre le reste à partir de `<issuer>/.well-known/openid-configuration`. Authentik fonctionne de la même manière en utilisant l'URL de configuration OpenID de son application comme émetteur.

:::tip
Le préfixe de la variable est simplement le nom du fournisseur en majuscules. Pour ajouter un autre fournisseur, ajoutez son nom à `BEEHIVE_OIDC_PROVIDERS` et fournissez les `BEEHIVE_OIDC_<NAME>_ISSUER`, `BEEHIVE_OIDC_<NAME>_CLIENT_ID` et `BEEHIVE_OIDC_<NAME>_CLIENT_SECRET` correspondants.
:::

### Enregistrer l'URL de redirection auprès de votre IdP

Dans la configuration du client de votre fournisseur, ajoutez une URI de redirection autorisée qui correspond à `BEEHIVE_OIDC_REDIRECT_URL` caractère pour caractère :

```text
https://beehive.example.com/auth/callback
```

Pièges courants :

- Le schéma doit correspondre (`https` en production, pas `http`).
- Pas de barre oblique finale, sauf si votre `BEEHIVE_OIDC_REDIRECT_URL` en comporte une.
- Utilisez votre domaine public, et non un nom d'hôte interne ou `localhost`, sauf si vous testez en local.

Si la connexion échoue avec une erreur de non-correspondance de redirection, c'est que la valeur enregistrée auprès de l'IdP et la valeur de `BEEHIVE_OIDC_REDIRECT_URL` diffèrent quelque part.

## Vérifier votre configuration

Après avoir modifié l'un de ces paramètres, redémarrez le serveur et chargez l'application dans un navigateur :

1. **Sans connexion**, le tableau de bord s'ouvre directement.
2. Avec les **clés d'accès ou OIDC**, vous devriez voir un écran de connexion proposant chaque méthode activée.
3. Effectuez une connexion et confirmez que vous accédez au tableau de bord et que les enregistrements se synchronisent.

Si quelque chose ne fonctionne pas, consultez les journaux du serveur et le guide de [Dépannage](/knowledge-base/troubleshooting). Pour la liste complète des paramètres, voir [Configuration](/self-hosting/configuration).
