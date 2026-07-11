export type OpcRarityRow = {
  /** 翻译 key，如 opc_rarity_leader */
  labelKey: string;
  count: number;
};

export type OpcTopCardGroup = {
  /** 本地图片路径，/products/topcards/... */
  images: string[];
  title: string;
  remark?: string;
};

export type OpcSetSpec = {
  /** 系列中文名（不含 OPC 编号，与店内 series 一致） */
  titleZh: string;
  titleJa?: string;
  titleEn?: string;
  /** ISO 日期 YYYY-MM-DD（日版官网发售日） */
  releaseDate?: string;
  /** 卡种总数文案，如 126种+1种 */
  totalTypes?: string;
  cardsPerPack: number;
  packsPerBox: number;
  boxesPerCase: number;
  rarities?: OpcRarityRow[];
  /** 异图/平行卡备注，如 27种 */
  parallelTypes?: string;
  /** 官网商品页 */
  sourceUrl?: string;
  /** 本商品可开出的顶卡展示（数据来源：onepiece-cardgame.cn 商品详情页） */
  topCards?: OpcTopCardGroup[];
};

const PACK = { cardsPerPack: 6, packsPerBox: 24, boxesPerCase: 12 } as const;

function R(
  rows: Array<[string, number]>
): OpcRarityRow[] {
  return rows.map(([labelKey, count]) => ({ labelKey, count }));
}

/**
 * 海贼王补充包官方规格（OPC-XX ↔ 日版 OP-XX）。
 * 数据来源：https://www.onepiece-cardgame.com/products/boosters/
 */
export const OPC_SET_SPECS: Record<string, OpcSetSpec> = {
  "OPC-01": {
    titleZh: "冒险的黎明",
    titleJa: "ROMANCE DAWN",
    titleEn: "Romance Dawn",
    releaseDate: "2022-07-22",
    totalTypes: "121种",
    ...PACK,
    parallelTypes: "27种",
    sourceUrl: "https://www.onepiece-cardgame.com/products/boosters/op01.php",
    rarities: R([
      ["opc_rarity_leader", 8],
      ["opc_rarity_c", 45],
      ["opc_rarity_uc", 30],
      ["opc_rarity_r", 26],
      ["opc_rarity_sr", 10],
      ["opc_rarity_sec", 2],
    ]),
    topCards: [
      {
        images: ["/products/topcards/opc-01-card-1.png"],
        title: "香克斯（漫画异画 SEC）",
        remark: "官网渲染图 · 本弹旗舰 chase",
      },
      {
        images: ["/products/topcards/opc-01-card-2.png"],
        title: "香克斯（异画 SEC）",
        remark: "官网渲染图 · SEC 平行",
      },
      {
        images: ["/products/topcards/opc-01-card-3.png"],
        title: "大和（异画 SEC）",
        remark: "官网渲染图 · SEC 平行",
      },
      {
        images: ["/products/topcards/opc-01-card-4.png"],
        title: "波雅·汉库克（SP）",
        remark: "官网渲染图 · 特别异画",
      },
      {
        images: ["/products/topcards/opc-01-card-5.png"],
        title: "蒙奇·D·路飞（异画）",
        remark: "官网渲染图 · 人气异画",
      },
    ],
  },
  "OPC-02": {
    titleZh: "顶尖决战",
    titleJa: "頂上決戦",
    titleEn: "Paramount War",
    releaseDate: "2022-11-04",
    totalTypes: "121种",
    ...PACK,
    parallelTypes: "27种",
    sourceUrl: "https://www.onepiece-cardgame.com/products/boosters/op02.php",
    rarities: R([
      ["opc_rarity_leader", 8],
      ["opc_rarity_c", 45],
      ["opc_rarity_uc", 30],
      ["opc_rarity_r", 26],
      ["opc_rarity_sr", 10],
      ["opc_rarity_sec", 2],
    ]),
    topCards: [
      {
        images: ["/products/topcards/opc-02-card-1.png"],
        title: "波特卡斯·D·艾斯（漫画异画）",
        remark: "官网渲染图 · 本弹旗舰 chase",
      },
      {
        images: ["/products/topcards/opc-02-card-2.png"],
        title: "波特卡斯·D·艾斯（异画）",
        remark: "官网渲染图 · SR 平行",
      },
      {
        images: ["/products/topcards/opc-02-card-3.png"],
        title: "乌塔（异画 SEC）",
        remark: "官网渲染图 · SEC 平行",
      },
      {
        images: ["/products/topcards/opc-02-card-4.png"],
        title: "娜美（异画）",
        remark: "官网渲染图 · 人气异画",
      },
      {
        images: ["/products/topcards/opc-02-card-5.png"],
        title: "萨卡斯基（异画）",
        remark: "官网渲染图 · 人气异画",
      },
    ],
  },
  "OPC-03": {
    titleZh: "强大的敌人",
    titleJa: "強大な敵",
    titleEn: "Pillars of Strength",
    releaseDate: "2023-02-11",
    totalTypes: "127种",
    ...PACK,
    parallelTypes: "27种",
    sourceUrl: "https://www.onepiece-cardgame.com/products/boosters/op03.php",
    rarities: R([
      ["opc_rarity_leader", 8],
      ["opc_rarity_c", 45],
      ["opc_rarity_uc", 32],
      ["opc_rarity_r", 26],
      ["opc_rarity_sr", 10],
      ["opc_rarity_sec", 2],
      ["opc_rarity_sp", 4],
    ]),
    topCards: [
      {
        images: ["/products/topcards/opc-03-card-1.png"],
        title: "狙击王（漫画异画 SEC）",
        remark: "官网渲染图 · 本弹旗舰 chase",
      },
      {
        images: ["/products/topcards/opc-03-card-2.png"],
        title: "娜美（领袖异画）",
        remark: "官网渲染图 · 领袖平行",
      },
      {
        images: ["/products/topcards/opc-03-card-3.png"],
        title: "马尔科（异画）",
        remark: "官网渲染图 · 人气异画",
      },
      {
        images: ["/products/topcards/opc-03-card-4.png"],
        title: "夏洛特·布琳（SP）",
        remark: "官网渲染图 · 特别异画",
      },
      {
        images: ["/products/topcards/opc-03-card-5.png"],
        title: "波特卡斯·D·艾斯（领袖异画）",
        remark: "官网渲染图 · 领袖平行",
      },
    ],
  },
  "OPC-04": {
    titleZh: "诡计的王国",
    titleJa: "謀略の王国",
    titleEn: "Kingdoms of Intrigue",
    releaseDate: "2023-05-27",
    totalTypes: "124种+1种",
    ...PACK,
    parallelTypes: "25种",
    sourceUrl: "https://www.onepiece-cardgame.com/products/boosters/op04.php",
    rarities: R([
      ["opc_rarity_leader", 6],
      ["opc_rarity_c", 45],
      ["opc_rarity_uc", 30],
      ["opc_rarity_r", 26],
      ["opc_rarity_sr", 10],
      ["opc_rarity_sec", 2],
      ["opc_rarity_sp", 5],
      ["opc_rarity_don", 1],
    ]),
    topCards: [
      {
        images: ["/products/topcards/opc-04-card-1.png"],
        title: "萨博（漫画异画）",
        remark: "官网渲染图 · 本弹旗舰 chase",
      },
      {
        images: ["/products/topcards/opc-04-card-2.png"],
        title: "萨博（异画）",
        remark: "官网渲染图 · SR 平行",
      },
      {
        images: ["/products/topcards/opc-04-card-3.png"],
        title: "奈菲鲁塔利·薇薇（领袖异画）",
        remark: "官网渲染图 · 领袖平行",
      },
      {
        images: ["/products/topcards/opc-04-card-4.png"],
        title: "唐吉诃德·多弗朗明哥（异画）",
        remark: "官网渲染图 · 人气异画",
      },
      {
        images: ["/products/topcards/opc-04-card-5.png"],
        title: "山治（异画）",
        remark: "官网渲染图 · 人气异画",
      },
    ],
  },
  "OPC-05": {
    titleZh: "新时代的主角",
    titleJa: "新時代の主役",
    titleEn: "Awakening of the New Era",
    releaseDate: "2023-08-26",
    totalTypes: "127种",
    ...PACK,
    parallelTypes: "27种+1种",
    sourceUrl: "https://www.onepiece-cardgame.com/products/boosters/op05.php",
    rarities: R([
      ["opc_rarity_leader", 6],
      ["opc_rarity_c", 45],
      ["opc_rarity_uc", 30],
      ["opc_rarity_r", 26],
      ["opc_rarity_sr", 10],
      ["opc_rarity_sec", 2],
      ["opc_rarity_sp", 6],
      ["opc_rarity_don", 1],
      ["opc_rarity_anni1", 1],
    ]),
    topCards: [
      {
        images: ["/products/topcards/opc-05-card-1.png"],
        title: "蒙奇·D·路飞（漫画异画 SEC）",
        remark: "官网渲染图 · 本弹旗舰 chase",
      },
      {
        images: ["/products/topcards/opc-05-card-2.png"],
        title: "尤斯塔斯·基德（漫画异画）",
        remark: "官网渲染图 · 漫画异画",
      },
      {
        images: ["/products/topcards/opc-05-card-3.png"],
        title: "特拉法尔加·罗（漫画异画）",
        remark: "官网渲染图 · 漫画异画",
      },
      {
        images: ["/products/topcards/opc-05-card-4.png"],
        title: "蒙奇·D·路飞（异画 SEC）",
        remark: "官网渲染图 · SEC 平行",
      },
      {
        images: ["/products/topcards/opc-05-card-5.png"],
        title: "索隆十郎（SP）",
        remark: "官网渲染图 · 特别异画",
      },
    ],
  },
  "OPC-06": {
    titleZh: "双壁的霸者",
    titleJa: "双璧の覇者",
    titleEn: "Wings of the Captain",
    releaseDate: "2023-11-25",
    totalTypes: "126种",
    ...PACK,
    parallelTypes: "25种",
    sourceUrl: "https://www.onepiece-cardgame.com/products/boosters/op06.php",
    rarities: R([
      ["opc_rarity_leader", 6],
      ["opc_rarity_c", 45],
      ["opc_rarity_uc", 30],
      ["opc_rarity_r", 26],
      ["opc_rarity_sr", 10],
      ["opc_rarity_sec", 2],
      ["opc_rarity_sp", 6],
      ["opc_rarity_don", 1],
    ]),
    topCards: [
      {
        images: ["/products/topcards/opc-06-card-1.png"],
        title: "罗罗诺亚·索隆（漫画异画 SEC）",
        remark: "官网渲染图 · 本弹旗舰 chase",
      },
      {
        images: ["/products/topcards/opc-06-card-2.png"],
        title: "罗罗诺亚·索隆（异画 SEC）",
        remark: "官网渲染图 · SEC 平行",
      },
      {
        images: ["/products/topcards/opc-06-card-3.png"],
        title: "文斯莫克·贾奇（异画）",
        remark: "官网渲染图 · 人气异画",
      },
      {
        images: ["/products/topcards/opc-06-card-4.png"],
        title: "香克斯（异画）",
        remark: "官网渲染图 · 人气异画",
      },
      {
        images: ["/products/topcards/opc-06-card-5.png"],
        title: "乌塔（异画）",
        remark: "官网渲染图 · 人气异画",
      },
    ],
  },
  "OPC-07": {
    titleZh: "500年后的未来",
    titleJa: "500年後の未来",
    titleEn: "500 Years in the Future",
    releaseDate: "2024-02-24",
    totalTypes: "125种+1种",
    ...PACK,
    sourceUrl: "https://www.onepiece-cardgame.com/products/boosters/op07.php",
    rarities: R([
      ["opc_rarity_leader", 6],
      ["opc_rarity_c", 45],
      ["opc_rarity_uc", 30],
      ["opc_rarity_r", 26],
      ["opc_rarity_sr", 10],
      ["opc_rarity_sec", 2],
      ["opc_rarity_sp", 6],
      ["opc_rarity_don", 1],
    ]),
    topCards: [
      {
        images: ["/products/topcards/opc-07-card-1.png"],
        title: "波雅·汉库克（漫画异画）",
        remark: "官网渲染图 · 本弹旗舰 chase",
      },
      {
        images: ["/products/topcards/opc-07-card-2.png"],
        title: "波雅·汉库克（异画）",
        remark: "官网渲染图 · SR 平行",
      },
      {
        images: ["/products/topcards/opc-07-card-3.png"],
        title: "巴兹尔·霍金斯（异画）",
        remark: "官网渲染图 · 人气异画",
      },
      {
        images: ["/products/topcards/opc-07-card-4.png"],
        title: "波特卡斯·D·艾斯（领袖异画）",
        remark: "官网渲染图 · 领袖平行",
      },
      {
        images: ["/products/topcards/opc-07-card-5.png"],
        title: "蒙奇·D·龙（异画）",
        remark: "官网渲染图 · 人气异画",
      },
    ],
  },
  "OPC-08": {
    titleZh: "双子传说",
    titleJa: "二つの伝説",
    titleEn: "Two Legends",
    releaseDate: "2024-05-25",
    totalTypes: "125种+1种",
    ...PACK,
    sourceUrl: "https://www.onepiece-cardgame.com/products/boosters/op08.php",
    rarities: R([
      ["opc_rarity_leader", 6],
      ["opc_rarity_c", 45],
      ["opc_rarity_uc", 30],
      ["opc_rarity_r", 26],
      ["opc_rarity_sr", 10],
      ["opc_rarity_sec", 2],
      ["opc_rarity_sp", 6],
      ["opc_rarity_don", 1],
    ]),
    topCards: [
      {
        images: ["/products/topcards/opc-08-card-1.png"],
        title: "西尔尔克·雷利（漫画异画 SEC）",
        remark: "官网渲染图 · 本弹旗舰 chase",
      },
      {
        images: ["/products/topcards/opc-08-card-2.png"],
        title: "西尔尔克·雷利（异画 SEC）",
        remark: "官网渲染图 · SEC 平行",
      },
      {
        images: ["/products/topcards/opc-08-card-3.png"],
        title: "夏洛特·布琳（异画）",
        remark: "官网渲染图 · 人气异画",
      },
      {
        images: ["/products/topcards/opc-08-card-4.png"],
        title: "黑玛利亚（异画）",
        remark: "官网渲染图 · 人气异画",
      },
      {
        images: ["/products/topcards/opc-08-card-5.png"],
        title: "娜美（异画）",
        remark: "官网渲染图 · 人气异画",
      },
    ],
  },
  "OPC-09": {
    titleZh: "新帝降临",
    titleJa: "新たなる皇帝",
    titleEn: "Emperors in the New World",
    releaseDate: "2024-08-31",
    totalTypes: "129种+1种",
    ...PACK,
    sourceUrl: "https://www.onepiece-cardgame.com/products/boosters/op09.php",
    rarities: R([
      ["opc_rarity_leader", 6],
      ["opc_rarity_c", 45],
      ["opc_rarity_uc", 30],
      ["opc_rarity_r", 26],
      ["opc_rarity_sr", 10],
      ["opc_rarity_sec", 2],
      ["opc_rarity_sp", 10],
      ["opc_rarity_don", 1],
    ]),
    topCards: [
      {
        images: ["/products/topcards/opc-09-card-1.png"],
        title: "戈尔·D·罗杰（黄金漫画异画 SEC）",
        remark: "官网渲染图 · 本弹旗舰 chase",
      },
      {
        images: ["/products/topcards/opc-09-card-2.png"],
        title: "蒙奇·D·路飞（漫画异画 SEC）",
        remark: "官网渲染图 · 漫画异画",
      },
      {
        images: ["/products/topcards/opc-09-card-3.png"],
        title: "香克斯（漫画异画）",
        remark: "官网渲染图 · 漫画异画",
      },
      {
        images: ["/products/topcards/opc-09-card-4.png"],
        title: "马歇尔·D·蒂奇（漫画异画）",
        remark: "官网渲染图 · 漫画异画",
      },
      {
        images: ["/products/topcards/opc-09-card-5.png"],
        title: "巴基（漫画异画）",
        remark: "官网渲染图 · 漫画异画",
      },
    ],
  },
  "OPC-10": {
    titleZh: "王之血脉",
    titleJa: "王族の血統",
    titleEn: "Royal Blood",
    releaseDate: "2024-11-30",
    totalTypes: "125种+1种",
    ...PACK,
    sourceUrl: "https://www.onepiece-cardgame.com/products/boosters/op10.php",
    rarities: R([
      ["opc_rarity_leader", 6],
      ["opc_rarity_c", 45],
      ["opc_rarity_uc", 30],
      ["opc_rarity_r", 26],
      ["opc_rarity_sr", 10],
      ["opc_rarity_sec", 2],
      ["opc_rarity_sp", 6],
      ["opc_rarity_don", 1],
    ]),
    topCards: [
      {
        images: ["/products/topcards/opc-10-card-1.png"],
        title: "特拉法尔加·罗（漫画异画 SEC）",
        remark: "官网渲染图 · 本弹旗舰 chase",
      },
      {
        images: ["/products/topcards/opc-10-card-2.png"],
        title: "特拉法尔加·罗（异画 SEC）",
        remark: "官网渲染图 · SEC 平行",
      },
      {
        images: ["/products/topcards/opc-10-card-3.png"],
        title: "神避（异画 SEC）",
        remark: "官网渲染图 · SEC 平行",
      },
      {
        images: ["/products/topcards/opc-10-card-4.png"],
        title: "库赞（领袖异画）",
        remark: "官网渲染图 · 领袖平行",
      },
      {
        images: ["/products/topcards/opc-10-card-5.png"],
        title: "乌索普（异画）",
        remark: "官网渲染图 · 人气异画",
      },
    ],
  },
  "OPC-11": {
    titleZh: "神速之拳",
    titleJa: "神速の拳",
    titleEn: "A Fist of Divine Speed",
    releaseDate: "2025-03-01",
    totalTypes: "127种+1种",
    ...PACK,
    sourceUrl: "https://www.onepiece-cardgame.com/products/boosters/op11.php",
    rarities: R([
      ["opc_rarity_leader", 6],
      ["opc_rarity_c", 45],
      ["opc_rarity_uc", 30],
      ["opc_rarity_r", 26],
      ["opc_rarity_sr", 10],
      ["opc_rarity_sec", 2],
      ["opc_rarity_sp", 6],
      ["opc_rarity_anni3", 2],
      ["opc_rarity_don", 1],
    ]),
    topCards: [
      {
        images: ["/products/topcards/opc-11-card-1.png"],
        title: "蒙奇·D·路飞（漫画异画 SEC）",
        remark: "官网渲染图 · 本弹旗舰 chase",
      },
      {
        images: ["/products/topcards/opc-11-card-2.png"],
        title: "蒙奇·D·路飞（异画 SEC）",
        remark: "官网渲染图 · SEC 平行",
      },
      {
        images: ["/products/topcards/opc-11-card-3.png"],
        title: "娜美（异画）",
        remark: "官网渲染图 · 人气异画",
      },
      {
        images: ["/products/topcards/opc-11-card-4.png"],
        title: "库赞（异画）",
        remark: "官网渲染图 · 人气异画",
      },
      {
        images: ["/products/topcards/opc-11-card-5.png"],
        title: "橡胶橡胶果实·火手枪（异画）",
        remark: "官网渲染图 · 事件异画",
      },
    ],
  },
  "OPC-14": {
    titleZh: "苍海七杰",
    titleJa: "蒼海の七傑",
    titleEn: "The Seven Warlords of the Sea",
    releaseDate: "2025-11-22",
    totalTypes: "128种+1种",
    ...PACK,
    sourceUrl: "https://www.onepiece-cardgame.com/products/boosters/op14.php",
    rarities: R([
      ["opc_rarity_leader", 7],
      ["opc_rarity_c", 45],
      ["opc_rarity_uc", 30],
      ["opc_rarity_r", 26],
      ["opc_rarity_sr", 10],
      ["opc_rarity_sec", 2],
      ["opc_rarity_sp", 6],
      ["opc_rarity_anni3", 2],
      ["opc_rarity_don", 1],
    ]),
    topCards: [
      {
        images: ["/products/topcards/opc-14-card-1.png"],
        title: "鹰眼米霍克（漫画异画 SEC）",
        remark: "官网渲染图 · 本弹旗舰 chase",
      },
      {
        images: ["/products/topcards/opc-14-card-2.png"],
        title: "鹰眼米霍克（异画 SEC）",
        remark: "官网渲染图 · SEC 平行",
      },
      {
        images: ["/products/topcards/opc-14-card-3.png"],
        title: "波雅·汉库克（异画）",
        remark: "官网渲染图 · 人气异画",
      },
      {
        images: ["/products/topcards/opc-14-card-4.png"],
        title: "波雅·汉库克（异画）",
        remark: "官网渲染图 · 人气异画",
      },
      {
        images: ["/products/topcards/opc-14-card-5.png"],
        title: "娜美（异画）",
        remark: "官网渲染图 · 人气异画",
      },
    ],
  },
  "OPC-15": {
    titleZh: "神之岛的冒险",
    titleJa: "神の島の冒険",
    titleEn: "Adventure on God's Island",
    releaseDate: "2026-02-28",
    totalTypes: "125种+1种",
    ...PACK,
    sourceUrl: "https://www.onepiece-cardgame.com/products/boosters/op15.php",
    rarities: R([
      ["opc_rarity_leader", 6],
      ["opc_rarity_c", 45],
      ["opc_rarity_uc", 30],
      ["opc_rarity_r", 26],
      ["opc_rarity_sr", 10],
      ["opc_rarity_sec", 2],
      ["opc_rarity_sp", 6],
      ["opc_rarity_don", 1],
    ]),
    topCards: [
      {
        images: ["/products/topcards/opc-15-card-1.png"],
        title: "艾尼路（漫画异画 SEC）",
        remark: "官网渲染图 · 本弹旗舰 chase",
      },
      {
        images: ["/products/topcards/opc-15-card-2.png"],
        title: "蒙奇·D·路飞（异画 SEC）",
        remark: "官网渲染图 · SEC 平行",
      },
      {
        images: ["/products/topcards/opc-15-card-3.png"],
        title: "艾尼路（异画 SEC）",
        remark: "官网渲染图 · SEC 平行",
      },
      {
        images: ["/products/topcards/opc-15-card-4.png"],
        title: "蒙奇·D·路飞（领袖异画）",
        remark: "官网渲染图 · 领袖平行",
      },
      {
        images: ["/products/topcards/opc-15-card-5.png"],
        title: "艾尼路（领袖异画）",
        remark: "官网渲染图 · 领袖平行",
      },
    ],
  },
  "OPC-16": {
    titleZh: "决战之时",
    titleJa: "決戦の刻",
    titleEn: "The Time of Battle",
    releaseDate: "2026-05-30",
    totalTypes: "126种+1种",
    ...PACK,
    sourceUrl: "https://www.onepiece-cardgame.com/products/boosters/op16.php",
    rarities: R([
      ["opc_rarity_leader", 6],
      ["opc_rarity_c", 45],
      ["opc_rarity_uc", 30],
      ["opc_rarity_r", 26],
      ["opc_rarity_sr", 10],
      ["opc_rarity_sec", 2],
      ["opc_rarity_sp", 6],
      ["opc_rarity_don", 1],
      ["opc_rarity_tr", 1],
    ]),
    topCards: [
      {
        images: [
          "/products/topcards/opc-16-1-1.png",
          "/products/topcards/opc-16-1-2.png",
          "/products/topcards/opc-16-1-3.png",
          "/products/topcards/opc-16-1-4.png",
        ],
        title: "在那场战役中活跃的角色们悉数参战!",
        remark: "大量卡牌搭配领袖卡牌都有出色效果!",
      },
      {
        images: ["/products/topcards/opc-16-2-1.png", "/products/topcards/opc-16-2-2.png"],
        title: "波特卡斯·D·艾斯、马歇尔·D·提奇以SEC卡牌登场!",
        remark: "带着强力的效果一起奔向战场...!",
      },
      {
        images: [
          "/products/topcards/opc-16-3-1.png",
          "/products/topcards/opc-16-3-2.png",
          "/products/topcards/opc-16-3-3.png",
        ],
        title: "这次的超级异画卡牌是“三大将”!",
        remark: "将这些特别设计的卡牌收入手中吧!",
      },
    ],
  },
};

function parseOpcCode(series: string | null | undefined): string | null {
  if (!series) return null;
  const m = series.match(/^(OPC-\d+)\b/i);
  return m ? m[1].toUpperCase() : null;
}

export function getOpcSetSpec(series: string | null | undefined): {
  code: string;
  spec: OpcSetSpec;
} | null {
  const code = parseOpcCode(series);
  if (!code) return null;
  const spec = OPC_SET_SPECS[code];
  if (!spec) return null;
  return { code, spec };
}
