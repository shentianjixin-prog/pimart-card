import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProductAction } from "../../../../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, product.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">编辑商品</h1>
      <ProductForm action={boundAction} initial={product} submitLabel="保存修改" />
    </div>
  );
}
