"use server";

import { prisma } from "@/lib/prisma";
import {
  payloadFromDraft,
  validateBuybackDraft,
  type BuybackDraft,
} from "@/lib/buyback-types";

export type BuybackFormState = {
  ok?: boolean;
  orderNo?: string;
  error?: string;
};

function generateOrderNo() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const suffix = String(Math.floor(Math.random() * 9000) + 1000);
  return `PIM-${ymd}-${suffix}`;
}

export async function submitBuybackRequest(
  _prev: BuybackFormState,
  formData: FormData
): Promise<BuybackFormState> {
  const raw = String(formData.get("draftJson") || "");
  if (!raw) return { error: "required" };

  let draft: BuybackDraft;
  try {
    draft = JSON.parse(raw) as BuybackDraft;
  } catch {
    return { error: "required" };
  }

  const validationError = validateBuybackDraft(draft);
  if (validationError) return { error: validationError };

  const orderNo = generateOrderNo();
  const payload = payloadFromDraft(draft);

  try {
    await prisma.buybackRequest.create({
      data: {
        orderNo,
        name: draft.name,
        nameKana: draft.nameKana,
        email: draft.email,
        payload: JSON.stringify(payload),
      },
    });
    return { ok: true, orderNo };
  } catch {
    return { error: "server" };
  }
}
