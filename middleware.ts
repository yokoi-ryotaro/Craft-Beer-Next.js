import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET || "secret");

// ログイン必須のパス
const protectedPaths = ["/checkout", "/mypage", "/order", "/cart"];

// Cookie をパースする補助関数
function parseCookie(cookieHeader: string | null) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split("; ").map((c) => {
      const [key, ...v] = c.split("=");
      return [key, decodeURIComponent(v.join("="))];
    })
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 静的ファイル・API・ログイン/サインアップは除外
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup")
  ) {
    return NextResponse.next();
  }

  // 保護対象ルートでなければスルー
  const requiresAuth = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  if (!requiresAuth) return NextResponse.next();

  // Cookie 取得
  let token = req.cookies.get("session_token")?.value;

  // Vercel の場合、cookie が取れない時は headers から取得
  if (!token) {
    const cookies = parseCookie(req.headers.get("cookie"));
    token = cookies["session_token"];
  }

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const res = NextResponse.next();
    res.headers.set("x-user-id", String(payload.userId));
    return res;
  } catch (err) {
    console.error("❌ Invalid session token:", err);
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// 適用するルート
export const config = {
  matcher: ["/checkout/:path*", "/mypage/:path*", "/order/:path*", "/cart/:path*"],
};