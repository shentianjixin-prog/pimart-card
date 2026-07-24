import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { isProductArchived } from "@/lib/product-status";
import { checkRateLimit, rateLimitKey } from "@/lib/security";
import { getMemberSession } from "@/lib/session";
import { z } from "zod";
import { getJapanShippingRate } from "@/lib/shipping";

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().trim().min(1).max(128),
    quantity: z.number().int().min(1).max(100),
  })).min(1).max(25),
  solo: z.boolean().optional(),
  prefecture: z.string().trim().regex(/^JP-\d{2}$/),
  acceptedRules: z.literal(true),
}).strict();

export async function POST(request: NextRequest) {
  const checkoutLimit = checkRateLimit({
    key: rateLimitKey(request.headers, "checkout-create"),
    limit: 20,
    windowMs: 10 * 60 * 1000,
  });
  if (!checkoutLimit.allowed) {
    return NextResponse.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 });
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 16_384) {
    return NextResponse.json({ error: "请求内容过大" }, { status: 413 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: "商品数量或结算信息无效，请刷新后重试" }, { status: 400 });
  }

  const solo = parsed.data.solo === true;
  const shipping = getJapanShippingRate(parsed.data.prefecture);
  if (!shipping) {
    return NextResponse.json({ error: "请选择有效的日本收货都道府县" }, { status: 400 });
  }
  const itemTotals = new Map<string, number>();
  for (const item of parsed.data.items) {
    itemTotals.set(item.productId, (itemTotals.get(item.productId) ?? 0) + item.quantity);
  }
  const items = Array.from(itemTotals, ([productId, quantity]) => ({ productId, quantity }));
  if (items.some((item) => item.quantity > 100)) {
    return NextResponse.json({ error: "单件商品数量超过结算上限" }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });

  const lineItems = [];
  let totalJpy = 0;
  const orderItemsData = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json({ error: "商品不存在" }, { status: 400 });
    }
    if (isProductArchived(product.status)) {
      return NextResponse.json(
        { error: `「${product.name}」已下架，无法结算` },
        { status: 400 }
      );
    }
    if (product.priceJpy <= 0) {
      return NextResponse.json(
        { error: `「${product.name}」尚未完成价格核验` },
        { status: 409 }
      );
    }
    if (item.quantity < 1 || item.quantity > product.stock) {
      return NextResponse.json(
        { error: `「${product.name}」库存不足` },
        { status: 400 }
      );
    }
    totalJpy += product.priceJpy * item.quantity;
    orderItemsData.push({
      productId: product.id,
      quantity: item.quantity,
      priceJpy: product.priceJpy,
    });
    lineItems.push({
      price_data: {
        currency: "jpy",
        product_data: { name: product.name },
        unit_amount: product.priceJpy,
      },
      quantity: item.quantity,
    });
  }

  totalJpy += shipping.feeJpy;
  const member = await getMemberSession();

  const order = await prisma.order.create({
    data: {
      totalJpy,
      shippingFeeJpy: shipping.feeJpy,
      shippingPrefecture: shipping.label,
      customerId: member?.customerId,
      customerEmail: member?.email,
      customerName: member?.name,
      items: { create: orderItemsData },
    },
  });

  try {
    const stripe = getStripe();
    const origin = request.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "ja",
      // 不写死 payment_method_types：具体展示哪些支付方式由 Stripe 后台
      // 「Settings → Payment methods」里实际启用的方式自动决定，写死列表反而会在
      // 某个方式未在后台开启时导致整个 session 创建失败。
      line_items: lineItems,
      customer_email: member?.email,
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: ["JP"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: `日本国内配送（${shipping.label}）`,
            fixed_amount: { amount: shipping.feeJpy, currency: "jpy" },
          },
        },
      ],
      success_url: `${origin}/checkout/success?order=${order.id}${solo ? "&solo=1" : ""}`,
      cancel_url: `${origin}/checkout/cancel?order=${order.id}`,
      metadata: {
        orderId: order.id,
        solo: solo ? "1" : "0",
        shippingPrefecture: shipping.label,
        shippingPrefectureCode: shipping.code,
        shippingFeeJpy: String(shipping.feeJpy),
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "cancelled" },
    });
    console.error("Stripe checkout session creation failed", err);
    return NextResponse.json({ error: "支付服务暂时不可用，请稍后重试" }, { status: 502 });
  }
}
