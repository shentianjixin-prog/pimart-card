"use client";

import { useState, useTransition } from "react";
import { updateStockAction } from "@/app/admin/actions";

export function QuickStockEdit({
  productId,
  initialStock,
}: {
  productId: string;
  initialStock: number;
}) {
  const [editing, setEditing] = useState(false);
  const [stock, setStock] = useState(initialStock);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  function save(value: number) {
    setEditing(false);
    if (value === stock && status === "idle") return;
    startTransition(async () => {
      try {
        await updateStockAction(productId, value);
        setStock(value);
        setStatus("saved");
      } catch {
        setStatus("error");
      }
      setTimeout(() => setStatus("idle"), 1500);
    });
  }

  if (editing) {
    return (
      <input
        type="number"
        min={0}
        defaultValue={stock}
        autoFocus
        onBlur={(e) => save(Math.max(0, Number(e.target.value) || 0))}
        onKeyDown={(e) => {
          if (e.key === "Enter") save(Math.max(0, Number((e.target as HTMLInputElement).value) || 0));
          if (e.key === "Escape") setEditing(false);
        }}
        className="w-16 rounded border border-cyan-400/60 bg-white/5 px-2 py-0.5 text-sm text-white focus:outline-none"
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      title="点击快速编辑库存"
      className={`cursor-pointer rounded px-1 py-0.5 text-sm transition ${
        isPending
          ? "text-gray-500"
          : status === "saved"
            ? "text-green-400"
            : status === "error"
              ? "text-red-400"
              : "text-gray-300 hover:text-white hover:underline"
      }`}
    >
      {isPending ? "…" : stock}
    </span>
  );
}
