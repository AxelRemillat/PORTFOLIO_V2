import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Analytics from "@/components/Analytics";
import Attribution from "@/components/Attribution";
import TrackClicks from "@/components/TrackClicks";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { isLocale, locales, OG_LOCALE } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/server";
import { LocaleProvider } from "@/lib/i18n/client";
import { getMessages } from "@/messages";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Les deux langues sont PRÉRENDUES ; toute autre valeur de `[lang]` est une 404.
export const generateStaticParams = () => locales.map((lang) => ({ lang }));
export const dynamicParams = false;

type LangParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await getLocale(params);
  const t = getMessages(locale).meta;
  return {
    // Base des URLs absolues : canonical et og:image (générée par app/[lang]/opengraph-image.tsx).
    metadataBase: new URL(SITE_URL),
    title: t.siteTitle,
    description: t.siteDescription,
    openGraph: {
      title: t.siteTitle,
      description: `${t.tagline} — ${t.ogSuffix}`,
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children, params }: LangParams & { children: React.ReactNode }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = await getLocale(params);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <LocaleProvider locale={locale}>
          <Analytics />
          <Attribution />
          <TrackClicks />
          <Navbar />
          {/* Chaque page porte son propre <main> : un seul repère « main » par page. */}
          <div className="flex-1 pt-16">{children}</div>
          <ConditionalFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
