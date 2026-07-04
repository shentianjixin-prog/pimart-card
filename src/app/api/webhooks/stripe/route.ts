import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "未配置 Stripe Webhook 签名密钥" },
      { status: 400 }
    );
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "签名验证失败" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (order && order.status !== "paid") {
        const paidEmail = session.customer_details?.email?.trim().toLowerCase();
        let customerId = order.customerId;
        if (!customerId && paidEmail) {
          const customer = await prisma.customer.findUnique({ where: { email: paidEmail } });
          if (customer) customerId = customer.id;
        }

        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data: {
              status: "paid",
              customerId: customerId ?? undefined,
              customerEmail: paidEmail ?? order.customerEmail ?? undefined,
              customerName: session.customer_details?.name ?? order.customerName ?? undefined,
            },
          }),
          ...order.items.map((item) =>
            prisma.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            })
          ),
        ]);
      }
    }
  }

  return NextResponse.json({ received: true });
}
