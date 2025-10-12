// app/api/cart/delete/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json(
    { error: "Unauthorized" }, 
    { status: 401 }
  );

  const { itemId } = await req.json();
  if (!itemId) return NextResponse.json(
    { error: "Invalid input" }, 
    { status: 400 }
  );

  const cart = await prisma.cart.findFirst({ where: { userId: user.id } });
  if (!cart) return NextResponse.json(
    { error: "Cart not found" }, 
    { status: 404 }
  );

  // 商品削除
  await prisma.cartItem.deleteMany({ 
    where: { cartId: cart.id, itemId } 
  });

  // カート内にまだ商品があるか確認
  const remainingItems = await prisma.cartItem.count({
    where: { cartId: cart.id },
  });

  // 商品が0ならカート自体を削除
  if (remainingItems === 0) {
    await prisma.cart.delete({
      where: { id: cart.id },
    });
  }

  return NextResponse.json({ ok: true });
}