import { ImageResponse } from "next/og";
import { getCity, formatDuration } from "@/lib/eclipse/cities";
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
  const city = getCity(searchParams.get("city") ?? "") ?? tenantCity(tenant);
  const duration = formatDuration(city.circumstances.totalitySeconds);

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
          2 DE AGOSTO DE 2027
        </div>
        <div style={{ display: "flex", fontSize: 78, fontWeight: 900, lineHeight: 1.05, marginTop: 14 }}>
          Eclipse solar total
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
          en {city.name}
        </div>
        <div style={{ display: "flex", fontSize: 34, marginTop: 28, opacity: 0.85 }}>
          {duration ? `${duration} de totalidad` : "Guía completa, horarios y mapas"}
        </div>
        <div style={{ display: "flex", fontSize: 26, marginTop: "auto", opacity: 0.6 }}>
          {tenant.domain}
        </div>
      </div>
    ),
    size,
  );
}
