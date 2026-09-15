import { getPropiedades, SITE_URL } from "../lib/supabase";
import { ZONAS, zonaSlug } from "../lib/util";

export default async function sitemap() {
  const props = await getPropiedades();
  const zonas = ZONAS.map((z) => ({
    url: `${SITE_URL}/propiedades/${zonaSlug(z)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8
  }));
  const fichas = props.filter((p) => p.slug).map((p) => ({
    url: `${SITE_URL}/propiedad/${p.slug}`,
    lastModified: new Date(p.updated_at || p.created_at),
    changeFrequency: "weekly",
    priority: 0.9
  }));
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...zonas,
    ...fichas
  ];
}
