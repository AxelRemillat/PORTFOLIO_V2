import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects-data";
import { PUBLIC_ROUTES, SITE_URL } from "@/lib/site-config";
import { EN_PUBLIC, locales } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/paths";

const absolute = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

// sitemap.xml généré par Next. /ops n'y figure pas (noindex tant que non câblée).
// Anglais public (EN_PUBLIC) : chaque page y figure dans les deux langues, avec
// ses alternatives hreflang. Sinon, le sitemap reste exactement le français d'avant.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...PUBLIC_ROUTES, ...projects.map((p) => `/projets/${p.slug}`)];
  const languages = EN_PUBLIC ? locales : (["fr"] as const);
  return routes.flatMap((route) =>
    languages.map((locale) => ({
      url: absolute(localizedHref(route, locale)),
      changeFrequency: route === "/" ? "monthly" : "yearly",
      priority: route === "/" ? 1 : route === "/contact" || route === "/offres" ? 0.8 : 0.5,
      ...(EN_PUBLIC
        ? {
            alternates: {
              languages: {
                fr: absolute(localizedHref(route, "fr")),
                en: absolute(localizedHref(route, "en")),
                "x-default": absolute(localizedHref(route, "fr")),
              },
            },
          }
        : {}),
    })),
  );
}
