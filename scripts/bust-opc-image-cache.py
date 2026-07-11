# -*- coding: utf-8 -*-
"""OPC 主图换 v2 文件名破 Next/CDN 缓存，并更新本地 DB 路径。"""
from __future__ import annotations

import shutil
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "products"
DBS = [ROOT / "dev.db", ROOT / "prisma" / "data" / "initial.db"]

# 已清洗过、需要破缓存的文件
RENAMES = {
    "opc-01-box.jpg": "opc-01-box-v2.jpg",
    "opc-02-box.jpg": "opc-02-box-v2.jpg",
    "opc-07-box.webp": "opc-07-box-v2.webp",
    "opc-10-box.jpg": "opc-10-box-v2.jpg",
    "opc-15-box.png": "opc-15-box-v2.png",
    "opc-15-box.webp": "opc-15-box-v2.webp",
}


def main() -> None:
    for old, new in RENAMES.items():
        src = PUBLIC / old
        dest = PUBLIC / new
        if not src.exists() and dest.exists():
            print("already", new)
            continue
        if not src.exists():
            print("missing", old)
            continue
        shutil.copy2(src, dest)
        print("copy", old, "->", new, dest.stat().st_size)

    for dbp in DBS:
        if not dbp.exists():
            continue
        db = sqlite3.connect(dbp)
        rows = db.execute("SELECT id, images FROM Product WHERE images LIKE '%opc-%'").fetchall()
        updated = 0
        for pid, images in rows:
            new_images = images or ""
            for old, new in RENAMES.items():
                new_images = new_images.replace(f"/products/{old}", f"/products/{new}")
            if new_images != images:
                db.execute("UPDATE Product SET images=? WHERE id=?", (new_images, pid))
                updated += 1
        # 语言与上架兜底
        db.execute(
            "UPDATE Product SET language='简中' WHERE (language IS NULL OR trim(language)='') AND (name LIKE '%简中%' OR name LIKE '%（简中）%')"
        )
        db.execute("UPDATE Product SET status='上架' WHERE status IS NULL OR status!='上架'")
        db.commit()
        print(f"[{dbp.name}] image path rows={updated}")
        db.close()


if __name__ == "__main__":
    main()
