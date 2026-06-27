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
    era?: string;
  };
};

const BOX_TYPES = [
  { value: "",      labelKey: "filter_all" },
  { value: "肥盒",  labelKey: "filter_fat_box" },
  { value: "瘦盒",  labelKey: "filter_slim_box" },
  { value: "宝石包", labelKey: "filter_gem_pack" },
  { value: "礼盒",  labelKey: "filter_gift_box" },
];

const ERAS = [
  { value: "",    labelKey: "era_all" },
  { value: "sv",  labelKey: "era_sv" },
  { value: "ss",  labelKey: "era_ss" },
  { value: "sm",  labelKey: "era_sm" },
  { value: "gem", labelKey: "era_gem" },
  { value: "gift",labelKey: "era_gift" },
];

const POKEMON_CATEGORIES = ["宝可梦原盒"];

export function FilterSidebar({ categories, current }: Props) {
  const T = useT();
  const isPokemon = POKEMON_CATEGORIES.includes(current.category ?? "");

  return (
    <form
      method="GET"
      action="/"
      className="w-full shrink-0 space-y-6 text-sm text-gray-300 sm:w-56 sm:border-r sm:border-white/10 sm:pr-5"
    >
      {current.q && <input type="hidden" name="q" value={current.q} />}
      {current.category && <input type="hidden" name="category" value={current.category} />}

      {/* 宝可梦时代筛选 */}
      {isPokemon && (
        <div>
          <h3 className="mb-2 font-semibold text-white">{T("filter_era")}</h3>
          <div className="space-y-1">
            {ERAS.map(({ value, labelKey }) => (
              <label key={value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="era"
                  value={value}
                  defaultChecked={current.era === value || (!current.era && value === "")}
                  className="accent-cyan-400"
                />
                <span className={current.era === value || (!current.era && value === "") ? "text-cyan-300" : ""}>
                  {T(labelKey)}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-2 font-semibold text-white">{T("filter_sort")}</h3>
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
        <h3 className="mb-2 font-semibold text-white">{T("filter_price")}</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder={T("filter_price_min")}
            defaultValue={current.minPrice}
            className="input-field w-1/2"
          />
          <span className="text-gray-500">~</span>
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
        <h3 className="mb-2 font-semibold text-white">{T("filter_stock")}</h3>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            name="inStock"
            value="1"
            defaultChecked={current.inStock === "1"}
            className="accent-cyan-400"
          />
          {T("filter_in_stock")}
        </label>
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-white">{T("filter_preorder_status")}</h3>
        <div className="space-y-1">
          {[
            { value: "",  labelKey: "filter_all" },
            { value: "0", labelKey: "filter_instock" },
            { value: "1", labelKey: "filter_preorder" },
          ].map(({ value, labelKey }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="isPreorder"
                value={value}
                defaultChecked={current.isPreorder === value || (!current.isPreorder && value === "")}
                className="accent-cyan-400"
              />
              {T(labelKey)}
            </label>
          ))}
        </div>
      </div>

      {/* 包装类型（非宝可梦时显示） */}
      {!isPokemon && (
        <div>
          <h3 className="mb-2 font-semibold text-white">{T("filter_box_type")}</h3>
          <div className="space-y-1">
            {BOX_TYPES.map(({ value, labelKey }) => (
              <label key={value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="boxType"
                  value={value}
                  defaultChecked={current.boxType === value || (!current.boxType && value === "")}
                  className="accent-cyan-400"
                />
                {T(labelKey)}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 分类（非筛选状态下显示） */}
      {!current.category && (
        <div>
          <h3 className="mb-2 font-semibold text-white">{T("filter_category")}</h3>
          <div className="space-y-1">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="category"
                value=""
                defaultChecked={!current.category}
                className="accent-cyan-400"
              />
              {T("filter_all")}
            </label>
            {categories.map((c) => (
              <label key={c.value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  value={c.value}
                  defaultChecked={current.category === c.value}
                  className="accent-cyan-400"
                />
                {c.value}（{c.count}{T("filter_count_unit")}）
              </label>
            ))}
          </div>
        </div>
      )}

      <button type="submit" className="btn-primary w-full">
        {T("filter_apply")}
      </button>
    </form>
  );
}
