# Activar la publicidad

Estado de partida: el código ya está preparado —huecos, consentimiento, `ads.txt`— y
no falta nada por programar. Lo que falta es de cuenta y de dominio, y va en este
orden porque cada paso depende del anterior.

Hoy hay GitHub, Vercel y el dominio en GoDaddy. Con eso, lo que queda es:

| # | Paso | Dónde | Bloquea a |
| --- | --- | --- | --- |
| 1 | Un buzón `contacto@` que reciba correo | GoDaddy / proveedor de correo | 2, 4 |
| 2 | Dominio principal y DNS resueltos | Vercel + GoDaddy | 4 |
| 3 | Contenido suficiente y original | repo | 4 |
| 4 | Cuenta de AdSense y verificación del sitio | AdSense | 5, 6 |
| 5 | CMP certificado por Google | AdSense | 6 |
| 6 | IDs de bloque en variables de entorno | Vercel | — |

Los pasos 1 a 3 se pueden hacer hoy. El 4 tarda entre unos días y unas semanas en
resolverse por parte de Google, así que cuanto antes se envíe, mejor.

---

## 1. El buzón de contacto

**Es el bloqueo real, y es el paso más pequeño.** La LSSI (art. 10) exige un medio de
contacto que funcione, y el revisor de AdSense comprueba que la página de contacto
existe y es coherente. `src/lib/legal-entity.ts` ya publica `contacto@<dominio>` en
`/aviso-legal`, `/privacidad` y `/contacto`: hoy esa dirección aparece en la web y no
recibe nada, lo que es peor que no tenerla.

Hacen falta cinco direcciones, aunque solo una bloquea hoy:

```
contacto@ceutaeclipse.es      ← el canónico, el único que bloquea ahora
contacto@ceutaeclipse.com
contacto@eclipsecadiz.com
contacto@eclipsetarifa.com
contacto@eclipsegibraltar.com
```

No hace falta un buzón real por dominio: basta con que el correo acabe en una bandeja
que se lea.

### GoDaddy ya no es la vía gratuita

Conviene descartarlo primero para no perder tiempo. GoDaddy **retiró Workspace Email**,
que era lo que incluía reenvíos con el dominio. Hoy su producto de Email Forwarding
solo funciona si quedan créditos heredados de aquella época; si no, empujan a Microsoft
365 de pago tras una prueba. Merece la pena mirar en la cuenta si hay créditos antiguos
—es medio minuto— pero no conviene construir el plan sobre eso.

### La vía recomendada: el Google Workspace de upandalus.com

Es gratis, cubre los cinco dominios y **no consume licencias**, que es la parte que
todo el mundo asume mal. El truco está en usar **grupos** en vez de usuarios: un usuario
de Workspace cuesta licencia, un grupo no, y para un buzón de contacto un grupo hace
exactamente el mismo trabajo.

1. **Añadir el dominio como secundario.** Consola de administración → *Cuenta →
   Dominios → Gestionar dominios → Añadir un dominio*, y elegir **dominio secundario**,
   no alias.

   La diferencia importa: un *alias de dominio* replica automáticamente todas las
   direcciones de `upandalus.com` en `ceutaeclipse.es`, así que cualquier persona que
   entre algún día en ese Workspace tendría buzón en el dominio del eclipse sin
   pedirlo. Un *dominio secundario* deja controlar exactamente qué direcciones existen.

2. **Verificar la propiedad.** Google da un registro `TXT`; se añade en GoDaddy →
   *DNS → Registros → Añadir* con nombre `@`.

3. **Activar Gmail para ese dominio**, que es lo que pide el registro `MX`. En GoDaddy,
   un único registro:

   ```
   MX   @   smtp.google.com   prioridad 1
   ```

   Ése es el valor actual de Google. Los cinco registros antiguos que empiezan por
   `aspmx` siguen siendo válidos si ya están puestos en otro dominio; no hace falta
   cambiarlos.

4. **Crear el grupo.** *Directorio → Grupos → Crear grupo*, dirección
   `contacto@ceutaeclipse.es`, y añadirse como único miembro.

5. **Permitir el correo de fuera.** Es el paso que se olvida siempre y el que hace
   inútil todo lo anterior: por defecto un grupo de Workspace **rechaza el correo
   externo**. En la configuración del grupo, *Quién puede publicar* → **Cualquier
   usuario de internet**, y comprobar que los mensajes externos no quedan retenidos
   para moderación. Un buzón de contacto que rebota los correos de fuera es peor que
   no tener buzón, y es exactamente lo que probaría un revisor.

6. **Repetir con los otros cuatro dominios** cuando toque publicarlos. El límite de
   dominios de Workspace está muy por encima de cinco.

Dos avisos:

- **Esto no toca la web.** Los registros `A` y `CNAME` que apuntan a Vercel y los `MX`
  son cosas distintas y conviven sin interferir. Añadir el `MX` no afecta al sitio.
- Las ediciones **Essentials** e **Individual** de Workspace no admiten varios
  dominios. Con Business Starter en adelante, sí.

### Poder responder desde esa dirección

Recibir basta para la LSSI, pero responder desde `contacto@ceutaeclipse.es` da bastante
mejor impresión que hacerlo desde una cuenta personal. En Gmail: *Ver todos los ajustes
→ Cuentas e importación → Enviar como*. Para que esas respuestas no caigan en spam hay
que publicar además el **SPF** y el **DKIM** del dominio, que Google genera desde la
consola de administración.

### Si el Workspace es Microsoft 365 y no Google

La idea es la misma con otros nombres: añadir el dominio como *dominio aceptado* y
crear un **buzón compartido**, que en Microsoft 365 tampoco consume licencia.

### Si prefieres no tocar el Workspace

- **ImprovMX** o **Forward Email**: reenvío gratuito con dos registros `MX` en GoDaddy.
  Es lo más rápido de montar. A cambio, un canal con valor legal queda en manos de un
  tercero gratuito.
- **Cloudflare Email Routing**: gratis y con buen panel, pero obliga a mover los
  servidores de nombres del dominio a Cloudflare. Compensa si algún día se gestiona
  toda la red desde ahí; no por un solo buzón.

### La comprobación que cierra el paso

**Enviar un correo desde una dirección externa** —un Gmail personal, no una cuenta del
propio Workspace— a `contacto@ceutaeclipse.es`, y confirmar que llega y que no cae en
spam. Probar desde dentro de la organización no vale: el correo interno puede
entregarse aunque el `MX` esté mal puesto y da un falso positivo.

Un `MX` mal configurado no da error en ninguna parte: el correo simplemente se pierde.

---

## 2. Dominio principal y DNS

`ceutaeclipse.es` ya sirve producción, así que el DNS de ese dominio está resuelto.
Quedan dos cosas.

**El ápex tiene que ser el principal.** Ahora `ceutaeclipse.es` redirige (308) a
`www.ceutaeclipse.es`, mientras que el `canonical` del código apunta al ápex. Google
lo acaba resolviendo, pero es una señal contradictoria y a un revisor le sobra. En
*Vercel → Settings → Domains*, marcar `ceutaeclipse.es` como **primary domain** para
que sea `www` quien redirija hacia él. Si se prefiere lo contrario, cambiar el
dominio canónico en `TENANTS` (`src/lib/tenants.ts`) y desplegar: canonical, hreflang
y sitemap se recolocan solos.

**Los otros tres dominios.** `eclipsecadiz.com`, `eclipsetarifa.com` y
`eclipsegibraltar.com` siguen apuntando al registrador. Cuando toque publicarlos, en
Vercel se añaden al proyecto y en GoDaddy se ponen los registros que muestre el panel
de Vercel para ese dominio concreto. Dos avisos sobre GoDaddy:

- GoDaddy no admite `ALIAS`/`ANAME` en el ápex, así que el ápex va con un registro
  `A` a la IP que indique Vercel y `www` con un `CNAME`. Usar **los valores que
  muestre el panel**, no los de ninguna guía: Vercel los ha cambiado más de una vez.
- Hay que **borrar los registros de la página aparcada** que GoDaddy crea por
  defecto. Si se quedan, conviven con los nuevos y el dominio responde a veces con
  una cosa y a veces con otra.

Una recomendación de orden: no dar de alta los cuatro dominios en AdSense a la vez.
Se aprueba primero `ceutaeclipse.es`, que es el que tiene contenido, y los demás se
añaden después como sitios adicionales de la misma cuenta. Un dominio con poco
contenido en la misma cuenta puede arrastrar la revisión de los otros.

---

## 3. Contenido suficiente

Es el motivo número uno de rechazo, y viene con un nombre concreto en la respuesta de
Google: *low value content*. No hay un número publicado de páginas mínimas; lo que se
evalúa es si el sitio aporta algo que no esté ya en otro sitio.

A favor tenemos bastante: las circunstancias locales están **calculadas**, no
copiadas, hay API pública, y las guías son originales. La sección de blog añade
volumen editorial con la misma lógica —contenido propio, específico de la ciudad del
dominio y no duplicado entre dominios— y es justo lo que faltaba para presentarse a
revisión con solidez.

Antes de enviar, comprobar que están y funcionan: `/aviso-legal`, `/privacidad`,
`/cookies`, `/contacto`, `/fuentes`. Ya existen. Lo que hay que verificar es que el
correo de `/contacto` recibe (paso 1).

---

## 4. Cuenta de AdSense y verificación del sitio

1. Crear la cuenta en <https://adsense.google.com> con el dominio `ceutaeclipse.es`.
2. Google asigna el **ID de publisher** (`pub-XXXXXXXXXXXXXXXX`) en el momento del
   alta, antes de aprobar nada. Ése es el dato que hace falta para continuar.
3. En *Vercel → Settings → Environment Variables*, poner en **Production**:

   ```
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1380381573272514
   ```

   El prefijo `ca-` va aquí, y solo aquí. En `ads.txt` la línea lleva `pub-…` sin
   `ca-`; la ruta lo quita sola, así que no hay que pensarlo.

   **Poner solo esta variable es seguro**, y es exactamente lo que toca mientras
   Google revisa: `/ads.txt` empieza a publicar el identificador, pero no aparece el
   banner de cookies, no se carga el script de Google y no se instala ninguna cookie
   de terceros. Todo eso espera a que exista además algún ID de bloque (paso 6), que
   es cuando hay de verdad una finalidad que consentir.
4. **Redesplegar.** Las variables `NEXT_PUBLIC_` se incrustan en tiempo de build: si
   no se vuelve a construir, el valor no existe en el sitio publicado.
5. Verificar el sitio con la **etiqueta meta** o con **`ads.txt`**. Con cualquiera de
   las dos, no con el fragmento de código.

   Google ofrece tres métodos y solo uno es incompatible con la arquitectura de
   consentimiento de este proyecto:

   | Método | ¿Carga algo en el navegador? | ¿Sirve aquí? |
   | --- | --- | --- |
   | Fragmento de código de AdSense | Sí, el script de Google en todas las páginas | **No** |
   | Etiqueta `<meta>` | No, es HTML inerte | Sí |
   | Fragmento de `ads.txt` | No, es un archivo de texto | Sí |

   Las dos válidas ya están implementadas y **salen las dos de la misma variable del
   paso 3**: la ruta `/ads.txt` emite la línea que Google espera, y el layout emite
   `<meta name="google-adsense-account">` en todas las páginas, en los dos idiomas.
   No hay nada que pegar a mano ni dos sitios donde mantener el identificador.

   El fragmento de código queda descartado: cargaría `adsbygoogle.js` en cada visita
   antes de que nadie haya aceptado nada, que es justo lo que el banner existe para
   impedir.

   Comprobaciones después de desplegar:

   ```bash
   curl https://ceutaeclipse.es/ads.txt
   # google.com, pub-1380381573272514, DIRECT, f08c47fec0942fa0
   ```

   Tiene que responder **200 en el ápex, sin redirección**. Si devuelve 404, falta la
   variable o falta el redespliegue.

   ```bash
   curl -s https://ceutaeclipse.es/ | grep google-adsense-account
   # <meta name="google-adsense-account" content="ca-pub-1380381573272514"/>
   ```

   Si la etiqueta no aparece, es lo mismo: falta la variable o falta reconstruir.
6. Enviar a revisión y esperar. Mientras la cuenta esté en revisión no hay que tocar
   nada: la web sigue sin cargar publicidad porque no hay IDs de bloque, y eso no
   perjudica a la revisión.

---

## 5. El consentimiento: lo que falta de verdad

Aquí hay una diferencia que conviene entender antes de activar, porque es la única
parte del plan donde el código actual no basta.

El banner de `src/components/CookieConsent.tsx` **cumple lo que pide la AEPD**:
rechazar cuesta lo mismo que aceptar, no se carga nada de Google antes de un sí
explícito, y retirar el consentimiento está a un clic en el pie. Eso está bien y no
hay que estropearlo.

Lo que ese banner **no** es: un CMP certificado por Google integrado con IAB TCF
v2.2. Y desde enero de 2024 la política de consentimiento de usuarios de la UE de
Google exige uno para servir anuncios a visitantes del EEE y Reino Unido. Es decir:
podemos estar perfectamente en regla con la AEPD y aun así no cumplir el contrato de
AdSense. Son dos requisitos distintos y hay que satisfacer los dos.

### Qué mensaje elegir en el panel de Google

Google ofrece dos formatos de su propio CMP, y **solo uno vale en España**:

| Formato | Primera capa | ¿Vale? |
| --- | --- | --- |
| Dos opciones: *Consentir* y *Gestionar opciones* | No hay botón de rechazar | **No** |
| Tres opciones: *Consentir*, *No consentir* y *Gestionar opciones* | Aceptar y rechazar al mismo nivel | Sí |

La guía de cookies de la AEPD exige que rechazar esté **en la primera capa y con la
misma visibilidad que aceptar**, sin mandar al usuario a otra capa para hacerlo, y
sin destacar un botón sobre el otro. El formato de dos opciones esconde el rechazo
detrás de «Gestionar opciones», que es exactamente el patrón que la guía prohíbe.

Es además la misma regla que ya cumple nuestro banner y que está escrita en el
proyecto: rechazar tiene que costar lo mismo que aceptar. Elegir el de dos opciones
sería incumplir con la AEPD por decisión propia, y a cambio de nada: la diferencia de
ingresos entre uno y otro no compensa una sanción.

**Marcar la tercera opción del panel: «tres opciones».**

Dos caminos para el CMP:

- **Mensaje de GDPR de Google** (*AdSense → Privacidad y mensajes*). Gratis,
  certificado y sin código. Es lo que recomendaría: resuelve el requisito de Google
  sin dependencias nuevas. El matiz es que el mensaje viaja dentro del propio script
  de Google, así que solo puede aparecer una vez cargado ese script, y nuestro banner
  decide precisamente si se carga o no. Resultado: quien acepte en nuestro banner
  puede ver después el de Google. Un doble aviso es feo pero es correcto.
- **Un CMP certificado de terceros** que soporte bloqueo previo. Más control y una
  sola pregunta al visitante, a cambio de una integración y, según el proveedor, de
  una cuota.

El final limpio, en cualquiera de los dos casos, es **una sola pregunta**: cuando el
CMP certificado esté en marcha, nuestro banner deja de preguntar y pasa a apoyarse en
la señal del CMP, y el enlace «Configurar cookies» del pie abre el panel del CMP.
Hasta entonces, mejor un doble aviso que servir anuncios sin CMP certificado.

Dos cosas que no hay que olvidar al hacer este cambio:

- **Subir `CONSENT_VERSION`** en `src/lib/consent.ts`. Añadir un proveedor o una
  finalidad invalida los consentimientos anteriores: un sí para AdSense no cubre
  añadir un CMP con sus propias cookies.
- **Consent Mode v2**: si se integra un CMP de terceros, hay que pasarle a Google las
  señales `ad_storage`, `ad_user_data` y `ad_personalization`. El mensaje propio de
  Google lo hace solo.

---

## 6. Encender los bloques

Con la cuenta aprobada:

1. En AdSense, crear cinco bloques de display y copiar el ID de cada uno.
2. Ponerlos en Vercel (Production, y también Preview si se quieren ver en las
   previsualizaciones):

   ```
   NEXT_PUBLIC_ADSENSE_SLOT_HEADER=…
   NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE=…
   NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=…
   NEXT_PUBLIC_ADSENSE_SLOT_FOOTER=…
   NEXT_PUBLIC_ADSENSE_SLOT_LISTING=…
   ```

3. Redesplegar.

Se pueden activar de uno en uno: un hueco sin ID no se dibuja, así que se puede
empezar por `inArticle` —el que mejor rinde— y ver cómo queda antes de encender el
resto.

**Anuncios automáticos: no.** Son tentadores porque prometen colocación óptima sin
trabajo, pero requieren el script de Google en el `<head>` de todas las páginas
—incompatible con el consentimiento previo— e insertan bloques donde les parece, lo
que descoloca el diseño y penaliza el CLS. Las cinco posiciones manuales están
elegidas y son suficientes.

---

## Cómo queda un hueco sin anuncio

Desde ahora, un hueco sin configurar **no se dibuja**: ni recuadro, ni borde
discontinuo, ni altura reservada. Tampoco el contenedor que lo envolvía, que es la
parte que se suele olvidar y la que dejaba secciones vacías con ochenta píxeles de
relleno.

El coste de esta decisión, dicho claramente: el día que se activen los anuncios el
contenido se moverá una vez, porque aparece altura que antes no estaba. Es un salto
que se paga una sola vez —el día de activar— en lugar de mostrar recuadros vacíos
todos los días hasta entonces. Con el hueco ya activo sí se reserva la altura, que es
lo que evita el salto mientras carga cada anuncio.

---

## Facturación

Para cobrar, Google pide dirección postal, datos fiscales y una verificación por PIN
enviado por correo ordinario al llegar al umbral de 10 €. Dos avisos:

- El PIN llega en papel y puede tardar. Conviene tener la dirección bien puesta desde
  el principio.
- **Ceuta tiene régimen fiscal propio** (IPSI en lugar de IVA). Cómo se declaran los
  ingresos de AdSense con domicilio fiscal en Ceuta no es una pregunta de este
  documento: conviene resolverla con una asesoría antes del primer cobro, no después.

---

## Lista de comprobación

Antes de enviar a revisión:

- [ ] `contacto@ceutaeclipse.es` recibe correo de verdad (probado enviando uno)
- [ ] `ceutaeclipse.es` es el dominio principal en Vercel y `www` redirige a él
- [ ] `https://ceutaeclipse.es/ads.txt` responde 200 con la línea de `google.com`
- [ ] `https://ceutaeclipse.es/robots.txt` y `/sitemap.xml` responden
- [ ] `/aviso-legal`, `/privacidad`, `/cookies`, `/contacto` y `/fuentes` cargan
- [ ] La web tiene contenido editorial propio suficiente, blog incluido

Antes de encender los bloques:

- [ ] CMP certificado en marcha (mensaje de GDPR de Google o de terceros)
- [ ] `CONSENT_VERSION` subida si cambió algo del consentimiento
- [ ] Comprobado con el navegador: sin decisión y tras rechazar, cero peticiones a
      `googlesyndication.com`; tras aceptar, se carga
