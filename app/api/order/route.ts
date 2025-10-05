// app/api/order/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const TAX_RATE = 0.1;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const sessionUser = await getCurrentUser(); 
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(sessionUser.id);

    // 注文テーブルに保存
    const order = await prisma.order.create({
      data: {
        userId,
        lastName: body.lastName,
        firstName: body.firstName,
        email: body.email,
        postCode: body.postCode,
        prefecture: body.prefecture,
        city: body.city,
        street: body.street,
        building: body.building || null,
        phoneNumber: body.phoneNumber,
        paymentMethod: body.paymentMethod,
        totalPrice: body.cartItems.reduce(
          (sum: number, item: any) => sum + item.price * (1 + TAX_RATE) * item.quantity,
          0
        ),
        shippingFee:
          body.cartItems.reduce(
            (sum: number, item: any) =>
              sum + item.price * (1 + TAX_RATE) * item.quantity,
            0
          ) <= 1999
            ? 1000
            : body.cartItems.reduce(
                (sum: number, item: any) => sum + item.price * (1 + TAX_RATE) * item.quantity,
                0
              ) <= 4999
            ? 500
            : 0,
          paymentTotal: body.cartItems.reduce(
          (sum: number, item: any) => sum + item.price * (1 + TAX_RATE) * item.quantity,
          0
        ), // shippingFeeを加算してもOK
      },
    });

    console.log(body.cartItems)

    // 注文アイテムを保存
    await prisma.orderItem.createMany({
      data: body.cartItems.map((item: any) => ({
        orderId: order.id,
        itemId: item.id,  
        quantity: item.quantity,
        price: item.price * (1 + TAX_RATE),
      })),
    });

    // カートアイテム削除
    await prisma.cartItem.deleteMany({
      where: {
        cartId: {
          in: (await prisma.cart.findMany({
            where: { userId },
            select: { id: true },
          })).map(c => c.id),
        },
      },
    });

    // カートをクリア
    await prisma.cart.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("注文確定エラー:", error);
    return NextResponse.json({ error: "注文確定に失敗しました" }, { status: 500 });
  }
}