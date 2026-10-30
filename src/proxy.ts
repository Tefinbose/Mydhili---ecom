
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "mydhili_admin_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page without authentication.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Check whether an admin session cookie exists.
  const sessionCookie = request.cookies.get(COOKIE_NAME);

  if (!sessionCookie?.value) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
