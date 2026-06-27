"use client";

import { useT } from "@/lib/lang-context";

type Facet = { value: string; count: number };

type Props = {
  categories: Facet[];
  current: {
    category?: string;
    boxType?: string;
    inStock?: string;
    isPreorder?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    q?: string;
  };
};

export function FilterSidebar({ categories, current }: Props) {
  const T = useT();

  const BOX_TYPES = [
    { value: "",      labelKey: "filter_all" },
    { value: "肥盒",  labelKey: "filter_fat_box" },
    { value: "瘦盒",  labelKey: "filter_slim_box" },
    { value: "宝石包", labelKey: "filter_gem_pack" },
    { value: "礼盒",  labelKey: "filter_gift_box" },
  ];

  return (
    <form
      method="GET"
      action="/"
      className="surface-solid w-full shrink-0 space-y-6 p-5 text-sm text-[#374151] sm:w-60 lg:border-r-0 lg:bg-transparent lg:p-0 lg:shadow-none"
    >
      {current.q && <input type="hidden" name="q" value={current.q} />}

      <div>
        <h3 className="mb-2 font-semibold text-[#111827]">{T("filter_sort")}</h3>
        <select
          name="sort"
          defaultValue={current.sort || "newest"}
          className="input-field"
        >
          <option value="newest">{T("filter_sort_newest")}</option>
          <option value="price_asc">{T("filter_sort_asc")}</option>
          <option value="price_desc">{T("filter_sort_desc")}</option>
        </select>
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-[#111827]">{T("filter_price")}</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder={T("filter_price_min")}
            defaultValue={current.minPrice}
            className="input-field w-1/2"
          />
          <span className="text-[#9ca3af]">~</span>
          <input
            type="number"
            name="maxPrice"
            placeholder={T("filter_price_max")}
            defaultValue={current.maxPrice}
            className="input-field w-1/2"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-[#111827]">{T("filter_stock")}</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="inStock"
            value="1"
            defaultChecked={current.inStock === "1"}
            className="accent-[#111827]"
          />
          {T("filter_in_stock")}
        </label>
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-[#111827]">{T("filter_preorder_status")}</h3>
        <div className="space-y-1">
          {[
            { value: "",  labelKey: "filter_all" },
            { value: "0", labelKey: "filter_instock" },
            { value: "1", labelKey: "filter_preorder" },
          ].map(({ value, labelKey }) => (
            <label key={value} className="flex items-center gap-2">
              <input
                type="radio"
                name="isPreorder"
                value={value}
                defaultChecked={current.isPreorder === value || (!current.isPreorder && value === "")}
                className="accent-[#111827]"
              />
              {T(labelKey)}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-[#111827]">{T("filter_box_type")}</h3>
        <div className="space-y-1">
          {BOX_TYPES.map(({ value, labelKey }) => (
            <label key={value} className="flex items-center gap-2">
              <input
                type="radio"
                name="boxType"
                value={value}
                defaultChecked={current.boxType === value || (!current.boxType && value === "")}
                className="accent-[#111827]"
              />
              {T(labelKey)}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-[#111827]">{T("filter_category")}</h3>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              value=""
              defaultChecked={!current.category}
              className="accent-[#111827]"
            />
            {T("filter_all")}
          </label>
          {categories.map((c) => (
            <label key={c.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                value={c.value}
                defaultChecked={current.category === c.value}
                className="accent-[#111827]"
              />
              {c.value}（{c.count}{T("filter_count_unit")}）
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary w-full">
        {T("filter_apply")}
      </button>
    </form>
  );
}
