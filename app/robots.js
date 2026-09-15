import { SITE_URL, MODO_DEMO } from "../lib/supabase";

export default function robots() {
  if (MODO_DEMO) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin"] }],
    sitemap: SITE_URL + "/sitemap.xml"
  };
}
