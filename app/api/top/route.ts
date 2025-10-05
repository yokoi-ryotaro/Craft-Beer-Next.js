// app/api/top/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 新着商品: 作成日順で最新10件
    const newItems = await prisma.item.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // 人気商品: salesCount順で上位10件
    const bestSellers = await prisma.item.findMany({
      orderBy: { salesCount: "desc" },
      take: 10,
    });

    return NextResponse.json({ newItems, bestSellers });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}