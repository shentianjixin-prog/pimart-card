import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { CartProvider } from "@/lib/cart-context";
import { LangProvider } from "@/lib/lang-context";
import { HeaderShell } from "@/components/HeaderShell";
import { Footer } from "@/components/Footer";
import { NewsletterBar } from "@/components/NewsletterBar";
import type { Lang } from "@/lib/translations";
import { HTML_LANG } from "@/lib/translations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "PIMART CARD | 日本·中国正版TCG卡牌 / PSA评级 / 批发",
  description: "日本·中国正版TCG卡牌，宝可梦/海贼王/火影忍者等原盒现货与预售，PSA评级，B2B批发，5-7天发货",
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
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <div className="page-texture" aria-hidden="true" />
        <LangProvider initial={lang}>
          <CartProvider>
            <HeaderShell />
            <main className="flex-1">{children}</main>
            <NewsletterBar />
            <Footer />
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
