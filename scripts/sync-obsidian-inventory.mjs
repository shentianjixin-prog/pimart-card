import Database from "better-sqlite3";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const projectRoot = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const vaultRoot = "C:\\Users\\33092\\Documents\\Obsidian Vault";
const outDir = join(vaultRoot, "库存库");
const productDir = join(outDir, "商品");
const db = new Database(join(projectRoot, "dev.db"), { readonly: true });

const products = db
  .prepare(
    `select id, name, slug, category, series, description,
            priceJpy, stock, images, featured, isPreorder, shippingDays,
            releaseDate, createdAt, updatedAt
       from Product
      order by category, name`
  )
  .all();

mkdirSync(productDir, { recursive: true });

const now = new Date().toISOString();
const totalSkus = products.length;
const totalUnits = products.reduce((sum, product) => sum + product.stock, 0);
const inventoryValue = products.reduce(
  (sum, product) => sum + product.priceJpy * product.stock,
  0
);
const zeroStock = products.filter((product) => product.stock <= 0);
const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 3);
const categories = [...new Set(products.map((product) => product.category))].sort();

function yamlString(value) {
  return JSON.stringify(value ?? "");
}

function money(value) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

function fileSafe(value) {
  return String(value)
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

for (const product of products) {
  const filename = `${fileSafe(product.slug)} ${fileSafe(product.name)}.md`;
  const stockStatus =
    product.stock <= 0 ? "缺货" : product.stock <= 3 ? "低库存" : "有库存";
  const saleType = product.isPreorder ? "预售" : "现货";
  const imageList = String(product.images || "")
    .split(",")
    .map((image) => image.trim())
    .filter(Boolean);

  const body = `---
type: inventory-item
id: ${yamlString(product.id)}
name: ${yamlString(product.name)}
slug: ${yamlString(product.slug)}
category: ${yamlString(product.category)}
series: ${yamlString(product.series)}
sale_type: ${yamlString(saleType)}
price_jpy: ${product.priceJpy}
stock: ${product.stock}
stock_status: ${yamlString(stockStatus)}
inventory_value_jpy: ${product.priceJpy * product.stock}
featured: ${Boolean(product.featured)}
is_preorder: ${Boolean(product.isPreorder)}
shipping_days: ${product.shippingDays}
release_date: ${yamlString(product.releaseDate)}
source_database: ${yamlString("C:\\Users\\33092\\Documents\\card-shop\\dev.db")}
source_updated_at: ${yamlString(product.updatedAt)}
synced_at: ${yamlString(now)}
tags:
  - 库存
  - 商品
  - ${product.stock <= 0 ? "缺货" : product.stock <= 3 ? "低库存" : "有库存"}
  - ${saleType}
---

# ${product.name}

| 字段 | 内容 |
| --- | --- |
| 分类 | ${product.category} |
| 系列 | ${product.series || "-"} |
| 类型 | ${saleType} |
| 单价 | ${money(product.priceJpy)} |
| 库存 | ${product.stock} |
| 库存金额 | ${money(product.priceJpy * product.stock)} |
| 发货天数 | ${product.shippingDays} 个工作日 |
| 状态 | ${stockStatus} |

## 描述

${product.description || "暂无描述。"}

## 图片

${imageList.length ? imageList.map((image) => `- ${image}`).join("\n") : "- 暂无图片"}

## 来源

- 数据库 ID：\`${product.id}\`
- 商品 slug：\`${product.slug}\`
- 来源项目：\`C:\\Users\\33092\\Documents\\card-shop\`
`;

  writeFileSync(join(productDir, filename), body, "utf8");
}

const csvRows = [
  [
    "slug",
    "name",
    "category",
    "series",
    "sale_type",
    "price_jpy",
    "stock",
    "inventory_value_jpy",
    "stock_status",
    "shipping_days",
  ],
  ...products.map((product) => [
    product.slug,
    product.name,
    product.category,
    product.series || "",
    product.isPreorder ? "预售" : "现货",
    product.priceJpy,
    product.stock,
    product.priceJpy * product.stock,
    product.stock <= 0 ? "缺货" : product.stock <= 3 ? "低库存" : "有库存",
    product.shippingDays,
  ]),
]
  .map((row) => row.map(csvCell).join(","))
  .join("\n");

writeFileSync(join(outDir, "库存索引.csv"), `${csvRows}\n`, "utf8");

const indexBody = `---
type: inventory-dashboard
source_project: ${yamlString("C:\\Users\\33092\\Documents\\card-shop")}
source_database: ${yamlString("C:\\Users\\33092\\Documents\\card-shop\\dev.db")}
synced_at: ${yamlString(now)}
tags:
  - 库存
  - 仪表盘
---

# 库存库

## 当前总览

| 指标 | 数值 |
| --- | ---: |
| SKU 数 | ${totalSkus} |
| 总库存件数 | ${totalUnits} |
| 库存总金额 | ${money(inventoryValue)} |
| 缺货商品 | ${zeroStock.length} |
| 低库存商品 | ${lowStock.length} |

## 分类

${categories.map((category) => `- [[${category}]]`).join("\n")}

## 库存表

\`\`\`dataview
TABLE category AS "分类", series AS "系列", sale_type AS "类型", price_jpy AS "日元单价", stock AS "库存", inventory_value_jpy AS "库存金额", stock_status AS "状态"
FROM "库存库/商品"
WHERE type = "inventory-item"
SORT category ASC, stock ASC, price_jpy DESC
\`\`\`

## 需要补货

\`\`\`dataview
TABLE category AS "分类", price_jpy AS "日元单价", stock AS "库存", stock_status AS "状态"
FROM "库存库/商品"
WHERE type = "inventory-item" AND stock <= 3
SORT stock ASC, price_jpy DESC
\`\`\`

## 高价值库存

\`\`\`dataview
TABLE category AS "分类", price_jpy AS "日元单价", stock AS "库存", inventory_value_jpy AS "库存金额"
FROM "库存库/商品"
WHERE type = "inventory-item"
SORT inventory_value_jpy DESC
LIMIT 10
\`\`\`

## 文件

- [[库存索引.csv]]
- 商品明细：[[商品目录]]

最后同步：${now}
`;

writeFileSync(join(outDir, "库存库.md"), indexBody, "utf8");

const productIndexBody = `---
type: inventory-product-index
synced_at: ${yamlString(now)}
tags:
  - 库存
  - 商品
---

# 商品目录

\`\`\`dataview
LIST
FROM "库存库/商品"
WHERE type = "inventory-item"
SORT category ASC, name ASC
\`\`\`
`;

writeFileSync(join(outDir, "商品目录.md"), productIndexBody, "utf8");

for (const category of categories) {
  const body = `---
type: inventory-category
category: ${yamlString(category)}
synced_at: ${yamlString(now)}
tags:
  - 库存
  - 分类
---

# ${category}

\`\`\`dataview
TABLE series AS "系列", sale_type AS "类型", price_jpy AS "日元单价", stock AS "库存", stock_status AS "状态"
FROM "库存库/商品"
WHERE type = "inventory-item" AND category = "${category.replace(/"/g, '\\"')}"
SORT stock ASC, price_jpy DESC
\`\`\`
`;
  writeFileSync(join(outDir, `${fileSafe(category)}.md`), body, "utf8");
}

console.log(
  JSON.stringify(
    {
      outDir,
      products: totalSkus,
      totalUnits,
      inventoryValue,
      zeroStock: zeroStock.length,
      lowStock: lowStock.length,
    },
    null,
    2
  )
);
