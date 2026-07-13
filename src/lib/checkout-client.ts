/** 单品即刻购买：直连 Stripe，不写入购物车 */

export type SoloCheckoutItem = {
  productId: string;
  quantity: number;
};

export async function startSoloCheckout(
  items: SoloCheckoutItem[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, solo: true, acceptedRules: true }),
    });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !data.url) {
      return { ok: false, error: data.error || "结算失败，请稍后重试" };
    }
    window.location.href = data.url;
    return { ok: true };
  } catch {
    return { ok: false, error: "网络错误，请稍后重试" };
  }
}
