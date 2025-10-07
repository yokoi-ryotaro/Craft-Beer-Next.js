import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET || "secret");

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    console.log("✅ JWT OK:", payload);
    return NextResponse.next();
  } catch (err) {
    console.error("❌ JWT NG:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/mypage/:path*", "/checkout/:path*", "/order/:path*", "/cart/:path*"],
};
