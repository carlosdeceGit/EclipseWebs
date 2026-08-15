# EclipseWebs

Red multidominio de guías sobre el **eclipse solar total del 2 de agosto de 2027** en el
sur de España, en español e inglés. Un solo código y un solo despliegue sirven todos los
dominios; cada uno habla de su ciudad.

## Por qué existe

La franja de totalidad cruza el estrecho de Gibraltar y cubre Ceuta, Melilla, Gibraltar y
115 municipios de Cádiz, Málaga, Granada y Almería. Es un evento con fecha fija, audiencia
enorme y una ventana de monetización que se abre ahora y se cierra el 3 de agosto de 2027.
El objetivo es posicionar con casi un año de antelación para capturar ese tráfico por tres
vías: publicidad programática, fichas de pago en el directorio y clasificados.

## Lo que hace distinto a este proyecto

**Los datos del eclipse se calculan, no se copian.** `src/lib/eclipse/besselian.ts`
resuelve las circunstancias locales a partir de los elementos besselianos publicados por
la NASA, con el procedimiento del *Explanatory Supplement to the Astronomical Almanac*.

Eso da los cinco contactos, la duración, la magnitud, el porcentaje de disco cubierto y la
posición del Sol para **cualquier coordenada del planeta**, no solo para las localidades
que alguien haya tabulado. Es lo que permite el localizador, y lo que hace que añadir un
municipio sea añadir su nombre y sus coordenadas.

### Validación

`scripts/validate-eclipse.ts` compara el cálculo con valores publicados de forma
independiente y corre en CI antes de cada despliegue:

| Punto | Calculado | Publicado | Δ | Fuente |
| --- | --- | --- | --- | --- |
| Máximo del eclipse (Egipto) | 6 min 22,5 s | 6 min 22,6 s | −0,1 s | NASA |
| Ceuta | 4 min 48,4 s | 4 min 48 s | +0,4 s | IGN |
| Tarifa | 4 min 38,7 s | 4 min 38 s | +0,7 s | IGN |
| Melilla | 4 min 33,2 s | 4 min 33 s | +0,2 s | IGN |
| Algeciras | 4 min 28,1 s | 4 min 27 s | +1,1 s | IGN |
| La Línea | 4 min 24,7 s | 4 min 23 s | +1,7 s | IGN |
| Cádiz | 2 min 54,7 s | 2 min 54 s | +0,7 s | IGN |
| Málaga | 1 min 52,1 s | 1 min 48 s | +4,1 s | IGN |
| Sevilla (ocultación) | 98,4 % | 98 % | +0,4 pp | IGN |

Málaga está en el borde norte de la franja, donde la duración varía muy deprisa con la
posición; el resto queda dentro de dos segundos. La anchura de la franja calculada en el
punto de máximo (258,8 km) coincide con los 257,7 km de la NASA.

## Arquitectura

```
src/
  proxy.ts                 resuelve tenant e idioma antes de los Server Components
  i18n/                    configuración y diccionarios es/en
  lib/
    tenants.ts             dominio → ciudad, marca y color
    seo.ts                 metadatos, hreflang y JSON-LD
    ads.ts                 slots de AdSense y tarifas propias
    eclipse/
      besselian.ts         el cálculo del eclipse
      cities.ts            registro de localidades (solo lo que no se puede calcular)
    db/                    Supabase y consultas de anuncios
  content/                 FAQ y guías largas, bilingües
  components/
  app/
    [locale]/              todas las páginas
    api/eclipse            datos de todas las localidades
    api/circumstances      datos para coordenadas arbitrarias
    og, llms.txt, robots, sitemap
agents/                    sistema de agentes autónomos
scripts/validate-eclipse   validación del cálculo (corre en CI)
supabase/schema.sql        tablas, índices y políticas RLS
docs/negocio-gafas.md      investigación sobre el negocio de gafas
```

### Multi-tenant

`src/proxy.ts` guarda el `Host` en una cabecera y `resolveTenant()` la traduce a un
tenant. **Añadir un dominio es añadir una entrada en `TENANTS` y apuntar el DNS.**

Los textos se generan a partir de la ciudad, no se copian entre dominios: publicar el
mismo contenido en varias webs propias es la forma más rápida de que Google se quede con
una e ignore el resto.

### Idiomas

Español sin prefijo (`/horarios`) e inglés bajo `/en` (`/en/horarios`). El proxy reescribe
internamente a `/es`, lo que nunca asoma en la URL: la audiencia principal es española y
las URLs más valiosas no deben cargar con un prefijo ni con una redirección.

El inglés no es una traducción literal. Cambian los ejemplos y el encuadre, porque quien
busca en inglés viene de fuera y necesita otras cosas (aeropuertos, diferencia horaria con
Marruecos, dónde comprar filtros antes de viajar).

## Empezar

```bash
npm install
npm run dev              # http://localhost:3000
npm run build
npm run typecheck
npx tsx scripts/validate-eclipse.ts
```

Para ver un dominio concreto en local, manda la cabecera `Host`:

```bash
curl -H "Host: eclipsetarifa.com" localhost:3000/
curl -H "Host: ceutaeclipse.com" localhost:3000/en/horarios
```

Todas las variables de entorno son opcionales: sin Supabase el directorio sale vacío y sin
AdSense los huecos se muestran como marcadores. Ver `.env.example`.

## SEO y GEO

- Metadatos, canonical y hreflang por dominio e idioma, con `x-default` al español.
- JSON-LD: `Event`, `Place`, `WebSite`, `Organization`, `FAQPage`, `BreadcrumbList` y
  `Dataset` para las tablas de duraciones.
- `sitemap.xml` con alternates de idioma por URL; `robots.txt` por tenant.
- `llms.txt` con los hechos destilados, las tablas completas y **el método y el margen de
  error declarados**, para que un modelo que cite nuestras cifras pueda citar su precisión.
- API pública en `/api/eclipse` y `/api/circumstances` con CORS abierto.
- Imagen OG generada al vuelo, por ciudad e idioma, sin dependencias externas.
- Crawlers de IA permitidos a propósito.

## Monetización

1. **Programática.** AdSense por defecto. Los huecos reservan altura aunque no haya
   anuncio, para no penalizar CLS. Con volumen conviene migrar a Ezoic o Mediavine.
2. **Directorio.** Ficha básica gratis, destacada y patrocinio de ciudad de pago.
3. **Clasificados.** Gratis entre particulares, con moderación automática.
4. **Gafas de eclipse.** Negocio subsidiario. Ver [`docs/negocio-gafas.md`](docs/negocio-gafas.md).

Los enlaces salientes comerciales llevan `rel="sponsored nofollow"`. No es opcional.

## Agentes

Cuatro agentes actúan por su cuenta: publican eventos, moderan anuncios y auditan los
datos. Lo que los hace seguros son barreras deterministas que corren después del modelo,
no una revisión humana de cada acción. Ver [`agents/README.md`](agents/README.md).

## Pendiente

- Completar los datos identificativos en las páginas legales (obligatorio por LSSI y
  requisito para que AdSense apruebe el dominio). Están marcados como `[PENDIENTE]`.
- Banner de consentimiento de cookies antes de activar la publicidad.
- Mapa interactivo de la franja de totalidad.
- Autenticación para que los negocios gestionen su propia ficha.
- Ampliar el registro a los 115 municipios (el agente auditor propone los que faltan).
