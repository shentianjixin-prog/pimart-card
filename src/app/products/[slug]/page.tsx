import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatJpy } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductFormatSelector } from "@/components/ProductFormatSelector";
import { t, resolveLang, translateBoxType, type Lang } from "@/lib/translations";
import { isProductArchived } from "@/lib/product-status";
import { findBoxVariants } from "@/lib/product-box-variants";
import { OpcProductSpecs } from "@/components/OpcProductSpecs";
import { OpcTopCards } from "@/components/OpcTopCards";

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

  const variants = await findBoxVariants(product);
  const soldOut = product.stock <= 0;
  const boxLabel = product.boxType ? translateBoxType(product.boxType, lang) : "";

  return (
    <div className="product-detail">
      <nav className="product-detail-nav">
        <Link href="/" className="link-muted">
          {T("detail_all_products")}
        </Link>
        <span className="text-[#9ca3af]"> / </span>
        <span className="truncate text-[#111827]">{product.name}</span>
      </nav>

      <div className="product-detail-layout">
        <div className="product-detail-media">
          <ProductImageGallery
            images={product.images}
            name={product.name}
            soldOut={soldOut}
            soldOutLabel={T("card_sold_out")}
          />
        </div>

        <div className="product-detail-info">
          <div className="product-detail-meta">
            {product.category ? <span className="product-detail-badge">{product.category}</span> : null}
            {boxLabel ? <span className="product-detail-badge">{boxLabel}</span> : null}
            {product.isPreorder ? (
              <span className="product-detail-badge is-preorder">{T("detail_preorder")}</span>
            ) : null}
          </div>

          <h1 className="product-detail-title">{product.name}</h1>

          {product.series ? (
            <p className="product-detail-series">
              {T("detail_series")}
              {product.series}
            </p>
          ) : null}

          {product.language ? <p className="product-detail-lang">{product.language}</p> : null}

          <p className="product-detail-price">{formatJpy(product.priceJpy)}</p>
          <p className="product-detail-tax">{T("detail_price_tax")}</p>

          {!soldOut && product.stock <= 3 ? (
            <p className="product-detail-lowstock">
              {T("detail_remaining_pre")}
              {product.stock}
              {T("detail_remaining_suf")}
            </p>
          ) : null}

          <ProductFormatSelector
            variants={variants}
            currentSlug={product.slug}
            series={product.series}
          />

          <div className="product-detail-shipping">
            <p className="product-detail-shipping-title">{T("detail_shipping_h")}</p>
            <ul>
              <li>
                {T("detail_shipping_1_pre")}
                {product.shippingDays}
                {T("detail_shipping_1_suf")}
              </li>
              <li>{T("detail_shipping_2")}</li>
            </ul>
          </div>

          {product.isPreorder && product.releaseDate ? (
            <p className="product-detail-preorder-date">
              {T("detail_preorder_date")}
              {formatReleaseDate(product.releaseDate, lang)}
            </p>
          ) : null}

          <div className="product-detail-cta">
            <AddToCartButton product={product} />
          </div>

          <OpcProductSpecs
            series={product.series}
            boxType={product.boxType}
            lang={lang}
            T={T}
          />

          <OpcTopCards series={product.series} lang={lang} T={T} />

          {product.description ? (
            <div className="product-detail-desc">
              <p className="product-detail-desc-title">{T("detail_description")}</p>
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
