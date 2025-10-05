// app/api/items/[nameEnglish]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { nameEnglish: string } } // ✅ Promiseなし・分割代入形式
) {
  const { nameEnglish } = params;

  try {
    const item = await prisma.item.findUnique({
      where: { nameEnglish },
      include: { country: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const priceWithTax = Math.round((item.price ?? 0) * 1.1);
    return NextResponse.json({ item, priceWithTax });
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}