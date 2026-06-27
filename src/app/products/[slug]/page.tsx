import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatJpy } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { t, type Lang } from "@/lib/translations";
import { translateProduct } from "@/lib/translate-api";

function formatReleaseDate(date: Date, lang: Lang) {
  if (lang === "en") {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
  if (lang === "ja") {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug: rawSlug }, cookieStore] = await Promise.all([params, cookies()]);
  const slug = decodeURIComponent(rawSlug);
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) notFound();

  const rawLang = cookieStore.get("lang")?.value ?? "zh";
  const lang: Lang = rawLang === "ja" || rawLang === "en" ? rawLang : "zh";
  const T = (key: string) => t(key, lang);

  const p = lang !== "zh" ? await translateProduct(product, lang) : product;

  const soldOut = p.stock <= 0;

  const TIMELINE = [
    { label: T("detail_timeline_0"), sub: T("detail_timeline_0s") },
    { label: T("detail_timeline_1"), sub: T("detail_timeline_1s") },
    { label: T("detail_timeline_2"), sub: T("detail_timeline_2s") },
    { label: T("detail_timeline_3"), sub: T("detail_timeline_3s") },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="link-muted">{T("detail_all_products")}</Link>{" "}
        / <span className="text-gray-300">{p.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        {/* 左：图片画廊 */}
        <div className="relative">
          <ProductImageGallery images={p.images} name={p.name} />
          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60">
              <span className="rounded bg-white/10 px-4 py-1.5 text-sm font-bold tracking-wider text-white backdrop-blur-sm">
                {T("card_sold_out")}
              </span>
            </div>
          )}
        </div>

        {/* 右：商品信息 */}
        <div>
          <p className="text-xs font-medium text-gray-500">{p.category}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-white">{p.name}</h1>
            {p.isPreorder && (
              <span className="rounded bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                {T("detail_preorder")}
              </span>
            )}
          </div>
          {p.series && (
            <p className="mt-2 text-sm text-gray-400">{T("detail_series")}{p.series}</p>
          )}

          <p className="mt-6 text-3xl font-bold text-cyan-300">
            {formatJpy(p.priceJpy)}
          </p>
          {!soldOut && p.stock <= 3 && (
            <p className="mt-1 text-sm font-medium text-orange-400">
              {T("detail_remaining_pre")}{p.stock}{T("detail_remaining_suf")}
            </p>
          )}

          {/* 发货说明 */}
          <div className="surface mt-5 space-y-2 p-4 text-sm">
            <p className="font-semibold text-white">{T("detail_shipping_h")}</p>
            <ul className="list-disc space-y-1 pl-5 text-gray-400">
              <li>{T("detail_shipping_1_pre")}{p.shippingDays}{T("detail_shipping_1_suf")}</li>
              <li>{T("detail_shipping_2")}</li>
              <li>{T("detail_shipping_3")}</li>
            </ul>
          </div>

          {/* 发货时间线 */}
          <div className="mt-5 flex items-start justify-between">
            {TIMELINE.map((step, i) => (
              <div key={step.label} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-center">
                  <div className={`h-px flex-1 ${i === 0 ? "invisible" : "bg-white/20"}`} />
                  <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                  <div className={`h-px flex-1 ${i === TIMELINE.length - 1 ? "invisible" : "bg-white/20"}`} />
                </div>
                <p className="text-center text-[11px] font-medium text-white">{step.label}</p>
                <p className="text-center text-[10px] text-gray-500">{step.sub}</p>
              </div>
            ))}
          </div>

          {p.isPreorder && p.releaseDate && (
            <p className="mt-3 text-sm text-orange-300">
              {T("detail_preorder_date")}{formatReleaseDate(p.releaseDate, lang)}
            </p>
          )}

          {p.description && (
            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-gray-400">
              {p.description}
            </p>
          )}

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
