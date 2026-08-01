---
sidebar_position: 13
title: "Cuentas e inquilinos"
---

# Cuentas e inquilinos

La forma en que inicias sesión en Openbeehive depende de cómo esté configurada la
instancia. Una instancia autoalojada para una sola persona puede no necesitar
inicio de sesión alguno; una instancia compartida (como el servicio alojado) da a
cada quien su propia cuenta y te permite organizar las colmenas en **inquilinos**
entre los que puedes alternar.

## Iniciar sesión

Según la instancia, la pantalla de inicio de sesión ofrece una o varias de estas
opciones:

- **Correo y contraseña** — crea una cuenta con tu correo y luego inicia sesión.
- **Un proveedor** (Google, Keycloak, …) — "Continuar con …".
- **Una clave de acceso** — tu huella dactilar, tu rostro, el PIN del dispositivo o una llave de seguridad.
- **Nada en absoluto** — una instancia de un solo usuario abre directamente la aplicación.

Puedes usar cualquiera de los métodos que ofrezca la instancia, y todos están
vinculados a la misma cuenta: si primero te registraste con correo y contraseña y
más tarde inicias sesión con un proveedor que usa el **mismo correo**, ambos se
enlazan automáticamente.

:::note La primera cuenta es la del administrador
En una instancia recién creada, la **primera** cuenta que se crea se convierte en
la administradora de la instancia. Todos los que se unan después son usuarios
normales.
:::

Si la instancia requiere verificación de correo, recibirás un enlace de
confirmación por correo después de registrarte: ábrelo antes de tu primer inicio
de sesión.

## Qué es un inquilino

Un **inquilino** es un conjunto de colmenares y colmenas que pertenecen al mismo
grupo. Cada cuenta comienza con su **inquilino personal**: tus propios colmenares.
También puedes pertenecer a **inquilinos compartidos**, por ejemplo:

- un colmenar de un **club** o asociación que varios apicultores atienden juntos,
- una demostración **didáctica** o de una asociación,
- una segunda explotación que mantienes separada de tus colmenas privadas.

Tus registros siempre residen dentro del **inquilino activo**. Cambiar de
inquilino cambia qué colmenares, colmenas e inspecciones ves.

## Cambiar de inquilino

Abre **Ajustes → Inquilinos**. Verás todos los inquilinos a los que perteneces,
junto con tu rol en cada uno. Toca uno para activarlo: la aplicación se recarga
con las colmenas de ese inquilino.

## Crear un inquilino

En **Ajustes → Inquilinos**, ponle un nombre (por ejemplo, "Club de apicultura") y
créalo. Te conviertes en su **administrador de inquilino** (propietario) y pasa a
ser tu inquilino activo. Añade colmenares y colmenas como de costumbre; pertenecen
a este inquilino.

## Roles

| Rol | Qué puede hacer |
| --- | --- |
| **Administrador de instancia** | La primera cuenta de la instancia; un rol a nivel de toda la instancia para los operadores. |
| **Administrador de inquilino** (propietario) | Gestiona un inquilino e **invita** a otros a él. |
| **Miembro** | Trabaja con los colmenares y colmenas del inquilino. |

## Invitar apicultores

Si eres administrador de un inquilino, abre **Ajustes → Inquilinos → Invitar a un
apicultor**, introduce su correo y envía la invitación. Recibirán un enlace; una
vez que inicien sesión y la acepten, se unirán al inquilino y podrán cambiar a él
desde sus propios **Ajustes → Inquilinos**.

## La demostración

Algunas instancias ejecutan una **cuenta de demostración**. Cuando inicias sesión
en ella, un aviso te recuerda que estás explorando la demostración y que sus datos
**se restablecen cada hora**, así que siéntete libre de explorar, añadir visitas y
probar cosas; todo vuelve a los datos de muestra en el siguiente restablecimiento.
Los operadores pueden habilitarla mediante el [Modo demostración](/self-hosting/demo).
