import { NextResponse } from "next/server";
import { auth } from "@/auth";
import type { NextRequest } from "next/server";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";
const { rewrite: rewriteLLM } = rewritePath("/docs/*path", "/llms.mdx/*path");

export async function proxy(req: NextRequest) {
  // Bypass authentication cho /api/test-db ngay từ đầu
  if (req.nextUrl.pathname === "/api/test-db") {
    return NextResponse.next();
  }

  // Xử lý các route khác
  if (isMarkdownPreferred(req)) {
    const result = rewriteLLM(req.nextUrl.pathname);
    if (result) {
      return NextResponse.rewrite(new URL(result, req.nextUrl));
    }
  }

  const session = await auth();
  const isAuth = !!session?.user;

  const isAPI = req.nextUrl.pathname.startsWith("/api/app/");
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up") ||
    req.nextUrl.pathname.startsWith("/sign-out");

  if (isAPI) {
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (isAuthPage) {
    if (isAuth && !req.nextUrl.pathname.startsWith("/sign-out")) {
      let callbackUrl = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        callbackUrl += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`, req.url)
      );
    }
  }

  const adminEmails = process.env.SUPER_ADMIN_EMAILS?.split(",");
  const currentUserEmail = session?.user?.email;

  if (req.nextUrl.pathname.startsWith("/super-admin")) {
    if (!currentUserEmail || !adminEmails?.includes(currentUserEmail)) {
      return NextResponse.redirect(
        new URL("/sign-in?error=unauthorized", req.url)
      );
    }
  }

  if (!isAuth && req.nextUrl.pathname.startsWith("/app")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/test-db", // Đặt lên đầu để được xử lý đầu tiên
    "/docs/:path*",
    "/api/app/:path*",
    "/app/:path*",
    "/sign-in",
    "/sign-up",
    "/sign-out",
    "/super-admin/:path*",
  ],
};
