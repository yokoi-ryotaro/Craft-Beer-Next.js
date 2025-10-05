// app/api/checkout/confirm/route.ts
import { NextResponse } from "next/server";

let checkoutData: any = null; // 簡易的にサーバー変数に保存（本番はDBやRedis推奨）

export async function POST(req: Request) {
  const body = await req.json();
  checkoutData = body;
  return NextResponse.json({ ok: true });
}

export async function GET() {
  if (!checkoutData) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json(checkoutData);
}