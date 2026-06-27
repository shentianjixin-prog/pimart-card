"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/lang-context";

const STORAGE_KEY = "pimart-announcements-closed";
const ANN_ICONS = ["📢", "📦", "✅"];
const ANN_KEYS = ["ann_0", "ann_1", "ann_2"];

export function Announcements() {
  const T = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const closed = localStorage.getItem(STORAGE_KEY);
    if (!closed) setVisible(true);
  }, []);

  function close() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="surface mb-6 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          {T("ann_title")}
        </p>
        <button onClick={close} className="text-xs text-gray-500 hover:text-gray-300">
          {T("ann_close")}
        </button>
      </div>
      <ul className="space-y-1.5">
        {ANN_KEYS.map((key, i) => (
          <li key={key} className="flex items-start gap-2 text-sm text-gray-400">
            <span className="shrink-0">{ANN_ICONS[i]}</span>
            <span>{T(key)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
