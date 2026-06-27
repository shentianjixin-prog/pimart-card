import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { CartProvider } from "@/lib/cart-context";
import { LangProvider } from "@/lib/lang-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsletterBar } from "@/components/NewsletterBar";
import type { Lang } from "@/lib/translations";
import { HTML_LANG } from "@/lib/translations";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PIMART CARD | Global Trading Card Marketplace",
  description:
    "Japanese & Chinese TCG Sealed Boxes, PSA Cards & Wholesale Supply. Authentic guarantee, ships from Japan.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const rawLang = cookieStore.get("lang")?.value ?? "zh";
  const lang: Lang = rawLang === "ja" || rawLang === "en" ? rawLang : "zh";

  return (
    <html
      lang={HTML_LANG[lang]}
      className={`${inter.variable} ${notoSansSC.variable} ${notoSansJP.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-white text-[#111827]"
        style={{
          fontFamily:
            'var(--font-inter), var(--font-noto-sc), var(--font-noto-jp), system-ui, sans-serif',
        }}
      >
        <LangProvider initial={lang}>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <NewsletterBar />
            <Footer />
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
