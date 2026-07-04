"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createMemberSession,
  destroyMemberSession,
  getMemberSession,
} from "@/lib/session";

export type AuthState = { error?: string } | undefined;

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

export async function registerAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim();
  const nameKana = String(formData.get("nameKana") || "").trim();
  const email = normalizeEmail(String(formData.get("email") || ""));
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const passwordConfirm = String(formData.get("passwordConfirm") || "");

  if (!name || !email || !password) {
    return { error: "auth_err_required" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "auth_err_email" };
  }
  if (password.length < 8) {
    return { error: "auth_err_password_short" };
  }
  if (password !== passwordConfirm) {
    return { error: "auth_err_password_mismatch" };
  }

  const exists = await prisma.customer.findUnique({ where: { email } });
  if (exists) {
    return { error: "auth_err_email_taken" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const customer = await prisma.customer.create({
    data: {
      email,
      name,
      nameKana: nameKana || null,
      phone: phone || null,
      passwordHash,
    },
  });

  await createMemberSession({
    customerId: customer.id,
    email: customer.email,
    name: customer.name,
  });
  redirect("/account");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = normalizeEmail(String(formData.get("email") || ""));
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "auth_err_required" };
  }

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) {
    return { error: "auth_err_invalid" };
  }

  const ok = await bcrypt.compare(password, customer.passwordHash);
  if (!ok) {
    return { error: "auth_err_invalid" };
  }

  await createMemberSession({
    customerId: customer.id,
    email: customer.email,
    name: customer.name,
  });
  redirect("/account");
}

export async function logoutMemberAction() {
  await destroyMemberSession();
  redirect("/account/login");
}

export async function requireMember() {
  const session = await getMemberSession();
  if (!session) {
    redirect("/account/login");
  }
  return session;
}
