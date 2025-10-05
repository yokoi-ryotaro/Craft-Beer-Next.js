// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET || "secret");

// ログイン必須のパス（ここに含まれるURLはセッションチェック対象）
const protectedPaths = [
  "/checkout",
  "/mypage",
  "/order",
  "/cart",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 静的ファイルやAPI、ログインページなどは除外
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
  const requiresAuth = protectedPaths.some((path) => pathname.startsWith(path));
  if (!requiresAuth) {
    return NextResponse.next();
  }

  // セッションクッキーを取得
  const token = req.cookies.get("session_token")?.value;

  if (!token) {
    // 未ログイン → ログインページにリダイレクト
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname); // リダイレクト元を保持
    return NextResponse.redirect(loginUrl);
  }

  try {
    // JWT 検証
    const { payload } = await jwtVerify(token, secret);

    // 有効なセッション → 続行
    const res = NextResponse.next();
    // ユーザーIDをリクエストヘッダーに追加（サーバー側で使いたい場合）
    res.headers.set("x-user-id", String(payload.userId));
    return res;

  } catch (error) {
    console.error("❌ Invalid session token:", error);
    // トークンが無効または期限切れ → ログインページへ
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// ミドルウェアを適用するルート範囲
export const config = {
  matcher: [
    "/checkout/:path*",
    "/mypage/:path*",
    "/order/:path*",
    "/cart/:path*",
  ],
};