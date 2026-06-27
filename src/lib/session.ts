import "server-only";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.ADMIN_SESSION_SECRET || "dev-only-insecure-secret";
const COOKIE_NAME = "admin_session";

type SessionPayload = {
  adminId: string;
  username: string;
};

export async function createAdminSession(payload: SessionPayload) {
  const token = jwt.sign(payload, SECRET, { expiresIn: "7d" });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  // 显式覆盖写入同样的path/属性并立即过期，确保浏览器一定会清除该cookie
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
