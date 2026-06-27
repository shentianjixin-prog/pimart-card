import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatJpy } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { t, resolveLang, type Lang } from "@/lib/translations";
import { isProductArchived } from "@/lib/product-status";

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

  if (!product || isProductArchived(product.status)) notFound();

  const lang = resolveLang(cookieStore.get("lang")?.value);
  const T = (key: string) => t(key, lang);

  const soldOut = product.stock <= 0;
  const metaParts = [product.cardNumber, product.rarity, product.language].filter(Boolean);

  const TIMELINE = [
    { label: T("detail_timeline_0"), sub: T("detail_timeline_0s") },
    { label: T("detail_timeline_1"), sub: T("detail_timeline_1s") },
    { label: T("detail_timeline_2"), sub: T("detail_timeline_2s") },
    { label: T("detail_timeline_3"), sub: T("detail_timeline_3s") },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-[#6b7280]">
        <Link href="/" className="link-muted">{T("detail_all_products")}</Link>{" "}
        / <span className="text-[#111827]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div className="relative">
          <ProductImageGallery images={product.images} name={product.name} />
          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-white/72 backdrop-blur-[2px]">
              <span className="rounded-full border border-[rgba(17,24,39,0.08)] bg-white px-4 py-1.5 text-sm font-semibold text-[#6b7280]">
                {T("card_sold_out")}
              </span>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-[#6b7280]">{product.category}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-[#111827] sm:text-3xl">{product.name}</h1>
            {product.isPreorder && (
              <span className="rounded-full bg-[#FFF7D6] px-2.5 py-0.5 text-xs font-semibold text-[#92400e]">
                {T("detail_preorder")}
              </span>
            )}
          </div>
          {product.series && (
            <p className="mt-2 text-sm text-[#6b7280]">{T("detail_series")}{product.series}</p>
          )}
          {metaParts.length > 0 && (
            <p className="mt-1 text-sm text-[#9ca3af]">{metaParts.join(" · ")}</p>
          )}

          <p className="mt-6 text-3xl font-semibold text-[#111827]">
            {formatJpy(product.priceJpy)}
          </p>
          {!soldOut && product.stock <= 3 && (
            <p className="mt-1 text-sm font-medium text-[#92400e]">
              {T("detail_remaining_pre")}{product.stock}{T("detail_remaining_suf")}
            </p>
          )}

          <div className="surface mt-5 space-y-2 p-4 text-sm">
            <p className="font-semibold text-[#111827]">{T("detail_shipping_h")}</p>
            <ul className="list-disc space-y-1 pl-5 text-[#6b7280]">
              <li>{T("detail_shipping_1_pre")}{product.shippingDays}{T("detail_shipping_1_suf")}</li>
              <li>{T("detail_shipping_2")}</li>
              <li>{T("detail_shipping_3")}</li>
            </ul>
          </div>

          <div className="mt-5 flex items-start justify-between">
            {TIMELINE.map((step, i) => (
              <div key={step.label} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-center">
                  <div className={`h-px flex-1 ${i === 0 ? "invisible" : "bg-[rgba(17,24,39,0.12)]"}`} />
                  <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#111827]" />
                  <div className={`h-px flex-1 ${i === TIMELINE.length - 1 ? "invisible" : "bg-[rgba(17,24,39,0.12)]"}`} />
                </div>
                <p className="text-center text-[11px] font-medium text-[#111827]">{step.label}</p>
                <p className="text-center text-[10px] text-[#9ca3af]">{step.sub}</p>
              </div>
            ))}
          </div>

          {product.isPreorder && product.releaseDate && (
            <p className="mt-3 text-sm text-[#92400e]">
              {T("detail_preorder_date")}{formatReleaseDate(product.releaseDate, lang)}
            </p>
          )}

          {product.description && (
            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-[#6b7280]">
              {product.description}
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
