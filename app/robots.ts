import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

// robots.txt généré par Next : tout est crawlable sauf l'API et /ops.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/ops"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
