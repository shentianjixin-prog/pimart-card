import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { t, resolveLang, type Lang } from "@/lib/translations";
import { isProductArchived } from "@/lib/product-status";
import { findBoxVariants } from "@/lib/product-box-variants";
import { OpcProductSpecs } from "@/components/OpcProductSpecs";
import { ProductDetailPurchase } from "@/components/ProductDetailPurchase";

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

  return (
    <div className="product-detail">
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
