// app/api/items/[nameEnglish]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ nameEnglish: string }> } // ✅ Promise を残す
) {
  const { nameEnglish } = await context.params; // ✅ await して値を取得

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