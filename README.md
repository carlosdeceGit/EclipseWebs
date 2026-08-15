# EclipseWebs

Red multidominio de guías sobre el **eclipse solar total del 2 de agosto de 2027** en
el sur de España. Un solo código y un solo despliegue sirven todos los dominios; cada
uno habla de su ciudad.

## Por qué existe

La franja de totalidad cruza el estrecho de Gibraltar y cubre Ceuta, Melilla y 115
municipios de Cádiz, Málaga, Granada y Almería. Es un evento con fecha fija, audiencia
enorme y una ventana de monetización que se abre ahora y se cierra el 3 de agosto de
2027. El objetivo del proyecto es posicionar con más de un año de antelación para
capturar ese tráfico por tres vías: publicidad programática, fichas de pago en el
directorio y clasificados.

## Arquitectura

```
src/
  proxy.ts                 propaga el Host a los Server Components (Next 16)
  lib/
    tenants.ts             dominio → ciudad, marca y color
    tenant-context.ts      lectura del tenant en cada petición
    seo.ts                 metadatos y JSON-LD
    ads.ts                 slots de AdSense y tarifas propias
    eclipse/               dataset del eclipse (tipos, evento, ciudades)
    db/                    Supabase y consultas de anuncios
  content/                 FAQ, guías largas y páginas legales
  components/              chrome, cuenta atrás, fichas, huecos de anuncio
  app/                     rutas
agents/                    sistema de agentes diarios
supabase/schema.sql        tablas, índices y políticas RLS
```

### Multi-tenant

`src/proxy.ts` guarda el `Host` en una cabecera y `resolveTenant()` la traduce a un
tenant. Todo lo demás —metadatos, JSON-LD, sitemap, `llms.txt`, contenido— se deriva
de ahí. **Añadir un dominio nuevo es añadir una entrada en `TENANTS` y apuntar el DNS.**

Los textos se generan a partir de la ciudad, no se copian entre dominios: publicar el
mismo contenido en varias webs propias es la forma más rápida de que Google se quede
con una e ignore el resto.

## Empezar

```bash
npm install
npm run dev            # http://localhost:3000 sirve el tenant "hub"
npm run build          # compilación de producción
npm run typecheck
```

Para ver un dominio concreto en local, manda la cabecera `Host`:

```bash
curl -H "Host: ceutaeclipse.com" localhost:3000/
```

Todas las variables de entorno son opcionales: sin Supabase el directorio sale vacío
y sin AdSense los huecos se muestran como marcadores. Ver `.env.example`.

## Datos del eclipse

Viven en `src/lib/eclipse/cities.ts`, en el repositorio y no en la base de datos, para
que **cada cambio en un dato astronómico quede en el historial de git** con autor y
fecha.

Cada valor lleva un nivel de confianza:

| Confianza | Significado | Qué hace la UI |
| --- | --- | --- |
| `verified` | Contrastado contra la fuente oficial citada | Muestra el dato |
| `reported` | Publicado por fuentes fiables, sin contraste directo | Muestra el dato y avisa |
| `pending` | Sin dato | Escribe "pendiente de verificar" |

**Nunca se rellena un hueco con una estimación.** Las horas de contacto determinan
cuándo es seguro quitarse el filtro solar; un valor inventado no es un error de
producto, es un riesgo para la vista de quien lo lea.

Estado actual: duraciones de Ceuta, Melilla, Algeciras, Cádiz y Málaga tomadas de las
tablas del IGN recogidas por prensa (`reported`). Faltan los cinco contactos completos
de todas las ciudades y las circunstancias del resto de municipios: es la primera
tarea del agente `eclipse-data`.

## SEO y GEO

- Metadatos y canonical por dominio, con la ciudad y la fecha en el título.
- JSON-LD: `Event`, `Place`, `WebSite`, `Organization`, `FAQPage`, `BreadcrumbList`.
- `sitemap.xml` y `robots.txt` generados por tenant.
- `llms.txt` con los hechos clave destilados para motores generativos.
- API pública en `/api/eclipse` con CORS abierto, para que otros la citen.
- Imagen OG generada al vuelo, sin dependencias externas.
- Crawlers de IA permitidos a propósito: que ChatGPT, Claude, Perplexity y Gemini
  citen estas páginas es un canal de captación, no una fuga.

## Monetización

1. **Programática.** AdSense por defecto. Los huecos reservan altura aunque no haya
   anuncio, para no penalizar CLS. Con volumen conviene migrar a Ezoic o Mediavine.
2. **Directorio.** Ficha básica gratis, destacada y patrocinio de ciudad de pago.
3. **Clasificados.** Gratis entre particulares, con moderación.

Los enlaces salientes comerciales llevan `rel="sponsored nofollow"`. No es opcional.

## Agentes

Cuatro agentes mantienen la red al día desde GitHub Actions. Ver
[`agents/README.md`](agents/README.md).

La regla que ordena el diseño: **los agentes no escriben datos astronómicos**. Dejan
propuestas con su fuente en `data_proposals` y una persona las acepta.

## Pendiente

- Contrastar los cinco contactos de cada ciudad contra la tabla oficial del IGN.
- Completar los datos identificativos en las páginas legales (obligatorio por LSSI
  y requisito para que AdSense apruebe el dominio).
- Banner de consentimiento de cookies antes de activar la publicidad.
- Mapa interactivo de la franja de totalidad.
- Versión en inglés (hay mucho turista de eclipse internacional). El `hreflang` está
  deliberadamente desactivado hasta que esas páginas existan.
- Autenticación para que los negocios gestionen su propia ficha.
