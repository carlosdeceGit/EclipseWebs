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
4. **Gafas de eclipse** como negocio subsidiario (ver §9).

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
| **`eclipsecadiz.es`** (canónico) | Cádiz | 2 min 55 s | Con contenido propio; falta DNS y alta en Vercel |
| **`eclipsetarifa.es`** (canónico) | Tarifa | 4 min 39 s | Con contenido propio; falta DNS y alta en Vercel |
| **`eclipsegibraltar.com`** (canónico) | Gibraltar | 4 min 27 s | Con contenido propio; falta DNS y alta en Vercel |

Los `.com` de Cádiz y Tarifa y el `.es` de Gibraltar están declarados como **alias** aunque
no estén en propiedad. Un alias que no resuelve no cuesta nada y, si algún día se compran,
sirven el mismo contenido y canonicalizan al principal sin tocar código.

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

### El visor solar de realidad aumentada

`/visor` —y el localizador, cuando ya hay un resultado— superpone sobre la imagen de la
cámara trasera **el recorrido entero del Sol durante el eclipse**, con los cinco
contactos marcados. Sirve para lo que ninguna tabla resuelve: si desde ese balcón
concreto un edificio se va a interponer.

No añade ni un dato nuevo. Las posiciones salen del mismo cálculo besseliano —
`eclipseTrack()` en `besselian.ts` resuelve la posición del Sol y la fracción de disco
cubierta para cualquier instante—; `src/lib/eclipse/solar-viewer.ts` solo compara esa
dirección con hacia dónde apunta el teléfono. Ocho cosas que no conviene revertir:

- **El visor no enseña un instante, enseña el eclipse.** Entre el primer y el último
  contacto el Sol recorre unos 24° de azimut y sube casi 30°: el tejado que no tapa el
  máximo puede tapar perfectamente el principio de la totalidad. Enseñar solo el máximo
  era responder media pregunta. El arco se dibuja y el panel «Momento» salta a
  cualquiera de los cinco contactos o desliza por toda la ventana.
- **La guía son flechas, no un párrafo.** Con el móvil en alto apuntando al cielo nadie
  lee tres líneas de texto: `edgeMarkers()` coloca una flecha por eje desviado, pegada al
  borde hacia el que hay que moverse y con los grados que faltan. Los ajustes —rumbo
  manual, corrección de la brújula— viven en un panel que se abre, no ocupando media
  pantalla mientras se busca el Sol.
- **Las dos flechas nunca se apilan** y respetan `EdgeInsets`. Con el objetivo lejos las
  dos anclas se recortan al mismo margen y una tapaba a la otra, así que el usuario veía
  una sola de las dos correcciones que necesitaba; y una flecha centrada en un borde
  ocupado por la interfaz no la ve nadie. Las dos cosas están en la función pura y
  validadas.
- **Las pantallas completas se montan con un portal en `document.body`.** Un ancestro con
  `transform` se convierte en el bloque contenedor de sus descendientes `fixed`, y el
  visor va dentro de una `<section class="reveal">`, que lleva `transform` por su
  animación de entrada: sin el portal, `fixed inset-0` no cubría la ventana sino la
  sección, y la cámara salía recortada en media pantalla. **Es la trampa gemela de la de
  `isolation: isolate`, y aplica a cualquier capa a pantalla completa que se añada dentro
  de una `.reveal`.**
- **El rumbo se calcula con los tres ángulos**, no con `360 − alpha`. Esa simplificación
  solo vale con el móvil plano sobre una mesa, y aquí se usa levantado apuntando al cielo.
  En iOS la referencia absoluta es `webkitCompassHeading`, que se convierte a `alpha`
  antes de entrar en la misma matemática.
- **El modo manual es obligatorio.** Hay móviles sin magnetómetro y WebViews que no
  entregan rumbo absoluto: el visor se abre igual y el rumbo se ajusta a mano. Si en ocho
  segundos no ha llegado un rumbo absoluto, cambia solo. La pantalla de calibración lo
  dice **antes** de encender la cámara: lleva una aguja en vivo y declara si el rumbo que
  llega es absoluto, con la precisión que reporte el sistema. Ninguna barra de progreso
  inventada: se enseña lo que el navegador entrega y nada más.
- **El campo visual es una aproximación declarada**: el navegador no expone la distancia
  focal de forma portable. Está documentado en el módulo y es deliberadamente estrecho.
- **La cámara no graba nada.** El stream se pinta y se para al cerrar. Sin canvas, sin
  captura y sin subida — y eso es exactamente lo que dice `/privacidad`.

El recorrido **solo trae los puntos con el Sol por encima del horizonte**. La geometría
besseliana sitúa al observador respecto al cono de sombra sin preguntarse si mira hacia
el Sol, así que en las antípodas sale un eclipse perfectamente calculado que ocurre bajo
tierra; dibujarlo sería mandar a alguien a apuntar la cámara al suelo.

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
    navigation.ts          taxonomía de navegación: los cuatro grupos
  lib/
    tenants.ts             dominio → ciudad, marca y color
    tenant-context.ts      lectura del tenant/idioma en la petición
    legal-entity.ts        datos identificativos del titular (LSSI)
    seo.ts                 metadatos, hreflang y JSON-LD
    ads.ts                 slots de AdSense y tarifas propias
    eclipse/
      besselian.ts         EL CÁLCULO. No tocar sin correr la validación.
      cities.ts            registro de localidades (solo lo no calculable)
      solar-viewer.ts      geometría del visor AR: rumbo, elevación, proyección y guía
      event.ts             datos del evento independientes de la localidad
      types.ts
    db/
      supabase.ts          clientes, degradan a null sin variables
      listings.ts          directorio y clasificados
      events.ts            agenda de actos de la ciudad
      moderation.ts        consultas del panel: lo pendiente y lo ya decidido
    admin/
      auth.ts              puerta del panel: contraseña, sesión firmada
  content/
    faq.ts                 FAQ bilingües
    articles/              guías largas bilingües, una por archivo
      locales.ts           guías exclusivas de un dominio (`cities: [...]`)
    blog/                  posts del blog, agrupados por ciudad
    local/                 conocimiento local por ciudad: miradores, accesos, clima
  components/
    ui.tsx                 primitivas: PageHeader, Section, Datum, Card, Callout…
    SiteChrome.tsx         pie, y la envoltura de servidor de la navegación
    SiteNav.tsx            header, menú y barra inferior: cliente, por el camino actual
    Icon.tsx               iconos de navegación y el disco de la marca
    Article.tsx            armazón de guías y posts: índice, carril, anterior/siguiente
    Blocks.tsx             renderizador de bloques, compartido por guías y blog
    EclipseTimeline.tsx    los cinco contactos dibujados a escala
    ViewerPromo.tsx        el Visor 360º en la portada, con su escena del cielo
    EventCard.tsx          un acto de la agenda
    HomeLocator.tsx        el localizador embebido en la portada
    art/                   ilustraciones SVG propias (ver §7)
  app/
    [locale]/              todas las páginas
    [locale]/blog/         índice del blog y página de cada post
    [locale]/localizador/  localizador y visor AR de cámara (cliente)
    [locale]/visor/        el Visor 360º con URL propia
    [locale]/publicar/     alta pública: negocio, evento o anuncio de particular
    [locale]/directorio/   alojamiento, eventos y actividades de la ciudad
    admin/                 panel de moderación, fuera de [locale] y con noindex
    calendar.ics           el eclipse como cita de calendario, por tenant
    api/eclipse            datos de todas las localidades
    api/circumstances      datos para coordenadas arbitrarias
    og/                    imagen social generada al vuelo
    icon/                  favicon con el acento del dominio
    ads.txt                autorización de inventario, por tenant
    blog/rss.xml           feed del blog de la ciudad del dominio
    llms.txt, robots.ts, sitemap.ts
agents/                    sistema de agentes autónomos
scripts/validate-eclipse.ts
scripts/validate-solar-viewer.ts
supabase/schema.sql
docs/negocio-gafas.md
```

### Multi-tenant

`src/proxy.ts` guarda el `Host` en la cabecera `x-eclipse-host` y `resolveTenant()` la
traduce a un tenant. Todo lo demás —metadatos, JSON-LD, sitemap, `llms.txt`, contenido—
se deriva de ahí.

Probar un dominio en local:

```bash
curl -H "Host: eclipsetarifa.es" localhost:3000/
curl -H "Host: ceutaeclipse.com" localhost:3000/en/horarios

# Una guía exclusiva solo responde en su dominio: 200 aquí, 404 en los demás.
curl -o /dev/null -w "%{http_code}\n" -H "Host: eclipsetarifa.es" localhost:3000/levante
curl -o /dev/null -w "%{http_code}\n" -H "Host: eclipsecadiz.es"  localhost:3000/levante
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

Sustituir el topónimo no basta: cuatro guías idénticas con la ciudad cambiada siguen siendo
contenido duplicado. Lo que de verdad separa un dominio de otro es la **capa de
conocimiento local**.

#### `src/content/local/`: lo que el cálculo no da

Un perfil local por ciudad con lo único que no se puede calcular ni deducir:

| Campo | Qué guarda | Dónde sale |
| --- | --- | --- |
| `angle` | Qué hace distinto ver el eclipse aquí, en clave logística | `/donde-verlo` |
| `whyHere` | Qué significa el eclipse para esta ciudad | `/guia` |
| `spots[]` | Miradores con nombre propio, **cada uno con su pega** | `/donde-verlo`, como `h3` |
| `access[]` | Cómo se llega de verdad a esta ciudad | `/como-llegar` |
| `bottleneck` | El cuello de botella concreto del día 2 | `/como-llegar` |
| `stay[]` | Dónde dormir cuando el consejo genérico no sirve | `/alojamiento` |
| `weather` | El riesgo meteorológico local, que aquí nunca es el mismo | `/clima` |

Sin perfil, el tenant sirve el texto genérico y todo sigue funcionando. Con perfil, las
cinco guías se reescriben solas alrededor de su ciudad.

El `caveat` de cada mirador **es obligatorio**. Un sitio recomendado sin su pega es una
recomendación falsa: el 2 de agosto la diferencia entre un buen punto y una trampa no es la
vista, es el aparcamiento, el aforo y por dónde se sale.

#### Guías exclusivas de un dominio

`src/content/articles/locales.ts`. Un artículo con `cities: [...]` **solo existe en esos
dominios**: fuera devuelve 404 y no entra en el sitemap ni en `llms.txt`.

| Dominio | URL exclusiva | De qué va |
| --- | --- | --- |
| `ceutaeclipse.es` | `/ferry` | El único acceso es por mar, y el levante cancela salidas |
| `eclipsecadiz.es` | `/borde-de-la-franja` | Cádiz está al norte del centro: cuánto se gana bajando |
| `eclipsetarifa.es` | `/levante` | La barra de nubes del Estrecho y el plan B hacia el oeste |
| `eclipsegibraltar.com` | `/frontera` | La cola de frontera y la nube que fabrica el Peñón |

Las tablas de duraciones de esos artículos se resuelven desde `cities.ts` con el cálculo
besseliano: no hay ni una cifra escrita a mano.

Al añadir una guía exclusiva hay que enlazarla desde algún sitio. La home lo hace sola
(`localCards` va delante de las genéricas en `src/app/[locale]/page.tsx`); si no, queda
huérfana.

#### Estado real de la duplicación

Medido sobre los cuatro dominios en producción, como fracción de frases idénticas:

| Página | Compartido | Por qué |
| --- | --- | --- |
| `/donde-verlo` | 29–32 % | Miradores propios |
| `/como-llegar` | 30–33 % | Accesos y cuello de botella propios |
| `/clima` | 33–39 % | Fenómeno local distinto en cada sitio |
| `/alojamiento` | 38–41 % | Alternativas propias |
| `/fotografia` | 61 % | Técnica universal |
| `/guia` | 66–69 % | Qué es un eclipse: universal, con cierre local |
| `/fuentes` | 68 % | Método de cálculo: es el mismo, y debe serlo |
| `/gafas-de-eclipse` | 75 % | Normativa europea: es la misma |
| `/seguridad` | 76 % | **No se toca.** Ver regla 7 |

Las cuatro últimas son conocimiento universal y **no deben diferenciarse por SEO**: variar
la guía de seguridad para posicionar es exactamente lo que prohíbe la regla 7. Si Google
llega a filtrarlas, la solución correcta es un `canonical` cruzado hacia un dominio de
referencia, no reescribirlas.

### Diseño e interfaz

El sistema vive entero en `src/app/globals.css`: color, tipografía fluida con `clamp()`,
espaciado, curvas y duraciones de movimiento. Los componentes consumen variables y no
inventan valores; ninguno escribe un color literal, o los cuatro dominios dejarían de
distinguirse.

Decisiones que conviene no revertir:

- **El hero lleva imagen de fondo por tenant y crédito obligatorio.** `Tenant.hero`
  declara `src`, `focal` y un `credit` que **no es opcional a propósito**: la imagen es
  una ilustración generada con IA de un eclipse que todavía no ha ocurrido, así que
  cualquier imagen realista de ese momento es necesariamente inventada. El pie del hero
  lo dice con esas palabras. Presentarla como fotografía sería gastar justo la
  credibilidad que sostiene el resto de la web —la de publicar cifras calculadas y
  declarar su margen de error— a cambio de una imagen bonita. Los dos botones son las
  dos preguntas de quien llega, «¿se verá desde tu sitio?» y «dónde verlo aquí», no
  tareas administrativas. El tenant «hub» lleva la misma imagen porque las
  previsualizaciones de Vercel salen por un host `*.vercel.app` y caen ahí: sin eso,
  revisar el hero en una preview enseñaría el estado sin imagen.
- **El dato es el protagonista.** `Datum` en `ui.tsx` y la clase `.datum` existen para
  que la cifra calculada —«4 min 48 s»— sea el objeto más grande de la pantalla, con la
  etiqueta encima y pequeña. Es el activo diferencial de la red: enterrarlo en una fila
  de tabla era regalarlo.
- **Toda página tiene un `<h1>`.** Lo emite `PageHeader`. Ocho páginas no lo tenían
  porque `Section` emite `<h2>`: un documento sin encabezado de primer nivel deja a
  quien usa un lector de pantalla sin saber de qué va, y a los buscadores sin la señal
  más fuerte que hay.
- **El header es una isla flotante de una sola fila** que se contrae al bajar con
  `animation-timeline: scroll()`. Sustituye a un header de dos filas cuya segunda era
  una tira de once enlaces con scroll horizontal de la que solo se veían tres. Arriba
  quedan cuatro apartados fijos —**Horarios, Visor 360º, Guía y Blog**—, el
  conmutador de idioma y el botón de publicar. Los mismos cuatro están en la barra
  inferior de móvil: `HEADER_NAV` y `MOBILE_NAV` son la misma constante a propósito.
- **El conmutador de idioma es un control segmentado ES/EN, no una bandera.** Una
  bandera identifica un país, no una lengua: para quien lee en inglés desde Marruecos
  o desde Irlanda la bandera correcta no existe. Enseñar las dos opciones a la vez
  dice además que la web está en dos idiomas, cosa que un enlace «English» no dice.
  Cada mitad apunta a la traducción de la página actual.
- **Una sola taxonomía para las dos pantallas.** `src/i18n/navigation.ts` define cuatro
  grupos —Cuándo, Dónde, Ir, Saber— y de ahí beben el menú, la barra inferior de móvil
  y el pie. Que móvil y escritorio agrupen distinto obliga a aprender dos webs.
- **El menú es la API de `popover`**: capa superior, cierre con Escape y al pulsar
  fuera, sin una línea de JavaScript. Donde no haya soporte, el pie lleva todos los
  enlaces igualmente.
- **Todo lo que se mueve respeta `prefers-reduced-motion`**, y las entradas por scroll
  usan `animation-timeline: view()` bajo `@supports`: cero JavaScript, cero
  observadores, y donde no hay soporte el contenido simplemente ya está visible.
- **`isolation: isolate` en el cuerpo, no `position` en los hijos.** El campo de
  estrellas se coloca por detrás con `z-index: -1`. La alternativa —subir el contenido
  a una capa superior— rompía el header: Tailwind v4 emite sus utilidades dentro de
  `@layer utilities`, y **una regla sin capa gana a cualquier regla en capa por
  especificidad que tenga la otra**, así que una regla suelta con `position: relative`
  convertía en `relative` el `sticky` del header y el `fixed` de la barra inferior. Ni
  `:where()` lo evitaba. Es la trampa a recordar al escribir CSS global en este
  proyecto.
- **Las tablas llevan `.data-table`**: cabecera pegajosa, cifras de ancho fijo en
  las celdas numéricas y realce de fila al pasar el puntero. Una tabla ancha sin
  realce de fila es donde más fácil se pierde el renglón.
- **Barra de duración en `/horarios`, diferencia en el ranking de la portada.** No
  es una inconsistencia: la tabla larga baja de 4 min 51 s a menos de dos minutos
  y ahí una barra anclada al cero compara de verdad; las diez primeras localidades
  van de 4 min 51 s a 4 min 18 s y sus barras salen todas entre el 89 % y el 100 %,
  sin distinguir nada. Recortar el eje para que parezcan distintas es el engaño
  clásico del gráfico de barras, así que en la portada va la diferencia en
  segundos, que es exacta y responde la pregunta real: cuánto se pierde bajando
  por la lista. **Esa diferencia se calcula restando los valores ya redondeados**,
  no los crudos, para que la tabla cuadre si alguien hace la resta a mano; y si
  redondea a cero se muestra una raya, porque declaramos precisión de segundos y
  una diferencia de décimas no es un dato.
- **La navegación sabe en qué página está porque lo pregunta en el cliente.** Ésta
  costó dos intentos y conviene no volver al primero. Un layout de App Router **no se
  vuelve a renderizar al navegar entre páginas del mismo segmento**, así que un camino
  pasado como propiedad desde el layout se queda congelado en el de la página por la
  que se entró. Con eso, el conmutador de idioma seguía apuntando a la home después de
  pinchar cualquier enlace —cambiar de idioma te sacaba de la página— y el apartado
  marcado como activo era el anterior. Una recarga lo tapaba, que es por lo que pasó
  desapercibido. Ahora `src/components/SiteNav.tsx` lee `usePathname()`, que sí cambia
  en cada navegación. Se normalizan los prefijos `/es` y `/en` para que el servidor
  —que ve la ruta reescrita— y el navegador produzcan lo mismo y no haya discrepancia
  de hidratación. Al cliente solo cruzan cadenas: el diccionario, el registro de
  tenants y el cálculo de las 35 localidades se quedan en el servidor.

### El armazón de lectura

Las guías (`/seguridad`, `/guia`, `/clima`…) y los posts del blog son el mismo objeto de
lectura para quien llega de un buscador, así que comparten armazón:
`src/components/Article.tsx`. Eran prosa corrida en una columna centrada, con cinco
secciones de media y ninguna forma de saber qué había dentro sin leerlo entero.

- **El índice sale de los propios `h2`**, que ya llevaban ancla estable. No hay lista de
  secciones escrita a mano en ningún sitio: si alguien añade o renombra un `h2`, el índice
  le sigue solo. Con menos de tres secciones no se dibuja.
- **Un solo `<nav>` en el documento.** Va en el DOM entre la cabecera y el cuerpo —su sitio
  en móvil— y en pantalla ancha la colocación automática de la rejilla lo manda al carril
  pegajoso de la derecha. Duplicarlo y ocultar uno con `hidden` mete dos veces la misma
  navegación en el árbol de accesibilidad.
- **No marca la sección activa.** Hacerlo sin JavaScript no es fiable, y un índice que
  señala la sección equivocada es peor que uno que no señala ninguna.
- **El titular de artículo va un escalón por debajo del de página** (`--step-3` frente a
  `--step-4`). El de una página es una etiqueta corta; el de un artículo es una frase
  entera y al tamaño mayor ocupaba cuatro líneas antes de empezar el texto.
- **Anterior y siguiente al final**, en el orden editorial del registro de guías o del
  blog. Antes una guía terminaba y la única salida era el menú. Solo entre guías
  editoriales: encadenar el aviso legal detrás de la de seguridad no es una lectura que
  nadie quiera seguir.
- **Las preguntas frecuentes de las guías ahora se ven.** Existían solo como datos
  estructurados: se le daban a Google y no se le enseñaban a nadie. Además de contenido
  desaprovechado, marcar como `FAQPage` algo que no está visible en la página es motivo
  declarado para dejar de mostrar el resultado.
- **El carril reserva el mejor hueco de anuncio de la web, y no le quita nada al
  lector.** En pantalla ancha esa columna está vacía por debajo del índice: el anuncio
  acompaña toda la lectura sin empujar el texto ni un píxel. Comprobado midiendo la
  posición del cuerpo del artículo con los huecos apagados y encendidos: idéntica, así
  que activar publicidad no mueve la maquetación. En móvil no se dibuja —el carril va
  ahí entre la entradilla y el primer párrafo, y meter un bloque de 600 px delante del
  artículo es el patrón que hunde una web—. El carril lleva un tope de altura con
  desplazamiento propio porque un elemento pegajoso más alto que la ventana deja su
  parte de abajo fuera de alcance para siempre.
- **En `/ciudades` no hay barras, hay diferencia en segundos.** Es la misma decisión que en
  el ranking de la portada y por el mismo motivo ampliado: en una parrilla de tres columnas
  las longitudes quedan separadas por el ancho de una tarjeta y ya no se comparan, y arriba
  de la lista salen todas casi llenas y se leen como un subrayado del número. La barra sigue
  donde funciona, que es la columna de tabla de `/horarios`. Empate al segundo redondeado
  —Tánger y Tetuán— se dice «igual que la primera», no «−0 s» ni «la más larga».

### Dos funciones que ganaron protagonismo

- **`/visor`**: el visor de realidad aumentada tiene URL propia, metadatos e imagen
  social. Antes vivía enterrado dentro del localizador y solo aparecía tras calcular un
  resultado: no se podía enlazar, ni compartir, ni posicionar. Para la función más
  diferencial de la red, ése era el error de producto más caro que había. Se titula
  «¿Me lo tapa ese edificio?» y no «realidad aumentada» a propósito: la tecnología no
  es el beneficio. Enseña el **recorrido completo** del Sol con los cinco contactos, no
  solo el máximo: ver dónde estará el Sol a las 10:47 no dice si el tejado lo tapa a las
  10:45, y ésa es exactamente la pregunta.
- **`/publicar`**: un único formulario para las tres cosas que alguien de la ciudad
  quiere dar de alta —su negocio o alojamiento, un acto con fecha, o un anuncio
  entre particulares—. Antes solo existía el alta de clasificados y no había manera
  de meter un hotel ni una observación pública: el directorio se quedaba vacío
  esperando altas que nadie sabía cómo hacer. El tipo se elige arriba y el
  formulario se adapta; `/clasificados/nuevo` redirige aquí de forma permanente.
- **`/calendar.ics`**: el eclipse como cita de calendario, con las horas de la ciudad
  del tenant y dos avisos —el día antes y quince minutos antes de C1—. Es el único
  mecanismo de retención que no depende de una lista de correo: quien entra hoy no
  vuelve solo dentro de once meses, pero su teléfono sí le avisa. Las horas salen del
  cálculo, no de una tabla escrita a mano.

---

## 5. SEO y GEO

- Metadatos, canonical y `hreflang` por dominio e idioma, con `x-default` al español.
- JSON-LD: `Event`, `Place`, `WebSite`, `Organization`, `FAQPage`, `BreadcrumbList`,
  `Dataset` para las tablas de duraciones y `Blog`/`BlogPosting` para el blog.
- `sitemap.xml` con alternates de idioma por URL. `robots.txt` por tenant. `blog/rss.xml`
  con los posts de la ciudad del dominio.
- **`llms.txt`** con los hechos destilados, las tablas completas y **el método y el margen
  de error declarados**, para que un modelo que cite nuestras cifras pueda citar también su
  precisión.
- API pública en `/api/eclipse` y `/api/circumstances` con CORS abierto: que otros la usen
  genera enlaces y menciones. `/api/circumstances` publica además **`sunTrack`**, la
  posición del Sol y la fracción de disco cubierta a lo largo de todo el eclipse: es lo que
  dibuja el visor, cuesta cuatro kilobytes y es la parte de estos datos más difícil de
  reproducir para quien no resuelva los elementos besselianos.
- Imagen OG generada al vuelo por ciudad e idioma, solo con primitivas (sin fuentes ni
  imágenes externas: en el borde, cada fetch es un punto de fallo).
- **Favicon por dominio en `/icon`**, con el acento del tenant y en SVG. Antes no había
  ninguno: `/favicon.ico` devolvía 404 en cada carga y en los resultados de móvil de
  Google, donde el icono va pegado al título, ésta era la única web sin marca. Un icono
  estático obligaría a un archivo por dominio y a acordarse de regenerarlo al añadir el
  quinto.
- **Crawlers de IA permitidos a propósito.** Que ChatGPT, Claude, Perplexity y Gemini citen
  estas páginas es un canal de captación, no una fuga.

El primer párrafo de cada página carga los datos duros por delante (qué, dónde, cuándo,
cuánto dura): es lo que copian los motores generativos.

---

## 6. Monetización: detalles de implementación

**Pasos de activación, en orden y con lo que bloquea cada uno:
[`docs/activar-adsense.md`](docs/activar-adsense.md).** Resumen: el código está listo y el
buzón `contacto@ceutaeclipse.es` ya recibe; lo que falta es la cuenta de AdSense y un CMP
certificado por Google.

- Un hueco sin configurar **no se dibuja**: ni marcador, ni borde, ni altura reservada, ni
  el contenedor que lo envuelve. `AdSection` existe precisamente para que la `<Section>`
  desaparezca con el anuncio y no queden secciones vacías con su relleno vertical.
  El coste asumido es un salto de layout **el día de activar** —y solo ese día— en lugar de
  recuadros vacíos de aquí a entonces. Con el hueco activo sí se reserva la altura, que es
  lo que evita el salto mientras carga cada anuncio.
- Sin `NEXT_PUBLIC_ADSENSE_CLIENT_ID` no hay publicidad de ninguna clase y `/ads.txt`
  devuelve 404. Eso permite desplegar antes de tener AdSense aprobado.
- **El ID de cliente y la publicidad activa son dos cosas distintas**, y `adsActive()` las
  separa. Con solo el cliente configurado, `/ads.txt` publica el identificador —que es como
  Google verifica la propiedad del dominio, semanas antes de encender nada— pero no aparece
  el banner de cookies ni se carga el script de Google. Eso espera a que exista además algún
  ID de bloque: no se pide consentimiento para una finalidad que todavía no existe.
- **El hueco `sidebar` es el único que no desplaza nada al activarse.** Vive en el
  carril de las guías y los posts, donde esa columna está vacía por debajo del índice.
  Comprobado midiendo la posición del cuerpo del artículo con los huecos apagados y
  encendidos: idéntica. Por eso es por el que conviene empezar. La tabla de qué mueve
  cada uno de los cinco está en `docs/activar-adsense.md` §6.
- **`/ads.txt` se genera por tenant** desde el ID de cliente, y es obligatorio para que
  Google autorice el inventario.
- **La verificación de propiedad ante Google** se hace por `ads.txt` o por la etiqueta
  `<meta name="google-adsense-account">` que emite el layout, las dos derivadas del mismo
  ID de cliente. Ninguna carga nada en el navegador, así que ambas son compatibles con el
  consentimiento previo. La que no vale es el fragmento de código de AdSense en el `<head>`:
  cargaría el script de Google en todas las páginas antes de que nadie haya aceptado nada.
- Los enlaces salientes comerciales llevan `rel="sponsored nofollow"`. **No es opcional**:
  marcarlos mal hunde el dominio entero.
- RLS de Supabase impide que un usuario se autoasigne nivel de pago o se autoapruebe.

### Quién pregunta: `NEXT_PUBLIC_CMP`

`consentMode()` decide quién pide el consentimiento, y cambia el comportamiento legal
de la web:

| Valor | Quién pregunta | Cuándo carga el script de Google |
| --- | --- | --- |
| vacío (por defecto) | nuestro banner | solo tras un sí explícito |
| `google` | el CMP certificado de Google | desde el principio |

Con `google` el script se carga sin esperar **a propósito**: el mensaje de
consentimiento de Google viaja dentro de ese script, así que bloquearlo sería impedir
que se pregunte. A cambio se obtiene una sola pregunta y la señal TCF v2.2 que Google
exige. Es una variable y no una constante para poder volver atrás con un redespliegue
el día que el mensaje de Google falle o se despublique.

**Solo poner `google` cuando el mensaje esté creado y publicado para ese dominio**, y
con el formato de tres opciones. Con la variable puesta y sin mensaje publicado, la
web cargaría Google sin preguntar nada.

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

### Base de datos y panel de moderación

El proyecto de Supabase es **`eclipsewebs`** (organización Demiurgos, región
`eu-west-3` / París). `supabase/schema.sql` es el esquema aplicado: cuatro tablas
—`listings`, `events`, `agent_runs`, `agent_actions`— con RLS activo en todas.

Dos detalles del esquema que no son cosméticos y conviene no revertir:

- La función del trigger lleva `set search_path = ''`. Sin él, quien pueda crear
  objetos en un esquema del `search_path` puede secuestrar a qué tabla resuelve
  el código de la función.
- Las políticas usan `(select auth.uid())` y no `auth.uid()` a secas. Envuelto en
  un subselect se evalúa una vez por consulta; suelto, una vez por fila.

`agent_runs` y `agent_actions` tienen RLS activo **y ninguna política**, a
propósito: eso deniega todo salvo a la service role. El linter lo marca como
aviso informativo y es el comportamiento correcto.

El panel vive en **`/admin`**, fuera de `[locale]`: no tiene versión en inglés,
no tiene tenant, no lleva el header de la web ni el banner de cookies, y sale del
sitemap y de los `hreflang`. Modera una sola persona para los cuatro dominios, así
que **no filtra por tenant**: obligar a entrar cuatro veces sería multiplicar el
trabajo por cuatro sin ganar nada.

Cómo está protegido, en orden de importancia:

1. **Sin `ADMIN_PASSWORD` el panel devuelve 404.** No existe, en vez de enseñar un
   formulario de login a quien pase por ahí.
2. La sesión es una cookie `httpOnly`, `SameSite=Lax`, `path=/admin`, con la
   caducidad firmada por HMAC de la contraseña. Una cookie con fecha futura y
   firma inventada no entra.
3. **Cada acción de escritura vuelve a comprobar la sesión.** Una acción de
   servidor es un endpoint HTTP como cualquier otro: que la página que la dibuja
   esté protegida no protege la acción.
4. La contraseña se compara en tiempo constante sobre digests, así que ni el
   contenido ni la longitud se filtran por el tiempo de respuesta.

El nivel de pago (`tier`) se cambia **aparte** de aprobar. Es lo único del panel
que mueve dinero: subir a destacado va después de cobrar, y mezclarlo con el
visto bueno es el camino directo a regalarlo por descuido.

---

## 7. El blog

Cada dominio tiene su blog: guías largas, específicas de su ciudad y con ilustraciones
propias. Hoy hay **16 posts de Ceuta**, en español e inglés, en `src/content/blog/ceuta/`.

Sirve a tres cosas a la vez: es el volumen editorial que hace defendible una solicitud de
AdSense, cubre las consultas de cola larga que la home no puede cubrir («dónde ver el
eclipse en Ceuta», «cómo llegar», «qué comer»), y da a los motores generativos texto local
que citar.

### Dos reglas que no se rompen

**1. Un post pertenece a una ciudad.** `citySlug` decide dónde se publica: la ruta devuelve
404 si el tenant no es el de esa ciudad, y el índice, el sitemap, el RSS y el `llms.txt` de
los demás dominios ni lo mencionan. No es una preferencia editorial: servir el mismo
artículo en dos dominios propios es contenido duplicado, y la forma más rápida de que
Google se quede con uno e ignore el resto. Cuando se escriban posts de Cádiz, llevarán
`citySlug: "cadiz"` y ocurrirá lo simétrico.

**2. Ninguna cifra se escribe a mano.** El cuerpo de cada post es una función de la ciudad:
las horas de contacto, la duración y la altura del Sol se interpolan del cálculo besseliano
(`hm()` y `durationWords()` en `src/content/blog/helpers.ts`). Si el cálculo se afina, los
textos se afinan con él y no queda ninguna cifra huérfana contradiciendo a las tablas.

### Las ilustraciones

Quince ilustraciones **SVG dibujadas a mano** en `src/components/art/`, sin imágenes
externas ni fuentes remotas. Cada post lleva su portada más una segunda distinta dentro del
texto.

- Son nuestras: no hay licencia que revisar ni una foto de banco que aparezca idéntica en la
  web de la competencia.
- Heredan el color de acento del tenant, así que la misma ilustración encaja en cualquier
  dominio de la red sin generar un archivo por ciudad.
- Las que muestran cifras —`contacts-timeline`, `sun-position`, `duration-bars`— las sacan
  del mismo cálculo que las tablas. Un número dibujado a mano dentro de un SVG es el tipo de
  dato que se queda obsoleto sin que nadie se dé cuenta.
- Las que son esquemas lo dicen dentro del propio dibujo («esquema orientativo, no a
  escala»).

**No hay fotografías, y es a propósito**: no publicamos fotos de las que no tengamos los
derechos. El campo `photo` de `BlogPost` existe para que el día que haya fotos propias de
Ceuta entren sin tocar plantillas.

### Cómo añadir un post

1. Escribirlo en el archivo temático de su ciudad, exportando un `BlogPost`.
2. Añadirlo a `BLOG_POSTS` en `src/content/blog/index.ts`, en el orden editorial.
3. Elegir una `cover` del registro de `art/`. Si además se usa dentro del cuerpo, la portada
   de arriba se omite sola para no duplicarla.
4. Rellenar `related` con slugs que existan.

El sitemap, el RSS, el `llms.txt`, el JSON-LD `BlogPosting`, la imagen OG con su titular y
los minutos de lectura salen solos.

### Negrita en el contenido

`**así**` funciona en párrafos, listas, callouts, FAQ y en el párrafo de entrada. Es la
única marca de Markdown que interpreta el renderizador, a propósito: lo demás sería una
dependencia y una superficie de escape de HTML a cambio de una cursiva.

---

## 8. Agentes autónomos

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

El agente de eventos escribe en la tabla `events`, que **ya se lee desde la web**:
sale en `/directorio` como agenda de la ciudad. Antes se llenaba sin que nadie la
mirara. Además de lo que encuentra el agente, cualquiera puede dar de alta un acto
desde `/publicar`; entra como `pending` y se modera igual, y se le exige el mismo
enlace comprobable que a las fuentes del agente.

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

## 9. Negocio de gafas de eclipse

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

## 10. Datos legales

Titular configurado en `src/lib/legal-entity.ts` y propagado a las cuatro webs y los dos
idiomas:

- **Titular**: Carlos Delgado
- **DNI**: 48968028Q
- **Domicilio**: Calle González Besada 9, Ceuta, España
- **Correo**: `contacto@<dominio>`, derivado de cada tenant

Aparece en `/aviso-legal`, `/privacidad` y `/contacto`. Lo exige la LSSI (art. 10) y lo
revisa AdSense al aprobar un dominio.

`contacto@ceutaeclipse.es` **ya existe y recibe correo**, que es el que corresponde al
único dominio publicado.

**Pendiente**: dar de alta `contacto@eclipsecadiz.es`, `contacto@eclipsetarifa.es` y
`contacto@eclipsegibraltar.com` (o redirecciones) antes de publicar cada uno de esos
dominios. El correo se deriva del tenant, así que la dirección aparece publicada en
cuanto el dominio entra en `TENANTS`: el buzón tiene que existir antes.

---

## 11. Comandos

```bash
npm install
npm run dev                          # http://localhost:3000
npm run build
npm run typecheck
npx tsx scripts/validate-eclipse.ts  # OBLIGATORIO tras tocar besselian.ts
npm run validate:viewer              # OBLIGATORIO tras tocar solar-viewer.ts
npm run agents:list
```

Todas las variables de entorno son opcionales: sin Supabase el directorio sale vacío y sin
AdSense los huecos se muestran como marcadores. Ver `.env.example`.

---

## 12. Reglas del proyecto

Cosas que conviene no romper:

1. **Ningún dato numérico sin fuente o sin cálculo validado.** Lo que no se sabe se dice.
2. **`scripts/validate-eclipse.ts` debe pasar** antes de desplegar. Si falla, algo está mal
   en el cálculo y ningún dato de la web es fiable.
3. **Ningún agente escribe datos astronómicos.**
4. **Los guardarraíles no son opcionales**: un agente que escribe algo nuevo necesita su
   validador en `guardrails.ts` antes que su función en `store.ts`.
5. **`rel="sponsored nofollow"`** en todo enlace comercial saliente.
6. **No duplicar contenido entre dominios propios.** En el blog eso significa que cada post
   declara su `citySlug` y solo se sirve en el dominio de esa ciudad.
7. **La guía de seguridad no se suaviza por motivos comerciales.**
8. **Ninguna cifra escrita a mano en el contenido.** Horas, duraciones y altura del Sol se
   interpolan del cálculo, también en los posts y dentro de las ilustraciones.
9. **Ninguna imagen de la que no tengamos los derechos, y ninguna imagen generada sin
   decir que lo es.** Las ilustraciones son SVG propio; si algún día hay fotos, van por
   el campo `photo` y con su crédito. La imagen del hero es generada y su `credit` es
   obligatorio en el tipo: describe un eclipse que aún no ha ocurrido.
10. **Ningún color literal en un componente.** Todo sale de las variables de
    `globals.css`, o los cuatro dominios dejan de distinguirse.
11. **Toda página nueva empieza por `PageHeader`**, que es quien emite el `<h1>`.
12. **Toda animación nueva se apaga con `prefers-reduced-motion`.**
13. **Nada que dependa de la ruta actual se pasa como propiedad desde el layout.** Un
    layout de App Router no se vuelve a renderizar al navegar dentro de su segmento y
    ese valor se queda congelado. Lo que necesite la ruta lo pregunta en el cliente con
    `usePathname()`, normalizando el prefijo de idioma.

---

## 13. Pendiente

- Dar de alta los buzones de contacto del resto de dominios (§10). El de
  `ceutaeclipse.es` ya funciona; los demás bloquean publicar esos dominios, porque la
  LSSI exige un medio de contacto que funcione y el revisor de AdSense lo comprueba.
- **CMP certificado por Google** antes de encender los bloques de anuncios. El banner actual
  cumple con la AEPD pero no es un CMP de IAB TCF v2.2, que es lo que exige la política de
  consentimiento de la UE de Google. Detalle y opciones en `docs/activar-adsense.md` §5.
  Del CMP propio de Google hay que elegir el mensaje de **tres opciones** (consentir, no
  consentir, gestionar): el de dos esconde el rechazo tras «Gestionar opciones» y la AEPD
  exige que rechazar esté en la primera capa y con la misma visibilidad que aceptar.
- Marcar `ceutaeclipse.es` como dominio principal en Vercel, para que redirija `www` y no al
  contrario.
- **Publicar Cádiz, Tarifa y Gibraltar**: el contenido ya está, falta apuntar el DNS al
  proyecto de Vercel y dar de alta los tres dominios con su `www` en *Settings → Domains*.
  Marcar el ápex como principal, igual que en Ceuta.
- Escribir los perfiles locales de Algeciras, La Línea y Melilla antes de comprar sus
  dominios: un dominio sin `src/content/local/` sirve la guía genérica y no compite.
- **`circumstancesAt()` da eclipse donde el Sol está bajo el horizonte.** Para Sídney
  devuelve `isPartial: true` con un 43 % de disco cubierto y el Sol a 49° **por debajo**
  del horizonte: la geometría besseliana resuelve la posición del observador respecto al
  cono de sombra sin comprobar que mire hacia el Sol. No afecta a ningún dato publicado
  —las 35 localidades tienen el Sol entre 25° y 53° de altura— pero sí a `/api/circumstances`
  y al localizador para quien pregunte desde fuera de la zona. El visor ya lo esquiva
  (`eclipseTrack()` filtra por altura y devuelve un recorrido vacío), así que lo que falta
  es decidir la semántica de los dos indicadores: condicionar `isPartial`/`isTotal` a que
  el Sol esté sobre el horizonte tiene un caso de borde real —un eclipse que empieza antes
  del orto y se ve a medias— que hay que resolver antes de tocarlo.
- Mapa interactivo de la franja de totalidad.
- «Cuánto ganas si bajas X km»: dado un punto, cuántos segundos más de totalidad se
  consiguen desplazándose y en qué dirección. Es *la* pregunta de Cádiz y de Málaga, el
  cálculo ya la resuelve y nadie la responde.
- Modo día D: el 2 de agosto de 2027 la portada debería ser un reloj en vivo con la fase
  actual y el aviso de ponerse y quitarse el filtro. Ese día concentrará más tráfico que
  los once meses anteriores juntos.
- Posts de blog para Cádiz, Tarifa y Gibraltar cuando se activen esos dominios: hoy su
  `/blog` sale vacío y con `noindex`, que es el comportamiento correcto mientras no haya
  contenido propio de esas ciudades.
- Autenticación para que los negocios gestionen su propia ficha. Hoy el alta desde
  `/publicar` es anónima y se modera a mano, que es lo correcto para empezar pero no
  escala si el directorio se llena.
- Que el panel avise. Hoy hay que entrar a `/admin` para ver si hay algo esperando;
  un correo diario con el recuento pendiente evitaría que una ficha se quede una
  semana sin publicar.
- Ampliar el registro de 35 a los 115 municipios (el agente auditor propone los que faltan).
- Comprar los dominios recomendados de §2 antes de que los cojan.
- Escribir a Lionstar y Qiwei pidiendo el certificado de examen UE de tipo (§9).

---

## 14. Registro de sesiones

Historial de qué se hizo en cada sesión. Se añade por arriba y no se reescribe: la
verdad vigente del proyecto está en las secciones de antes, no aquí.

### 2026-08-24 — El visor solar deja de marcar un punto y enseña el eclipse entero

- **Qué se hizo:**
  - **El recorrido del Sol, calculado.** `skyPositionAt()` y `eclipseTrack()` en
    `src/lib/eclipse/besselian.ts` resuelven la posición del Sol y la fracción de disco
    cubierta para **cualquier instante**, no solo para el máximo. La conversión de
    coordenadas horarias a horizontales se extrajo a `horizontalCoordinates()` y ahora la
    comparten el máximo de las tablas y cada punto del recorrido: tenerla escrita dos veces
    era la forma segura de que un día el visor apuntase a un sitio y la tabla dijese otro.
    Para Ceuta el arco va de 85,5° / 24,9° en C1 a 109,5° / 53,0° en C4.
  - **Tres funciones puras nuevas** en `solar-viewer.ts`: `alignmentState()` (buscando,
    cerca, alineado), `edgeMarkers()` (las flechas de guía, con `EdgeInsets` por lado) y
    `projectPath()` (el recorrido proyectado, partido por los puntos que quedan a la
    espalda). Las tres validadas: `validate-solar-viewer.ts` pasa de 63 a 95 comprobaciones
    y `validate-eclipse.ts` añade cinco sobre el recorrido, incluida la que compara el
    máximo del arco con el de las tablas (Δ ≈ 4·10⁻⁷ grados).
  - **Pantalla del visor rehecha**, con el móvil en alto como caso de uso: hora simulada y
    salida arriba, las dos lecturas del objetivo en fila debajo, flechas ámbar grandes con
    los grados que faltan pegadas al borde hacia el que hay que girar, banda de estado
    abajo y dos paneles que se abren —«Momento» y «Ajustes»—. Los dos deslizadores que
    antes ocupaban media pantalla se fueron al panel de ajustes.
  - **Panel «Momento»**: los cinco contactos con su hora, un deslizador por toda la ventana
    del eclipse y el interruptor del arco. El arco se dibuja con sus contactos marcados, y
    las etiquetas que se solapan se suprimen —durante la totalidad C2, el máximo y C3 caen
    en el mismo píxel—.
  - **Pantalla de calibración** con comprobación en vivo: aguja de brújula, rumbo actual y
    si lo que llega es rumbo absoluto, más la precisión que declare el sistema. Y el aviso
    ocular como bloque propio, con el botón principal reconociéndolo.
  - **Tokens `--viewer-*` en `globals.css`** (regla 10): el visor es la única pantalla que
    no se dibuja sobre nuestro fondo sino sobre lo que ve la cámara, así que tiene paleta
    propia y paneles casi opacos. El componente ya no lleva ni un color literal.
  - **`sunTrack` en `/api/circumstances`**, con hora UTC y local, azimut, altura, cobertura
    y el contacto de cada punto.
  - Los pasos de uso de `/visor` en los dos idiomas cuentan lo del recorrido.

- **Decisiones tomadas:**
  - **El visor enseña el eclipse, no un instante.** Entre C1 y C4 el Sol se desplaza unos
    24° y sube casi 30°: enseñar solo el máximo respondía media pregunta, porque el tejado
    que no tapa el máximo puede tapar el principio de la totalidad.
  - **Nada de barra de calibración inventada.** La referencia que trajo el cliente enseña
    un «0 % calibrado» que ningún navegador puede medir. Aquí se enseña lo que el sistema
    entrega —si el rumbo es absoluto y su precisión declarada— y una aguja que se mueve:
    es la misma comprobación, y es verdad.
  - **El recorrido solo trae puntos con el Sol sobre el horizonte**, para no dibujar un
    arco bajo tierra en los puntos donde el cálculo besseliano da eclipse sin comprobar que
    el observador mire hacia el Sol (ver §13).
  - Las flechas se separan cuando se apilarían y respetan los márgenes de la interfaz. Las
    dos reglas viven en la función pura, no en el componente, para poder validarlas.

- **Un fallo de fondo encontrado y corregido:**
  - **El visor a pantalla completa no cubría la pantalla.** Medido en un navegador real, el
    diálogo `fixed inset-0` ocupaba desde el píxel 428 hacia abajo en vez de la ventana
    entera, con la cámara recortada y el header por encima. La causa: un ancestro con
    `transform` se convierte en el bloque contenedor de sus descendientes `fixed`, y el
    visor va dentro de una `<section class="reveal">`, cuya animación de entrada deja
    `transform` puesto. Se resuelve montando las dos pantallas completas con `createPortal`
    en `document.body`. Es la trampa gemela de la de `isolation: isolate` de la sesión
    anterior y estaba en producción desde que el visor existe.

- **Pendiente / próximos pasos:**
  - Decidir la semántica de `isPartial`/`isTotal` cuando el Sol está bajo el horizonte
    (§13, primer punto): el visor ya lo esquiva, la API todavía no.
  - Probar el visor en un móvil de verdad: el rumbo se validó con eventos inyectados en
    Chromium, que comprueba la matemática y la interfaz pero no el magnetómetro ni el campo
    visual real de la cámara.
  - El resto sigue en §13.

### 2026-08-23 — Rediseño de UX/UI completo, tres funciones nuevas, panel de moderación y dos fallos de fondo

- **Qué se hizo:**
  - **Sistema de diseño** rehecho en `src/app/globals.css`: tipografía fluida con
    `clamp()`, cuatro superficies, tonos de acento derivados con `color-mix` en oklab,
    tokens de sombra y foco visible. Entradas por scroll con `animation-timeline:
    view()` bajo `@supports`, sin JavaScript.
  - **Header nuevo**: isla flotante de una fila que se contrae al bajar, con los cuatro
    apartados que pidió el cliente —Horarios, Visor 360º, Guía, Blog—, conmutador de
    idioma segmentado y botón de publicar. Menú a pantalla completa con la API de
    `popover`. Taxonomía única en `src/i18n/navigation.ts` para menú, barra inferior y
    pie.
  - **Tres funciones nuevas**: `/visor` (el visor AR con URL propia, metadatos e imagen
    social; antes solo aparecía dentro del localizador y no se podía enlazar),
    `/publicar` (un formulario para negocio, evento o anuncio de particular) y
    `/directorio` convertido en el de la ciudad, que por fin lee la tabla `events` que
    el agente diario llenaba sin que ninguna página la mirara. Más `/calendar.ics`.
  - **Panel de moderación en `/admin`** sobre el Supabase `eclipsewebs`, fuera de
    `[locale]`, con la puerta construida antes que el panel: 404 sin `ADMIN_PASSWORD`,
    cookie firmada por HMAC, comprobación de sesión en cada acción de escritura y
    comparación de contraseña en tiempo constante.
  - **Hero** con imagen de fondo por tenant (generada con IA, 1,9 MB JPEG → 45 KB WebP)
    y crédito obligatorio.
  - **Armazón de lectura** para guías y posts en `src/components/Article.tsx`: índice
    sacado de los propios `h2`, anclas permanentes, ritmo de secciones y anterior/
    siguiente. Las FAQ de las guías pasan a verse, no solo a darse en JSON-LD.
  - **Blog** con saltos por categoría y estado vacío con su `h1`. **`/ciudades`** con
    puesto y diferencia exacta respecto a la primera.
  - **Favicon por dominio** en `/icon`, que no existía.
  - Fusionadas las PR [#2](https://github.com/carlosdeceGit/EclipseWebs/pull/2) y
    [#3](https://github.com/carlosdeceGit/EclipseWebs/pull/3) a la rama de producción.

- **Decisiones tomadas:**
  - **Barras donde comparan, diferencia donde no.** La barra de duración se queda en la
    columna de tabla de `/horarios`, donde la lista baja de 4 min 51 s a menos de dos
    minutos. En el ranking de la portada y en las tarjetas de `/ciudades` va la
    diferencia en segundos: ahí las barras salían todas entre el 89 % y el 100 % y
    recortar el eje para que parecieran distintas es el engaño clásico del gráfico de
    barras. La diferencia se resta sobre valores **ya redondeados** para que cuadre a
    mano, y un empate al segundo se dice como empate.
  - **El crédito de la imagen del hero es obligatorio en el tipo**, no una convención:
    describe un eclipse que aún no ha ocurrido.
  - **Nada que dependa de la ruta se pasa desde el layout** (regla 13). La navegación
    pasó al cliente; al navegador solo cruzan cadenas.
  - No se toca nada de mailing: no hay a quién enviar todavía.

- **Dos fallos de fondo encontrados y corregidos:**
  - **El campo de estrellas rompía el header.** Tailwind v4 emite sus utilidades dentro
    de `@layer utilities`, y una regla sin capa gana a cualquier regla en capa por
    especificidad que tenga la otra: una regla suelta con `position: relative` convertía
    en `relative` el `sticky` del header y el `fixed` de la barra inferior. Ni `:where()`
    lo evitaba. Se resuelve con `isolation: isolate` en el cuerpo. Se encontró midiendo
    `getComputedStyle(header).position` en un navegador real, no leyendo el código.
  - **El conmutador de idioma llevaba a otra página.** Solo ocurría navegando por
    dentro, porque un layout de App Router no se vuelve a renderizar dentro de su
    segmento; una recarga lo tapaba y por eso pasó desapercibido meses. Arrastraba
    además el apartado activo del header y de la barra inferior.
  - Menores: el escape de punto y coma de iCalendar no escapaba nada (`"\;"` en
    JavaScript es `";"`), ocho páginas no tenían `<h1>`, y `/favicon.ico` devolvía 404
    en cada carga.

- **Pendiente / próximos pasos:**
  - **`ADMIN_PASSWORD` en Vercel**: sin ella `/admin` devuelve 404 y la moderación es
    inaccesible.
  - **Comprobar que la integración de Vercel enlazó el proyecto correcto**: la
    `SUPABASE_URL` tiene que contener `wbjfsxgvdynobmsfdtqv`. Las lecturas contra
    Supabase siguen sin verificarse en vivo: la política de red del entorno de
    desarrollo deniega el CONNECT a `*.supabase.co`.
  - Al encender el hueco `sidebar`, mirar si el bloque oculto en móvil acumula
    impresiones sin rellenar (ver `docs/activar-adsense.md` §6).
  - Imágenes de hero para Cádiz, Tarifa y Gibraltar cuando existan.
  - El resto sigue en §13.
