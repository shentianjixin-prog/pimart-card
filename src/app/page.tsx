import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Pagination } from "@/components/Pagination";
import { HomeHero } from "@/components/HomeHero";
import { SearchBar } from "@/components/SearchBar";
import { ProductSection } from "@/components/ProductSection";
import { WhyPimart } from "@/components/WhyPimart";
import { WholesaleBanner } from "@/components/WholesaleBanner";
import { t, resolveLang } from "@/lib/translations";
import type { Prisma } from "@/generated/prisma/client";

const PAGE_SIZE = 12;
const POPULAR_TARGET = 10;

const ACTIVE_PRODUCT: Prisma.ProductWhereInput = {
  status: "上架",
};

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

function mergePopularProducts<T extends { id: string }>(
  featured: T[],
  recent: T[],
  target: number
): T[] {
  const seen = new Set<string>();
  const merged: T[] = [];
  for (const p of [...featured, ...recent]) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    merged.push(p);
    if (merged.length >= target) break;
  }
  return merged;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [sp, cookieStore] = await Promise.all([searchParams, cookies()]);
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const T = (key: string) => t(key, lang);

  const page = Math.max(1, Number(sp.page) || 1);
  const showMarketing = isDefaultView(sp);

  const where: Prisma.ProductWhereInput = { ...ACTIVE_PRODUCT };
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
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
      {
        OR: [
          { name: { contains: sp.q } },
          { series: { contains: sp.q } },
          { cardNumber: { contains: sp.q } },
          { rarity: { contains: sp.q } },
          { language: { contains: sp.q } },
        ],
      },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sp.sort === "price_asc"
      ? { priceJpy: "asc" }
      : sp.sort === "price_desc"
        ? { priceJpy: "desc" }
        : { createdAt: "desc" };

  const stockFilter = { ...ACTIVE_PRODUCT, stock: { gt: 0 } };

  const [
    products,
    total,
    categoryFacets,
    heroProducts,
    featuredProducts,
    recentInStock,
    newArrivals,
    psaPicks,
  ] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.product.groupBy({
      by: ["category"],
      where: ACTIVE_PRODUCT,
      _count: { _all: true },
    }),
    showMarketing
      ? prisma.product.findMany({
          where: stockFilter,
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { name: true, images: true, slug: true },
        })
      : Promise.resolve([]),
    showMarketing
      ? prisma.product.findMany({
          where: { ...stockFilter, featured: true },
          orderBy: { createdAt: "desc" },
          take: 12,
        })
      : Promise.resolve([]),
    showMarketing
      ? prisma.product.findMany({
          where: stockFilter,
          orderBy: { createdAt: "desc" },
          take: 12,
        })
      : Promise.resolve([]),
    showMarketing
      ? prisma.product.findMany({
          where: stockFilter,
          orderBy: { createdAt: "desc" },
          take: 4,
        })
      : Promise.resolve([]),
    showMarketing
      ? prisma.product.findMany({
          where: {
            ...stockFilter,
            OR: [
              { name: { contains: "PSA" } },
              { series: { contains: "PSA" } },
              { category: { contains: "PSA" } },
              { rarity: { contains: "PSA" } },
            ],
          },
          orderBy: { priceJpy: "desc" },
          take: 4,
        })
      : Promise.resolve([]),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (showMarketing) {
    const popular = mergePopularProducts(featuredProducts, recentInStock, POPULAR_TARGET);

    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="hero-section-spacing">
          <HomeHero products={heroProducts} />
        </div>

        <ProductSection
          title={T("section_popular")}
          subtitle={T("section_popular_sub")}
          products={popular}
          viewAllHref="/?inStock=1"
          viewAllLabel={T("section_view_all")}
          tone="default"
        />

        <ProductSection
          title={T("section_new_arrivals")}
          subtitle={T("section_new_sub")}
          products={newArrivals}
          viewAllHref="/?sort=newest&inStock=1"
          viewAllLabel={T("section_shop_all")}
          tone="blue"
        />

        <ProductSection
          title={T("section_psa_picks")}
          subtitle={T("section_psa_sub")}
          products={psaPicks}
          viewAllHref="/?q=PSA"
          viewAllLabel={T("section_view_psa")}
          tone="sky"
        />

        <div className="py-10 sm:py-14 lg:py-16">
          <WholesaleBanner />
        </div>

        <div className="pb-10 sm:pb-14 lg:pb-16">
          <WhyPimart />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8">
        <h1 className="section-title">
          {sp.q
            ? `${T("page_search_pre")}${sp.q}"`
            : sp.category || T("page_all_products")}
        </h1>
        <p className="section-subtitle">{T("page_shipping_desc")}</p>
        <div className="mt-6 max-w-xl">
          <SearchBar defaultValue={sp.q ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar
          categories={categoryFacets.map((c) => ({
            value: c.category,
            count: c._count._all,
          }))}
          current={{ ...sp }}
        />
        <div className="flex-1">
          <p className="mb-4 text-sm text-[#6b7280]">
            {T("page_total_pre")}{total}{T("page_total_unit")}
          </p>
          {products.length === 0 ? (
            <p className="py-20 text-center text-[#9ca3af]">{T("page_no_products")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-7">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <Pagination currentPage={page} totalPages={totalPages} searchParams={sp} />
          <div className="mt-8 text-center">
            <Link href="/" className="text-sm font-medium text-[#374151] hover:text-[#111827]">
              {T("page_back_home")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
