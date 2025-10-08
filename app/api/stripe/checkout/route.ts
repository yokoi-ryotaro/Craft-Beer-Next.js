// app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const paymentTotal = Math.round(data.paymentTotal);

    // 🔽 Cookieを引き継ぐ
    const cookie = req.headers.get("cookie") || "";

    // まず一時保存を呼び出す
    const tempRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/temp`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookie, },
      body: JSON.stringify(data),
    });

    const tempJson = await tempRes.json();

    if (!tempRes.ok) {
      throw new Error(tempJson.error || "Failed to save checkout temp");
    }

    const tempId = tempJson.tempId;

    if (!paymentTotal || paymentTotal <= 0) {
      throw new Error("paymentTotal が正しく渡されていません。");
    }

    // metadata に tempId のみを保存（500文字制限対策）
    const metadata = {
      tempId: String(tempId),
      email: data.email,
      total: String(paymentTotal),
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: "クラフトビールご注文",
              description: "商品合計・送料・税込みの総額です",
            },
            unit_amount: paymentTotal,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}