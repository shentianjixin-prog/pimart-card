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

  // konbini（コンビニ決済）等延迟支付方式：客户完成 checkout 时会先收到
  // `checkout.session.completed`（此时 payment_status 仍是 unpaid），
  // 真正在便利店付款后才会触发 `checkout.session.async_payment_succeeded`。
  // 两个事件都要处理，否则延迟支付的订单永远不会被标记为已付款。
  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId && session.payment_status === "paid") {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      const sessionMatches = order?.stripeSessionId === session.id;
      const amountMatches = session.amount_total === order?.totalJpy;
      if (order && sessionMatches && amountMatches && !["paid", "shipping_review"].includes(order.status)) {
        const paidEmail = session.customer_details?.email?.trim().toLowerCase();
        const shippingDetails = session.collected_information?.shipping_details;
        const shippingState = shippingDetails?.address.state?.trim();
        const prefectureMatches =
          !shippingState ||
          shippingState === order.shippingPrefecture ||
          shippingState === session.metadata?.shippingPrefectureCode ||
          shippingState.includes(order.shippingPrefecture || "__missing__");
        let customerId = order.customerId;
        if (!customerId && paidEmail) {
          const customer = await prisma.customer.findUnique({ where: { email: paidEmail } });
          if (customer) customerId = customer.id;
        }

        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data: {
              status: prefectureMatches ? "paid" : "shipping_review",
              customerId: customerId ?? undefined,
              customerEmail: paidEmail ?? order.customerEmail ?? undefined,
              customerName: session.customer_details?.name ?? order.customerName ?? undefined,
              shippingAddressJson: shippingDetails
                ? JSON.stringify({
                    ...shippingDetails,
                    phone: session.customer_details?.phone ?? null,
                  })
                : undefined,
            },
          }),
          ...order.items.map((item) =>
            prisma.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            })
          ),
        ]);
      } else if (order && (!sessionMatches || !amountMatches)) {
        console.error("Ignored Stripe session with mismatched order integrity fields", {
          orderId,
          sessionId: session.id,
          sessionMatches,
          amountMatches,
        });
      }
    }
  }

  // konbini 等延迟支付方式逾期未付款时，Stripe 触发这个事件；库存此前未扣减，
  // 这里只需把订单标记为取消，不需要回补库存。
  if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (order && order.stripeSessionId === session.id && order.status === "pending") {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "cancelled" },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
