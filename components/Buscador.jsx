"use client";
import { useMemo, useState } from "react";
import Card from "./Card";
import { OPERACIONES, TIPOS, ZONAS, waLink } from "../lib/util";

export default function Buscador({ propiedades, cfg, zonaFija }) {
  const [op, setOp] = useState("");
  const [tipo, setTipo] = useState("");
  const [zona, setZona] = useState(zonaFija || "");
  const [dorm, setDorm] = useState("");
  const [txt, setTxt] = useState("");
  const [orden, setOrden] = useState("recientes");

  const lista = useMemo(() => {
    let out = propiedades.filter((p) => {
      if (op && p.operacion !== op) return false;
      if (tipo && p.tipo !== tipo) return false;
      if (zona && p.zona !== zona) return false;
      if (dorm && (Number(p.dormitorios) || 0) < Number(dorm)) return false;
      if (txt) {
        const h = ((p.titulo || "") + " " + (p.descripcion || "") + " " + (p.zona || "") + " " + (p.tipo || "")).toLowerCase();
        if (!h.includes(txt.toLowerCase())) return false;
      }
      return true;
    });
    out = [...out].sort((a, b) => {
      if (orden === "precio-asc") return (Number(a.precio) || 1e15) - (Number(b.precio) || 1e15);
      if (orden === "precio-desc") return (Number(b.precio) || 0) - (Number(a.precio) || 0);
      if (!!a.destacada !== !!b.destacada) return a.destacada ? -1 : 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });
    return out;
  }, [propiedades, op, tipo, zona, dorm, txt, orden]);

  return (
    <>
      <div className="wrap" style={{ padding: 0 }}>
        <div className="search">
          <div className="sgrid">
            <div className="field">
              <label>Operación</label>
              <select value={op} onChange={(e) => setOp(e.target.value)}>
                <option value="">Todas</option>
                {OPERACIONES.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Tipo</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">Todos</option>
                {TIPOS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Zona</label>
              <select value={zona} onChange={(e) => setZona(e.target.value)}>
                <option value="">Todas</option>
                {ZONAS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Dormitorios</label>
              <select value={dorm} onChange={(e) => setDorm(e.target.value)}>
                <option value="">Cualquiera</option>
                {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} o más</option>)}
              </select>
            </div>
          </div>
          <div className="srow">
            <input placeholder="Buscá: río, centro, bosque, vista…" value={txt} onChange={(e) => setTxt(e.target.value)} />
            <button className="btn" onClick={() => { setOp(""); setTipo(""); setZona(zonaFija || ""); setDorm(""); setTxt(""); }}>Limpiar</button>
          </div>
        </div>
      </div>

      <section id="propiedades">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="kicker">Disponibles hoy</div>
              <h2>Propiedades</h2>
              <p className="count">
                {lista.length ? lista.length + (lista.length === 1 ? " propiedad publicada" : " propiedades publicadas") : "Sin resultados con esos filtros"}
              </p>
            </div>
            <select className="btn sm" value={orden} onChange={(e) => setOrden(e.target.value)}>
              <option value="recientes">Más recientes</option>
              <option value="precio-asc">Menor precio</option>
              <option value="precio-desc">Mayor precio</option>
            </select>
          </div>
          <div className="grid">
            {lista.length ? (
              lista.map((p) => <Card key={p.id} p={p} />)
            ) : (
              <div className="empty">
                <h3>No encontramos propiedades con esos filtros</h3>
                <p>Ampliá la búsqueda o contanos qué necesitás y te buscamos opciones a medida.</p>
                <a className="btn wa" style={{ marginTop: 14 }} target="_blank" rel="noopener"
                   href={waLink(cfg.whatsapp, "Hola Ester, no encontré lo que busco en la web. Estoy buscando:")}>
                  Contanos qué buscás
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
