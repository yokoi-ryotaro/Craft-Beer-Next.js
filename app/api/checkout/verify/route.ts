// app/api/checkout/verify/route.ts
import { NextResponse } from "next/server";
import { checkoutTokenStore } from "@/lib/checkoutTokenStore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const valid = checkoutTokenStore.verify(token);
  if (!valid) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}