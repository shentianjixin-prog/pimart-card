import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Pagination } from "@/components/Pagination";
import { HomeHero } from "@/components/HomeHero";
import { CategoryPills } from "@/components/CategoryPills";
import { ProductSection } from "@/components/ProductSection";
import { WhyPimart } from "@/components/WhyPimart";
import { WholesaleBanner } from "@/components/WholesaleBanner";
import { t, type Lang } from "@/lib/translations";
import type { Prisma } from "@/generated/prisma/client";

const PAGE_SIZE = 12;

const ACTIVE_PRODUCT: Prisma.ProductWhereInput = {
  NOT: { status: "下架" },
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
    newArrivals,
    bestSellers,
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
          where: stockFilter,
          orderBy: { createdAt: "desc" },
          take: 4,
        })
      : Promise.resolve([]),
    showMarketing
      ? prisma.product.findMany({
          where: { ...stockFilter, featured: true },
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
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6 sm:py-8">
          <HomeHero products={heroProducts} />
        </div>
        <CategoryPills />
        <ProductSection
          title="New Arrivals"
          subtitle="Latest sealed boxes and graded picks"
          products={newArrivals}
          viewAllHref="/?sort=newest&inStock=1"
          viewAllLabel="Shop all"
        />
        <ProductSection
          title="Best Sellers"
          subtitle="Popular items with strong demand"
          products={bestSellers}
          viewAllHref="/?inStock=1"
          viewAllLabel="View all"
          badge="Hot"
        />
        <ProductSection
          title="PSA Picks"
          subtitle="Graded cards and premium inventory"
          products={psaPicks}
          viewAllHref="/?q=PSA"
          viewAllLabel="View PSA"
        />
        <div className="space-y-8 py-8 sm:py-10">
          <WhyPimart />
          <WholesaleBanner />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="section-title">
          {sp.q
            ? `${T("page_search_pre")}${sp.q}"`
            : sp.category || T("page_all_products")}
        </h1>
        <p className="section-subtitle">{T("page_shipping_desc")}</p>
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <Pagination currentPage={page} totalPages={totalPages} searchParams={sp} />
          <div className="mt-8 text-center">
            <Link href="/" className="text-sm font-medium text-[#374151] hover:text-[#111827]">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
