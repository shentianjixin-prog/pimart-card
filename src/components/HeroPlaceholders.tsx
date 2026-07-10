/** Hero 用 CSS 占位视觉，避免 broken image */

export function CardPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex aspect-[5/7] w-full items-center justify-center rounded-[14px] bg-white ${className}`}
      aria-hidden
    >
      <div className="relative h-[72%] w-[78%] rounded-lg border border-[rgba(17,24,39,0.1)] bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <div className="absolute left-3 right-3 top-3 h-[38%] rounded-md bg-gradient-to-br from-[#eaf4ff] to-[#f3eeff]" />
        <div className="absolute bottom-4 left-3 right-3 h-2 rounded-full bg-[#e5e7eb]" />
        <div className="absolute bottom-8 left-3 h-2 w-2/3 rounded-full bg-[#f3f4f6]" />
      </div>
    </div>
  );
}

export function BoxPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex aspect-[5/7] w-full items-center justify-center rounded-[18px] bg-[#f7f8fa] ${className}`}
      aria-hidden
    >
      <div className="relative h-[55%] w-[75%] rounded-md border border-[rgba(17,24,39,0.1)] bg-gradient-to-b from-[#ffffff] to-[#f1f5f9] shadow-[0_12px_32px_rgba(17,24,39,0.08)]">
        <div className="absolute inset-x-2 top-2 h-3 rounded-sm bg-[#111827]/10" />
        <div className="absolute inset-x-3 bottom-3 top-8 rounded-sm bg-gradient-to-br from-[#fff7d6] to-[#eaf4ff]" />
      </div>
    </div>
  );
}

export function PsaSlabPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex aspect-[5/7] w-full items-center justify-center rounded-[18px] bg-[#f7f8fa] ${className}`}
      aria-hidden
    >
      <div className="relative h-[78%] w-[68%] rounded-lg border-2 border-[#d1d5db] bg-gradient-to-b from-[#f9fafb] to-[#e5e7eb] shadow-[0_16px_40px_rgba(17,24,39,0.1)]">
        <div className="absolute inset-x-2 top-2 h-[62%] rounded border border-[rgba(17,24,39,0.08)] bg-white">
          <div className="absolute inset-2 rounded bg-gradient-to-br from-[#fff0f5] to-[#eaf4ff]" />
        </div>
        <div className="absolute bottom-3 left-2 right-2 flex items-center justify-between">
          <span className="rounded bg-[#111827] px-1.5 py-0.5 text-[8px] font-bold text-white">PSA</span>
          <span className="h-1.5 w-8 rounded bg-[#d1d5db]" />
        </div>
      </div>
    </div>
  );
}

export function isUsableProductImage(url?: string | null) {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.endsWith("placeholder.svg")) return false;
  if (trimmed.endsWith(".webp")) return true;
  if (/\.(png|jpe?g|gif)$/i.test(trimmed)) return true;
  return trimmed.startsWith("/products/") || trimmed.startsWith("/images/");
}
