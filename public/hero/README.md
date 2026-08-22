# Imágenes de hero

Una por ciudad, opcional. Sin imagen el hero dibuja su corona en SVG, así que
este directorio puede estar vacío y la web se ve bien igual.

## Cómo añadir una

1. Guarda el archivo aquí como `<citySlug>.webp` — `ceuta.webp`, `cadiz.webp`,
   `tarifa.webp`, `gibraltar.webp`.
2. Declárala en la entrada del tenant, en `src/lib/tenants.ts`:

   ```ts
   hero: {
     src: "/hero/ceuta.webp",
     credit: "Ilustración generada con IA. El eclipse aún no ha ocurrido: no es una fotografía.",
     focal: "70% 35%",
   },
   ```

## Requisitos

| Qué | Por qué |
| --- | --- |
| **2560 × 1440** o similar, 16:9 | Es un fondo a sangre; por debajo de 2000 px se ve blando en pantallas densas. |
| **WebP, por debajo de 400 KB** | Es lo primero que carga la portada. Un JPEG de 3 MB hunde el LCP en 4G, que es como llega la mayoría. |
| **Tercio superior izquierdo despejado** | Ahí van el titular y el distintivo de fecha. Con detalle en esa zona el texto deja de leerse. |
| **Sin texto ni marcas de agua** | El titular lo pone la web. |

## El crédito no es opcional

El campo `credit` es obligatorio en el tipo `Tenant["hero"]`, y por una razón
concreta: **el eclipse del 2 de agosto de 2027 todavía no ha ocurrido**. Cualquier
imagen realista de ese eclipse es necesariamente inventada, y publicarla sin decirlo
la convierte en un documento falso. En una web cuyo argumento entero es que sus
cifras se calculan y se validan, ése es exactamente el activo que no conviene gastar.

Si algún día hay una fotografía real —del eclipse de 2027 o de cualquier otro—, el
crédito pasa a ser el del autor y la licencia, que es lo que pide la regla 9 del
proyecto.
