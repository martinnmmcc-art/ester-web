import { getPropiedades, getConfig } from "../../../lib/supabase";
import { ZONAS, zonaSlug } from "../../../lib/util";
import Buscador from "../../../components/Buscador";
import Link from "next/link";

export const revalidate = 60;

export async function generateStaticParams() {
  return ZONAS.map((z) => ({ zona: zonaSlug(z) }));
}

function nombreZona(slug) {
  return ZONAS.find((z) => zonaSlug(z) === slug) || null;
}

export async function generateMetadata({ params }) {
  const z = nombreZona(params.zona);
  if (!z) return { title: "Propiedades" };
  return {
    title: `Propiedades en venta y alquiler en ${z}`,
    description: `Casas, lotes, chacras y alquileres en ${z}. Publicaciones actualizadas de Ester Cortez Propiedades, inmobiliaria de la Comarca Andina.`,
    alternates: { canonical: "/propiedades/" + params.zona }
  };
}

export default async function ZonaPage({ params }) {
  const z = nombreZona(params.zona);
  const [todas, cfg] = await Promise.all([getPropiedades(), getConfig()]);
  if (!z) {
    return (
      <div className="wrap pagehead">
        <h1>Zona no encontrada</h1>
        <p><Link className="link" href="/">Volver al inicio</Link></p>
      </div>
    );
  }
  const propiedades = todas.filter((p) => p.zona === z);
  return (
    <>
      <div className="wrap pagehead">
        <div className="crumbs"><Link href="/">Inicio</Link> › Propiedades en {z}</div>
        <h1>Propiedades en {z}</h1>
        <p>
          {propiedades.length
            ? `${propiedades.length} ${propiedades.length === 1 ? "propiedad disponible" : "propiedades disponibles"} en ${z} y alrededores. Casas, lotes, chacras y alquileres con asesoramiento sobre títulos, servicios y accesos.`
            : `Por el momento no tenemos publicaciones activas en ${z}. Escribinos y te avisamos apenas entre algo.`}
        </p>
      </div>
      <Buscador propiedades={propiedades} cfg={cfg} zonaFija={z} />
    </>
  );
}
