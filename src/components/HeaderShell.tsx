import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";

export async function HeaderShell() {
  const facets = await prisma.product.groupBy({
    by: ["category"],
    _count: { _all: true },
  });

  const categoryCounts = Object.fromEntries(
    facets.map((f) => [f.category, f._count._all])
  );

  return <Header categoryCounts={categoryCounts} />;
}
