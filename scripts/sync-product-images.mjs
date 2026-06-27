/**
 * 强制同步商品图片路径到运行时数据库（幂等）。
 * 解决 Railway Volume 旧库图片为 placeholder 的问题。
 */
import Database from "better-sqlite3";
import { existsSync } from "fs";

const url = process.env.DATABASE_URL || "file:./dev.db";
const dbPath = url.startsWith("file:") ? url.slice(5) : url;

if (!existsSync(dbPath)) {
  console.log("[images] 数据库不存在，跳过");
  process.exit(0);
}

const IMAGE_MAP = {
  "151-コレクタ-ズセット-简中": "/products/151-box.png",
  "2026-春节礼盒-简中": "/products/chunjie2026-box.png",
  "2026-端午节礼盒-简中": "/products/duanwu2026-box.png",
  "ebc-02-anime-25th-collection-box": "/products/ebc-02-box.jpg",
  "ebc-03-heroines-edition-box": "/products/ebc-03-box.png",
  "narutop99-ウエハ-ス第1弾-box": "/products/naruto-wafer-vol1.jpg",
  "opc-01-romance-dawn-box": "/products/opc-01-box.jpg",
  "opc-02-paramount-war-box": "/products/opc-02-box.jpg",
  "opc-03-pillars-of-strength-box": "/products/opc-03-box.jpg",
  "opc-04-kingdoms-of-intrigue-box": "/products/opc-04-box.jpg",
  "opc-05-awakening-new-era-box": "/products/opc-05-box.jpg",
  "opc-06-wings-of-the-captain-box": "/products/opc-06-box.jpg",
  "opc-07-500-years-future-box": "/products/opc-07-box.webp",
  "opc-08-two-legends-box": "/products/opc-08-box.webp",
  "opc-09-emperors-new-world-box": "/products/opc-09-box.jpg",
  "opc-10-royal-blood-box": "/products/opc-10-box.jpg",
  "opc-11-divine-speed-box": "/products/opc-11-box.png",
  "opc-14-cyan-sea-seven-box": "/products/opc-14-box.png",
  "opc-15-adventure-gods-island-box": "/products/opc-15-box.png",
  "sm-强化包-第一弹-box-简中": "/products/sm15-box.png",
  "sm-强化包-第二弹-box-简中": "/products/sm25-box.webp",
  "stc-01-straw-hat-crew-deck": "/products/stc-01-deck.jpg",
  "stc-02-worst-generation-deck": "/products/stc-02-deck.jpg",
  "stc-03-warlords-deck": "/products/stc-03-deck.jpg",
  "stc-04-animal-kingdom-deck": "/products/stc-04-deck.jpg",
  "stc-06-absolute-justice-deck": "/products/stc-06-deck.jpg",
  "スノ-ハザ-ド-クレイバ-スト-ダブルパック-简中": "/products/sv2-double-box.png",
  "ポケモンカ-ド151-box-简中": "/products/151-box.png",
  "九彩汇聚-朋-box-简中": "/products/cs4a-box.jpg",
  "九彩汇聚-源-box-简中": "/products/cs4b-box.webp",
  "交相辉映-唤-box-简中": "/products/csm2c-box.png",
  "交相辉映-沐-box-简中": "/products/csm2a-box.png",
  "交相辉映-魁-box-简中": "/products/csm2b-box.png",
  "剑刃觉醒-box-简中": "/products/csv7c-box.png",
  "勇魅群星-勇-box-简中": "/products/cs5b-box.png",
  "勇魅群星-魅-box-简中": "/products/cs5-box.png",
  "嘉奖回合-box-简中": "/products/csv4c-box.png",
  "奇迹启程-box-简中": "/products/csv2c-box.png",
  "宝石包第一弹-box-简中": "/products/cbb1c-box.png",
  "宝石包第三弹-box-简中": "/products/cbb3c-box.png",
  "宝石包第二弹-box-简中": "/products/cbb2c-box.png",
  "宝石包第五弹-box-简中": "/products/cbb5c-box.png",
  "宝石包第四弹-box-简中": "/products/cbb4c-box.png",
  "怒炎灼天-box-简中": "/products/cs35-box.png",
  "无畏太晶-box-简中": "/products/csv3c-box.png",
  "星彩晶璃-box-简中": "/products/csv9c-box.png",
  "暗影夺辉-box-简中": "/products/cs55-box.png",
  "朱-紫-黒炎の支配者-box-简中": "/products/sv3-box.png",
  "朱-紫ex-強化拡張パック-box-简中": "/products/csv1c-box.png",
  "极巨争锋-焰-box-简中": "/products/cs1b-box.png",
  "极巨争锋-雷-box-简中": "/products/cs1a-box.png",
  "极巨攻防-box-简中": "/products/cs15-box.png",
  "横空出世-泽-box-简中": "/products/csm1c-box.png",
  "横空出世-苍-box-简中": "/products/csm1b-box.png",
  "横空出世-赫-box-简中": "/products/csm1a-box.png",
  "洪荒演武-激-box-简中": "/products/cs3b-box.png",
  "洪荒演武-茂-box-简中": "/products/cs3a-box.jpg",
  "浓墨重彩-靛-box-简中": "/products/cs2b-box.png",
  "浓墨重彩-黎-box-简中": "/products/cs2a-box.png",
  "游历对战周边礼盒-简中": "/products/ylsc-battle-box.png",
  "游历收藏周边礼盒-简中": "/products/ylsc-collect-box.png",
  "火影忍者-コレクタブルカ-ド-スタ-タ-セット": "/products/naruto-wafer-vol3.jpg",
  "火影忍者-疾風伝-カ-ドウエハ-ス-box": "/products/naruto-wafer-vol2.jpg",
  "璀璨反击-box-简中": "/products/cs25-box.png",
  "璀璨诡幻-box-简中": "/products/csv8c-box.png",
  "真实玄虚-box-简中": "/products/csv6c-box.png",
  "碧海暗影-box-简中": "/products/cs6a-box.png",
  "终末炎舞-box-简中": "/products/cs45-box.png",
  "胜象星引-box-简中": "/products/cs65-box.jpg",
  "黑晶炽焰-box-简中": "/products/csv5c-box.png",
};

const db = new Database(dbPath);
const update = db.prepare('UPDATE "Product" SET images = ? WHERE slug = ? AND images != ?');

let updated = 0;
let skipped = 0;

for (const [slug, images] of Object.entries(IMAGE_MAP)) {
  const result = update.run(images, slug, images);
  if (result.changes > 0) {
    updated++;
  } else {
    skipped++;
  }
}

db.close();
console.log(`[images] 图片路径同步完成：更新 ${updated} 件，已是最新 ${skipped} 件`);
