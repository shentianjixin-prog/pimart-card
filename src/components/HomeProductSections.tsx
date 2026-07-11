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

function SectionHead({
  mark,
  eyebrow,
  title,
  subtitle,
  action,
}: {
  mark: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="home-section-head">
      <div className="home-section-head-copy min-w-0">
        <div className="home-section-meta">
          <span className="home-section-mark" aria-hidden>
            {mark}
          </span>
          <p className="home-section-eyebrow">{eyebrow}</p>
        </div>
        <h2 className="home-section-title">{title}</h2>
        {subtitle ? <p className="home-section-sub">{subtitle}</p> : null}
      </div>
      {action}
    </header>
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
          <SectionHead
            mark="01"
            eyebrow={T("section_latest_eyebrow")}
            title={T("section_latest")}
          />
          <ProductGrid products={latest.slice(0, 4)} />
        </section>
      ) : null}

      {popular.length > 0 ? (
        <section className="home-products-v2">
          <SectionHead
            mark="02"
            eyebrow={T("section_popular_eyebrow")}
            title={T("section_popular")}
            subtitle={T("section_popular_sub")}
            action={
              <Link href="/?stock=instock" className="home-products-viewall shrink-0">
                {T("section_view_more")}
              </Link>
            }
          />
          <ProductGrid products={popular.slice(0, 8)} />
        </section>
      ) : null}
    </>
  );
}
