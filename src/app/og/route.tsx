import { ImageResponse } from "next/og";
import { getCity, formatDuration, formatObscuration } from "@/lib/eclipse/cities";
import { resolveTenant, tenantCity } from "@/lib/tenants";

export const alt = "Eclipse solar total del 2 de agosto de 2027";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Imagen de compartición generada al vuelo.
 *
 * Se dibuja solo con primitivas para no depender de fuentes ni imágenes externas:
 * cualquier fetch adicional aquí es un punto de fallo y una décima de segundo que
 * paga quien comparte el enlace.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenant = resolveTenant(request.headers.get("host"));
  const locale = searchParams.get("locale") === "en" ? "en" : "es";
  const city = getCity(searchParams.get("city") ?? "") ?? tenantCity(tenant);
  const name = locale === "en" ? (city.nameEn ?? city.name) : city.name;
  const duration = formatDuration(city.eclipse.totalitySeconds, locale);

  /**
   * Título propio, para los posts del blog.
   *
   * Sin `title` se compone la portada genérica de la ciudad. Con él, el titular del
   * post pasa a ser el protagonista y la ciudad y la duración bajan a subtítulo: es
   * lo que hace que dieciséis posts compartidos en redes no se vean idénticos.
   *
   * Se recorta a 90 caracteres porque a partir de ahí el texto no cabe en 630 px de
   * alto sin reducir el cuerpo a un tamaño ilegible en la miniatura de un chat.
   */
  const rawTitle = searchParams.get("title")?.trim();
  const title = rawTitle ? (rawTitle.length > 90 ? `${rawTitle.slice(0, 89)}…` : rawTitle) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px",
          background: "linear-gradient(135deg, #0a0f1e 0%, #131b33 60%, #1c1230 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Corona solar: dos discos concéntricos, el interior negro. */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: `radial-gradient(circle, hsl(${tenant.accentHsl}) 0%, hsl(${tenant.accentHsl} / 0.25) 42%, transparent 62%)`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 40,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "#0a0f1e",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, opacity: 0.75 }}>
          {locale === "en" ? "2 AUGUST 2027" : "2 DE AGOSTO DE 2027"}
        </div>

        {title ? (
          <div
            style={{
              display: "flex",
              fontSize: title.length > 60 ? 54 : 66,
              fontWeight: 900,
              lineHeight: 1.1,
              marginTop: 18,
              maxWidth: 900,
            }}
          >
            {title}
          </div>
        ) : (
          <>
            <div style={{ display: "flex", fontSize: 78, fontWeight: 900, lineHeight: 1.05, marginTop: 14 }}>
              {locale === "en" ? "Total solar eclipse" : "Eclipse solar total"}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 78,
                fontWeight: 900,
                lineHeight: 1.05,
                color: `hsl(${tenant.accentHsl})`,
              }}
            >
              {locale === "en" ? `in ${name}` : `en ${name}`}
            </div>
          </>
        )}

        <div
          style={{
            display: "flex",
            fontSize: 32,
            marginTop: 26,
            opacity: 0.85,
            color: title ? `hsl(${tenant.accentHsl})` : "white",
          }}
        >
          {[
            title ? name : null,
            duration
              ? locale === "en"
                ? `${duration} of totality`
                : `${duration} de totalidad`
              : locale === "en"
                ? `${formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)} partial eclipse`
                : `Eclipse parcial al ${formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)}`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </div>
        <div style={{ display: "flex", fontSize: 26, marginTop: "auto", opacity: 0.6 }}>
          {tenant.domain}
        </div>
      </div>
    ),
    size,
  );
}
