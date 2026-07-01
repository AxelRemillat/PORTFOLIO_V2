"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

// Le footer est global (monté dans le layout) mais masqué sur /demos (VEGA est
// une expérience plein écran type cockpit). Toutes les autres routes le gardent.
export default function ConditionalFooter() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/demos")) return null;
  return <Footer />;
}
