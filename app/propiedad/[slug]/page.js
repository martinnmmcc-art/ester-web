import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropiedad, getPropiedades, getConfig, fotoUrl, SITE_URL } from "../../../lib/supabase";
import { precioTexto, escena, waLink, zonaSlug } from "../../../lib/util";
import ConsultaForm from "../../../components/ConsultaForm";

export const revalidate = 60;

export async function generateStaticParams() {
  const props = await getPropiedades();
  return props.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const p = await getPropiedad(params.slug);
  if (!p) return { title: "Propiedad no encontrada" };
  const m = precioTexto(p);
  const foto = p.fotos && p.fotos.length ? fotoUrl(p.fotos[0]) : null;
  const title = `${p.titulo} — ${p.operacion} en ${p.zona}`;
  const description =
    (p.descripcion || "").slice(0, 155) ||
    `${p.tipo} en ${p.operacion.toLowerCase()} en ${p.zona}. ${m.v}. Consultá por WhatsApp.`;
  return {
    title,
    description,
    alternates: { canonical: "/propiedad/" + p.slug },
    openGraph: {
      type: "article",
      title,
      description,
      url: SITE_URL + "/propiedad/" + p.slug,
      images: foto ? [{ url: foto, width: 1200, height: 900, alt: p.titulo }] : []
    }
  };
}

export default async function PropiedadPage({ params }) {
  const [p, cfg] = await Promise.all([getPropiedad(params.slug), getConfig()]);
  if (!p) notFound();

  const m = precioTexto(p);
  const fotos = (p.fotos || []).map(fotoUrl);
  const msg = `Hola Ester, me interesa esta propiedad: ${p.titulo} (${p.zona}). ¿Me pasás más información? ${SITE_URL}/propiedad/${p.slug}`;

  const ld = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.titulo,
    description: p.descripcion || undefined,
    url: SITE_URL + "/propiedad/" + p.slug,
    image: fotos.length ? fotos : undefined,
    datePosted: p.created_at,
    address: { "@type": "PostalAddress", addressLocality: p.zona, addressRegion: "Río Negro", addressCountry: "AR" },
    offers: p.consultar_precio || !p.precio ? undefined : {
      "@type": "Offer", price: Number(p.precio), priceCurrency: p.moneda || "USD", availability: p.estado === "Disponible" ? "https://schema.org/InStock" : "https://schema.org/SoldOut"
    },
    numberOfRooms: p.dormitorios || undefined,
    floorSize: p.m2_cubiertos ? { "@type": "QuantitativeValue", value: p.m2_cubiertos, unitCode: "MTK" } : undefined
  };

  return (
    <div className="wrap" style={{ paddingTop: 22, paddingBottom: 40 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <div className="crumbs">
        <Link href="/">Inicio</Link> › <Link href={"/propiedades/" + zonaSlug(p.zona)}>{p.zona}</Link> › {p.tipo}
      </div>

      <div className="gal">
        {fotos.length ? (
          fotos.map((f, i) => <img key={i} src={f} alt={`${p.titulo} — foto ${i + 1}`} loading={i ? "lazy" : "eager"} />)
        ) : (
          <>
            <div dangerouslySetInnerHTML={{ __html: escena(p.id) }} />
            <div dangerouslySetInnerHTML={{ __html: escena(p.id + "b") }} />
            <div dangerouslySetInnerHTML={{ __html: escena(p.id + "c") }} />
          </>
        )}
      </div>

      <div className="zline" style={{ marginTop: 16 }}>
        {p.zona} · {p.tipo} · {p.operacion}{p.estado !== "Disponible" ? " · " + p.estado : ""}
      </div>
      <h1 style={{ fontSize: "clamp(24px,6vw,36px)", marginTop: 8 }}>{p.titulo}</h1>
      <div className="dprice">{m.v}</div>
      {m.s ? <div className="muted" style={{ fontSize: 13 }}>{m.s}</div> : null}

      <div className="spec-grid">
        {p.dormitorios ? <div><b>{p.dormitorios}</b><span>Dormitorios</span></div> : null}
        {p.banos ? <div><b>{p.banos}</b><span>Baños</span></div> : null}
        {p.m2_cubiertos ? <div><b>{p.m2_cubiertos}</b><span>m² cubiertos</span></div> : null}
        {p.m2_lote ? <div><b>{p.m2_lote}</b><span>m² de lote</span></div> : null}
      </div>

      <p className="desc">{p.descripcion || "Consultanos por más detalles de esta propiedad."}</p>

      <div style={{ display: "flex", gap: 10, margin: "24px 0", flexWrap: "wrap" }}>
        <a className="btn wa" style={{ flex: 1, minWidth: 190 }} target="_blank" rel="noopener" href={waLink(cfg.whatsapp, msg)}>
          Consultar por WhatsApp
        </a>
        <a className="btn" style={{ flex: 1, minWidth: 150 }} href={"tel:+" + cfg.whatsapp}>Llamar ahora</a>
      </div>

      <ConsultaForm propiedadId={p.id} titulo={p.titulo} />
    </div>
  );
}
