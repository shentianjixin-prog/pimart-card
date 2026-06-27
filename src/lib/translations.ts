export type Lang = "zh" | "ja" | "en";
export const DEFAULT_LANG: Lang = "ja";
export const LANGS: Lang[] = ["ja", "zh", "en"];
export const LANG_LABELS: Record<Lang, string> = {
  ja: "日本語",
  zh: "中文",
  en: "EN",
};

/** 从 cookie 解析语言，默认日语（主站面向日本客户） */
export function resolveLang(raw?: string | null): Lang {
  if (raw === "zh" || raw === "en") return raw;
  return DEFAULT_LANG;
}

const dict: Record<string, Record<Lang, string>> = {
  // 导航
  nav_home:       { zh: "首页",       ja: "ホーム",       en: "Home" },
  nav_shop:       { zh: "商品",       ja: "商品",         en: "Products" },
  nav_more:       { zh: "更多",       ja: "その他",       en: "More" },
  nav_menu:       { zh: "菜单",       ja: "メニュー",     en: "Menu" },
  nav_pokemon:    { zh: "宝可梦原盒", ja: "ポケモンBOX",  en: "Pokémon Boxes" },
  nav_naruto:     { zh: "火影忍者",   ja: "NARUTO",        en: "Naruto" },
  nav_cart:       { zh: "购物车",     ja: "カート",        en: "Cart" },
  nav_search:     { zh: "搜索商品名称", ja: "商品名を検索", en: "Search products" },
  nav_search_products: { zh: "搜索商品…", ja: "商品を検索…", en: "Search Products..." },

  menu_pokemon:     { zh: "宝可梦",     ja: "ポケモン",         en: "Pokémon" },
  menu_one_piece:   { zh: "海贼王",     ja: "ワンピース",       en: "One Piece" },
  menu_other_tcg:   { zh: "其他 TCG",   ja: "その他TCG",        en: "Other TCG" },
  menu_merchandise: { zh: "周边商品",   ja: "周辺グッズ",       en: "Merchandise" },
  menu_dragon_ball: { zh: "龙珠",       ja: "ドラゴンボール",   en: "Dragon Ball" },
  menu_yugioh:      { zh: "游戏王",     ja: "遊戯王",           en: "Yu-Gi-Oh!" },
  menu_gundam:      { zh: "高达",       ja: "ガンダム",         en: "Gundam" },
  menu_naruto:      { zh: "火影",       ja: "NARUTO",           en: "Naruto" },
  menu_union_arena: { zh: "Union Arena", ja: "Union Arena",     en: "Union Arena" },
  menu_weiss:       { zh: "Weiss Schwarz", ja: "Weiss Schwarz", en: "Weiss Schwarz" },
  menu_sleeves:     { zh: "卡套",       ja: "スリーブ",         en: "Card Sleeves" },
  menu_binders:     { zh: "卡册",       ja: "バインダー",       en: "Binders" },
  menu_storage:     { zh: "收纳盒",     ja: "収納ボックス",     en: "Storage Boxes" },
  menu_display:     { zh: "展示用品",   ja: "ディスプレイ用品", en: "Display Items" },
  menu_official:    { zh: "官方周边",   ja: "公式グッズ",     en: "Official Goods" },
  menu_limited_box: { zh: "限定礼盒",   ja: "限定ギフトBOX",  en: "Limited Gift Boxes" },
  menu_sealed:      { zh: "现货原盒",   ja: "未開封BOX",        en: "Sealed Boxes" },
  menu_psa:         { zh: "PSA 评级卡", ja: "PSA鑑定品",        en: "PSA Cards" },
  menu_new_arrivals:{ zh: "新品上架",   ja: "新着商品",         en: "New Arrivals" },
  menu_wholesale:   { zh: "批发询价",   ja: "卸売・お問い合わせ", en: "Wholesale" },
  menu_shipping:    { zh: "发货说明",   ja: "配送について",     en: "Shipping" },
  menu_guide:       { zh: "购物指南",   ja: "ご利用ガイド",     en: "Guide" },

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

  // 首页
  page_featured:       { zh: "推荐商品",    ja: "おすすめ商品",  en: "Featured" },
  page_hot:            { zh: "🔥 本周热销", ja: "🔥 今週の人気", en: "🔥 Hot This Week" },
  page_see_all_stock:  { zh: "查看全部现货 →", ja: "全在庫を見る →", en: "See All In Stock →" },
  page_all_products:   { zh: "全部商品",    ja: "全商品",        en: "All Products" },
  page_total_unit:     { zh: "件商品",      ja: "件の商品",      en: " products" },
  page_total_pre:      { zh: "共 ",         ja: "全 ",           en: "" },
  page_shipping_desc:  { zh: "简中原盒 / 预售现货 / 5-7 天发货", ja: "日・中 TCG 未開封BOX / PSA / 予約・現物 / 5〜7日発送", en: "JP & CN sealed boxes · PSA · Pre-order & in stock · Ships in 5-7 days" },
  page_back_home:      { zh: "← 返回首页", ja: "← ホームに戻る", en: "← Back to home" },
  page_no_products:    { zh: "没有找到符合条件的商品", ja: "条件に合う商品が見つかりません", en: "No products found" },
  page_hot_badge:      { zh: "热销",        ja: "人気",          en: "Hot" },
  page_search_pre:     { zh: "搜索结果：\"", ja: "検索結果：\"",  en: "Search: \"" },

  // 商品卡片
  card_added:          { zh: "已加入 ✓",    ja: "追加済 ✓",     en: "Added ✓" },
  card_add_cart:       { zh: "+ 加入购物车", ja: "カートに追加", en: "Add to Cart" },
  card_preorder:       { zh: "预售",         ja: "予約",          en: "Pre-order" },
  card_sold_out:       { zh: "售罄",         ja: "売切",          en: "Sold Out" },
  card_new:            { zh: "新品",         ja: "NEW",           en: "New" },
  card_hot:            { zh: "热销",         ja: "HOT",           en: "Hot" },
  card_psa:            { zh: "PSA",          ja: "PSA",           en: "PSA" },
  card_wholesale:      { zh: "批发",         ja: "卸売",          en: "Wholesale" },
  card_label_language: { zh: "语言",         ja: "言語",          en: "Language" },
  card_label_series:   { zh: "系列",         ja: "シリーズ",      en: "Series" },
  card_label_number:   { zh: "编号",         ja: "カードNo.",     en: "No." },
  card_label_rarity:   { zh: "稀有度",       ja: "レアリティ",    en: "Rarity" },
  card_label_stock:    { zh: "库存",         ja: "在庫",          en: "Stock" },
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

  // 购物车
  cart_title:           { zh: "购物车",          ja: "カート",              en: "Cart" },
  cart_loading:         { zh: "加载中…",          ja: "読み込み中…",         en: "Loading…" },
  cart_empty:           { zh: "购物车是空的",     ja: "カートは空です",      en: "Your cart is empty" },
  cart_go_shop:         { zh: "去逛逛",           ja: "商品を見る",          en: "Browse Products" },
  cart_remove:          { zh: "删除",             ja: "削除",                en: "Remove" },
  cart_total:           { zh: "合计",             ja: "合計",                en: "Total" },
  cart_shipping_note:   { zh: "运费将在结账时显示", ja: "送料はチェックアウト時に表示されます", en: "Shipping calculated at checkout" },
  cart_checkout:        { zh: "前往结算",         ja: "レジへ進む",          en: "Checkout" },
  cart_checkout_loading:{ zh: "跳转中…",          ja: "処理中…",             en: "Redirecting…" },
  cart_checkout_error:  { zh: "结算失败，请重试", ja: "決済に失敗しました", en: "Checkout failed, please try again" },
  cart_network_error:   { zh: "网络错误，请检查连接", ja: "ネットワークエラー", en: "Network error, please check your connection" },

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
  footer_admin:    { zh: "管理后台",   ja: "管理画面",              en: "Admin" },
  footer_payment:  { zh: "支持 Visa / Mastercard / JCB 在线支付（测试模式）", ja: "Visa / Mastercard / JCB 対応（テストモード）", en: "Visa / Mastercard / JCB accepted (test mode)" },

  // 公告
  ann_title:  { zh: "最新公告", ja: "お知らせ", en: "Announcements" },
  ann_close:  { zh: "关闭 ×",  ja: "閉じる ×", en: "Close ×" },
  ann_0:      { zh: "【新品预告】简中151 BOX 即将开启预售，敬请期待！", ja: "【新商品予告】中国語版151 BOX まもなく予約受付開始！", en: "[New Release] CN 151 BOX pre-order coming soon — stay tuned!" },
  ann_1:      { zh: "【发货通知】6/20 前下单的订单已于 6/25 全部发出", ja: "【発送通知】6/20までのご注文は6/25に全て発送済みです", en: "[Shipping Update] Orders placed before 6/20 have all shipped on 6/25" },
  ann_2:      { zh: "【正品保证】本店所有商品均为正规渠道进货，假一赔十", ja: "【正規品保証】当店の商品はすべて正規ルートより仕入れています", en: "[Authentic Guarantee] All items sourced from official channels" },

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

  // 顶部公告栏
  banner_worldwide: { zh: "日本发货 · 全球配送", ja: "日本から世界へ発送", en: "Ships Worldwide from Japan" },
  banner_wholesale: { zh: "支持批发询价", ja: "卸売対応", en: "Wholesale Available" },
  banner_psa:       { zh: "每周 PSA 新品上架", ja: "毎週PSA新着入荷", en: "New PSA Arrivals Every Week" },

  // 分类展示
  showcase_title:    { zh: "探索分类", ja: "カテゴリー", en: "Shop by Category" },
  showcase_subtitle: { zh: "从人气 IP 到评级卡与批发", ja: "人気IPから鑑定品・卸売まで", en: "From fan-favorite IPs to graded cards and wholesale" },
  showcase_explore:  { zh: "浏览 →", ja: "見る →", en: "Explore →" },

  // Hero（首页主视觉）
  hero_tag:         { zh: "高端 TCG 交易平台", ja: "プレミアムTCGマーケット", en: "Premium TCG Marketplace" },
  hero_subtitle:    { zh: "全球卡牌交易平台", ja: "グローバルトレーディングカードマーケット", en: "Global Trading Card Marketplace" },
  hero_desc:        { zh: "全球直供 · 正品保证", ja: "世界直送・正規品保証", en: "Global Direct Supply · Authentic Guarantee" },
  hero_trust_global:{ zh: "全球直供", ja: "世界直送", en: "Global Direct Supply" },
  hero_trust_auth:  { zh: "正品保证", ja: "正規品保証", en: "Authentic Guarantee" },
  hero_cta_new:     { zh: "浏览新品", ja: "新着商品を見る", en: "Shop New Arrivals" },
  hero_cta_wholesale:{ zh: "批发询价", ja: "卸売のお問い合わせ", en: "Wholesale Inquiry" },
  hero_cta_psa:     { zh: "查看 PSA 精选", ja: "PSA商品を見る", en: "View PSA Picks" },

  // 首页分类胶囊
  cat_pokemon:      { zh: "宝可梦", ja: "ポケモン", en: "Pokémon" },
  cat_one_piece:    { zh: "海贼王", ja: "ワンピース", en: "One Piece" },
  cat_dragon_ball:  { zh: "龙珠", ja: "ドラゴンボール", en: "Dragon Ball" },
  cat_psa:          { zh: "PSA", ja: "PSA", en: "PSA" },
  cat_sealed:       { zh: "现货原盒", ja: "未開封BOX", en: "Sealed Boxes" },
  cat_wholesale:    { zh: "批发", ja: "卸売", en: "Wholesale" },

  // 首页商品区块
  section_new_arrivals: { zh: "新品上架", ja: "新着商品", en: "New Arrivals" },
  section_new_sub:      { zh: "最新原盒与评级卡", ja: "最新の未開封BOXと鑑定品", en: "Latest sealed boxes and graded picks" },
  section_best_sellers: { zh: "热销商品", ja: "人気商品", en: "Best Sellers" },
  section_best_sub:     { zh: "需求旺盛的人气商品", ja: "人気の高い定番アイテム", en: "Popular items with strong demand" },
  section_psa_picks:    { zh: "PSA 精选", ja: "PSAピックアップ", en: "PSA Picks" },
  section_psa_sub:      { zh: "评级卡与高端库存", ja: "鑑定品とプレミアム在庫", en: "Graded cards and premium inventory" },
  section_shop_all:     { zh: "查看全部", ja: "すべて見る", en: "Shop all" },
  section_view_all:     { zh: "查看全部", ja: "すべて見る", en: "View all" },
  section_view_psa:     { zh: "查看 PSA", ja: "PSAを見る", en: "View PSA" },

  // Why PIMART
  why_title:    { zh: "为什么选择 PIMART CARD", ja: "PIMART CARDが選ばれる理由", en: "Why PIMART CARD" },
  why_subtitle: { zh: "原盒、评级卡与批发客户的可靠供货", ja: "未開封BOX・鑑定品・卸売向けの信頼できる仕入れ", en: "Trusted supply for sealed boxes, graded cards, and wholesale buyers" },
  why_auth_title: { zh: "正品保证", ja: "正規品保証", en: "Authentic Guarantee" },
  why_auth_desc:  { zh: "所有商品均来自可溯源的正规渠道", ja: "すべて正規ルートから仕入れ、トレーサビリティを確保", en: "All products sourced through verified channels with traceable supply." },
  why_japan_title:{ zh: "日本发货", ja: "日本から発送", en: "Ships from Japan" },
  why_japan_desc: { zh: "日本国内精心打包，可靠出库", ja: "日本国内で丁寧に梱包し、確実に発送", en: "Carefully packed and dispatched from Japan with reliable handling." },
  why_world_title:{ zh: "全球配送", ja: "世界各国へ配送", en: "Worldwide Shipping" },
  why_world_desc: { zh: "支持海外收藏家与经销商配送", ja: "海外のコレクター・業者向けに国際配送対応", en: "International delivery support for collectors and resellers worldwide." },
  why_pay_title:  { zh: "安全支付", ja: "安全な決済", en: "Secure Payment" },
  why_pay_desc:   { zh: "Stripe 加密结账，安心付款", ja: "Stripeによる暗号化チェックアウト", en: "Stripe-powered checkout with encrypted payment processing." },

  // 批发横幅
  wholesale_tag:   { zh: "B2B / 批发", ja: "B2B / 卸売", en: "B2B / Wholesale" },
  wholesale_title: { zh: "批发与批量供货", ja: "卸売・大口仕入れ", en: "Wholesale & Bulk Supply" },
  wholesale_desc:  { zh: "需要原盒、PSA 库存或定期供货？欢迎联系询价与专属支持。", ja: "未開封BOX・PSA在庫・定期仕入れをご希望の方は、価格・在庫・専任サポートをご相談ください。", en: "Looking for sealed boxes, PSA inventory, or recurring supply? Contact us for pricing, availability, and dedicated support for resellers and shops." },
  wholesale_cta:   { zh: "批发询价", ja: "卸売のお問い合わせ", en: "Wholesale Inquiry" },

  // 页脚扩展
  footer_tagline:  { zh: "全球卡牌交易平台——原盒、PSA 评级卡与批发供货", ja: "未開封BOX・PSA鑑定品・卸売対応のグローバルTCGマーケット", en: "Global Trading Card Marketplace for sealed boxes, PSA cards, and wholesale supply." },
  footer_shop:     { zh: "选购", ja: "ショップ", en: "Shop" },
  footer_support:  { zh: "支持", ja: "サポート", en: "Support" },
  footer_legal:    { zh: "法律信息", ja: "法的情報", en: "Legal" },
  footer_link_psa: { zh: "PSA 精选", ja: "PSA商品", en: "PSA Picks" },
  footer_about:    { zh: "关于我们", ja: "会社概要", en: "About Us" },
  footer_company:  { zh: "公司", ja: "Company", en: "Company" },
  footer_shipping_policy: { zh: "配送政策", ja: "配送ポリシー", en: "Shipping Policy" },
  footer_condition: { zh: "品相指南", ja: "コンディションガイド", en: "Condition Guide" },
  footer_faq:      { zh: "常见问题", ja: "FAQ", en: "FAQ" },
  footer_tokusho:  { zh: "特定商取引法", ja: "特定商取引法", en: "Legal Notice" },

  about_p1: { zh: "PIMART CARD 是面向全球收藏者与经销商的 TCG 交易平台，提供日版与中国语版未开封原盒、PSA 评级卡及批发供货。", ja: "PIMART CARDは、コレクターと業者向けのグローバルTCGマーケットです。日版・中国語版の未開封BOX、PSA鑑定品、卸売に対応しています。", en: "PIMART CARD is a global TCG marketplace for collectors and resellers, offering Japanese and Chinese sealed boxes, PSA graded cards, and wholesale supply." },
  about_p2: { zh: "我们从日本发货，坚持正品渠道、安全支付与可靠包装。", ja: "日本から発送。正規ルート仕入れ、安全な決済、丁寧な梱包を徹底しています。", en: "We ship from Japan with authentic sourcing, secure checkout, and careful packaging." },

  faq_q1: { zh: "是否支持国际配送？", ja: "海外配送は可能ですか？", en: "Do you ship internationally?" },
  faq_a1: { zh: "支持。我们从日本发货，具体时效与费用以结账页为准。", ja: "はい。日本から世界各国へ発送しています。詳細はチェックアウト時にご確認ください。", en: "Yes. We ship worldwide from Japan. Rates and delivery times are shown at checkout." },
  faq_q2: { zh: "商品是否为正品？", ja: "正規品ですか？", en: "Are products authentic?" },
  faq_a2: { zh: "所有商品均来自可溯源的正规渠道。", ja: "すべて正規ルートから仕入れた商品です。", en: "All items are sourced through verified authentic channels." },
  faq_q3: { zh: "如何咨询批发？", ja: "卸売の問い合わせは？", en: "How do I inquire about wholesale?" },
  faq_a3: { zh: "请通过 Contact 页面或 Footer 中的 Wholesale 链接联系我们。", ja: "ContactページまたはフッターのWholesaleリンクよりお問い合わせください。", en: "Contact us via the Contact page or the Wholesale link in the footer." },
  faq_contact_pre: { zh: "还有其他问题？", ja: "他にご質問は？", en: "More questions?" },

  // 邮件订阅
  newsletter_title:       { zh: "订阅更新", ja: "最新情報を受け取る", en: "Stay updated" },
  newsletter_sub:           { zh: "新品、PSA 上架与批发资讯", ja: "新着・PSA入荷・卸売情報", en: "New arrivals, PSA drops, and wholesale updates." },
  newsletter_placeholder: { zh: "your@email.com", ja: "your@email.com", en: "your@email.com" },
  newsletter_btn:         { zh: "订阅", ja: "登録する", en: "Subscribe" },
  newsletter_done:          { zh: "订阅成功，感谢加入 PIMART CARD。", ja: "登録ありがとうございます。", en: "Subscribed — thank you for joining PIMART CARD." },

  filter_count_unit: { zh: "件", ja: "件", en: "" },
};

export function t(key: string, lang: Lang): string {
  return dict[key]?.[lang] ?? dict[key]?.[DEFAULT_LANG] ?? dict[key]?.["zh"] ?? key;
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
