// app/api/stripe/success/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { getCurrentUser } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const TAX_RATE = 0.1;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionUser = await getCurrentUser(); 
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout`);
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const tempId = session.metadata?.tempId;

    if (!tempId) {
      throw new Error("Stripe metadata に tempId が存在しません。");
    }

    // CheckoutTemp取得
    const temp = await prisma.checkoutTemp.findUnique({
      where: { id: Number(tempId) },
    });

    if (!temp) {
      throw new Error("一時注文情報が見つかりません。");
    }

    // カート情報取得
    const cart = await prisma.cart.findFirst({
      where: { userId: temp.userId },
      include: { 
        items: { 
          include: { item: true },
        },
      },
    });

    if (!cart) {
      throw new Error("カートが見つかりません。");
    }

    const cartItems = cart?.items ?? [];

    const totalPrice = cartItems.reduce(
      (sum, ci) => 
        sum + Math.round((ci.item.price ?? 0) * (1 + TAX_RATE)) * ci.quantity,0
    );

    const shippingFee = totalPrice <= 1999 ? 1000 : totalPrice <= 4999 ? 500 : 0;
    const paymentTotal = Math.round(totalPrice + shippingFee);

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: temp.userId,
          lastName: temp.lastName,
          firstName: temp.firstName,
          email: temp.email,
          postCode: temp.postCode,
          prefecture: temp.prefecture,
          city: temp.city,
          street: temp.street,
          building: temp.building || null,
          phoneNumber: temp.phoneNumber,
          paymentMethod: temp.paymentMethod,
          totalPrice: Math.round(totalPrice),
          shippingFee,
          paymentTotal,
        },
      });

      await tx.orderItem.createMany({
        data: cartItems.map((ci) => ({
          orderId: order.id,
          itemId: ci.itemId,
          quantity: ci.quantity,
          price: Math.round(((ci.item.price ?? 0) * (1 + TAX_RATE))),
        })),
      });

      // カート削除
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      await tx.cart.delete({ where: { id: cart.id } });

      // 一時テーブル削除
      await tx.checkoutTemp.delete({ where: { id: temp.id } });
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout/complete`);
  } catch (error) {
    console.error("注文確定エラー:", error);
    return NextResponse.json({ error: "注文確定に失敗しました" }, { status: 500 });
  }
}