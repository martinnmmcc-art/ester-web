"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ConsultaForm({ propiedadId, titulo }) {
  const [f, setF] = useState({ nombre: "", telefono: "", email: "", mensaje: "" });
  const [estado, setEstado] = useState("");

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function enviar() {
    if (!f.nombre.trim() || (!f.telefono.trim() && !f.email.trim())) {
      setEstado("faltan");
      return;
    }
    setEstado("enviando");
    const { error } = await supabase.from("inm_consultas").insert({
      propiedad_id: propiedadId || null,
      nombre: f.nombre.trim(),
      telefono: f.telefono.trim() || null,
      email: f.email.trim() || null,
      mensaje: (f.mensaje.trim() || "") + (titulo ? `\n\n[Propiedad: ${titulo}]` : ""),
      origen: "web"
    });
    setEstado(error ? "error" : "ok");
    if (!error) setF({ nombre: "", telefono: "", email: "", mensaje: "" });
  }

  if (estado === "ok") {
    return <div className="alert">¡Gracias! Tu consulta llegó. Te respondemos a la brevedad.</div>;
  }

  return (
    <div className="formbox">
      <h2 style={{ fontSize: 21 }}>Consultar por esta propiedad</h2>
      <p className="muted" style={{ fontSize: 14, margin: 0 }}>Dejanos tus datos y te contactamos. También podés escribirnos directo por WhatsApp.</p>
      <div className="two">
        <div className="field"><label>Nombre *</label><input value={f.nombre} onChange={set("nombre")} /></div>
        <div className="field"><label>Teléfono</label><input inputMode="tel" value={f.telefono} onChange={set("telefono")} /></div>
      </div>
      <div className="field"><label>Email</label><input inputMode="email" value={f.email} onChange={set("email")} /></div>
      <div className="field"><label>Mensaje</label><textarea rows="4" value={f.mensaje} onChange={set("mensaje")} /></div>
      {estado === "faltan" && <div className="alert err">Poné tu nombre y al menos un teléfono o un email.</div>}
      {estado === "error" && <div className="alert err">No se pudo enviar. Probá por WhatsApp.</div>}
      <button className="btn primary block" onClick={enviar} disabled={estado === "enviando"}>
        {estado === "enviando" ? "Enviando…" : "Enviar consulta"}
      </button>
    </div>
  );
}
