// app/api/checkout/data/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = sessionUser.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { cart: { userId } },
      include: { item: true },
      orderBy: { createdAt: "asc" },
    });

    if (!cartItems.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 404 });
    }

    const items = cartItems.map((ci) => ({
      id: ci.item.id,
      name: ci.item.name ?? "",
      image: ci.item.image ?? "noimage.jpg",
      quantity: ci.quantity,
      price: ci.item.price ?? 0,
    }));

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

    return NextResponse.json({ items, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}