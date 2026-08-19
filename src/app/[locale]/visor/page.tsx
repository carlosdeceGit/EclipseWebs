import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSection } from "@/components/AdSlot";
import { Callout, Section, buttonStyle } from "@/components/ui";
import { ViewerClient, type ViewerDefaults, type ViewerLabels } from "./ViewerClient";
import { cityName, toLocalTime } from "@/lib/eclipse/cities";
import { breadcrumbGraph, buildMetadata, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";
import { isLocale, localePath } from "@/i18n/config";

/*
  Textos de la página.

  Van aquí y no en el diccionario global por la misma razón que los del visor:
  son de una sola pantalla y varios cruzan a un componente de cliente, donde una
  función no puede pasar. Cuando alguna se necesite en otro sitio, se sube.
*/
const COPY = {
  es: {
    // El nombre de la función no es «realidad aumentada» a propósito: la
    // tecnología no es el beneficio, y quien busca esto lo busca con esta frase.
    title: (city: string) => `¿Me lo tapa ese edificio? Dónde estará el Sol en ${city}`,
    h1: "¿Me lo tapa ese edificio?",
    lead: (city: string, time: string) =>
      `Apunta con la cámara del móvil hacia donde vayas a estar el 2 de agosto y te marcamos el punto exacto del cielo donde estará el Sol a las ${time}, el instante del máximo en ${city}. Sirve para lo que ninguna tabla resuelve: saber si desde ese balcón, esa terraza o ese mirador se va a interponer un edificio, una grúa o una montaña.`,
    description: (city: string) =>
      `Superpone la posición del Sol durante el eclipse del 2 de agosto de 2027 sobre la imagen de tu cámara y comprueba si un edificio te tapará la totalidad desde ${city}.`,
    useMyLocation: "Afinar con mi ubicación",
    locating: "Localizando…",
    error: "No hemos podido obtener tu ubicación. Se sigue usando el punto de la ciudad.",
    usingCity: "Calculando sobre",
    usingPoint: "Calculando sobre tu punto:",
    refineHint:
      "Con el punto de la ciudad ya funciona. Afinar con el GPS cambia la dirección del Sol en décimas de grado: importa si estás valorando un balcón concreto.",
    howTitle: "Cómo se usa",
    how: [
      "Colócate donde vayas a estar el día del eclipse. El visor responde por ese punto, no por la ciudad.",
      "Abre la cámara y gira sobre ti mismo hasta que el círculo se ponga sobre el Sol marcado.",
      "Mira qué hay en esa dirección y a esa altura. Si hay un edificio, ese sitio no vale: la totalidad dura minutos y el Sol no se mueve lo suficiente para librarlo.",
      "Si el móvil no tiene brújula o no da rumbo absoluto, usa el ajuste manual: el visor se abre igual.",
    ],
    privacyTitle: "La cámara no graba nada",
    privacy:
      "La imagen se pinta en pantalla y se descarta. No hay captura, no hay lienzo intermedio y no se sube nada a ningún servidor. Al cerrar el visor, el flujo de vídeo se detiene.",
    accuracyTitle: "Qué precisión tiene",
    accuracy:
      "El azimut y la altura del Sol salen del mismo cálculo besseliano que las tablas y son fiables dentro de una fracción de grado. Lo que no es exacto es el campo visual de la cámara: el navegador no expone la distancia focal de forma portable, así que el tamaño del círculo es una aproximación deliberadamente estrecha. Úsalo para descartar obstáculos claros, no para medir.",
    otherTools: "Antes de esto, mira",
    locator: "Tus horas exactas en tu punto",
    where: "Miradores de la ciudad, con la pega de cada uno",
  },
  en: {
    title: (city: string) => `Will that building block it? Where the Sun will be in ${city}`,
    h1: "Will that building block it?",
    lead: (city: string, time: string) =>
      `Point your phone's camera where you plan to be on 2 August and we mark the exact spot in the sky where the Sun will be at ${time}, the moment of maximum eclipse in ${city}. It answers what no table can: whether a building, a crane or a hillside will get in the way from that balcony, terrace or viewpoint.`,
    description: (city: string) =>
      `Overlay the Sun's position during the 2 August 2027 eclipse on your camera view and check whether a building will block totality from ${city}.`,
    useMyLocation: "Refine with my location",
    locating: "Locating…",
    error: "We could not get your location. Still using the city's point.",
    usingCity: "Computing for",
    usingPoint: "Computing for your point:",
    refineHint:
      "The city's point already works. Refining with GPS shifts the Sun's direction by fractions of a degree: it matters when you are judging one specific balcony.",
    howTitle: "How to use it",
    how: [
      "Stand where you plan to be on eclipse day. The viewer answers for that point, not for the city.",
      "Open the camera and turn until the circle sits over the marked Sun.",
      "Look at what is in that direction and at that height. If a building is there, the spot is no good: totality lasts minutes and the Sun does not move far enough to clear it.",
      "If your phone has no compass or gives no absolute heading, use manual adjustment: the viewer opens all the same.",
    ],
    privacyTitle: "The camera records nothing",
    privacy:
      "The image is painted on screen and discarded. There is no capture, no intermediate canvas and nothing is uploaded anywhere. Closing the viewer stops the video stream.",
    accuracyTitle: "How accurate it is",
    accuracy:
      "The Sun's azimuth and altitude come from the same Besselian computation as the tables and are reliable to a fraction of a degree. What is not exact is the camera's field of view: browsers do not expose focal length portably, so the circle's size is a deliberately narrow approximation. Use it to rule out obvious obstacles, not to measure.",
    otherTools: "Before this, see",
    locator: "Your exact timings at your point",
    where: "The city's viewpoints, each with its catch",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const name = cityName(city, locale);
  const copy = COPY[locale];

  return buildMetadata({
    tenant,
    city,
    locale,
    path: "/visor",
    title: copy.title(name),
    description: copy.description(name),
  });
}

/**
 * Visor solar, con dirección propia.
 *
 * Estaba enterrado dentro del localizador y solo aparecía después de calcular un
 * resultado: no se podía enlazar, ni compartir, ni posicionar en un buscador.
 * Para la función más diferencial de la red eso era el error de producto más
 * caro que había. Ahora tiene URL, metadatos, imagen social y enlaces entrantes
 * desde la home, la barra inferior y el header.
 */
export default async function ViewerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const name = cityName(city, locale);
  const copy = COPY[locale];

  // Hora del máximo sin segundos: la usa el titular, y ahí los segundos sobran.
  const maximumShort = toLocalTime(city.eclipse.maximum, city.timeZone, false) ?? city.localTimes.maximum;

  const defaults: ViewerDefaults = {
    cityName: name,
    sunAzimuthDeg: Number(city.eclipse.sunAzimuthDeg.toFixed(1)),
    sunAltitudeDeg: Number(city.eclipse.sunAltitudeDeg.toFixed(1)),
    maximumTime: city.localTimes.maximum,
    timeZone: city.timeZone,
  };

  const labels: ViewerLabels = {
    useMyLocation: copy.useMyLocation,
    locating: copy.locating,
    error: copy.error,
    usingCity: copy.usingCity,
    usingPoint: copy.usingPoint,
    refineHint: copy.refineHint,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbGraph(tenant, locale, [
            { name: tenant.brand, path: "/" },
            { name: copy.h1, path: "/visor" },
          ]),
        )}
      />

      <section className="mx-auto max-w-6xl px-4 pb-2 pt-10 sm:pt-14">
        <p className="datum-label" style={{ color: "hsl(var(--accent))" }}>
          {name}
        </p>
        <h1 className="mt-2 font-black" style={{ fontSize: "var(--step-4)", lineHeight: 1.02 }}>
          {copy.h1}
        </h1>
        <p className="mt-4 max-w-3xl" style={{ color: "hsl(var(--muted))", fontSize: "var(--step-1)" }}>
          {copy.lead(name, maximumShort)}
        </p>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ViewerClient locale={locale} defaults={defaults} labels={labels} />
          </div>

          <div className="space-y-6">
            <Callout title={copy.privacyTitle}>{copy.privacy}</Callout>
            <Callout title={copy.accuracyTitle}>{copy.accuracy}</Callout>
          </div>
        </div>
      </Section>

      <Section title={copy.howTitle}>
        <ol className="max-w-3xl space-y-4">
          {copy.how.map((step, i) => (
            <li key={step} className="flex gap-4">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style={{ background: "hsl(var(--accent) / 0.15)", color: "hsl(var(--accent))" }}
              >
                {i + 1}
              </span>
              <span style={{ color: "hsl(var(--muted))" }}>{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={localePath(locale, "/localizador")} {...buttonStyle("primary")}>
            {copy.locator}
          </Link>
          <Link href={localePath(locale, "/donde-verlo")} {...buttonStyle("ghost")}>
            {copy.where}
          </Link>
        </div>
      </Section>

      <AdSection name="footer" locale={locale} />
    </>
  );
}
