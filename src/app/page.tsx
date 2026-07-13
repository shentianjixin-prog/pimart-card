import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { ProductListingControls } from "@/components/ProductListingControls";
import { Pagination } from "@/components/Pagination";
import { HomeHero } from "@/components/HomeHero";
import { HomeAnnounceBar } from "@/components/HomeAnnounceBar";
import { HomeProductSections } from "@/components/HomeProductSections";
import { HomeB2B } from "@/components/HomeB2B";
import { HomeFindRequest } from "@/components/HomeFindRequest";
import { TrustedFeatures } from "@/components/TrustedFeatures";
import { t, resolveLang } from "@/lib/translations";
import { fetchFilterFacets, fetchSubGameCounts } from "@/lib/product-facets";
import {
  PAGE_SIZE,
  buildOrderBy,
  buildWhere,
  isListingView,
  parseFilterState,
  LISTING_PRODUCT,
  type RawSearchParams,
} from "@/lib/product-filters";
const POPULAR_TARGET = 8;
const LATEST_TARGET = 4;

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

  const stockFilter = { ...LISTING_PRODUCT, stock: { gt: 0 } };

  const [
    products,
    total,
    facets,
    subGameCounts,
    heroProducts,
    featuredProducts,
    recentInStock,
    latestProducts,
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
    showMarketing ? Promise.resolve(null) : fetchFilterFacets(filterState.game),
    showMarketing ? Promise.resolve({}) : fetchSubGameCounts(),
    showMarketing
      ? prisma.product.findMany({
          where: {
            OR: [
              { images: { contains: "151-box" } },
              { images: { contains: "cbb5c" } },
              { images: { contains: "csv9c" } },
              { images: { contains: "csv3c" } },
              { images: { contains: "csv8c" } },
            ],
          },
          orderBy: { createdAt: "desc" },
          take: 12,
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
          take: 16,
        })
      : Promise.resolve([]),
    showMarketing
      ? prisma.product.findMany({
          where: LISTING_PRODUCT,
          orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
          take: LATEST_TARGET,
        })
      : Promise.resolve([]),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (showMarketing) {
    const latestIds = new Set(latestProducts.map((p) => p.id));
    const popular = mergePopularProducts(featuredProducts, recentInStock, POPULAR_TARGET + latestProducts.length)
      .filter((p) => !latestIds.has(p.id))
      .slice(0, POPULAR_TARGET);
    return (
      <>
        <HomeHero products={heroProducts} />

        <div className="home-main-stack mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HomeAnnounceBar />

          <HomeProductSections latest={latestProducts} popular={popular} />

          <HomeB2B />
          <HomeFindRequest />
          <TrustedFeatures />
        </div>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      {facets && (
        <ProductListingControls
          state={filterState}
          facets={facets}
          subGameCounts={subGameCounts}
          total={total}
        >
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
