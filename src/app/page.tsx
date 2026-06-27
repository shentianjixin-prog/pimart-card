import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { ProductListingControls } from "@/components/ProductListingControls";
import { Pagination } from "@/components/Pagination";
import { HomeHero } from "@/components/HomeHero";
import { HomeInfoBar } from "@/components/HomeInfoBar";
import { SearchBar } from "@/components/SearchBar";
import { ProductSection } from "@/components/ProductSection";
import { WhyPimart } from "@/components/WhyPimart";
import { WholesaleBanner } from "@/components/WholesaleBanner";
import { t, resolveLang } from "@/lib/translations";
import { fetchFilterFacets } from "@/lib/product-facets";
import {
  PAGE_SIZE,
  buildOrderBy,
  buildWhere,
  isListingView,
  parseFilterState,
  type RawSearchParams,
} from "@/lib/product-filters";
import type { Prisma } from "@/generated/prisma/client";

const POPULAR_TARGET = 10;

const ACTIVE_PRODUCT: Prisma.ProductWhereInput = { status: "上架" };

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
  searchParams: Promise<RawSearchParams>;
}) {
  const [rawSp, cookieStore] = await Promise.all([searchParams, cookies()]);
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const T = (key: string) => t(key, lang);

  const filterState = parseFilterState(rawSp);
  const showMarketing = !isListingView(filterState);
  const where = buildWhere(filterState);
  const orderBy = buildOrderBy(filterState.sort);
  const page = filterState.page;

  const stockFilter = { ...ACTIVE_PRODUCT, stock: { gt: 0 } };

  const [
    products,
    total,
    facets,
    heroProducts,
    featuredProducts,
    recentInStock,
    newArrivals,
    psaPicks,
  ] = await Promise.all([
    showMarketing
      ? Promise.resolve([])
      : prisma.product.findMany({
          where,
          orderBy,
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE,
        }),
    showMarketing ? Promise.resolve(0) : prisma.product.count({ where }),
    showMarketing ? Promise.resolve(null) : fetchFilterFacets(),
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

        <HomeInfoBar />

        <ProductSection
          title={T("section_popular")}
          subtitle={T("section_popular_sub")}
          products={popular}
          viewAllHref="/?stock=instock"
          viewAllLabel={T("section_view_all")}
          tone="default"
        />

        <ProductSection
          title={T("section_new_arrivals")}
          subtitle={T("section_new_sub")}
          products={newArrivals}
          viewAllHref="/?sort=newest&stock=instock"
          viewAllLabel={T("section_shop_all")}
          tone="blue"
        />

        <ProductSection
          title={T("section_psa_picks")}
          subtitle={T("section_psa_sub")}
          products={psaPicks}
          viewAllHref="/?type=psa"
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="section-title">
          {filterState.q
            ? `${T("page_search_pre")}${filterState.q}"`
            : filterState.category || T("page_all_products")}
        </h1>
        <p className="section-subtitle">{T("page_shipping_desc")}</p>
        <div className="mt-5 max-w-xl">
          <SearchBar defaultValue={filterState.q ?? ""} />
        </div>
      </div>

      {facets && (
        <ProductListingControls state={filterState} facets={facets} total={total}>
          {products.length === 0 ? (
            <p className="py-20 text-center text-[#9ca3af]">{T("page_no_products")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            filterState={filterState}
          />
          <div className="mt-8 text-center">
            <Link href="/" className="text-sm font-medium text-[#374151] hover:text-[#111827]">
              {T("page_back_home")}
            </Link>
          </div>
        </ProductListingControls>
      )}
    </div>
  );
}
