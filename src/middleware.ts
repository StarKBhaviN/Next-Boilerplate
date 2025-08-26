import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/profile", "/settings"];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    const isAuthPage =
      pathname.startsWith("/signin") || pathname.startsWith("/signup");

    if (isAuthPage && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (pathname === "/" && !token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (pathname.startsWith("/api/")) return true;

        if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
          return true;
        }

        if (
          pathname === "/" ||
          protectedRoutes.some((route) => pathname.startsWith(route))
        ) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/signin",
    "/signup",
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/api/user/:path*",
  ],
};
