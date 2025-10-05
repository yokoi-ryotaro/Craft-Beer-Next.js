// app/api/contries/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const countries = await prisma.country.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(countries);
}