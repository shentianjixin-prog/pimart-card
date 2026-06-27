"use client";

import { useActionState } from "react";
import type { ProductFormState } from "@/app/admin/actions";

type Props = {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  initial?: {
    name: string;
    category: string;
    series: string | null;
    description: string | null;
    priceJpy: number;
    stock: number;
    images: string;
    featured: boolean;
    isPreorder: boolean;
    shippingDays: number;
    releaseDate: Date | null;
  };
  submitLabel: string;
};

function formatDateInput(date: Date | null | undefined) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function ProductForm({ action, initial, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label className="mb-1 block text-sm text-gray-400">名称</label>
        <input
          name="name"
          defaultValue={initial?.name}
          required
          className="input-field"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm text-gray-400">分类</label>
          <input
            name="category"
            defaultValue={initial?.category}
            required
            placeholder="宝可梦原盒/火影忍者"
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-400">系列</label>
          <input
            name="series"
            defaultValue={initial?.series || ""}
            placeholder="朱・紫ex / 疾風伝"
            className="input-field"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm text-gray-400">价格（日元）</label>
          <input
            name="priceJpy"
            type="number"
            min={0}
            defaultValue={initial?.priceJpy}
            required
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-400">库存</label>
          <input
            name="stock"
            type="number"
            min={0}
            defaultValue={initial?.stock}
            required
            className="input-field"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm text-gray-400">发货天数（5-7）</label>
          <input
            name="shippingDays"
            type="number"
            min={5}
            max={7}
            defaultValue={initial?.shippingDays ?? 6}
            required
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-400">预售发货日（可选）</label>
          <input
            name="releaseDate"
            type="date"
            defaultValue={formatDateInput(initial?.releaseDate)}
            className="input-field"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">
          图片URL（多张用英文逗号分隔，留空可填 /products/placeholder.svg）
        </label>
        <input
          name="images"
          defaultValue={initial?.images || "/products/placeholder.svg"}
          required
          className="input-field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">描述</label>
        <textarea
          name="description"
          defaultValue={initial?.description || ""}
          rows={3}
          className="input-field"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-400">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={initial?.featured}
          className="accent-cyan-400"
        />
        设为首页推荐
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-400">
        <input
          type="checkbox"
          name="isPreorder"
          defaultChecked={initial?.isPreorder}
          className="accent-orange-400"
        />
        预售商品
      </label>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "保存中..." : submitLabel}
      </button>
    </form>
  );
}
