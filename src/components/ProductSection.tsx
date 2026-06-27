import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";

type Product = React.ComponentProps<typeof ProductCard>["product"];

type Props = {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
  tone?: "default" | "blue" | "purple" | "sky";
};

const TONE_CLASS: Record<NonNullable<Props["tone"]>, string> = {
  default: "section-tone-default",
  blue: "section-tone-blue",
  purple: "section-tone-purple",
  sky: "section-tone-sky",
};

export function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
  viewAllLabel = "View all",
  tone = "default",
}: Props) {
  if (products.length === 0) return null;

  return (
    <section className={`section-block py-12 sm:py-16 lg:py-20 ${TONE_CLASS[tone]}`}>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="shrink-0 text-sm font-medium text-[#374151] transition hover:text-[#111827]">
            {viewAllLabel} →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-7">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
