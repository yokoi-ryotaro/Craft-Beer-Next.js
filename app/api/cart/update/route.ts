// app/api/cart/update/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId, quantity } = await req.json();
  if (!itemId || !quantity || quantity < 1) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const cart = await prisma.cart.findFirst({ where: { userId: user.id } });
  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  await prisma.cartItem.updateMany({
    where: { cartId: cart.id, itemId },
    data: { quantity },
  });

  return NextResponse.json({ ok: true });
}