import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";

type Product = React.ComponentProps<typeof ProductCard>["product"];

type Props = {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
  badge?: string;
};

export function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
  viewAllLabel = "View all",
  badge,
}: Props) {
  if (products.length === 0) return null;

  return (
    <section className="py-8 sm:py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="shrink-0 text-sm font-medium text-[#374151] hover:text-[#111827]">
            {viewAllLabel} →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="relative">
            {badge && (
              <span className="absolute -right-1 -top-1 z-10 rounded-full bg-[#111827] px-2 py-0.5 text-[10px] font-semibold text-white">
                {badge}
              </span>
            )}
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
