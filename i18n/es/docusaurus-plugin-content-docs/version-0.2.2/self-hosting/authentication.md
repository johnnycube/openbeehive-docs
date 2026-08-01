---
sidebar_position: 7
title: "Autenticacion"
---

# Autenticacion

Openbeehive te permite elegir exactamente cuanta autenticacion necesitas. Un apicultor en solitario que ejecuta el binario unico en casa puede omitir el inicio de sesion por completo. Una instancia compartida puede requerir claves de acceso, inicio de sesion a traves de un proveedor de identidad, o ambos.

Esta pagina cubre los tres modos, los ajustes de sesion que necesita cualquier configuracion multiusuario y como configurar la URL de redireccion de tu proveedor de identidad.

:::note
La autenticacion protege el acceso al *servidor* y a su API de sincronizacion. La aplicacion en si sigue siendo "offline-first": una vez que has iniciado sesion, tu dispositivo sigue leyendo y escribiendo localmente y se sincroniza en segundo plano. Consulta [Sin conexion y sincronizacion](/using-the-app/offline-and-sync).
:::

## Elegir un modo

| Modo | Cuando usarlo | Ajustes clave |
| --- | --- | --- |
| Sin inicio de sesion (un solo usuario) | Una persona, un servidor, detras de tu propia red o de un proxy inverso de confianza | `BEEHIVE_OIDC_PROVIDERS` vacio **y** `BEEHIVE_WEBAUTHN_ENABLED=false` |
| Correo y contrasena (cuentas en la aplicacion) | Una instancia compartida donde la gente se registra por si misma, sin necesidad de un proveedor de identidad externo | `BEEHIVE_PASSWORD_AUTH=true` (activado por defecto para el perfil `cloud`) |
| Claves de acceso (WebAuthn) | Un grupo pequeno; inicio de sesion sin contrasena con datos biometricos del dispositivo o claves de seguridad | `BEEHIVE_WEBAUTHN_ENABLED=true` mas `WEBAUTHN_RP_*` |
| Proveedores OIDC | Ya tienes Google, Keycloak, Authentik, etc., o quieres un control centralizado de cuentas | `BEEHIVE_OIDC_PROVIDERS` mas ajustes por proveedor |

Puedes combinar todos estos metodos. La pantalla de inicio de sesion ofrece los metodos que esten habilitados, y la cuenta de una persona se comparte entre los metodos: iniciar sesion con un proveedor se vincula a una cuenta de correo y contrasena existente con el mismo correo electronico.

## Modo 1: un solo usuario, sin inicio de sesion

Esta es la configuracion mas sencilla y el punto de partida por defecto para una instancia `selfhost`. Deja ambas opciones desactivadas:

```bash
BEEHIVE_OIDC_PROVIDERS=
BEEHIVE_WEBAUTHN_ENABLED=false
```

Sin metodos de autenticacion habilitados, Openbeehive funciona como una instancia de un solo usuario y no solicita el inicio de sesion. Esto es ideal para un aficionado que ejecuta el [binario unico](/self-hosting/single-binary) en una maquina domestica o detras de una red privada.

:::caution
"Sin inicio de sesion" significa que cualquiera que pueda alcanzar el servidor puede leer y editar tus registros. Usalo solo en una red de confianza, en `localhost`, o detras de un proxy inverso que gestione el acceso por si mismo. Si tu instancia es accesible desde internet, habilita las claves de acceso u OIDC.
:::

## Ajustes de sesion (obligatorios una vez habilitado cualquier inicio de sesion)

En cuanto activas las claves de acceso u OIDC, el servidor emite cookies de sesion firmadas. Debes proporcionar un secreto de sesion.

```bash
# Genera un secreto aleatorio robusto
openssl rand -base64 32
```

Establece el resultado como `BEEHIVE_SESSION_SECRET` y, opcionalmente, ajusta cuanto duran las sesiones:

```bash
BEEHIVE_SESSION_SECRET=PUT_YOUR_GENERATED_SECRET_HERE
BEEHIVE_SESSION_TTL=720h
```

`BEEHIVE_SESSION_TTL` acepta una duracion de Go (por ejemplo `720h` son 30 dias, `24h` es un dia). Cuando expira, los usuarios vuelven a iniciar sesion.

:::danger
Manten `BEEHIVE_SESSION_SECRET` en secreto y estable. Cualquiera que lo conozca puede falsificar sesiones. Si lo cambias, todas las sesiones existentes quedan invalidadas y todos deben volver a iniciar sesion. Nunca lo subas al control de versiones.
:::

Si sirves la aplicacion a traves de HTTPS mediante un proxy inverso, asegurate de que `BEEHIVE_PUBLIC_BASE_URL` use `https://` para que las cookies y las URL de redireccion sean correctas. Consulta [Proxy inverso](/self-hosting/reverse-proxy).

## Correo y contrasena (cuentas en la aplicacion)

Cuando quieres varios usuarios pero no ejecutas un proveedor de identidad, habilita las cuentas integradas de correo y contrasena:

```bash
BEEHIVE_PASSWORD_AUTH=true
```

Esto esta **activado por defecto para el perfil `cloud`** y desactivado para `selfhost`. Con esta opcion habilitada, la pantalla de inicio de sesion ofrece "crear cuenta" e "iniciar sesion", y la gente puede [registrarse por si misma](/using-the-app/accounts-tenants).

### Instancias solo por invitacion

Si no quieres que desconocidos creen cuentas, establece `BEEHIVE_REGISTRATION=false` para cerrar el registro abierto. La configuracion del administrador en el primer arranque sigue funcionando, asi que una instancia nueva siempre puede crear su cuenta de administrador. Despues, la gente nueva solo puede unirse mediante enlaces de invitacion, que un administrador del tenant emite desde los Ajustes y que deben coincidir con el correo invitado. La pantalla de inicio de sesion muestra un aviso de que la instancia es solo por invitacion.

**La primera cuenta es la del administrador.** En una instancia nueva, la primera persona que se registra se convierte en el administrador de la instancia; todos los que vienen despues son usuarios normales. Cada cuenta nueva comienza con su propio [tenant](/using-the-app/accounts-tenants) personal.

### Verificacion de correo opcional

Por defecto, una cuenta nueva puede iniciar sesion de inmediato. Para exigir que la gente confirme primero su direccion de correo electronico, activa la verificacion:

```bash
BEEHIVE_EMAIL_VERIFICATION=true
```

Entonces la cuenta no puede iniciar sesion hasta que siga el enlace de verificacion. Configura SMTP para que el correo se envie realmente:

```bash
BEEHIVE_SMTP_HOST=smtp.example.com
BEEHIVE_SMTP_PORT=587
BEEHIVE_SMTP_USER=postbox@example.com
BEEHIVE_SMTP_PASS=your-smtp-password
BEEHIVE_SMTP_FROM=Openbeehive <no-reply@example.com>
```

:::note
Si `BEEHIVE_SMTP_HOST` se deja vacio, Openbeehive escribe el enlace de verificacion en el registro del servidor en lugar de enviarlo por correo: comodo para pruebas, no para produccion.
:::

## Modo 2: claves de acceso (WebAuthn)

Las claves de acceso permiten a la gente iniciar sesion con una huella dactilar, un escaneo facial, un PIN del dispositivo o una clave de seguridad de hardware. No hay contrasenas que gestionar.

```bash
BEEHIVE_WEBAUTHN_ENABLED=true
BEEHIVE_WEBAUTHN_RP_ID=beehive.example.com
BEEHIVE_WEBAUTHN_RP_ORIGINS=https://beehive.example.com
BEEHIVE_WEBAUTHN_RP_DISPLAY_NAME=Openbeehive
```

Que significa cada valor:

- `BEEHIVE_WEBAUTHN_RP_ID` es el **ID de la parte que confia (relying party ID)**: el dominio registrable que visitan los usuarios, sin esquema ni puerto (por ejemplo `beehive.example.com`, o `localhost` para pruebas locales). Las claves de acceso estan vinculadas a este dominio.
- `BEEHIVE_WEBAUTHN_RP_ORIGINS` es el origen completo (o los origenes separados por comas) que enviara el navegador, incluyendo el esquema y cualquier puerto, por ejemplo `https://beehive.example.com`.
- `BEEHIVE_WEBAUTHN_RP_DISPLAY_NAME` es el nombre descriptivo que se muestra en el aviso de clave de acceso del navegador.

:::caution
WebAuthn requiere un **contexto seguro**. Las claves de acceso funcionan a traves de HTTPS, o a traves de `http://localhost` para desarrollo, pero no a traves de HTTP simple en una direccion remota. Coloca el servidor detras de TLS antes de habilitar las claves de acceso en produccion. El `RP_ID` debe coincidir con el dominio de tu `BEEHIVE_PUBLIC_BASE_URL`.
:::

## Modo 3: proveedores OIDC

Conecta Openbeehive a uno o mas proveedores de identidad OpenID Connect. Enumera los que quieras, separados por comas, y configura cada uno por su nombre.

:::note Las cuentas se vinculan automaticamente
Cuando alguien inicia sesion a traves de un proveedor, Openbeehive encuentra o crea su cuenta en la aplicacion: primero hace coincidir la identidad del proveedor, luego la **direccion de correo electronico** (vinculando una cuenta de correo y contrasena existente a ese proveedor) y, en caso contrario, registra una cuenta nueva. Asi, una persona puede iniciar sesion con un proveedor o con correo y contrasena de forma indistinta, y la primera cuenta de la instancia es la del administrador.
:::

```bash
BEEHIVE_OIDC_PROVIDERS=google,keycloak
BEEHIVE_OIDC_REDIRECT_URL=https://beehive.example.com/auth/callback
```

`BEEHIVE_OIDC_REDIRECT_URL` es la direccion a la que tu proveedor devuelve a los usuarios despues de que se autentiquen. Debe ser accesible por el navegador y debe coincidir exactamente con lo que registres con el proveedor (ver mas abajo).

### Google

```bash
BEEHIVE_OIDC_GOOGLE_ISSUER=https://accounts.google.com
BEEHIVE_OIDC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
BEEHIVE_OIDC_GOOGLE_CLIENT_SECRET=your-client-secret
BEEHIVE_OIDC_GOOGLE_SCOPES=openid,email,profile
```

Crea el cliente en la Google Cloud Console en **APIs & Services -> Credentials -> OAuth client ID** (tipo: aplicacion web).

### Keycloak y Authentik

Keycloak, Authentik y otros proveedores que cumplen los estandares usan las variables genericas por proveedor. El nombre del proveedor en `BEEHIVE_OIDC_PROVIDERS` se asigna al prefijo de la variable.

```bash
BEEHIVE_OIDC_PROVIDERS=keycloak
BEEHIVE_OIDC_KEYCLOAK_ISSUER=https://id.example.com/realms/main
BEEHIVE_OIDC_KEYCLOAK_CLIENT_ID=openbeehive
BEEHIVE_OIDC_KEYCLOAK_CLIENT_SECRET=your-client-secret
```

El emisor (issuer) es la URL base del realm; Openbeehive descubre el resto a partir de `<issuer>/.well-known/openid-configuration`. Authentik funciona de la misma manera, usando la URL de configuracion OpenID de su aplicacion como emisor.

:::tip
El prefijo de la variable es simplemente el nombre del proveedor en mayusculas. Para anadir otro proveedor, agrega su nombre a `BEEHIVE_OIDC_PROVIDERS` y proporciona las correspondientes `BEEHIVE_OIDC_<NAME>_ISSUER`, `BEEHIVE_OIDC_<NAME>_CLIENT_ID` y `BEEHIVE_OIDC_<NAME>_CLIENT_SECRET`.
:::

### Registrar la URL de redireccion en tu IdP

En la configuracion del cliente de tu proveedor, anade una URI de redireccion autorizada que coincida con `BEEHIVE_OIDC_REDIRECT_URL` caracter por caracter:

```text
https://beehive.example.com/auth/callback
```

Errores comunes:

- El esquema debe coincidir (`https` en produccion, no `http`).
- Sin barra final a menos que tu `BEEHIVE_OIDC_REDIRECT_URL` la tenga.
- Usa tu dominio publico, no un nombre de host interno ni `localhost`, a menos que estes haciendo pruebas localmente.

Si el inicio de sesion falla con un error de discrepancia de redireccion, el valor registrado en el IdP y el valor en `BEEHIVE_OIDC_REDIRECT_URL` difieren en algun punto.

## Verificar tu configuracion

Despues de cambiar cualquiera de estos ajustes, reinicia el servidor y carga la aplicacion en un navegador:

1. **Sin inicio de sesion**, el panel se abre directamente.
2. Con **claves de acceso u OIDC**, deberias ver una pantalla de inicio de sesion que ofrece cada metodo habilitado.
3. Completa un inicio de sesion y confirma que llegas al panel y que los registros se sincronizan.

Si algo no funciona, revisa los registros del servidor y la guia de [Solucion de problemas](/knowledge-base/troubleshooting). Para ver la lista completa de ajustes, consulta [Configuracion](/self-hosting/configuration).
