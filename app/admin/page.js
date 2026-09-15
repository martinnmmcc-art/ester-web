"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase, fotoUrl, BUCKET } from "../../lib/supabase";
import { OPERACIONES, TIPOS, ZONAS, ESTADOS, slugify, precioTexto } from "../../lib/util";

const VACIA = {
  titulo: "", operacion: "Venta", tipo: "Casa", zona: "El Bolsón", precio: "", moneda: "USD",
  consultar_precio: false, dormitorios: "", banos: "", m2_cubiertos: "", m2_lote: "",
  descripcion: "", estado: "Disponible", destacada: false, fotos: []
};

export default function Admin() {
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [tab, setTab] = useState("props");
  const [props, setProps] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [cfg, setCfg] = useState(null);
  const [edit, setEdit] = useState(null);
  const [msg, setMsg] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSesion(data.session); setCargando(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSesion(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const cargar = useCallback(async () => {
    const [a, b, c] = await Promise.all([
      supabase.from("inm_propiedades").select("*").order("created_at", { ascending: false }),
      supabase.from("inm_consultas").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("inm_config").select("*").eq("id", 1).maybeSingle()
    ]);
    setProps(a.data || []);
    setConsultas(b.data || []);
    setCfg(c.data || null);
  }, []);

  useEffect(() => { if (sesion) cargar(); }, [sesion, cargar]);

  function aviso(t) { setMsg(t); setTimeout(() => setMsg(""), 3500); }

  if (cargando) return <div className="wrap pagehead"><p>Cargando…</p></div>;
  if (!sesion) return <Login onOk={() => {}} />;

  async function guardar() {
    const e = edit;
    if (!e.titulo.trim()) return aviso("Falta el título");
    const num = (v) => (v === "" || v === null ? null : Number(String(v).replace(/\D/g, "")) || null);
    const fila = {
      titulo: e.titulo.trim(),
      slug: e.slug || slugify(e.titulo) + "-" + Math.random().toString(36).slice(2, 6),
      operacion: e.operacion, tipo: e.tipo, zona: e.zona, estado: e.estado,
      precio: num(e.precio), moneda: e.moneda, consultar_precio: !!e.consultar_precio,
      dormitorios: num(e.dormitorios), banos: num(e.banos),
      m2_cubiertos: num(e.m2_cubiertos), m2_lote: num(e.m2_lote),
      descripcion: e.descripcion, destacada: !!e.destacada, fotos: e.fotos || []
    };
    const q = e.id
      ? await supabase.from("inm_propiedades").update(fila).eq("id", e.id)
      : await supabase.from("inm_propiedades").insert(fila);
    if (q.error) return aviso("Error: " + q.error.message);
    aviso("Guardado");
    setEdit(null);
    cargar();
  }

  async function borrar(id) {
    const q = await supabase.from("inm_propiedades").delete().eq("id", id);
    if (q.error) return aviso("Error al borrar");
    aviso("Eliminada"); setEdit(null); cargar();
  }

  async function comprimir(file) {
    const img = await createImageBitmap(file);
    const max = 1600;
    let { width: w, height: h } = img;
    if (w > max || h > max) { if (w > h) { h = Math.round(h * max / w); w = max; } else { w = Math.round(w * max / h); h = max; } }
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    c.getContext("2d").drawImage(img, 0, 0, w, h);
    return new Promise((res) => c.toBlob(res, "image/webp", 0.82));
  }

  async function subir(files) {
    setSubiendo(true);
    const nuevas = [...(edit.fotos || [])];
    for (const file of files) {
      try {
        const blob = await comprimir(file);
        const nombre = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
        const { error } = await supabase.storage.from(BUCKET).upload(nombre, blob, { contentType: "image/webp", upsert: false });
        if (error) { aviso("Error al subir: " + error.message); continue; }
        nuevas.push(nombre);
      } catch { aviso("No se pudo procesar una foto"); }
    }
    setEdit({ ...edit, fotos: nuevas });
    setSubiendo(false);
  }

  async function guardarCfg() {
    const q = await supabase.from("inm_config").update({
      whatsapp: cfg.whatsapp, telefono: cfg.telefono, email: cfg.email,
      direccion: cfg.direccion, mapa_url: cfg.mapa_url, nosotros: cfg.nosotros
    }).eq("id", 1);
    aviso(q.error ? "Error: " + q.error.message : "Datos actualizados");
  }

  return (
    <div className="wrap" style={{ paddingTop: 20, paddingBottom: 60 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: 26, flex: 1 }}>Panel</h1>
        <button className="btn sm" onClick={() => supabase.auth.signOut()}>Salir</button>
      </div>
      {msg && <div className="alert" style={{ marginTop: 12 }}>{msg}</div>}

      {edit ? (
        <Formulario
          edit={edit} setEdit={setEdit} guardar={guardar} borrar={borrar}
          subir={subir} subiendo={subiendo} cancelar={() => setEdit(null)}
        />
      ) : (
        <>
          <div className="tabs" style={{ marginTop: 16 }}>
            <button className={tab === "props" ? "on" : ""} onClick={() => setTab("props")}>Propiedades ({props.length})</button>
            <button className={tab === "leads" ? "on" : ""} onClick={() => setTab("leads")}>Consultas ({consultas.filter((c) => !c.leido).length})</button>
            <button className={tab === "cfg" ? "on" : ""} onClick={() => setTab("cfg")}>Datos</button>
          </div>

          {tab === "props" && (
            <>
              <button className="btn primary block" onClick={() => setEdit({ ...VACIA })} style={{ marginBottom: 14 }}>+ Nueva propiedad</button>
              <div className="adm-list">
                {props.map((p) => (
                  <div className="adm-row" key={p.id}>
                    {p.fotos && p.fotos[0]
                      ? <img className="th" src={fotoUrl(p.fotos[0])} alt="" />
                      : <div className="th" style={{ display: "grid", placeItems: "center" }}>🏠</div>}
                    <div className="t">
                      <b>{p.titulo}</b>
                      <span>{p.zona} · {precioTexto(p).v} · {p.estado}</span>
                    </div>
                    <button className="btn sm" onClick={() => setEdit({ ...p })}>Editar</button>
                  </div>
                ))}
                {!props.length && <div className="empty"><h3>Todavía no hay propiedades</h3><p>Tocá “+ Nueva propiedad”.</p></div>}
              </div>
            </>
          )}

          {tab === "leads" && (
            <div>
              {consultas.map((c) => (
                <div className="lead-row" key={c.id}>
                  <b>{c.nombre}</b>
                  <span>{new Date(c.created_at).toLocaleString("es-AR")}</span>
                  <p style={{ margin: "8px 0", fontSize: 14, whiteSpace: "pre-wrap" }}>{c.mensaje}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {c.telefono && <a className="btn sm wa" target="_blank" rel="noopener" href={"https://wa.me/" + c.telefono.replace(/\D/g, "")}>WhatsApp</a>}
                    {c.email && <a className="btn sm" href={"mailto:" + c.email}>Responder mail</a>}
                  </div>
                </div>
              ))}
              {!consultas.length && <div className="empty"><h3>Sin consultas todavía</h3></div>}
            </div>
          )}

          {tab === "cfg" && cfg && (
            <div className="formbox">
              <div className="field"><label>WhatsApp (sin +)</label><input value={cfg.whatsapp || ""} onChange={(e) => setCfg({ ...cfg, whatsapp: e.target.value })} /></div>
              <div className="field"><label>Teléfono visible</label><input value={cfg.telefono || ""} onChange={(e) => setCfg({ ...cfg, telefono: e.target.value })} /></div>
              <div className="field"><label>Email</label><input value={cfg.email || ""} onChange={(e) => setCfg({ ...cfg, email: e.target.value })} /></div>
              <div className="field"><label>Dirección</label><input value={cfg.direccion || ""} onChange={(e) => setCfg({ ...cfg, direccion: e.target.value })} /></div>
              <div className="field"><label>Link del mapa</label><input value={cfg.mapa_url || ""} onChange={(e) => setCfg({ ...cfg, mapa_url: e.target.value })} /></div>
              <div className="field"><label>Texto de “Nosotros”</label><textarea rows="5" value={cfg.nosotros || ""} onChange={(e) => setCfg({ ...cfg, nosotros: e.target.value })} /></div>
              <button className="btn primary block" onClick={guardarCfg}>Guardar datos</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [cargando, setCargando] = useState(false);

  async function entrar() {
    setCargando(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
    if (error) setErr("Usuario o contraseña incorrectos.");
    setCargando(false);
  }

  return (
    <div className="wrap" style={{ maxWidth: 440, paddingTop: 50, paddingBottom: 60 }}>
      <div className="formbox">
        <h1 style={{ fontSize: 24 }}>Panel de administración</h1>
        <p className="muted" style={{ margin: 0, fontSize: 14.5 }}>Ingresá con tu email y contraseña.</p>
        <div className="field"><label>Email</label><input inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="field"><label>Contraseña</label><input type="password" value={pass} onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && entrar()} /></div>
        {err && <div className="alert err">{err}</div>}
        <button className="btn primary block" onClick={entrar} disabled={cargando}>{cargando ? "Entrando…" : "Entrar"}</button>
      </div>
    </div>
  );
}

function Formulario({ edit, setEdit, guardar, borrar, subir, subiendo, cancelar }) {
  const [armado, setArmado] = useState(false);
  const set = (k) => (e) => setEdit({ ...edit, [k]: e.target.value });
  const chk = (k) => (e) => setEdit({ ...edit, [k]: e.target.checked });

  return (
    <div className="formbox" style={{ marginTop: 16 }}>
      <h2 style={{ fontSize: 21 }}>{edit.id ? "Editar propiedad" : "Nueva propiedad"}</h2>
      <div className="field"><label>Título *</label><input value={edit.titulo} onChange={set("titulo")} placeholder="Casa de 3 dormitorios con vista al cerro" /></div>
      <div className="two">
        <div className="field"><label>Operación</label><select value={edit.operacion} onChange={set("operacion")}>{OPERACIONES.map((o) => <option key={o}>{o}</option>)}</select></div>
        <div className="field"><label>Tipo</label><select value={edit.tipo} onChange={set("tipo")}>{TIPOS.map((o) => <option key={o}>{o}</option>)}</select></div>
      </div>
      <div className="two">
        <div className="field"><label>Zona</label><select value={edit.zona} onChange={set("zona")}>{ZONAS.map((o) => <option key={o}>{o}</option>)}</select></div>
        <div className="field"><label>Estado</label><select value={edit.estado} onChange={set("estado")}>{ESTADOS.map((o) => <option key={o}>{o}</option>)}</select></div>
      </div>
      <div className="two">
        <div className="field"><label>Precio</label><input inputMode="numeric" value={edit.precio ?? ""} onChange={set("precio")} /></div>
        <div className="field"><label>Moneda</label><select value={edit.moneda} onChange={set("moneda")}><option>USD</option><option>ARS</option></select></div>
      </div>
      <label style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 600 }}>
        <input type="checkbox" style={{ width: 20, height: 20 }} checked={!!edit.consultar_precio} onChange={chk("consultar_precio")} /> Mostrar “Consultar valor”
      </label>
      <div className="two">
        <div className="field"><label>Dormitorios</label><input inputMode="numeric" value={edit.dormitorios ?? ""} onChange={set("dormitorios")} /></div>
        <div className="field"><label>Baños</label><input inputMode="numeric" value={edit.banos ?? ""} onChange={set("banos")} /></div>
      </div>
      <div className="two">
        <div className="field"><label>m² cubiertos</label><input inputMode="numeric" value={edit.m2_cubiertos ?? ""} onChange={set("m2_cubiertos")} /></div>
        <div className="field"><label>m² del lote</label><input inputMode="numeric" value={edit.m2_lote ?? ""} onChange={set("m2_lote")} /></div>
      </div>
      <div className="field"><label>Descripción</label><textarea rows="6" value={edit.descripcion || ""} onChange={set("descripcion")} placeholder="Servicios, acceso, estado general, papeles…" /></div>
      <label style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 600 }}>
        <input type="checkbox" style={{ width: 20, height: 20 }} checked={!!edit.destacada} onChange={chk("destacada")} /> Destacar en la portada
      </label>

      <div className="field">
        <label>Fotos</label>
        <label className="drop" htmlFor="fotos-input">
          {subiendo ? <b>Subiendo…</b> : <><b>Tocá para elegir fotos</b><br />desde la galería o la cámara</>}
        </label>
        <input id="fotos-input" type="file" accept="image/*" multiple style={{ display: "none" }}
          onChange={(e) => { const f = [...e.target.files]; e.target.value = ""; if (f.length) subir(f); }} />
        <div className="thumbs" style={{ marginTop: 10 }}>
          {(edit.fotos || []).map((f, i) => (
            <div className="thumb" key={i}>
              <img src={fotoUrl(f)} alt="" />
              <button onClick={() => setEdit({ ...edit, fotos: edit.fotos.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
        </div>
      </div>

      <button className="btn primary block" onClick={guardar}>Guardar propiedad</button>
      {edit.id && (
        <button className="btn block" style={armado ? { background: "#b4483f", color: "#fff", borderColor: "#b4483f" } : { color: "#b4483f" }}
          onClick={() => { if (!armado) { setArmado(true); setTimeout(() => setArmado(false), 4500); } else borrar(edit.id); }}>
          {armado ? "¿Seguro? Tocá otra vez para eliminar" : "Eliminar"}
        </button>
      )}
      <button className="btn block" onClick={cancelar}>Volver al listado</button>
    </div>
  );
}
