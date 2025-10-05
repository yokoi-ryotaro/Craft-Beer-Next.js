// app/checkout/page.tsx
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; 
import { redirect } from "next/navigation";
import CheckoutPage from "./CheckoutPage";

export default async function Checkout() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    redirect("/login");
  }
  const userId = sessionUser?.id;

  // DBからカート取得
  const cartItems = await prisma.cartItem.findMany({
    where: { cart: { userId } },
    include: { item: true }, 
    orderBy: {createdAt: "asc"},
  })

  if (!cartItems) {
    redirect("/cart");
  }

  // React 側に渡す形に整形
  const items = cartItems.map((ci) => ({
    id: ci.item.id,
    name: ci.item.name ?? "",
    image: ci.item.image ?? "noimage.jpg",
    quantity: ci.quantity,
    price: ci.item.price ?? 0,
  }));

  // ユーザー情報を取得
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      lastName: true,
      firstName: true,
      email: true,
      postCode: true,
      prefecture: true,
      city: true,
      street: true,
      building: true,
      phoneNumber: true,
    },
  });

  return <CheckoutPage cartItems={items} user={user}  />;
}