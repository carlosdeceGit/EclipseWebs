# EclipseWebs

Red multidominio de guías sobre el **eclipse solar total del 2 de agosto de 2027** en el
sur de España, en español e inglés.

Este documento es el mapa del proyecto: qué hay, por qué está así y qué decisiones no
conviene revertir sin entender lo que resuelven.

---

## 1. El negocio

El eclipse del **lunes 2 de agosto de 2027** cruza el estrecho de Gibraltar. La franja de
totalidad cubre Ceuta, Melilla, Gibraltar y 115 municipios de Cádiz, Málaga, Granada y
Almería. Es un evento con fecha fija, audiencia enorme y una ventana de monetización que
se abre ahora y se cierra el 3 de agosto de 2027.

Cuatro vías de ingreso:

1. **Publicidad programática** (AdSense, migrando a Ezoic o Mediavine con volumen).
2. **Directorio de negocios**: ficha básica gratis, destacada 49 €, patrocinio de ciudad 390 €.
3. **Clasificados** entre particulares, gratis y moderados.
4. **Gafas de eclipse** como negocio subsidiario (ver §8).

La estrategia es posicionar con casi un año de antelación. Después del 2 de agosto de 2027
esta audiencia desaparece de golpe: no hay segunda temporada.

### Contexto temporal importante

El eclipse del **12 de agosto de 2026 ya pasó** (cruzó el norte de España). El de este
proyecto es el de **2027**, que cruza el sur. No confundirlos: son eclipses distintos con
franjas distintas.

---

## 2. Dominios

### En propiedad

| Dominio | Ciudad | Totalidad | Estado |
| --- | --- | --- | --- |
| **`ceutaeclipse.es`** (canónico) + `ceutaeclipse.com` | Ceuta | 4 min 48 s — **el máximo de España** | En producción |
| `eclipsecadiz.com` | Cádiz | 2 min 55 s | Configurado, sin activar |
| `eclipsetarifa.com` | Tarifa | 4 min 39 s | Configurado, sin activar |
| `eclipsegibraltar.com` | Gibraltar | 4 min 27 s | Configurado, sin activar |

Configurados en `src/lib/tenants.ts`. **Añadir un dominio es añadir una entrada ahí y
apuntar el DNS.** Nada más.

El primer dominio de cada entrada es el canónico; los demás son alias que sirven el mismo
contenido y canonicalizan al primero. En Ceuta el canónico es el `.es` porque es el que
está publicado: intercambiar las dos líneas recoloca canonical, hreflang y sitemap.

### Despliegue

- Proyecto de Vercel: `eclipse-webs`, conectado al repo, framework Next.js.
- **Rama de producción: `claude/eclipse-spain-2025-web-uf6i0g`**, que además es la rama por
  defecto del repositorio. No hay `main`: cada push a esa rama despliega producción.
- URL de fábrica: `eclipse-webs.vercel.app`.
- Dominios dados de alta: `ceutaeclipse.es` y `www.ceutaeclipse.es`. Los otros tres siguen
  apuntando al registrador y hay que añadirlos al proyecto cuando toque publicarlos.

**Pendiente de un clic en Vercel**: ahora mismo el ápex `ceutaeclipse.es` redirige (308) a
`www.ceutaeclipse.es`, mientras que el canonical del código apunta al ápex. Google acaba
resolviéndolo, pero es una ambigüedad que no hace falta tener. En *Settings → Domains*,
marcar `ceutaeclipse.es` como dominio principal para que sea `www` quien redirija hacia él.
Si se prefiere lo contrario, cambiar el canónico en `TENANTS` a `www.ceutaeclipse.es`.

Un host que no esté en `TENANTS` —una URL de preview, `localhost`— recibe el tenant
genérico **con su propio host como dominio**, de modo que se canonicaliza a sí mismo. Esto
resuelve un bug real de producción: con un dominio fijo en la plantilla del hub, todas las
URLs canónicas de los despliegues de preview apuntaban a un dominio ajeno.

### Libres y recomendados (verificados en Vercel, ~11,25 $/año)

Por prioridad:

1. `algeciraseclipse.com` — 4 min 28 s, el mejor punto peninsular, y nadie lo ha visto.
2. `melillaeclipse.com` — 4 min 33 s, la otra ciudad autónoma.
3. `eclipseandalucia.com` — portal agregador de toda la red.
4. `conileclipse.com`, `vejereclipse.com`, `chiclanaeclipse.com`, `barbateeclipse.com`,
   `sanroqueeclipse.com`, `lalineaeclipse.com`, `esteponaeclipse.com`, `marbellaeclipse.com`,
   `jerezeclipse.com`, `rondaeclipse.com`, `nerjaeclipse.com`, `motrileclipse.com`,
   `fuengirolaeclipse.com`, `torremolinoseclipse.com`.

**Ocupados** (competencia moviéndose): `malagaeclipse.com`, `eclipsemalaga.com`,
`eclipse2027.es`, `eclipsetotal2027.com`, `eclipse2027spain.com`, `spaineclipse2027.com`.

---

## 3. Los datos del eclipse se calculan, no se copian

Ésta es la decisión central del proyecto y la que no hay que revertir.

`src/lib/eclipse/besselian.ts` resuelve las circunstancias locales a partir de los
**elementos besselianos publicados por la NASA**, con el procedimiento del *Explanatory
Supplement to the Astronomical Almanac*. Eso da los cinco contactos, duración, magnitud,
porcentaje de disco cubierto y posición del Sol **para cualquier coordenada del planeta**.

Consecuencias:

- Añadir un municipio es añadir su nombre y sus coordenadas en `cities.ts`. Los datos del
  eclipse aparecen solos y son correctos por construcción.
- El localizador puede responder para el punto exacto del usuario.
- No dependemos de que alguien haya tabulado una localidad.

### Dos detalles técnicos que costaron encontrar

**1. Corrección del meridiano de efemérides.** El `μ` que publica la NASA es el ángulo
horario desde el *meridiano de efemérides*, no desde Greenwich. Sin restar
`1.002738 × ΔT × 15/3600` grados, la franja entera queda **27 km desplazada** y los
contactos salen más de un minuto tarde. Se detectó calculando el instante del máximo de
forma independiente y comparándolo con el publicado por la NASA.

**2. ΔT = 71,7 s.** No es una elección libre: es el valor con el que la NASA generó estos
elementos. Calculando el máximo desde los polinomios sale TDT 10:07:49,4, y restar 71,7 s
da exactamente las 10:06:37,7 UT que publica la NASA. Cambiarlo sin regenerar los
elementos descuadra el resultado frente a las tablas oficiales.

### Validación (corre en CI antes de cada despliegue)

`scripts/validate-eclipse.ts`:

| Punto | Calculado | Publicado | Δ | Fuente |
| --- | --- | --- | --- | --- |
| Máximo del eclipse (Egipto) | 6 min 22,5 s | 6 min 22,6 s | **−0,1 s** | NASA |
| Ceuta | 4 min 48,4 s | 4 min 48 s | +0,4 s | IGN |
| Tarifa | 4 min 38,7 s | 4 min 38 s | +0,7 s | IGN |
| Melilla | 4 min 33,2 s | 4 min 33 s | +0,2 s | IGN |
| Algeciras | 4 min 28,1 s | 4 min 27 s | +1,1 s | IGN |
| La Línea | 4 min 24,7 s | 4 min 23 s | +1,7 s | IGN |
| Los Barrios | 4 min 20,6 s | 4 min 19 s | +1,6 s | IGN |
| San Roque | 4 min 17,7 s | 4 min 17 s | +0,7 s | IGN |
| Cádiz | 2 min 54,7 s | 2 min 54 s | +0,7 s | IGN |
| Málaga | 1 min 52,1 s | 1 min 48 s | +4,1 s | IGN |
| Sevilla (ocultación) | 98,4 % | 98 % | +0,4 pp | IGN |

Málaga está en el borde norte, donde la duración varía muy deprisa con la posición: los
4 s se explican por el punto de referencia que use cada fuente dentro del municipio.

Comprobación geométrica independiente: la anchura de la franja calculada en el punto de
máximo es **258,8 km** frente a los **257,7 km** de la NASA.

### Margen de error que declaramos

- Duraciones: fiables dentro de unos segundos.
- Horas de contacto: fiables dentro de unos segundos; pueden diferir ligeramente de las
  tablas del IGN por convenciones de ΔT y radio lunar.
- El instante real de C2 y C3 varía uno o dos segundos más por el relieve del limbo lunar.

**Por eso toda la guía de seguridad insiste en lo mismo: no te fíes del reloj para quitarte
el filtro, fíate de lo que ves.** Esto no es un descargo de responsabilidad, es el consejo
correcto y aparece en `/seguridad`, `/horarios`, `/fuentes` y en la API.

### Pendiente sobre datos

El proxy de red del entorno de desarrollo **bloquea `astronomia.ign.es` y `eclipses.ign.es`**
(403 en el túnel CONNECT, política de la organización). Los valores del IGN de la tabla de
arriba se obtuvieron vía búsqueda web, no leyendo la página.

El agente `auditor-datos` corre en GitHub Actions, **donde sí hay acceso**, y es quien
contrastará la tabla completa. Si alguien puede pegar la tabla del IGN como texto, se
incorpora al test de validación directamente.

---

## 4. Arquitectura

```
src/
  proxy.ts                 resuelve tenant e idioma antes de los Server Components
  i18n/
    config.ts              locales, prefijos, helpers de ruta
    dictionary.ts          cadenas de interfaz es/en
  lib/
    tenants.ts             dominio → ciudad, marca y color
    tenant-context.ts      lectura del tenant/idioma en la petición
    legal-entity.ts        datos identificativos del titular (LSSI)
    seo.ts                 metadatos, hreflang y JSON-LD
    ads.ts                 slots de AdSense y tarifas propias
    eclipse/
      besselian.ts         EL CÁLCULO. No tocar sin correr la validación.
      cities.ts            registro de localidades (solo lo no calculable)
      event.ts             datos del evento independientes de la localidad
      types.ts
    db/
      supabase.ts          clientes, degradan a null sin variables
      listings.ts          directorio y clasificados
  content/
    faq.ts                 FAQ bilingües
    articles/              guías largas bilingües, una por archivo
  components/
  app/
    [locale]/              todas las páginas
    api/eclipse            datos de todas las localidades
    api/circumstances      datos para coordenadas arbitrarias
    og/                    imagen social generada al vuelo
    llms.txt, robots.ts, sitemap.ts
agents/                    sistema de agentes autónomos
scripts/validate-eclipse.ts
supabase/schema.sql
docs/negocio-gafas.md
```

### Multi-tenant

`src/proxy.ts` guarda el `Host` en la cabecera `x-eclipse-host` y `resolveTenant()` la
traduce a un tenant. Todo lo demás —metadatos, JSON-LD, sitemap, `llms.txt`, contenido—
se deriva de ahí.

Probar un dominio en local:

```bash
curl -H "Host: eclipsetarifa.com" localhost:3000/
curl -H "Host: ceutaeclipse.com" localhost:3000/en/horarios
```

`localhost` cae al tenant «hub», así que la web es navegable sin tocar `/etc/hosts`.

### Idiomas

Español **sin prefijo** (`/horarios`), inglés bajo **`/en`** (`/en/horarios`). El proxy
reescribe internamente a `/es`; eso nunca asoma en la URL.

Motivo: la audiencia principal es española y las URLs más valiosas no deben cargar con un
prefijo ni con una redirección.

El inglés **no es traducción literal**. Cambian ejemplos y encuadre: quien busca en inglés
viene de fuera y necesita aeropuertos, la diferencia horaria con Marruecos y dónde comprar
filtros antes de viajar.

### Contenido sin duplicar

Los textos se generan a partir de la ciudad del dominio. Publicar el mismo contenido en
varias webs propias es la forma más rápida de que Google se quede con una e ignore el
resto. **Cualquier contenido nuevo debe seguir esta regla.**

---

## 5. SEO y GEO

- Metadatos, canonical y `hreflang` por dominio e idioma, con `x-default` al español.
- JSON-LD: `Event`, `Place`, `WebSite`, `Organization`, `FAQPage`, `BreadcrumbList` y
  `Dataset` para las tablas de duraciones.
- `sitemap.xml` con alternates de idioma por URL. `robots.txt` por tenant.
- **`llms.txt`** con los hechos destilados, las tablas completas y **el método y el margen
  de error declarados**, para que un modelo que cite nuestras cifras pueda citar también su
  precisión.
- API pública en `/api/eclipse` y `/api/circumstances` con CORS abierto: que otros la usen
  genera enlaces y menciones.
- Imagen OG generada al vuelo por ciudad e idioma, solo con primitivas (sin fuentes ni
  imágenes externas: en el borde, cada fetch es un punto de fallo).
- **Crawlers de IA permitidos a propósito.** Que ChatGPT, Claude, Perplexity y Gemini citen
  estas páginas es un canal de captación, no una fuga.

El primer párrafo de cada página carga los datos duros por delante (qué, dónde, cuándo,
cuánto dura): es lo que copian los motores generativos.

---

## 6. Monetización: detalles de implementación

- Los huecos de anuncio **reservan altura aunque no haya anuncio**, para que el layout no
  salte el día que se activen. Saltar penaliza CLS.
- Sin `NEXT_PUBLIC_ADSENSE_CLIENT_ID` no se carga el script de Google ni se instala ninguna
  cookie de terceros. Eso permite desplegar antes de tener AdSense aprobado.
- Los enlaces salientes comerciales llevan `rel="sponsored nofollow"`. **No es opcional**:
  marcarlos mal hunde el dominio entero.
- RLS de Supabase impide que un usuario se autoasigne nivel de pago o se autoapruebe.

### Consentimiento de cookies

`src/components/CookieConsent.tsx` es quien monta el script de AdSense, **no el layout**.
Esa es la parte importante: si el script viviera en el layout, el banner sería decorativo
y estaríamos incumpliendo igual. Verificado con navegador real: sin decisión y tras
rechazar, cero peticiones a Google; tras aceptar, se carga.

Tres cosas que exige la AEPD y que condicionan el diseño:

1. **Rechazar es tan fácil como aceptar**: los dos botones tienen el mismo peso visual.
2. **Nada no esencial antes del consentimiento.**
3. **Retirarlo es tan fácil como darlo**: enlace permanente «Configurar cookies» en el pie.

Seguir navegando no es consentir, así que el banner no se cierra con scroll ni al pulsar
fuera. `CONSENT_VERSION` en `src/lib/consent.ts` invalida los consentimientos previos:
**súbela al añadir cualquier finalidad o proveedor nuevo**, porque un sí para AdSense no
cubre añadir después otra red.

---

## 7. Agentes autónomos

Cuatro agentes **actúan por su cuenta**: publican eventos, moderan anuncios y auditan
datos, sin esperar aprobación.

| Agente | Frecuencia | Capacidades |
| --- | --- | --- |
| `auditor-datos` | semanal | `report:issue` |
| `eventos` | diaria | `publish:events` |
| `moderacion` | diaria | `moderate:listings` |
| `vigilancia` | diaria | `report:issue` |

### Qué los hace seguros

No una revisión humana de cada acción, sino **barreras deterministas que corren después
del modelo** (`agents/guardrails.ts`). El prompt es una petición; esto es una barrera:

1. **Capacidades declaradas.** `assertCapability()` antes de cada escritura.
2. **Fuentes acotadas.** `allowedSources` limita la búsqueda, e `isAllowedSource()` vuelve
   a validar cada URL antes de guardarla.
3. **Validación de cada escritura.** Ciudad conocida, fecha en ventana, fuente permitida,
   anuncio realmente pendiente.
4. **Topes por ejecución** (`maxWrites`).
5. **Auditoría completa** en `agent_runs` y `agent_actions`.
6. **La persona gana**: la moderación solo toca filas que siguen en `pending`.

### Los datos astronómicos no los escribe ningún agente

Antes había un agente que proponía horarios. Ya no hace falta: se calculan y se validan.
El agente de datos hace lo contrario — **audita las nuestras contra el IGN** y abre
incidencia en GitHub si algo se sale de tolerancia (>10 s, o desacuerdo sobre si un
municipio está en la franja).

El workflow ejecuta `scripts/validate-eclipse.ts` **antes** que los agentes: si el cálculo
no valida, no tiene sentido auditar nada contra él y la ejecución se detiene.

### Uso

```bash
npm run agents:list
npm run agents:run -- --daily
npm run agents:run -- eventos --dry
```

---

## 8. Negocio de gafas de eclipse

Detalle completo en [`docs/negocio-gafas.md`](docs/negocio-gafas.md). Lo esencial:

### Dos hallazgos que condicionan el plan

**1. Poner tu marca en unas gafas te convierte legalmente en el fabricante.** El Reglamento
(UE) 2016/425 dice que quien comercializa un EPI bajo su propio nombre o marca asume todas
las obligaciones del fabricante, y **eso no se traslada por contrato a la fábrica china**:
expediente técnico, evaluación de conformidad, declaración UE de conformidad, marcado CE y
responsabilidad civil por daños.

**2. ISO 12312-2 no basta para vender en España.** Las gafas de eclipse son EPI de
categoría II y necesitan **marcado CE respaldado por un certificado de examen UE de tipo**
emitido por un organismo notificado. Casi todo el producto asiático que se anuncia como
«ISO 12312-2 certified» no lo tiene.

### Proveedor: China con CE propio, sin pasar por la competencia española

Decisión de negocio tomada: **no comprar a marcas españolas** (Eclipseando y similares),
porque sería revender producto de un competidor directo y quedar atado a su precio.

La AAS verifica identidad e ISO 12312-2, **pero no el CE**. Estar en su lista es necesario
y no suficiente. De los cinco fabricantes chinos de esa lista:

| Fabricante | CE / examen UE de tipo |
| --- | --- |
| **Shenzhen Lionstar Technology** | **Confirmado**: CE bajo 2016/425, EN ISO 12312-2:2015, organismo notificado **CCQS (NB 2834)** |
| **Cangnan County Qiwei Craft** | Declara CE cat. II; organismo notificado sin confirmar |
| Shenzhen Shihui Tongda | Declara CE (marca Keyaluo); sin confirmar |
| Hangzhou Retsing Eyewear | Declara CE; solo mayorista, MOQ 1.000 |
| Jaxy Optical Instruments | Sin evidencia de CE |

**Lionstar es el candidato**: CCQS es el mismo organismo notificado que certifica a
Helioclipse y Galaxium, las marcas europeas de referencia.

**Los dos pasos que filtran el mercado entero**, antes de negociar nada:

1. Pedir el **certificado de examen UE de tipo** (Módulo B, 2016/425) con su número y el
   del organismo notificado. No vale una declaración de conformidad ni un informe ISO.
2. Verificar ese organismo en **NANDO** (<https://ec.europa.eu/growth/tools-databases/nando/>)
   y comprobar que está autorizado **para 2016/425** concretamente.

Lista de referencia de la AAS: <https://eclipse.aas.org/eye-safety/viewers-filters>

### Sinergia con las webs

La página `/gafas-de-eclipse` explica precisamente la diferencia entre ISO y CE. **Vende
sin vender**: educa al comprador en el criterio que solo un producto certificado cumple.

Regla que no hay que romper: esa página debe dar el mismo consejo que daría si no
vendiéramos nada. En cuanto se note que está escrita para empujar producto, pierde la
credibilidad que la hace útil — y con ella, el posicionamiento.

---

## 9. Datos legales

Titular configurado en `src/lib/legal-entity.ts` y propagado a las cuatro webs y los dos
idiomas:

- **Titular**: Carlos Delgado
- **DNI**: 48968028Q
- **Domicilio**: Calle González Besada 9, Ceuta, España
- **Correo**: `contacto@<dominio>`, derivado de cada tenant

Aparece en `/aviso-legal`, `/privacidad` y `/contacto`. Lo exige la LSSI (art. 10) y lo
revisa AdSense al aprobar un dominio.

**Pendiente**: dar de alta los buzones `contacto@ceutaeclipse.com`,
`contacto@eclipsecadiz.com`, `contacto@eclipsetarifa.com` y `contacto@eclipsegibraltar.com`
(o redirecciones) antes de publicar.

---

## 10. Comandos

```bash
npm install
npm run dev                          # http://localhost:3000
npm run build
npm run typecheck
npx tsx scripts/validate-eclipse.ts  # OBLIGATORIO tras tocar besselian.ts
npm run agents:list
```

Todas las variables de entorno son opcionales: sin Supabase el directorio sale vacío y sin
AdSense los huecos se muestran como marcadores. Ver `.env.example`.

---

## 11. Reglas del proyecto

Cosas que conviene no romper:

1. **Ningún dato numérico sin fuente o sin cálculo validado.** Lo que no se sabe se dice.
2. **`scripts/validate-eclipse.ts` debe pasar** antes de desplegar. Si falla, algo está mal
   en el cálculo y ningún dato de la web es fiable.
3. **Ningún agente escribe datos astronómicos.**
4. **Los guardarraíles no son opcionales**: un agente que escribe algo nuevo necesita su
   validador en `guardrails.ts` antes que su función en `store.ts`.
5. **`rel="sponsored nofollow"`** en todo enlace comercial saliente.
6. **No duplicar contenido entre dominios propios.**
7. **La guía de seguridad no se suaviza por motivos comerciales.**

---

## 12. Pendiente

- Dar de alta los buzones de contacto (§9). **Bloquea publicar**: la LSSI exige un medio
  de contacto que funcione.
- Mapa interactivo de la franja de totalidad.
- Autenticación para que los negocios gestionen su propia ficha.
- Ampliar el registro de 35 a los 115 municipios (el agente auditor propone los que faltan).
- Comprar los dominios recomendados de §2 antes de que los cojan.
- Escribir a Lionstar y Qiwei pidiendo el certificado de examen UE de tipo (§8).
