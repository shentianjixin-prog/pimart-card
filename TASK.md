# 新网站开发任务

## 背景

本项目从 card-shop 复制而来，请在此基础上改造成专门售卖**简中宝可梦原盒**和**火影忍者周边**的网站。

---

## 一、品牌与命名

- 网站名：**CNBOX STORE**（可自行微调）
- 口号：简中原盒 / 预售现货 / 5-7 天发货

---

## 二、数据库 Schema 改造（prisma/schema.prisma）

在 `Product` 模型上做以下改动：

```
删除字段：
  - code          （卡牌编号，不再需要）
  - condition     （品相，不再需要）
  - language      （语言，不再需要）

新增字段：
  - series        String?          // 系列名，如 "朱・紫ex" / "疾風伝"
  - isPreorder    Boolean @default(false)  // 是否为预售商品
  - shippingDays  Int     @default(6)      // 预计发货天数（默认6天，范围5-7）
  - releaseDate   DateTime?                // 预售发货日（可选）
```

分类（category）改为：
- `宝可梦原盒`
- `火影忍者`

删除以下模型（不需要拍卖功能）：
- `Auction`
- `Bid`
- `Buyer`

---

## 三、删除拍卖相关代码

删除以下文件/目录：
- `src/app/auctions/`
- `src/app/api/auctions/`
- `src/app/account/`（买家登录，不再需要）
- `src/components/auctions/`
- `src/components/AccountNav.tsx`
- `src/lib/auctions.ts`
- `src/lib/auction-events.ts`
- `src/lib/buyer-session.ts`

从 `src/app/layout.tsx` 中移除 `<AccountNav />`

---

## 四、Header 改造（src/components/Header.tsx）

- Logo 文字改为 **CNBOX STORE**
- 导航分类改为：`宝可梦原盒` / `火影忍者`
- 删除"拍卖"导航链接
- 搜索框 placeholder 改为 `搜索商品名称`

---

## 五、ProductCard 改造（src/components/ProductCard.tsx）

- 删除 `code / condition / language` 显示
- 改为显示 `series`（系列）
- 如果 `isPreorder === true`，在图片右上角显示橙色角标：**预售**
- 如果缺货（stock <= 0），保留原 SOLD OUT 蒙层

---

## 六、商品详情页改造（src/app/products/[slug]/page.tsx）

- 删除 `编号 / 品相 / 语言` 显示
- 改为显示 `系列`
- 在价格下方，**始终显示发货提示框**：

```
📦 发货说明
• 预计发货时间：下单后 5-7 个工作日
• 我们将在发货后通过邮件通知您
• 如有疑问请联系客服
```

- 如果 `isPreorder === true`，在标题旁边显示橙色 `预售` 徽章
- 如果有 `releaseDate`，显示：`预计发货日：XXXX年X月X日`

---

## 七、主页改造（src/app/page.tsx）

- 筛选条件删除 `condition` 和 `language`
- 保留 `category`（分类）和价格区间
- 添加 `isPreorder` 筛选：全部 / 现货 / 预售

---

## 八、FilterSidebar 改造（src/components/FilterSidebar.tsx）

- 删除品相（condition）和语言（language）筛选
- 添加"现货/预售"筛选选项

---

## 九、管理后台 ProductForm 改造（src/components/admin/ProductForm.tsx）

- 删除 `code / condition / language` 字段
- 新增字段：
  - `series`：文本输入（系列名）
  - `isPreorder`：开关/复选框（是否为预售）
  - `shippingDays`：数字输入（发货天数，默认 6，范围 5-7）
  - `releaseDate`：日期选择（预售发货日，可选）

---

## 十、删除管理后台拍卖功能

删除 `src/app/admin/(protected)/auctions/` 目录

---

## 十一、Footer 改造（src/components/Footer.tsx）

- 版权改为：`© YYYY CNBOX STORE`
- 删除"利用ガイド"链接
- 添加：联系方式 / 发货说明链接

---

## 十二、种子数据（prisma/seed.ts）

清空旧卡牌数据，改为以下示例商品：

**宝可梦原盒（5款）**
1. 朱・紫ex 強化拡張パック BOX（简中）/ 现货 / ¥3,200
2. 151 コレクターズセット（简中）/ 现货 / ¥12,800
3. ポケモンカード151 BOX（简中）/ 预售 / ¥8,500 / 发货日 2026-08-01
4. 朱・紫 黒炎の支配者 BOX（简中）/ 现货 / ¥4,200
5. スノーハザード+クレイバースト ダブルパック（简中）/ 预售 / ¥6,800

**火影忍者周边（3款）**
1. NARUTOP99 ウエハース第1弾 BOX / 现货 / ¥2,800
2. 火影忍者 疾風伝 カードウエハース BOX / 现货 / ¥3,500
3. 火影忍者 コレクタブルカード スターターセット / 预售 / ¥1,500

图片字段先填写占位符 `/placeholder.png`

---

## 十三、执行顺序

1. 修改 `prisma/schema.prisma`
2. 删除旧文件
3. 修改各组件和页面
4. 修改 `prisma/seed.ts`
5. 运行：
   ```bash
   npx prisma migrate reset --force
   npm run db:seed
   npm run dev
   ```
6. 在浏览器验证 http://localhost:3001（注意端口避开已启动的 card-shop）

---

## 收款系统（已有，无需重建）

Stripe 已集成，保留 `src/app/api/checkout/` 和 `src/app/api/webhooks/stripe/`，只需在 `.env` 填入新的 Stripe 密钥即可。
