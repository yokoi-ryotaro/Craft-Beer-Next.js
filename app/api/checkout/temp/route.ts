// app/api/checkout/temp/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // CheckoutTempに保存
    const temp = await prisma.checkoutTemp.create({
      data: {
        userId: Number(user.id),
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
      },
    });

    return NextResponse.json({ tempId: temp.id });
  } catch (error) {
    console.error("❌ CheckoutTemp 登録エラー:", error);
    return NextResponse.json({ error: "Failed to create temp checkout" }, { status: 500 });
  }
}