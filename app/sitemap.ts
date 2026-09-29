import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects-data";
import { PUBLIC_ROUTES, SITE_URL } from "@/lib/site-config";

// sitemap.xml généré par Next. /ops n'y figure pas (noindex tant que non câblée).
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...PUBLIC_ROUTES, ...projects.map((p) => `/projets/${p.slug}`)];
  return routes.map((route) => ({
    url: `${SITE_URL}${route === "/" ? "" : route}`,
    changeFrequency: route === "/" ? "monthly" : "yearly",
    priority: route === "/" ? 1 : route === "/contact" || route === "/offres" ? 0.8 : 0.5,
  }));
}
