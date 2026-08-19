import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, Section } from "@/components/ui";
import { ClassifiedForm } from "./ClassifiedForm";
import { buildMetadata } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";
import { cityName } from "@/lib/eclipse/cities";
import { isLocale } from "@/i18n/config";

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

  return buildMetadata({
    tenant,
    city,
    locale,
    path: "/clasificados/nuevo",
    title: locale === "es" ? `Publicar un anuncio gratis en ${name}` : `Post a free ad in ${name}`,
    description:
      locale === "es"
        ? `Publica gratis tu anuncio para los días del eclipse en ${name}: alojamiento, coche compartido, material de observación o servicios.`
        : `Post your ad for free for the eclipse days in ${name}: accommodation, car sharing, viewing gear or services.`,
  });
}

export default async function NewClassifiedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const city = tenantCity(await currentTenant());
  const name = cityName(city, locale);

  return (
    <>
      <PageHeader
        title={locale === "es" ? "Publicar un anuncio" : "Post an ad"}
        lead={
          locale === "es"
            ? `Gratis y sin registro. El anuncio se publica en el tablón de ${name} después de una revisión manual.`
            : `Free, no account needed. Your ad appears on the ${name} board after a manual review.`
        }
      />
      <Section>
        <div className="max-w-2xl">
          <ClassifiedForm locale={locale} />
        </div>
      </Section>
    </>
  );
}
