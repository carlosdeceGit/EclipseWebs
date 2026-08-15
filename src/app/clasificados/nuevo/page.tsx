import type { Metadata } from "next";
import { Section } from "@/components/ui";
import { ClassifiedForm } from "./ClassifiedForm";
import { buildMetadata } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  return buildMetadata({
    tenant,
    city,
    path: "/clasificados/nuevo",
    title: `Publicar un anuncio gratis en ${city.name}`,
    description: `Publica gratis tu anuncio para los días del eclipse en ${city.name}: alojamiento, coche compartido, material de observación o servicios.`,
  });
}

export default async function NuevoClasificadoPage() {
  const city = tenantCity(await currentTenant());

  return (
    <Section
      title="Publicar un anuncio"
      lead={`Gratis y sin registro. El anuncio se publica en el tablón de ${city.name} después de una revisión manual.`}
    >
      <div className="max-w-2xl">
        <ClassifiedForm />
      </div>
    </Section>
  );
}
