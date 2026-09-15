"use client";
import { useState } from "react";
import Link from "next/link";
import { waLink } from "../lib/util";

export default function Header({ cfg }) {
  const [open, setOpen] = useState(false);
  const wa = waLink(cfg.whatsapp, "Hola Ester, te escribo desde la web. Necesito ayuda con una consulta.");
  return (
    <header className="site">
      <div className="wrap hdr">
        <Link className="logo" href="/">
          {cfg.logo_url ? (
            <img className="hdrlogo" src={cfg.logo_url} alt="Ester Cortez Propiedades" />
          ) : (
            <>
              <span className="mark">
                <svg viewBox="0 0 24 24"><path d="M12 3 2 11h3v9h6v-6h2v6h6v-9h3L12 3z" /></svg>
              </span>
              <span><b>Ester Cortez</b><small>Propiedades</small></span>
            </>
          )}
        </Link>
        <nav className="desk">
          <Link href="/#propiedades">Propiedades</Link>
          <Link href="/propiedades/el-bolson">El Bolsón</Link>
          <Link href="/propiedades/lago-puelo">Lago Puelo</Link>
          <Link href="/#contacto">Contacto</Link>
        </nav>
        <div className="hdr-cta">
          <a className="btn primary sm" href={wa} target="_blank" rel="noopener">WhatsApp</a>
          <button className="icon-btn burger" aria-label="Menú" onClick={() => setOpen(!open)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" /></svg>
          </button>
        </div>
      </div>
      <nav className={"mob" + (open ? " open" : "")} onClick={() => setOpen(false)}>
        <Link href="/#propiedades">Propiedades</Link>
        <Link href="/propiedades/el-bolson">El Bolsón</Link>
        <Link href="/propiedades/lago-puelo">Lago Puelo</Link>
        <Link href="/propiedades/el-hoyo">El Hoyo</Link>
        <Link href="/#contacto">Contacto</Link>
        <a href={wa} target="_blank" rel="noopener">Escribir por WhatsApp</a>
      </nav>
    </header>
  );
}
