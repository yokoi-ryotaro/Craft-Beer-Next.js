// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = sessionUser.id;

    // 1ユーザー＝1カート想定
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: { item: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!cart || !cart.items.length) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // カート商品を整形
    const cartItems = cart.items.map((ci) => ({
      id: ci.item.id,
      name: ci.item.name ?? "",
      image: ci.item.image ?? "noimage.jpg",
      quantity: ci.quantity,
      price: ci.item.price ?? 0,
    }));

    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        lastName: true,
        firstName: true,
        email: true,
        postCode: true,
        prefecture: true,
        city: true,
        street: true,
        building: true,
        phoneNumber: true,
      },
    });

    return NextResponse.json({ user, items: cartItems });
  } catch (error) {
    console.error("❌ checkout/data error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}