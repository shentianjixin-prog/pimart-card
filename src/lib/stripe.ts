import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "未配置 STRIPE_SECRET_KEY，请在 .env 中填入你的 Stripe 测试密钥后再使用在线支付功能"
    );
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}
