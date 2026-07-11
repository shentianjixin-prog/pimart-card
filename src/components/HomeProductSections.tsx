import Link from "next/link";
import { cookies } from "next/headers";
import { ProductCard } from "@/components/ProductCard";
import { t, resolveLang } from "@/lib/translations";

type Product = React.ComponentProps<typeof ProductCard>["product"];

type Props = {
  latest: Product[];
  popular: Product[];
};

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export async function HomeProductSections({ latest, popular }: Props) {
  const cookieStore = await cookies();
  const lang = resolveLang(cookieStore.get("lang")?.value);
  const T = (key: string) => t(key, lang);

  if (!latest.length && !popular.length) return null;

  return (
    <>
      {latest.length > 0 ? (
        <section className="home-products-v2 home-products-latest">
          <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6">
            <div className="min-w-0">
              <h2 className="section-title">{T("section_latest")}</h2>
              <p className="section-subtitle">{T("section_latest_sub")}</p>
            </div>
          </div>
          <ProductGrid products={latest.slice(0, 4)} />
        </section>
      ) : null}

      {popular.length > 0 ? (
        <section className="home-products-v2">
          <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6">
            <div className="min-w-0">
              <h2 className="section-title">{T("section_popular")}</h2>
              <p className="section-subtitle">{T("section_popular_sub")}</p>
            </div>
            <Link href="/?stock=instock" className="home-products-viewall shrink-0">
              {T("section_view_more")}
            </Link>
          </div>
          <ProductGrid products={popular.slice(0, 8)} />
        </section>
      ) : null}
    </>
  );
}
