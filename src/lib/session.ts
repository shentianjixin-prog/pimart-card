import "server-only";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || "dev-only-insecure-secret";
const MEMBER_SECRET = process.env.MEMBER_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || "dev-only-member-secret";
const ADMIN_COOKIE = "admin_session";
const MEMBER_COOKIE = "member_session";

type AdminSessionPayload = {
  adminId: string;
  username: string;
};

type MemberSessionPayload = {
  customerId: string;
  email: string;
  name: string;
};

export type MemberSession = MemberSessionPayload;

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function createAdminSession(payload: AdminSessionPayload) {
  const token = jwt.sign(payload, ADMIN_SECRET, { expiresIn: "7d" });
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, cookieOptions(60 * 60 * 24 * 7));
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, ADMIN_SECRET) as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "", cookieOptions(0));
}

export async function createMemberSession(payload: MemberSessionPayload) {
  const token = jwt.sign(payload, MEMBER_SECRET, { expiresIn: "30d" });
  const cookieStore = await cookies();
  cookieStore.set(MEMBER_COOKIE, token, cookieOptions(60 * 60 * 24 * 30));
}

export async function getMemberSession(): Promise<MemberSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(MEMBER_COOKIE)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, MEMBER_SECRET) as MemberSessionPayload;
  } catch {
    return null;
  }
}

export async function destroyMemberSession() {
  const cookieStore = await cookies();
  cookieStore.set(MEMBER_COOKIE, "", cookieOptions(0));
}
