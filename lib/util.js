export const ZONAS = ["El Bolsón", "Mallín Ahogado", "Lago Puelo", "El Hoyo", "Epuyén", "Bariloche"];
export const TIPOS = ["Casa", "Departamento", "Lote", "Chacra", "Cabaña", "Local / Galpón"];
export const OPERACIONES = ["Venta", "Alquiler", "Permuta"];
export const ESTADOS = ["Disponible", "Reservada", "Vendida", "Oculta"];

export function slugify(t) {
  return String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
export const zonaSlug = slugify;

export function precioTexto(p) {
  if (p.consultar_precio || !p.precio) return { v: "Consultar", s: "valor" };
  const n = Number(p.precio) || 0;
  return { v: (p.moneda === "ARS" ? "$ " : "US$ ") + n.toLocaleString("es-AR"),
           s: p.operacion === "Alquiler" ? "por mes" : "" };
}

export function waLink(wa, texto) {
  return "https://wa.me/" + wa + "?text=" + encodeURIComponent(texto);
}

export function hash(s) {
  s = String(s || ""); let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const PAL = [
  { sky: ["#ffd9a0","#ff9f6b","#f2789f"], sun:"#fff1c9", m1:"#7b5ea7", m2:"#5d4587", m3:"#3d2d63", g:"#2f7d5d", w:"#f7b2a0" },
  { sky: ["#bfeaff","#7fd0ef","#4fb3dd"], sun:"#ffffff", m1:"#6fb3a8", m2:"#3f8a86", m3:"#2a5f66", g:"#2f7d5d", w:"#8fd8e8" },
  { sky: ["#fff3cf","#ffd98a","#ffb45e"], sun:"#fffbe8", m1:"#a7c48b", m2:"#6d9e6a", m3:"#3f7550", g:"#4b8b4f", w:"#cfe9a8" },
  { sky: ["#e8f3ff","#c6dcf5","#9fc0e8"], sun:"#ffffff", m1:"#cfd9e8", m2:"#9aabc4", m3:"#6a7b99", g:"#3f6d64", w:"#dceaf7" },
  { sky: ["#ffe6c2","#ffc48a","#ef8f6e"], sun:"#fff6de", m1:"#8a9fb8", m2:"#5d7794", m3:"#3b5372", g:"#356b58", w:"#a8d7e0" },
  { sky: ["#d9f2e4","#a9e0c8","#79c9a8"], sun:"#ffffff", m1:"#79a98f", m2:"#4d8269", m3:"#2f5a4b", g:"#3d7d5c", w:"#bfe8d6" }
];

function pinos(y, c, n) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = i * (400 / n) + ((i * 37) % 19);
    const h = 16 + ((i * 13) % 14);
    s += '<path d="M' + x + ' ' + y + ' l' + (h*0.42) + ' -' + h + ' l' + (h*0.42) + ' ' + h + ' z" fill="' + c + '" opacity=".92"/>';
  }
  return s;
}

/* Paisaje generado. Se usa solo cuando la propiedad todavia no tiene fotos. */
export function escena(seed) {
  const i = hash(seed);
  const p = PAL[i % PAL.length];
  const id = "g" + (i % 9999);
  return '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Paisaje de la Comarca Andina">' +
  '<defs><linearGradient id="s' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' + p.sky[0] + '"/><stop offset="55%" stop-color="' + p.sky[1] + '"/><stop offset="100%" stop-color="' + p.sky[2] + '"/></linearGradient>' +
  '<linearGradient id="w' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' + p.w + '"/><stop offset="100%" stop-color="' + p.m3 + '" stop-opacity=".55"/></linearGradient></defs>' +
  '<rect width="400" height="300" fill="url(#s' + id + ')"/>' +
  '<circle cx="' + (90 + (i*53)%230) + '" cy="' + (52 + (i*17)%30) + '" r="' + (20 + (i%3)*7) + '" fill="' + p.sun + '" opacity=".85"/>' +
  '<path d="M0 150 L70 84 L118 126 L160 96 L214 158 L260 118 L320 168 L400 120 L400 300 L0 300 Z" fill="' + p.m1 + '" opacity=".55"/>' +
  '<path d="M0 178 L58 122 L112 166 L168 126 L232 182 L286 148 L344 190 L400 156 L400 300 L0 300 Z" fill="' + p.m2 + '" opacity=".8"/>' +
  '<path d="M0 206 L46 170 L96 202 L150 168 L206 210 L262 180 L318 214 L400 184 L400 300 L0 300 Z" fill="' + p.m3 + '"/>' +
  '<path d="M0 232 Q100 218 200 234 T400 226 L400 300 L0 300 Z" fill="' + p.g + '"/>' +
  (i % 2 === 0 ? '<path d="M120 300 Q170 262 158 232 Q210 246 244 300 Z" fill="url(#w' + id + ')" opacity=".85"/>' : "") +
  pinos(246, p.m3, 11) + pinos(272, "#1f4a3c", 9) + '</svg>';
}
