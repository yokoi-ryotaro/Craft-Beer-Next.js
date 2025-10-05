// app/api/items/[nameEnglish]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { nameEnglish: string } }
) {
  const { nameEnglish } = params;
  try {
    const item = await prisma.item.findUnique({
      where: { nameEnglish },
      include: { country: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const priceWithTax = Math.floor((item.price ?? 0) * 1.1);

    return NextResponse.json({ item, priceWithTax });
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}