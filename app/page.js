import Link from "next/link";
import { getPropiedades, getConfig } from "../lib/supabase";
import { escena, waLink, zonaSlug } from "../lib/util";
import Buscador from "../components/Buscador";

export const revalidate = 60;

const ZONAS_HOME = ["El Bolsón", "Lago Puelo", "El Hoyo", "Epuyén"];

export default async function Home() {
  const [propiedades, cfg] = await Promise.all([getPropiedades(), getConfig()]);
  const wa = (t) => waLink(cfg.whatsapp, t);

  return (
    <>
      <div className="hero">
        <div className="heroart">
          <div dangerouslySetInnerHTML={{ __html: escena("hero-comarca-andina") }} />
          <div className="vin" />
          <div className="heroc">
            <div className="wrap">
              <div className="eyebrow">El Bolsón · Lago Puelo · El Hoyo · Epuyén</div>
              <h1>Encontrá tu lugar<br />en <em>la Comarca Andina</em></h1>
              <p>Casas con vista al Piltriquitrón, chacras junto al río Azul, lotes con bosque propio. Te acompañamos desde la primera visita hasta la escritura.</p>
              <div className="trust">
                <span className="chip">Martillera matriculada</span>
                <span className="chip">+20 años en la zona</span>
                <span className="chip">Tasación sin cargo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Buscador propiedades={propiedades} cfg={cfg} />

      <section id="zonas">
        <div className="wrap">
          <div className="sec-head">
            <div><div className="kicker">Dónde buscamos</div><h2>Cuatro valles, un solo paisaje</h2></div>
          </div>
          <div className="zonas">
            {ZONAS_HOME.map((z) => (
              <Link key={z} className="zona-c" href={"/propiedades/" + zonaSlug(z)}>
                <div dangerouslySetInnerHTML={{ __html: escena(z) }} />
                <span>{z}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap"><div className="band"><div className="split">
          <div>
            <div className="kicker">¿Querés vender?</div>
            <h2 style={{ fontSize: "clamp(23px,5.3vw,34px)" }}>Tasamos tu propiedad sin cargo y sin compromiso</h2>
            <p className="muted" style={{ marginTop: 12 }}>
              Conocemos los valores reales de cada barrio y cada valle. Te decimos en cuánto se vende hoy, qué papeles hay que ordenar antes y cuánto tarda en promedio.
            </p>
            <a className="btn wa" style={{ marginTop: 18 }} target="_blank" rel="noopener"
               href={wa("Hola Ester, quiero pedir una tasación de mi propiedad. Está ubicada en:")}>
              Pedir tasación por WhatsApp
            </a>
          </div>
          <div className="panel" style={{ padding: 0, overflow: "hidden" }}
               dangerouslySetInnerHTML={{ __html: escena("tasacion") }} />
        </div></div></div>
      </section>

      <section id="nosotros">
        <div className="wrap split">
          <div className="panel">
            <div className="kicker">Nosotros</div>
            <h2>Conocemos cada camino de la Comarca</h2>
            <p>{cfg.nosotros || "Somos una inmobiliaria de El Bolsón, de acá de toda la vida. Acompañamos a quienes eligen mudarse a la montaña y a quienes necesitan vender o tasar. Te asesoramos sobre títulos, mensuras, servicios y accesos: eso que no se ve en las fotos y que define si la propiedad realmente te sirve."}</p>
            <div className="stats">
              <div className="stat"><b>+20</b><span>años de experiencia</span></div>
              <div className="stat"><b>4</b><span>valles de cobertura</span></div>
              <div className="stat"><b>100%</b><span>documentación verificada</span></div>
              <div className="stat"><b>24 h</b><span>respuesta por WhatsApp</span></div>
            </div>
          </div>
          <div className="panel" id="contacto">
            <div className="kicker">Contacto</div>
            <h2>Hablemos</h2>
            <p>Contanos qué buscás o qué querés vender. Respondemos por WhatsApp, teléfono o mail.</p>
            <ul className="clist">
              <li>{cfg.direccion}</li>
              <li><a href={"tel:+" + cfg.whatsapp}>{cfg.telefono}</a></li>
              <li><a href={"mailto:" + cfg.email}>{cfg.email}</a></li>
            </ul>
            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              <a className="btn wa" style={{ flex: 1, minWidth: 170 }} target="_blank" rel="noopener"
                 href={wa("Hola Ester, te escribo desde la web. Necesito ayuda con una consulta.")}>
                Consultar por WhatsApp
              </a>
              <a className="btn" style={{ flex: 1, minWidth: 140 }} target="_blank" rel="noopener"
                 href={cfg.mapa_url || "https://www.google.com/maps/search/?api=1&query=Ester+Cortez+Propiedades+El+Bolson"}>
                Cómo llegar
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
