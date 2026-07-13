import Link from "next/link";
import type { Metadata } from "next";
import { cache } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { t, resolveLang, type Lang } from "@/lib/translations";
import { isProductArchived } from "@/lib/product-status";
import { findBoxVariants } from "@/lib/product-box-variants";
import { OpcProductSpecs } from "@/components/OpcProductSpecs";
import { ProductDetailPurchase } from "@/components/ProductDetailPurchase";

const getProductBySlug = cache((slug: string) =>
  prisma.product.findUnique({ where: { slug } })
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const product = await getProductBySlug(decodeURIComponent(rawSlug));
  if (!product || isProductArchived(product.status)) return { title: "Product not found" };
  const description = product.description?.slice(0, 155) ||
    `${product.name} — current price, stock status, and dispatch information from PIMART CARD.`;
  const image = product.images.split(",")[0]?.trim();
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${encodeURIComponent(product.slug)}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
  };
}

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
  const product = await getProductBySlug(slug);

  if (!product || isProductArchived(product.status)) notFound();

  const lang = resolveLang(cookieStore.get("lang")?.value);
  const T = (key: string) => t(key, lang);

  const variants = await findBoxVariants(product);
  const productUrl = `https://pimartcard.com/products/${encodeURIComponent(product.slug)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: product.images.split(",").map((image) => image.trim()).filter(Boolean),
    sku: product.id,
    category: product.category,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "JPY",
      price: product.priceJpy,
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <div className="product-detail">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <nav className="product-detail-nav">
        <Link href="/" className="link-muted">
          {T("detail_all_products")}
        </Link>
        <span className="text-[#9ca3af]"> / </span>
        <span className="truncate text-[#111827]">{product.name}</span>
      </nav>

      <ProductDetailPurchase
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          series: product.series,
          language: product.language,
          category: product.category,
          boxType: product.boxType,
          priceJpy: product.priceJpy,
          stock: product.stock,
          images: product.images,
          isPreorder: product.isPreorder,
          shippingDays: product.shippingDays,
          description: product.description,
          releaseDateLabel: product.releaseDate
            ? formatReleaseDate(product.releaseDate, lang)
            : null,
        }}
        variants={variants}
      >
        <OpcProductSpecs
          series={product.series}
          boxType={product.boxType}
          lang={lang}
          T={T}
        />

        {product.description ? (
          <div className="product-detail-desc">
            <p className="product-detail-desc-title">{T("detail_description")}</p>
            <p className="whitespace-pre-line">{product.description}</p>
          </div>
        ) : null}
      </ProductDetailPurchase>
    </div>
  );
}
