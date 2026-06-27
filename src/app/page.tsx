import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Pagination } from "@/components/Pagination";
import { HomeHero } from "@/components/HomeHero";
import { TrustBadges } from "@/components/TrustBadges";
import { WholesaleSection } from "@/components/WholesaleSection";
import { SectionHeader } from "@/components/SectionHeader";
import { t, type Lang } from "@/lib/translations";
import { translateProduct } from "@/lib/translate-api";
import type { Prisma } from "@/generated/prisma/client";

const PAGE_SIZE = 12;

type SearchParams = {
  category?: string;
  boxType?: string;
  inStock?: string;
  isPreorder?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  q?: string;
  page?: string;
  era?: string; // 宝可梦时代筛选: sv/ss/sm/gem/gift
};

function isDefaultView(sp: SearchParams) {
  return (
    !sp.category &&
    !sp.boxType &&
    !sp.inStock &&
    !sp.isPreorder &&
    !sp.minPrice &&
    !sp.maxPrice &&
    !sp.q &&
    (!sp.page || sp.page === "1")
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [sp, cookieStore] = await Promise.all([searchParams, cookies()]);
  const rawLang = cookieStore.get("lang")?.value ?? "zh";
  const lang: Lang = rawLang === "ja" || rawLang === "en" ? rawLang : "zh";
  const T = (key: string) => t(key, lang);

  const page = Math.max(1, Number(sp.page) || 1);
  const showHero = isDefaultView(sp);

  const where: Prisma.ProductWhereInput = {};
  if (sp.category) where.category = sp.category;
  if (sp.boxType) where.boxType = sp.boxType;
  if (sp.inStock === "1") where.stock = { gt: 0 };
  if (sp.isPreorder === "0") where.isPreorder = false;
  if (sp.isPreorder === "1") where.isPreorder = true;
  if (sp.minPrice || sp.maxPrice) {
    where.priceJpy = {
      ...(sp.minPrice ? { gte: Number(sp.minPrice) } : {}),
      ...(sp.maxPrice ? { lte: Number(sp.maxPrice) } : {}),
    };
  }
  if (sp.q) {
    where.OR = [
      { name: { contains: sp.q } },
      { series: { contains: sp.q } },
    ];
  }

  // 首页默认只展示有货；?inStock=0 可查看含售罄
  if (sp.inStock === "0") {
    // 显式查看全部（含售罄）
  } else if (sp.inStock === "1" || (showHero && !sp.q)) {
    where.stock = { gt: 0 };
  }

  // 时代筛选（仅宝可梦）
  if (sp.era && sp.category === "宝可梦原盒") {
    const eraSeriesMap: Record<string, string> = {
      sv:   "朱・紫",
      ss:   "剑&盾",
      sm:   "太阳&月亮",
      gem:  "宝石包",
    };
    if (sp.era === "gift") {
      where.boxType = "礼盒";
    } else if (eraSeriesMap[sp.era]) {
      where.series = { contains: eraSeriesMap[sp.era] };
    }
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sp.sort === "price_asc"
      ? { priceJpy: "asc" }
      : sp.sort === "price_desc"
        ? { priceJpy: "desc" }
        : { createdAt: "desc" };

  const [rawProducts, total, categoryFacets, rawFeatured, rawHot, rawNew, rawPreorder] =
    await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.product.count({ where }),
      prisma.product.groupBy({ by: ["category"], _count: { _all: true } }),
      showHero
        ? prisma.product.findMany({
            where: { featured: true, stock: { gt: 0 } },
            orderBy: { createdAt: "desc" },
            take: 4,
          })
        : Promise.resolve([]),
      showHero
        ? prisma.product.findMany({
            where: { stock: { gt: 0, lte: 5 }, isPreorder: false },
            orderBy: { stock: "asc" },
            take: 4,
          })
        : Promise.resolve([]),
      showHero
        ? prisma.product.findMany({
            where: { stock: { gt: 0 } },
            orderBy: { createdAt: "desc" },
            take: 4,
          })
        : Promise.resolve([]),
      showHero
        ? prisma.product.findMany({
            where: { isPreorder: true },
            orderBy: { createdAt: "desc" },
            take: 4,
          })
        : Promise.resolve([]),
    ]);

  const [products, featuredProducts, hotProducts, newProducts, preorderProducts] = await Promise.all([
    lang !== "zh" ? Promise.all(rawProducts.map((p) => translateProduct(p, lang))) : Promise.resolve(rawProducts),
    lang !== "zh" ? Promise.all(rawFeatured.map((p) => translateProduct(p, lang))) : Promise.resolve(rawFeatured),
    lang !== "zh" ? Promise.all(rawHot.map((p) => translateProduct(p, lang))) : Promise.resolve(rawHot),
    lang !== "zh" ? Promise.all(rawNew.map((p) => translateProduct(p, lang))) : Promise.resolve(rawNew),
    lang !== "zh" ? Promise.all(rawPreorder.map((p) => translateProduct(p, lang))) : Promise.resolve(rawPreorder),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 lg:px-12">
      {showHero && <HomeHero />}
      {showHero && <TrustBadges />}

      {showHero && newProducts.length > 0 && (
        <section className="mb-16">
          <SectionHeader
            index="04"
            title={T("section_new_arrivals")}
            href="/?sort=newest"
            linkLabel={T("section_view_all")}
          />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6">
            {newProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {showHero && hotProducts.length > 0 && (
        <section className="mb-16">
          <SectionHeader
            index="05"
            title={T("section_best_sellers")}
            href="/?isPreorder=0&inStock=1"
            linkLabel={T("section_view_all")}
          />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6">
            {hotProducts.map((p) => (
              <div key={p.id} className="relative">
                <span className="absolute -right-1 -top-1 z-10 rounded-sm border border-red-900/60 bg-red-950 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-400">
                  {T("page_hot_badge")}
                </span>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {showHero && preorderProducts.length > 0 && (
        <section className="mb-16">
          <SectionHeader
            index="06"
            title={T("section_preorder")}
            href="/?isPreorder=1"
            linkLabel={T("section_view_all")}
          />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6">
            {preorderProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {showHero && <WholesaleSection />}

      <div className="mb-8 mt-4">
        <SectionHeader
          index={showHero ? "07" : "—"}
          title={
            sp.q
              ? `${T("page_search_pre")}${sp.q}"`
              : sp.category || T("page_all_products")
          }
        />
        {!showHero && (
          <p className="-mt-4 text-sm text-neutral-600">{T("page_shipping_desc")}</p>
        )}
      </div>

      <div className="flex flex-col gap-8 sm:flex-row">
        <FilterSidebar
          categories={categoryFacets.map((c) => ({
            value: c.category,
            count: c._count._all,
          }))}
          current={{ ...sp, era: sp.era }}
        />
        <div className="flex-1">
          <p className="mb-4 text-sm text-gray-500">
            {T("page_total_pre")}{total}{T("page_total_unit")}
            {showHero && sp.inStock !== "0" && (
              <>
                {" · "}
                <Link href="/?inStock=0" className="text-neutral-400 hover:text-white">
                  {T("page_show_sold_out")}
                </Link>
              </>
            )}
          </p>
          {products.length === 0 ? (
            <p className="py-20 text-center text-gray-400">{T("page_no_products")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <Pagination currentPage={page} totalPages={totalPages} searchParams={sp} />
        </div>
      </div>
    </div>
  );
}
