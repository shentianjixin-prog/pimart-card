"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createMemberSession,
  destroyMemberSession,
  getMemberSession,
} from "@/lib/session";

export type AuthState = { error?: string; success?: string } | undefined;

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

export async function updateProfileAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const session = await requireMember();
  const name = String(formData.get("name") || "").trim();
  const nameKana = String(formData.get("nameKana") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  if (!name) {
    return { error: "auth_err_required" };
  }

  const customer = await prisma.customer.update({
    where: { id: session.customerId },
    data: {
      name,
      nameKana: nameKana || null,
      phone: phone || null,
    },
  });

  await createMemberSession({
    customerId: customer.id,
    email: customer.email,
    name: customer.name,
  });

  return { success: "auth_profile_saved" };
}

export async function changePasswordAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const session = await requireMember();
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const newPasswordConfirm = String(formData.get("newPasswordConfirm") || "");

  if (!currentPassword || !newPassword) {
    return { error: "auth_err_required" };
  }
  if (newPassword.length < 8) {
    return { error: "auth_err_password_short" };
  }
  if (newPassword !== newPasswordConfirm) {
    return { error: "auth_err_password_mismatch" };
  }

  const customer = await prisma.customer.findUnique({ where: { id: session.customerId } });
  if (!customer) {
    return { error: "auth_err_invalid" };
  }

  const ok = await bcrypt.compare(currentPassword, customer.passwordHash);
  if (!ok) {
    return { error: "auth_err_current_password" };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.customer.update({
    where: { id: customer.id },
    data: { passwordHash },
  });

  return { success: "auth_password_saved" };
}
