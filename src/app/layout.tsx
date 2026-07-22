import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_JP, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { CartProvider } from "@/lib/cart-context";
import { LangProvider } from "@/lib/lang-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNavGestures } from "@/components/MobileNavGestures";
import { HTML_LANG, resolveLang } from "@/lib/translations";
import { getMemberSession } from "@/lib/session";

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
  metadataBase: new URL("https://pimartcard.com"),
  title: {
    default: "PIMART CARD | Global Trading Card Marketplace",
    template: "%s | PIMART CARD",
  },
  description:
    "日版・中国語版 TCG 未開封BOX、日本国内配送、卸売対応。正規品保証、日本国内履行。",
  openGraph: {
    type: "website",
    siteName: "PIMART CARD",
    title: "PIMART CARD | Global Trading Card Marketplace",
    description: "Curated sealed TCG products, nationwide delivery, and wholesale support in Japan.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "PIMART CARD",
    description: "Curated sealed TCG products fulfilled and delivered within Japan.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/logo-icon.png", type: "image/png" }, { url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#080b10",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const member = await getMemberSession();

  return (
    <html
      lang={HTML_LANG[lang]}
      className={`${inter.variable} ${notoSansSC.variable} ${notoSansJP.variable} h-full antialiased`}
    >
      <body
        className="site-shell min-h-full"
        style={{
          fontFamily:
            'var(--font-inter), var(--font-noto-sc), var(--font-noto-jp), system-ui, sans-serif',
        }}
      >
        <LangProvider initial={lang}>
          <CartProvider>
            <MobileNavGestures />
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>
            <div className="site-frame">
              <Header member={member} />
              <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
            </div>
            <Footer />
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
