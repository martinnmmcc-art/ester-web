import Link from "next/link";
import { fotoUrl } from "../lib/supabase";
import { precioTexto, escena } from "../lib/util";

export default function Card({ p }) {
  const m = precioTexto(p);
  const foto = p.fotos && p.fotos.length ? fotoUrl(p.fotos[0]) : null;
  return (
    <Link className="card" href={"/propiedad/" + p.slug} prefetch={false}>
      <div className="ph">
        {foto ? (
          <img src={foto} alt={p.titulo} loading="lazy" width="400" height="300" />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: escena(p.id || p.titulo) }} />
        )}
        <div className="badges">
          <span className={"badge " + (p.operacion === "Alquiler" ? "alq" : "op")}>{p.operacion}</span>
          {p.destacada && <span className="badge dest">Destacada</span>}
          {p.estado === "Reservada" && <span className="badge res">Reservada</span>}
          {p.estado === "Vendida" && <span className="badge vend">Vendida</span>}
        </div>
        <div className="pricetag">{m.v}{m.s ? <small>{m.s}</small> : null}</div>
      </div>
      <div className="card-b">
        <div className="zline">
          <svg viewBox="0 0 24 24"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" /></svg>
          {p.zona} · {p.tipo}
        </div>
        <h3>{p.titulo}</h3>
        <div className="specs">
          {p.dormitorios ? <span>{p.dormitorios} dorm.</span> : null}
          {p.banos ? <span>{p.banos} baños</span> : null}
          {p.m2_cubiertos ? <span>{p.m2_cubiertos} m²</span> : null}
          {p.m2_lote ? <span>{p.m2_lote} m² lote</span> : null}
        </div>
      </div>
    </Link>
  );
}
