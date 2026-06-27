import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

type CheckoutItem = { productId: string; quantity: number };

export async function POST(request: NextRequest) {
  let body: { items?: CheckoutItem[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const items = body.items;
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

  const order = await prisma.order.create({
    data: {
      totalJpy,
      items: { create: orderItemsData },
    },
  });

  try {
    const stripe = getStripe();
    const origin = request.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout/success?order=${order.id}`,
      cancel_url: `${origin}/checkout/cancel?order=${order.id}`,
      metadata: { orderId: order.id },
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
