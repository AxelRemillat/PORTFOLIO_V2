"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Footer from "./Footer";
import { useLocale, useMessages } from "@/lib/i18n/client";
import { localizedHref, splitPath } from "@/lib/i18n/paths";

// Le footer est global (monté dans le layout) mais masqué sur /demos (VEGA est
// une expérience plein écran type cockpit) : il y est remplacé par un lien discret
// vers les mentions légales, obligatoire sur toutes les pages.
export default function ConditionalFooter() {
  const locale = useLocale();
  const legal = useMessages().footer.legal;
  // Chemin sans préfixe de langue : « /en/demos » masque le footer comme « /demos ».
  const pathname = splitPath(usePathname() || "/").path;
  if (pathname.startsWith("/demos")) {
    return (
      <Link
        href={localizedHref("/mentions-legales", locale)}
        className="fixed bottom-1 left-2 z-40 text-[11px] text-muted hover:text-white transition-colors"
      >
        {legal}
      </Link>
    );
  }
  return <Footer />;
}
