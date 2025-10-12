// app/api/checkout/verify/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const record = await prisma.checkoutToken.findUnique({ where: { token } });
  if (!record) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  // トークンは使い捨て（1回使用後に削除）
  await prisma.checkoutToken.delete({ where: { id: record.id } });

  return NextResponse.json({ ok: true });
}