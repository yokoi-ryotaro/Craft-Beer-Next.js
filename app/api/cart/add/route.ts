// app/api/cart/add/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "ログインしてください" },
        { status: 401 }
      );
    }

    const { itemId, quantity } = await req.json();

    // 1. ユーザーのカートを取得 or 作成
    let cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });
    }

    // 2. 既存のCartItemがあるか確認
    const existingCartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, itemId },
    });

    if (existingCartItem) {
      // 数量を加算
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // 新規追加
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          itemId,
          quantity,
        },
      });
    }

    return NextResponse.json({ message: "カートに追加しました" }, { status: 200 });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { message: "カート追加に失敗しました" },
      { status: 500 }
    );
  }
}