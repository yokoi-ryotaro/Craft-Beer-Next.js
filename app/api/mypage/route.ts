// app/api/mypage/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


export async function GET() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { firstName: true, lastName: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: sessionUser.id },
    include: {
      orderItems: {
        include: { item: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const fullName = `${user.lastName} ${user.firstName}`;

  return NextResponse.json({ fullName, orders });
}