"use server";

import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { linkOrdersToCustomer } from "@/lib/customer-orders";
import { isEmailConfigured, sendPasswordResetEmail } from "@/lib/email";
import {
  createMemberSession,
  destroyMemberSession,
  getMemberSession,
} from "@/lib/session";
import { checkRateLimit, isHoneypotFilled, rateLimitKey } from "@/lib/security";
import { resolveLang } from "@/lib/translations";

export type AuthState = { error?: string; success?: string } | undefined;

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

function isValidNickname(name: string) {
  return /^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}A-Za-z0-9_-]{2,20}$/u.test(name);
}

function isValidPassword(password: string) {
  return (
    password.length >= 8 &&
    password.length <= 32 &&
    !/\s/.test(password) &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password)
  );
}

export async function registerAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim();
  const email = normalizeEmail(String(formData.get("email") || ""));
  const password = String(formData.get("password") || "");
  const passwordConfirm = String(formData.get("passwordConfirm") || "");
  const acceptedTerms = formData.get("terms") === "on";
  const hdrs = await headers();
  const ipLimit = checkRateLimit({ key: rateLimitKey(hdrs, "register"), limit: 20, windowMs: 60 * 60 * 1000 });
  const emailLimit = checkRateLimit({ key: rateLimitKey(hdrs, "register-email", email), limit: 5, windowMs: 60 * 60 * 1000 });

  if (isHoneypotFilled(formData) || !ipLimit.allowed || !emailLimit.allowed) {
    return { error: "auth_err_rate_limited" };
  }

  if (!name || !email || !password) {
    return { error: "auth_err_required" };
  }
  if (!isValidNickname(name)) {
    return { error: "auth_err_name_rule" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "auth_err_email" };
  }
  if (!isValidPassword(password)) {
    return { error: "auth_err_password_rule" };
  }
  if (password !== passwordConfirm) {
    return { error: "auth_err_password_mismatch" };
  }
  if (!acceptedTerms) {
    return { error: "auth_err_terms_required" };
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
      passwordHash,
    },
  });

  await linkOrdersToCustomer(customer.id, customer.email);

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
  const hdrs = await headers();
  const ipLimit = checkRateLimit({ key: rateLimitKey(hdrs, "login"), limit: 30, windowMs: 15 * 60 * 1000 });
  const emailLimit = checkRateLimit({ key: rateLimitKey(hdrs, "login-email", email), limit: 8, windowMs: 15 * 60 * 1000 });

  if (isHoneypotFilled(formData) || !ipLimit.allowed || !emailLimit.allowed) {
    return { error: "auth_err_rate_limited" };
  }

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

  await linkOrdersToCustomer(customer.id, customer.email);

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
  const hdrs = await headers();
  const passwordLimit = checkRateLimit({ key: rateLimitKey(hdrs, "change-password", session.customerId), limit: 8, windowMs: 15 * 60 * 1000 });
  if (!passwordLimit.allowed) {
    return { error: "auth_err_rate_limited" };
  }

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

async function resolveRequestLang(formData?: FormData) {
  if (formData) {
    const raw = String(formData.get("lang") || "");
    if (raw) return resolveLang(raw);
  }
  const cookieStore = await cookies();
  return resolveLang(cookieStore.get("lang")?.value);
}

async function resolveSiteOrigin() {
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") || hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
}

export async function forgotPasswordAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = normalizeEmail(String(formData.get("email") || ""));
  const lang = await resolveRequestLang(formData);
  const hdrs = await headers();
  const ipLimit = checkRateLimit({ key: rateLimitKey(hdrs, "forgot-password"), limit: 10, windowMs: 60 * 60 * 1000 });
  const emailLimit = checkRateLimit({ key: rateLimitKey(hdrs, "forgot-password-email", email), limit: 3, windowMs: 60 * 60 * 1000 });

  if (isHoneypotFilled(formData) || !ipLimit.allowed || !emailLimit.allowed) {
    return { error: "auth_err_rate_limited" };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "auth_err_email" };
  }

  if (!isEmailConfigured()) {
    return { error: "auth_err_email_not_configured" };
  }

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (customer) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.deleteMany({ where: { customerId: customer.id } });
    await prisma.passwordResetToken.create({
      data: { customerId: customer.id, token, expiresAt },
    });

    const origin = await resolveSiteOrigin();
    const resetUrl = `${origin}/account/reset-password?token=${token}`;
    const sent = await sendPasswordResetEmail(email, resetUrl, lang);
    if (!sent.ok) {
      return { error: "auth_err_email_send_failed" };
    }
  }

  return { success: "auth_reset_email_sent" };
}

export async function resetPasswordAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const token = String(formData.get("token") || "").trim();
  const newPassword = String(formData.get("newPassword") || "");
  const newPasswordConfirm = String(formData.get("newPasswordConfirm") || "");

  if (!token || !newPassword) {
    return { error: "auth_err_required" };
  }
  if (newPassword.length < 8) {
    return { error: "auth_err_password_short" };
  }
  if (newPassword !== newPasswordConfirm) {
    return { error: "auth_err_password_mismatch" };
  }

  const reset = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { customer: true },
  });

  if (!reset || reset.expiresAt < new Date()) {
    return { error: "auth_err_reset_invalid" };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.$transaction([
    prisma.customer.update({
      where: { id: reset.customerId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.deleteMany({ where: { customerId: reset.customerId } }),
  ]);

  redirect("/account/login");
}
