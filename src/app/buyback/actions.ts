"use server";

import { prisma } from "@/lib/prisma";

export type BuybackFormState = {
  ok?: boolean;
  error?: string;
};

export async function submitBuybackRequest(
  _prev: BuybackFormState,
  formData: FormData
): Promise<BuybackFormState> {
  const name = String(formData.get("name") || "").trim();
  const nameKana = String(formData.get("nameKana") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !nameKana || !email || !message) {
    return { error: "required" };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "email" };
  }

  try {
    await prisma.buybackRequest.create({
      data: { name, nameKana, email, message },
    });
    return { ok: true };
  } catch {
    return { error: "server" };
  }
}
