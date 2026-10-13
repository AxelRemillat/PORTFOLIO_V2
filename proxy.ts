import { NextResponse, type NextRequest } from "next/server";
import { EN_PUBLIC, LOCALE_COOKIE } from "@/lib/i18n/config";
import { detectLocale } from "@/lib/i18n/detect";
import { localizedHref, splitPath } from "@/lib/i18n/paths";

/**
 * PROXY (Next 16 : ex-`middleware`, même rôle, runtime Node par défaut).
 *
 * Toutes les pages vivent sous `app/[lang]` et sont PRÉRENDUES en fr et en en.
 * Ce proxy relie les URL publiques à ces deux versions :
 *   - « /agent » (français, URL historique inchangée) → réécriture INTERNE vers
 *     « /fr/agent » : le visiteur ne voit jamais « /fr » ;
 *   - « /en/agent » → servie telle quelle (`[lang] = en`) ;
 *   - « /fr/... » tapée à la main → 307 vers l'URL sans préfixe (une seule URL par page).
 *
 * Première visite sans cookie `lang` : la langue du navigateur choisit
 * (lib/i18n/detect.ts) et l'on redirige en 307 — jamais 301, le choix dépend
 * du visiteur — vers la version équivalente, query string comprise.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Images Open Graph / Twitter : Next les publie sous « /fr/opengraph-image ».
  // On les sert telles quelles, sans détour par une redirection (robots des réseaux sociaux).
  if (/^\/(fr|en)\/(opengraph|twitter)-image/.test(pathname)) return NextResponse.next();

  // Une seule URL publique par page française : « /fr/agent » → « /agent ».
  if (pathname === "/fr" || pathname.startsWith("/fr/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 307);
  }

  const { locale } = splitPath(pathname);
  const wanted = EN_PUBLIC
    ? detectLocale({
        acceptLanguage: request.headers.get("accept-language"),
        country: request.headers.get("x-vercel-ip-country"),
        cookie: request.cookies.get(LOCALE_COOKIE)?.value ?? null,
      })
    : null;

  if (wanted && wanted !== locale) {
    const target = new URL(localizedHref(`${pathname}${search}`, wanted), request.url);
    const response = NextResponse.redirect(target, 307);
    // Le choix dépend du visiteur : un cache partagé ne doit pas le figer.
    response.headers.set("Vary", "Accept-Language, Cookie");
    return response;
  }

  if (locale === "en") return NextResponse.next();

  // Français : réécriture interne vers la version prérendue « /fr/... ».
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/fr" : `/fr${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Tout, sauf l'API, les fichiers internes de Next, les fichiers servis tels
    // quels (robots, sitemap, icônes, images de public/) et tout ce qui a une extension.
    "/((?!api|_next/static|_next/image|favicon\\.ico|icon\\.png|robots\\.txt|sitemap\\.xml|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
