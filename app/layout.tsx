import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import Attribution from "@/components/Attribution";
import TrackClicks from "@/components/TrackClicks";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Base des URLs absolues : canonical et og:image (générée par app/opengraph-image.tsx).
  metadataBase: new URL(SITE_URL),
  title: "Axel Remillat — Ingénieur Data & IA",
  description:
    "Portfolio & lab de démos d'Axel Remillat. Projets Data & IA testables en vrai : chatbot RAG, automatisations N8N, pipelines ML.",
  openGraph: {
    title: "Axel Remillat — Ingénieur Data & IA",
    description: `${SITE_TAGLINE} — portfolio & lab de démos.`,
    type: "website",
    siteName: SITE_NAME,
    locale: "fr_FR",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <Analytics />
        <Attribution />
        <TrackClicks />
        <Navbar />
        {/* Chaque page porte son propre <main> : un seul repère « main » par page. */}
        <div className="flex-1 pt-16">{children}</div>
        <ConditionalFooter />
      </body>
    </html>
  );
}
