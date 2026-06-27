import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "../../../actions";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">新增商品</h1>
      <ProductForm action={createProductAction} submitLabel="创建商品" />
    </div>
  );
}
