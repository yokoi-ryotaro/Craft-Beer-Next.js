// app/api/stripe/success/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const TAX_RATE = 0.1;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionUser = await getCurrentUser(); 
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(sessionUser.id);
    
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout`);
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    const metadata = session.metadata?.userData;

    if (!metadata) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout`);
    }

    const data = JSON.parse(metadata);
    /*console.log("✅ Stripe metadata:", data);*/

    if (!userId) {
      throw new Error("userId が未定義です。Checkout作成時にmetadataに含めてください。");
    }

    const totalPrice = data.cartItems.reduce(
      (sum: number, item: any) => sum + item.price * (1 + TAX_RATE) * item.quantity,
      0
    );

    const shippingFee = totalPrice <= 1999 ? 1000 : totalPrice <= 4999 ? 500 : 0;
    const paymentTotal = Math.round(totalPrice + shippingFee);

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          lastName: data.lastName,
          firstName: data.firstName,
          email: data.email,
          postCode: data.postCode,
          prefecture: data.prefecture,
          city: data.city,
          street: data.street,
          building: data.building || null,
          phoneNumber: data.phoneNumber,
          paymentMethod: data.paymentMethod,
          totalPrice: Math.round(totalPrice),
          shippingFee,
          paymentTotal,
        },
      });

      await tx.orderItem.createMany({
        data: data.cartItems.map((item: any) => ({
          orderId: order.id,
          itemId: item.id,
          quantity: item.quantity,
          price: Math.round(item.price * (1 + TAX_RATE)),
        })),
      });

      const carts = await tx.cart.findMany({
        where: { userId },
        select: { id: true },
      });

      await tx.cartItem.deleteMany({
        where: {
          cartId: { in: carts.map((c) => c.id) },
        },
      });

      await tx.cart.deleteMany({
        where: { userId },
      });
    });
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout/complete`);
  } catch (error) {
    console.error("注文確定エラー:", error);
    return NextResponse.json({ error: "注文確定に失敗しました" }, { status: 500 });
  }
}