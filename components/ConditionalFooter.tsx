"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Footer from "./Footer";

// Le footer est global (monté dans le layout) mais masqué sur /demos (VEGA est
// une expérience plein écran type cockpit) : il y est remplacé par un lien discret
// vers les mentions légales, obligatoire sur toutes les pages.
export default function ConditionalFooter() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/demos")) {
    return (
      <Link
        href="/mentions-legales"
        className="fixed bottom-1 left-2 z-40 text-[11px] text-muted hover:text-white transition-colors"
      >
        Mentions légales
      </Link>
    );
  }
  return <Footer />;
}
