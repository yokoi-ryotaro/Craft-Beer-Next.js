// app/api/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET || "secret");
const cookieName = "session_token";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "メールアドレスまたはパスワードが正しくありません。" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "メールアドレスまたはパスワードが正しくありません。" }, { status: 401 });
  }

  const token = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  const res = NextResponse.json({ success: true });

  // ✅ Cookie 設定を修正
  res.cookies.set(cookieName, token, {
    httpOnly: true,
    secure: true, // 本番では必ず true
    sameSite: "none", // ← lax → none に変更
    path: "/", // ルート全体に適用
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}