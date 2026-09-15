import "./globals.css";
import { getConfig, SITE_URL, MODO_DEMO } from "../lib/supabase";
import Header from "../components/Header";
import Fab from "../components/Fab";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ester Cortez Propiedades — Inmobiliaria en El Bolsón, Lago Puelo y El Hoyo",
    template: "%s | Ester Cortez Propiedades"
  },
  description:
    "Casas, chacras, lotes y alquileres en El Bolsón, Lago Puelo, El Hoyo y Epuyén. Más de 20 años acompañando a quienes eligen la Comarca Andina.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Ester Cortez Propiedades",
    title: "Ester Cortez Propiedades — Inmobiliaria en El Bolsón",
    description: "Casas, chacras, lotes y alquileres en la Comarca Andina."
  },
  robots: MODO_DEMO
    ? { index: false, follow: false, nocache: true,
        googleBot: { index: false, follow: false } }
    : { index: true, follow: true }
};

export default async function RootLayout({ children }) {
  const cfg = await getConfig();
  return (
    <html lang="es-AR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,600&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "Ester Cortez Propiedades",
              url: SITE_URL,
              telephone: "+" + cfg.whatsapp,
              email: cfg.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: cfg.direccion,
                addressLocality: "El Bolsón",
                addressRegion: "Río Negro",
                postalCode: "8430",
                addressCountry: "AR"
              },
              areaServed: ["El Bolsón", "Lago Puelo", "El Hoyo", "Epuyén"],
              priceRange: "$$"
            })
          }}
        />
      </head>
      <body>
        <Header cfg={cfg} />
        <main>{children}</main>
        <footer className="site">
          <div className="wrap fw">
            <div>© {new Date().getFullYear()} Ester Cortez Propiedades · {cfg.direccion}</div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a className="link" href={"mailto:" + cfg.email}>{cfg.email}</a>
              <a className="link" href={"tel:+" + cfg.whatsapp}>{cfg.telefono}</a>
              <a className="link" href="/admin">Administrar</a>
            </div>
          </div>
        </footer>
        <Fab cfg={cfg} />
      </body>
    </html>
  );
}
