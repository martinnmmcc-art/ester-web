"use client";
import { useEffect, useState } from "react";
import { waLink } from "../lib/util";

export default function Fab({ cfg }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 15000);
    return () => clearTimeout(t);
  }, []);
  const wa = waLink(cfg.whatsapp, "Hola Ester, te escribo desde la web. Necesito ayuda con una consulta.");
  return (
    <div className="fab">
      <a className="fab-btn" href={wa} target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">
        <svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.5-3.8-3.3-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.5.7.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3a8.2 8.2 0 1 1 7.2 3.9z" /></svg>
      </a>
      {show && (
        <div className="fab-bubble">
          ¿Necesitás ayuda?
          <small>Escribinos, te respondemos al toque.</small>
          <span className="x" onClick={() => setShow(false)}>×</span>
        </div>
      )}
    </div>
  );
}
