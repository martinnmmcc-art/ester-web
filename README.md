# Ester Cortez Propiedades — sitio web

Next.js 14 (App Router) + Supabase + Vercel.

## Correr local
    npm install
    cp .env.local.example .env.local
    npm run dev

## Estructura
- `/` portada con buscador y filtros
- `/propiedades/[zona]` páginas por zona (SEO)
- `/propiedad/[slug]` ficha con Open Graph y JSON-LD RealEstateListing
- `/admin` panel: login Supabase, alta/edición de propiedades, subida de fotos, consultas recibidas y datos de contacto

## Base (Supabase)
Tablas `inm_propiedades`, `inm_config`, `inm_consultas` y bucket `inmobiliaria`.
Lectura pública, escritura solo autenticada (RLS).
