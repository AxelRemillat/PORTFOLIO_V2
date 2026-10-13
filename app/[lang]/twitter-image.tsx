import { OG_SIZE, ogAlt, renderOgImage } from "@/lib/og-image";
import { isLocale } from "@/lib/i18n/config";

// Image de partage dans la langue de la page : /en reçoit la version anglaise
// (promesse et texte alternatif). `generateImageMetadata` est la seule façon de
// faire suivre le texte alternatif à la langue (`alt` statique sinon).
type LangParams = { params: Promise<{ lang: string }> | { lang: string } };

const localeOf = async (params: LangParams["params"]) => {
  const { lang } = await params;
  return isLocale(lang) ? lang : "fr";
};

export async function generateImageMetadata({ params }: LangParams) {
  return [{ id: "share", alt: ogAlt(await localeOf(params)), size: OG_SIZE, contentType: "image/png" }];
}

export default async function Image({ params }: LangParams) {
  return renderOgImage(await localeOf(params));
}
