// app/api/stripe/cancel/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      throw new Error("session_id が指定されていません。");
    }

    // Stripe セッション情報を取得
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const tempId = session.metadata?.tempId;

    if (!tempId) {
      console.warn("cancel: metadata.tempId が存在しません。");
    } else {
      // 一時注文情報を削除
      await prisma.checkoutTemp.deleteMany({
        where: { id: Number(tempId) },
      });
      console.log(`✅ checkoutTemp ${tempId} を削除しました`);
    }

    // カートページへリダイレクト
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/cart`);
  } catch (error) {
    console.error("❌ cancel処理中にエラー:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/cart?error=cancel_failed`);
  }
}