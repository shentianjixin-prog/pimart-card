import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const hasSession = request.cookies.has("admin_session");
    if (!hasSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname === "/account" || pathname.startsWith("/account/")) {
    const isPublic =
      pathname === "/account/login" || pathname === "/account/register";
    const hasMember = request.cookies.has("member_session");
    if (!isPublic && !hasMember) {
      return NextResponse.redirect(new URL("/account/login", request.url));
    }
    if (isPublic && hasMember) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account", "/account/:path*"],
};
