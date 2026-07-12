import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { isProductArchived } from "@/lib/product-status";
import { checkRateLimit, rateLimitKey } from "@/lib/security";
import { getMemberSession } from "@/lib/session";

type CheckoutItem = { productId: string; quantity: number };

export async function POST(request: NextRequest) {
  const checkoutLimit = checkRateLimit({
    key: rateLimitKey(request.headers, "checkout-create"),
    limit: 20,
    windowMs: 10 * 60 * 1000,
  });
  if (!checkoutLimit.allowed) {
    return NextResponse.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 });
  }
  let body: { items?: CheckoutItem[]; solo?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const items = body.items;
  const solo = body.solo === true;
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "购物车为空" }, { status: 400 });
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

  const member = await getMemberSession();

  const order = await prisma.order.create({
    data: {
      totalJpy,
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
      line_items: lineItems,
      customer_email: member?.email,
      success_url: `${origin}/checkout/success?order=${order.id}${solo ? "&solo=1" : ""}`,
      cancel_url: `${origin}/checkout/cancel?order=${order.id}`,
      metadata: { orderId: order.id, solo: solo ? "1" : "0" },
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
    const message = err instanceof Error ? err.message : "支付服务暂时不可用";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
