import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSection } from "@/components/AdSlot";
import { Badge, Card, Datum, PageHeader, Section } from "@/components/ui";
import { citiesByTotality, citiesOutsideTotality, cityName, formatDuration, formatObscuration } from "@/lib/eclipse/cities";
import { ECLIPSE } from "@/lib/eclipse/event";
import { buildMetadata, datasetGraph, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";
import { isLocale, localePath } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const tenant = await currentTenant();

  return buildMetadata({
    tenant,
    city: tenantCity(tenant),
    locale,
    path: "/ciudades",
    title:
      locale === "es"
        ? "Dónde se ve el eclipse total: localidad por localidad"
        : "Where the total eclipse is visible: location by location",
    description:
      locale === "es"
        ? "Duración de la totalidad y horarios en cada ciudad de la franja del eclipse del 2 de agosto de 2027, y qué se verá desde las capitales que quedan fuera."
        : "Length of totality and timings for every location in the path of the 2 August 2027 eclipse, plus what the cities outside will see.",
  });
}

export default async function CitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const tenant = await currentTenant();
  const current = tenantCity(tenant);
  const inBand = citiesByTotality();
  const outside = citiesOutsideTotality();
  const { byProvince, total } = ECLIPSE.totalityMunicipalities;
  // La escala de las barras: anclada al cero y con el máximo de la propia lista.
  // Aquí una barra sí discrimina —la lista baja de 4 min 51 s a menos de dos
  // minutos—, al revés que en el ranking corto de la portada, donde todas salían
  // entre el 89 % y el 100 % y por eso allí va la diferencia en segundos.
  const longest = inBand[0]?.eclipse.totalitySeconds ?? 0;
  const shortest = inBand[inBand.length - 1]?.eclipse.totalitySeconds ?? 0;
  const top = formatDuration(longest, locale);
  const bottom = formatDuration(shortest, locale);
  // `formatDuration` devuelve null sin totalidad, así que la entradilla solo se
  // escribe cuando hay dos extremos que enseñar. Con la lista vacía se cae al
  // título de la sección en vez de imprimir «De null a null».
  const scale =
    top && bottom
      ? locale === "es"
        ? `De ${top} a ${bottom}. Cada ficha dice cuánto se pierde respecto a la primera.`
        : `From ${top} down to ${bottom}. Each card says how much is lost against the first.`
      : undefined;

  /**
   * Cuánto se pierde respecto a la localidad más larga de la lista.
   *
   * Aquí no va una barra, y no es un descuido. Una barra anclada al cero compara
   * bien dentro de una columna de tabla —por eso sigue en `/horarios`—, pero en
   * una parrilla de tres columnas las longitudes quedan separadas por el ancho de
   * una tarjeta y ya no se comparan; encima, arriba de la lista salen todas casi
   * llenas y se leen como un subrayado del número. La diferencia en segundos es
   * exacta, cabe en una línea y responde la pregunta real: cuánto cuesta elegir
   * este sitio en vez del mejor.
   *
   * Se resta sobre los valores **ya redondeados**, igual que en el ranking de la
   * portada, para que quien haga la resta a mano con las cifras que ve obtenga
   * exactamente este número.
   */
  function lost(seconds: number, rank: number, l: typeof locale): string {
    if (rank === 0) return l === "es" ? "La más larga de la lista" : "The longest on the list";
    const diff = Math.round(longest) - Math.round(seconds);
    // Empate al segundo redondeado. Tánger y Tetuán se separan por décimas y la
    // web declara precisión de segundos: decir «−0 s» afirmaría una diferencia
    // que no estamos en condiciones de sostener, y llamar «la más larga» a la
    // segunda sería directamente falso.
    if (diff <= 0) return l === "es" ? "Igual que la primera" : "Level with the first";
    const m = Math.floor(diff / 60);
    const sec = diff % 60;
    const amount = m > 0 ? (sec === 0 ? `${m} min` : `${m} min ${sec} s`) : `${sec} s`;
    return l === "es" ? `−${amount} que la primera` : `−${amount} against the first`;
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(datasetGraph(tenant, locale))} />

      <PageHeader
        eyebrow={locale === "es" ? "Toda la franja" : "The whole path"}
        title={locale === "es" ? "Localidades dentro de la franja" : "Locations inside the path"}
        lead={
          locale === "es"
            ? `El eclipse será total en Ceuta, en Melilla, en Gibraltar y en ${total} municipios andaluces. Estas son las localidades principales, ordenadas por duración.`
            : `The eclipse is total in Ceuta, Melilla, Gibraltar and ${total} Andalusian municipalities. These are the main locations, ordered by duration.`
        }
      >
        {/* El reparto por provincias en cifras protagonistas y no en tarjetas con un
            número suelto: es el dato que sitúa el tamaño real del evento, y hasta
            ahora competía en peso con el nombre de la provincia. */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(byProvince).map(([province, count]) => (
            <Datum
              key={province}
              size="md"
              label={province}
              value={String(count)}
              note={locale === "es" ? "municipios en la franja" : "municipalities in the path"}
            />
          ))}
        </div>
      </PageHeader>

      <Section
        title={locale === "es" ? "Ordenadas por duración de la totalidad" : "Ordered by length of totality"}
        lead={scale}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inBand.map((c, i) => (
            <Link key={c.slug} href={localePath(locale, `/ciudades/${c.slug}`)} className="block">
              <Card interactive className="h-full">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold">
                      {/* El puesto delante del nombre: sin él, una parrilla de
                          treinta y cinco tarjetas parece desordenada aunque no lo
                          esté, y el orden es la única razón de leerla. */}
                      <span className="tabular mr-2 text-sm" style={{ color: "hsl(var(--faint))" }}>
                        {i + 1}
                      </span>
                      {cityName(c, locale)}
                    </h3>
                    <p className="mt-0.5 text-xs" style={{ color: "hsl(var(--muted))" }}>
                      {c.province}
                    </p>
                  </div>
                  {c.slug === current.slug && <Badge>{locale === "es" ? "estás aquí" : "you are here"}</Badge>}
                </div>

                <p className="datum mt-4" style={{ fontSize: "var(--step-3)", textWrap: "nowrap" }}>
                  <span className="tabular">{formatDuration(c.eclipse.totalitySeconds, locale)}</span>
                </p>
                <p className="mt-1 text-xs tabular-nums" style={{ color: "hsl(var(--faint))" }}>
                  {c.localTimes.totalityStart} – {c.localTimes.totalityEnd}
                </p>
                <p className="mt-3 text-sm" style={{ color: "hsl(var(--muted))" }}>
                  {c.hook[locale]}
                </p>
                {/* La comparación va al pie y separada: es un dato distinto del
                    resto de la ficha —relativo, no propio de la localidad— y con
                    el mismo tratamiento que la entradilla se confundía con ella. */}
                <p
                  className="mt-4 border-t pt-3 text-xs font-semibold"
                  style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--faint))" }}
                >
                  {lost(c.eclipse.totalitySeconds, i, locale)}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <AdSection name="listing" locale={locale} />

      {outside.length > 0 && (
        <Section
          title={locale === "es" ? "Fuera de la franja" : "Outside the path"}
          lead={
            locale === "es"
              ? "Aquí el eclipse se verá parcial. Entre el 99% y el 100% no hay comparación posible: merece la pena el desplazamiento."
              : "Here the eclipse is partial. There is no comparison between 99% and 100%: the trip is worth it."
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {outside
              .sort((a, b) => b.eclipse.obscuration - a.eclipse.obscuration)
              .map((c) => (
                <Link key={c.slug} href={localePath(locale, `/ciudades/${c.slug}`)} className="block">
                  <Card interactive className="h-full">
                    <h3 className="font-bold">{cityName(c, locale)}</h3>
                    <p className="mt-0.5 text-xs" style={{ color: "hsl(var(--muted))" }}>
                      {c.province}
                    </p>
                    <p className="mt-3 text-2xl font-black tabular-nums" style={{ color: "hsl(var(--muted))" }}>
                      {formatObscuration(c.eclipse.obscuration, c.eclipse.isTotal)}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "hsl(var(--muted))" }}>
                      {locale === "es" ? "del Sol cubierto, sin totalidad" : "of the Sun covered, no totality"}
                    </p>
                    <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
                      {c.hook[locale]}
                    </p>
                  </Card>
                </Link>
              ))}
          </div>
        </Section>
      )}
    </>
  );
}
