import { prisma } from "@/lib/prisma";

/** 将同邮箱的历史游客订单关联到会员账号 */
export async function linkOrdersToCustomer(customerId: string, email: string) {
  const normalized = email.trim().toLowerCase();
  await prisma.order.updateMany({
    where: {
      customerId: null,
      customerEmail: normalized,
    },
    data: { customerId },
  });
}
