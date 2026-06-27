export type Lang = "zh" | "ja" | "en";
export const LANGS: Lang[] = ["zh", "ja", "en"];
export const LANG_LABELS: Record<Lang, string> = { zh: "中", ja: "日", en: "EN" };

const dict: Record<string, Record<Lang, string>> = {
  // 导航
  nav_home:       { zh: "首页",       ja: "ホーム",       en: "Home" },
  nav_pokemon:    { zh: "宝可梦原盒", ja: "ポケモンBOX",  en: "Pokémon Boxes" },
  nav_naruto:     { zh: "火影忍者",   ja: "NARUTO",        en: "Naruto" },
  nav_cart:       { zh: "购物车",     ja: "カート",        en: "Cart" },
  nav_search:     { zh: "搜索商品名称", ja: "商品名を検索", en: "Search products" },

  // 筛选栏
  filter_sort:         { zh: "排序",           ja: "並び替え",     en: "Sort" },
  filter_sort_newest:  { zh: "最新上架",       ja: "新着順",       en: "Newest" },
  filter_sort_asc:     { zh: "价格从低到高",   ja: "安い順",       en: "Price: Low to High" },
  filter_sort_desc:    { zh: "价格从高到低",   ja: "高い順",       en: "Price: High to Low" },
  filter_price:        { zh: "价格区间（日元）", ja: "価格帯（円）", en: "Price Range (¥)" },
  filter_price_min:    { zh: "最低",           ja: "最低",         en: "Min" },
  filter_price_max:    { zh: "最高",           ja: "最高",         en: "Max" },
  filter_stock:        { zh: "库存状态",       ja: "在庫状況",     en: "Stock" },
  filter_in_stock:     { zh: "仅显示有货",     ja: "在庫あり",     en: "In stock only" },
  filter_preorder_status: { zh: "现货/预售",  ja: "現物/予約",    en: "Stock Status" },
  filter_all:          { zh: "全部",           ja: "すべて",       en: "All" },
  filter_instock:      { zh: "现货",           ja: "現物",         en: "In Stock" },
  filter_preorder:     { zh: "预售",           ja: "予約",         en: "Pre-order" },
  filter_box_type:     { zh: "包装类型",       ja: "ボックスタイプ", en: "Box Type" },
  filter_fat_box:      { zh: "肥盒（补充包）", ja: "ブースターBOX",    en: "Booster Box" },
  filter_slim_box:     { zh: "瘦盒（强化包）", ja: "強化拡張パック",   en: "Enhanced Pack" },
  filter_gem_pack:     { zh: "宝石包",         ja: "ジェムパック",     en: "Gem Pack" },
  filter_gift_box:     { zh: "礼盒 / 套装",    ja: "ギフトBOX / セット", en: "Gift Box / Set" },
  filter_category:     { zh: "商品分类",       ja: "カテゴリー",   en: "Category" },
  filter_apply:        { zh: "应用筛选",       ja: "絞り込む",     en: "Apply" },
  filter_era:          { zh: "时代 / 系列",    ja: "時代 / シリーズ", en: "Era / Series" },
  era_all:             { zh: "全部时代",       ja: "すべての時代", en: "All Eras" },
  era_sv:              { zh: "朱紫时代 (SV)",  ja: "スカーレット＆バイオレット", en: "Scarlet & Violet" },
  era_ss:              { zh: "剑盾时代 (CS)",  ja: "ソード＆シールド", en: "Sword & Shield" },
  era_sm:              { zh: "太阳月亮时代",   ja: "サン＆ムーン", en: "Sun & Moon" },
  era_gem:             { zh: "宝石包",         ja: "ジェムパック", en: "Gem Pack" },
  era_gift:            { zh: "礼盒 / 限定",    ja: "ギフト / 限定", en: "Gift / Limited" },

  // 首页
  page_featured:       { zh: "推荐商品",    ja: "おすすめ商品",  en: "Featured" },
  page_hot:            { zh: "🔥 本周热销", ja: "🔥 今週の人気", en: "🔥 Hot This Week" },
  page_see_all_stock:  { zh: "查看全部现货 →", ja: "全在庫を見る →", en: "See All In Stock →" },
  page_all_products:   { zh: "全部商品",    ja: "全商品",        en: "All Products" },
  page_total_unit:     { zh: "件商品",      ja: "件の商品",      en: " products" },
  page_total_pre:      { zh: "共 ",         ja: "全 ",           en: "" },
  page_show_sold_out:  { zh: "含售罄商品",  ja: "売切含む",      en: "Include sold out" },
  page_shipping_desc:  { zh: "简中原盒 / 预售现货 / 5-7 天发货", ja: "中国語版 / 予約・現物 / 5-7日発送", en: "CN edition · Pre-order & In Stock · Ships in 5-7 days" },
  page_no_products:    { zh: "没有找到符合条件的商品", ja: "条件に合う商品が見つかりません", en: "No products found" },
  page_hot_badge:      { zh: "热销",        ja: "人気",          en: "Hot" },
  page_search_pre:     { zh: "搜索结果：\"", ja: "検索結果：\"",  en: "Search: \"" },

  // 商品卡片
  card_added:          { zh: "已加入 ✓",    ja: "追加済 ✓",     en: "Added ✓" },
  card_add_cart:       { zh: "+ 加入购物车", ja: "カートに追加", en: "Add to Cart" },
  card_preorder:       { zh: "预售",         ja: "予約",          en: "Pre-order" },
  card_sold_out:       { zh: "售罄",         ja: "売切",          en: "Sold Out" },
  card_new:            { zh: "新品",         ja: "NEW",           en: "New" },
  card_remaining_pre:  { zh: "仅剩 ",        ja: "残り ",         en: "Only " },
  card_remaining_suf:  { zh: " 件",          ja: " 点",           en: " left" },

  // 商品类型标签 (DB 存中文，显示用这里翻译)
  boxtype_fat:         { zh: "肥盒",   ja: "ブースターBOX",    en: "Booster Box" },
  boxtype_slim:        { zh: "瘦盒",   ja: "強化拡張パック",   en: "Enhanced Pack" },
  boxtype_gem:         { zh: "宝石包", ja: "ジェムパック",     en: "Gem Pack" },
  boxtype_gift:        { zh: "礼盒",   ja: "ギフトBOX",       en: "Gift Box" },

  // 商品详情页
  detail_all_products: { zh: "全部商品",   ja: "全商品",        en: "All Products" },
  detail_series:       { zh: "系列：",     ja: "シリーズ：",    en: "Series: " },
  detail_preorder:     { zh: "预售",       ja: "予約",          en: "Pre-order" },
  detail_remaining_pre:{ zh: "仅剩 ",      ja: "残り ",         en: "Only " },
  detail_remaining_suf:{ zh: " 件",        ja: " 点",           en: " left" },
  detail_shipping_h:   { zh: "📦 发货说明",  ja: "📦 配送について", en: "📦 Shipping" },
  detail_shipping_1_pre:{ zh: "预计发货时间：下单后 ", ja: "お支払い後 ",    en: "Ships within " },
  detail_shipping_1_suf:{ zh: " 个工作日",              ja: " 営業日以内に発送", en: " business days" },
  detail_shipping_2:   { zh: "我们将在发货后通过邮件通知您", ja: "発送後にメールでお知らせします", en: "You'll be notified by email after shipping" },
  detail_shipping_3:   { zh: "如有疑问请联系客服", ja: "ご不明点はお問い合わせください", en: "Contact us if you have any questions" },
  detail_timeline_0:   { zh: "下单支付",  ja: "注文・決済", en: "Order & Pay" },
  detail_timeline_0s:  { zh: "当天",      ja: "当日",       en: "Day 0" },
  detail_timeline_1:   { zh: "备货打包",  ja: "梱包準備",   en: "Prepare" },
  detail_timeline_1s:  { zh: "1-3 天",   ja: "1-3日",      en: "1-3 days" },
  detail_timeline_2:   { zh: "发货出库",  ja: "発送",       en: "Ship Out" },
  detail_timeline_2s:  { zh: "3-5 天",   ja: "3-5日",      en: "3-5 days" },
  detail_timeline_3:   { zh: "收货",      ja: "受取",       en: "Receive" },
  detail_timeline_3s:  { zh: "5-7 天",   ja: "5-7日",      en: "5-7 days" },
  detail_preorder_date:{ zh: "预计发货日：", ja: "発送予定日：", en: "Expected ship date: " },

  // 支付成功/取消
  checkout_success_title: { zh: "支付成功，感谢您的购买！", ja: "お支払いが完了しました！", en: "Payment successful, thank you!" },
  checkout_success_order: { zh: "订单编号：",     ja: "注文番号：",          en: "Order ID: " },
  checkout_success_desc:  { zh: "我们会尽快为您安排发货，如有疑问请通过页脚的联系方式与我们沟通。", ja: "できるだけ早く発送いたします。ご不明な点はフッターのお問い合わせよりご連絡ください。", en: "We'll ship your order as soon as possible. Contact us via the footer if you have any questions." },
  checkout_success_cta:   { zh: "继续逛逛",       ja: "引き続きショッピング", en: "Continue Shopping" },
  checkout_cancel_title:  { zh: "支付已取消",     ja: "お支払いがキャンセルされました", en: "Payment Cancelled" },
  checkout_cancel_desc:   { zh: "本次支付未完成，购物车中的商品仍保留，您可以重新结算。", ja: "お支払いは完了していません。カートの商品はそのまま残っています。", en: "Payment was not completed. Your cart items are still saved." },
  checkout_cancel_cta:    { zh: "返回购物车",     ja: "カートに戻る",        en: "Back to Cart" },

  // 页脚
  footer_contact:  { zh: "联系方式",   ja: "お問い合わせ",          en: "Contact" },
  footer_shipping: { zh: "发货说明",   ja: "配送について",          en: "Shipping" },
  footer_guide:    { zh: "购物指南",   ja: "ショッピングガイド",    en: "Shopping Guide" },
  footer_privacy:  { zh: "隐私政策",   ja: "プライバシーポリシー",  en: "Privacy Policy" },
  footer_terms:    { zh: "服务条款",   ja: "利用規約",              en: "Terms of Service" },
  footer_tokusho:  { zh: "特定商取引法",ja: "特定商取引法に基づく表記", en: "Legal Disclosure" },
  footer_admin:    { zh: "管理后台",   ja: "管理画面",              en: "Admin" },
  footer_payment:  { zh: "支持 Visa / Mastercard / JCB 在线支付（测试模式）", ja: "Visa / Mastercard / JCB 対応（テストモード）", en: "Visa / Mastercard / JCB accepted (test mode)" },
  footer_payment_live: { zh: "支持 Visa / Mastercard / JCB 在线支付", ja: "Visa / Mastercard / JCB 対応", en: "Visa / Mastercard / JCB accepted" },

  // 公告
  ann_title:  { zh: "最新公告", ja: "お知らせ", en: "Announcements" },
  ann_close:  { zh: "关闭 ×",  ja: "閉じる ×", en: "Close ×" },
  ann_0:      { zh: "【新品预告】简中151 BOX 即将开启预售，敬请期待！", ja: "【新商品予告】中国語版151 BOX まもなく予約受付開始！", en: "[New Release] CN 151 BOX pre-order coming soon — stay tuned!" },
  ann_1:      { zh: "【发货通知】6/20 前下单的订单已于 6/25 全部发出", ja: "【発送通知】6/20までのご注文は6/25に全て発送済みです", en: "[Shipping Update] Orders placed before 6/20 have all shipped on 6/25" },
  ann_2:      { zh: "【正品保证】本店所有商品均为正规渠道进货，假一赔十", ja: "【正規品保証】当店の商品はすべて正規ルートより仕入れています", en: "[Authentic Guarantee] All items sourced from official channels" },

  // 品牌
  brand_tagline: { zh: "日本·中国正版TCG卡牌 / PSA评级 / 批发", ja: "日本・中国正規TCGカード / PSA鑑定 / 卸売", en: "Japanese & Chinese TCG Sealed Boxes / PSA / Wholesale" },
  brand_hero_tag: { zh: "正版授权 · 日本直发", ja: "正規品 · 日本直送", en: "Authentic · Ships from Japan" },
  brand_cta_pokemon: { zh: "浏览宝可梦", ja: "ポケモンを見る", en: "Shop Pokémon" },
  brand_cta_wholesale: { zh: "批发询价", ja: "卸売お問い合わせ", en: "Wholesale Inquiry" },
  brand_cta_new: { zh: "新品上架", ja: "新着商品", en: "New Arrivals" },

  // 导航扩展
  nav_one_piece:   { zh: "海贼王",    ja: "ワンピース",      en: "One Piece" },
  nav_other_tcg:   { zh: "其他TCG",   ja: "その他TCG",       en: "Other TCG" },
  nav_shipping_link:{ zh: "发货说明", ja: "配送について",    en: "Shipping" },
  nav_contact_link:{ zh: "联系方式",  ja: "お問い合わせ",    en: "Contact" },
  nav_sealed:      { zh: "原盒",      ja: "シールドBOX",     en: "Sealed Box" },
  nav_loose:       { zh: "散包",      ja: "バラパック",      en: "Loose Packs" },
  nav_singles:     { zh: "单卡",      ja: "シングル",        en: "Singles" },
  nav_all:         { zh: "全部",      ja: "すべて",          en: "All" },
  nav_gundam:      { zh: "高达",      ja: "ガンダム",        en: "Gundam" },
  nav_dragonball:  { zh: "龙珠",      ja: "ドラゴンボール",  en: "Dragon Ball" },

  // 首页区块
  section_new_arrivals: { zh: "新品上架", ja: "新着商品",   en: "New Arrivals" },
  section_best_sellers: { zh: "热销商品", ja: "人気商品",   en: "Best Sellers" },
  section_preorder:     { zh: "预售商品", ja: "予約商品",   en: "Pre-order" },
  section_psa:          { zh: "PSA评级卡",ja: "PSA鑑定カード", en: "PSA Graded Cards" },
  section_view_all:     { zh: "查看全部", ja: "すべて見る", en: "View All" },

  // 信任区块
  trust_auth_title:  { zh: "正品保证",  ja: "正規品保証",     en: "Authentic Guarantee" },
  trust_auth_desc:   { zh: "全渠道正规进货，官方授权", ja: "正規ルート仕入れ", en: "Official channels only" },
  trust_pack_title:  { zh: "安全包装",  ja: "安全梱包",       en: "Safe Packaging" },
  trust_pack_desc:   { zh: "气泡膜+硬壳双重保护", ja: "プチプチ+ハードケース", en: "Bubble wrap + hard case" },
  trust_ship_title:  { zh: "快速发货",  ja: "迅速発送",       en: "Fast Shipping" },
  trust_ship_desc:   { zh: "5-7个工作日", ja: "5〜7営業日",  en: "5-7 business days" },
  trust_world_title: { zh: "全球配送",  ja: "国際配送",       en: "Worldwide Shipping" },
  trust_world_desc:  { zh: "支持全球配送", ja: "世界中に対応", en: "Delivered worldwide" },
  trust_pay_title:   { zh: "安全支付",  ja: "安全決済",       en: "Secure Payment" },
  trust_pay_desc:    { zh: "Visa / MC / JCB", ja: "Visa / MC / JCB", en: "Visa / MC / JCB" },
  trust_japan_title: { zh: "日本直发",  ja: "日本直送",       en: "Ships from Japan" },
  trust_japan_desc:  { zh: "日本仓库直接发货", ja: "日本倉庫から直接発送", en: "Direct from Japan warehouse" },

  // 批发区块
  wholesale_title:   { zh: "批发 / B2B 询价", ja: "卸売 / B2B お問い合わせ", en: "Wholesale / B2B Inquiry" },
  wholesale_desc:    { zh: "我们提供日本及中国TCG原盒批发，欢迎实体店、电商及经销商合作。", ja: "日本・中国TCGシールドBOXの卸売を提供。実店舗・EC・ディーラー様歓迎。", en: "We offer wholesale TCG sealed boxes from Japan & China. Open to retail stores, e-commerce, and distributors." },
  wholesale_f1:      { zh: "起批量折扣", ja: "ロット割引", en: "Bulk discounts" },
  wholesale_f2:      { zh: "长期合作价", ja: "長期取引価格", en: "Partnership pricing" },
  wholesale_f3:      { zh: "专属客服", ja: "専任担当者", en: "Dedicated support" },
  wholesale_cta:     { zh: "立即联系", ja: "お問い合わせ", en: "Contact Us" },

  // Hero 幻灯片
  hero_0_tag:   { zh: "宝可梦原盒", ja: "ポケモンBOX", en: "Pokémon Boxes" },
  hero_0_title: { zh: "简中宝可梦原盒", ja: "中国語版ポケモンBOX", en: "Simplified Chinese Pokémon Boxes" },
  hero_0_desc:  { zh: "151、朱紫系列正版简中原盒，现货直发，5-7 天到货", ja: "151・スカーレット＆バイオレット 正規中国語版、現物在庫あり、5〜7日でお届け", en: "151, Scarlet & Violet CN edition booster boxes — in stock, ships in 5-7 days" },
  hero_0_cta:   { zh: "浏览宝可梦原盒", ja: "ポケモンBOXを見る", en: "Browse Pokémon Boxes" },
  hero_0_cta2:  { zh: "查看预售",       ja: "予約商品を見る",    en: "View Pre-orders" },
  hero_1_tag:   { zh: "火影忍者",    ja: "NARUTO", en: "Naruto" },
  hero_1_title: { zh: "火影忍者周边", ja: "NARUTO周辺グッズ", en: "Naruto Merchandise" },
  hero_1_desc:  { zh: "NARUTOP99、疾风传系列卡牌威化 BOX，日本正版进货", ja: "NARUTOP99・疾風伝シリーズ ウエハースBOX、日本正規品", en: "NARUTOP99 & Shippuden wafer card BOX — authentic Japanese stock" },
  hero_1_cta:   { zh: "浏览火影忍者", ja: "NARUTOを見る",    en: "Browse Naruto" },
  hero_1_cta2:  { zh: "查看全部",     ja: "全商品を見る",    en: "View All" },
  hero_2_tag:   { zh: "预售说明",       ja: "予約について",    en: "Pre-orders" },
  hero_2_title: { zh: "预售现货 · 放心购", ja: "予約・現物 安心購入", en: "Pre-order & In Stock" },
  hero_2_desc:  { zh: "预售商品到货后优先安排发货，全程正规包装，假一赔十", ja: "予約商品は入荷次第優先発送、正規梱包、品質保証", en: "Pre-order items shipped first upon arrival, secure packaging, authentic guarantee" },
  hero_2_cta:   { zh: "查看预售商品", ja: "予約商品を見る",  en: "View Pre-orders" },
  hero_2_cta2:  { zh: "查看现货",     ja: "現物を見る",      en: "View In Stock" },

  // 购物车
  cart_title:            { zh: "购物车",               ja: "カート",                 en: "Cart" },
  cart_loading:          { zh: "加载中...",            ja: "読み込み中...",          en: "Loading..." },
  cart_empty:            { zh: "购物车是空的",         ja: "カートは空です",         en: "Your cart is empty" },
  cart_go_shop:          { zh: "去逛逛",               ja: "買い物を続ける",         en: "Continue shopping" },
  cart_remove:           { zh: "移除",                 ja: "削除",                   en: "Remove" },
  cart_total:            { zh: "合计",                 ja: "合計",                   en: "Total" },
  cart_shipping_note:    { zh: "现货商品下单后 5-7 个工作日发货，预售商品以详情页标注为准。", ja: "現物は5〜7営業日、予約商品は商品ページの案内に従います。", en: "In-stock items ship in 5-7 business days. Pre-orders follow the product page." },
  cart_checkout:         { zh: "去结算",               ja: "レジに進む",             en: "Checkout" },
  cart_checkout_loading: { zh: "正在跳转结算...",      ja: "決済ページへ...",        en: "Redirecting..." },
  cart_checkout_error:   { zh: "结算失败，请稍后重试", ja: "決済に失敗しました",     en: "Checkout failed, please try again" },
  cart_network_error:    { zh: "网络错误，请稍后重试", ja: "ネットワークエラー",     en: "Network error, please try again" },

  // 加购按钮
  btn_quantity:   { zh: "数量",           ja: "数量",           en: "Qty" },
  btn_stock:      { zh: "库存",           ja: "在庫",           en: "Stock" },
  btn_add_cart:   { zh: "加入购物车",     ja: "カートに追加",   en: "Add to Cart" },
  btn_buy_now:    { zh: "立即购买",       ja: "今すぐ購入",     en: "Buy Now" },
  btn_added_cart: { zh: "已加入购物车 ✓", ja: "追加済 ✓",       en: "Added ✓" },

  filter_count_unit: { zh: "件", ja: "件", en: "" },
};

export function t(key: string, lang: Lang): string {
  return dict[key]?.[lang] ?? dict[key]?.["zh"] ?? key;
}

const BOX_TYPE_KEY: Record<string, string> = {
  肥盒: "boxtype_fat",
  瘦盒: "boxtype_slim",
  宝石包: "boxtype_gem",
  礼盒: "boxtype_gift",
};

export function translateBoxType(boxType: string, lang: Lang): string {
  const key = BOX_TYPE_KEY[boxType];
  return key ? t(key, lang) : boxType;
}

export const HTML_LANG: Record<Lang, string> = { zh: "zh-CN", ja: "ja", en: "en" };
