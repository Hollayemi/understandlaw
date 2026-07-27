import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PROTECTED_USER_PREFIXES = ["/dashboard"];
const PROTECTED_ADMIN_PREFIXES = ["/admin"];
const ADMIN_PUBLIC_PATHS = ["/admin/login"];

export default auth((req: any) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isAdminRoute =
    PROTECTED_ADMIN_PREFIXES.some((p) => pathname.startsWith(p)) &&
    !ADMIN_PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isUserRoute = PROTECTED_USER_PREFIXES.some((p) => pathname.startsWith(p));

  if (isAdminRoute) {
    if (!session || session.actor !== "admin") {
      const loginUrl = new URL("/admin/login", req.nextUrl.origin);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isUserRoute) {
    if (!session || session.actor !== "user") {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
