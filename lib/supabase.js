import { createClient } from "@supabase/supabase-js";

export const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kmkprbnwcbavonfnyput.supabase.co";
export const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_kRQwyAKfcqMP3Kx2ACltuw_uJ7jn6m_";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.estercortezpropiedades.com.ar";
export const BUCKET = "inmobiliaria";

export const supabase = createClient(SUPA_URL, SUPA_KEY);

export function fotoUrl(path) {
  if (!path) return null;
  if (String(path).startsWith("http")) return path;
  return SUPA_URL + "/storage/v1/object/public/" + BUCKET + "/" + path;
}

export async function getPropiedades() {
  const { data } = await supabase.from("inm_propiedades").select("*")
    .neq("estado", "Oculta")
    .order("destacada", { ascending: false })
    .order("created_at", { ascending: false });
  return data || [];
}

export async function getPropiedad(slug) {
  const { data } = await supabase.from("inm_propiedades").select("*")
    .eq("slug", slug).neq("estado", "Oculta").maybeSingle();
  return data || null;
}

export async function getConfig() {
  const { data } = await supabase.from("inm_config").select("*").eq("id", 1).maybeSingle();
  return data || {
    whatsapp: "5492944833668",
    telefono: "2944 83-3668",
    email: "estercortezpropiedades@gmail.com",
    direccion: "José Hernández 478, (8430) El Bolsón, Río Negro",
    mapa_url: "https://www.google.com/maps/search/?api=1&query=Ester+Cortez+Propiedades+El+Bolson",
    nosotros: null
  };
}
