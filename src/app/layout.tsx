import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { CartProvider } from "@/lib/cart-context";
import { LangProvider } from "@/lib/lang-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
  title: "PIMART CARD | グローバルトレーディングカードマーケット",
  description:
    "日版・中国語版 TCG 未開封BOX、PSA鑑定品、卸売対応。正規品保証、日本から発送。",
  icons: {
    icon: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
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
            <div className="site-frame">
              <Header member={member} />
              <main className="flex-1">{children}</main>
            </div>
            <Footer />
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
