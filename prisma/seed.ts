import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // orders データ
  await prisma.order.createMany({
    data: [
      {
        id: 1,
        userId: 13,
        lastName: "ビール",
        firstName: "太郎",
        email: "test04@gmail.com",
        postCode: "1100001",
        prefecture: "東京都",
        city: "台東区谷中",
        street: "1-1-1",
        building: "",
        phoneNumber: "000-0000-0003",
        paymentMethod: "CREDIT",
        totalPrice: 781,
        shippingFee: 1000,
        paymentTotal: 1781,
        createdAt: new Date("2025-06-15T15:02:29"),
        updatedAt: new Date("2025-06-15T15:02:29"),
      },
      {
        id: 2,
        userId: 13,
        lastName: "ビール",
        firstName: "太郎",
        email: "test04@gmail.com",
        postCode: "1100001",
        prefecture: "東京都",
        city: "台東区谷中",
        street: "1-1-1",
        building: "",
        phoneNumber: "000-0000-0003",
        paymentMethod: "CREDIT",
        totalPrice: 9680,
        shippingFee: 0,
        paymentTotal: 9680,
        createdAt: new Date("2025-06-15T15:03:29"),
        updatedAt: new Date("2025-06-15T15:03:29"),
      },
      {
        id: 3,
        userId: 13,
        lastName: "ビール",
        firstName: "太郎",
        email: "test04@gmail.com",
        postCode: "1100002",
        prefecture: "東京都",
        city: "台東区上野桜木",
        street: "2-2-2",
        building: "",
        phoneNumber: "000-0000-0003",
        paymentMethod: "BANK",
        totalPrice: 2090,
        shippingFee: 500,
        paymentTotal: 2590,
        createdAt: new Date("2025-06-15T15:07:26"),
        updatedAt: new Date("2025-06-15T15:07:26"),
      },
      {
        id: 7,
        userId: 16,
        lastName: "ビール",
        firstName: "小五郎",
        email: "test05@gmail.com",
        postCode: "1100002",
        prefecture: "東京都",
        city: "台東区上野桜木",
        street: "1-1-2",
        building: "",
        phoneNumber: "000-0000-0005",
        paymentMethod: "CREDIT",
        totalPrice: 2189,
        shippingFee: 500,
        paymentTotal: 2689,
        createdAt: new Date("2025-07-08T22:34:25"),
        updatedAt: new Date("2025-07-08T22:34:25"),
      },
    ],
    skipDuplicates: true,
  });

  // order_items データ
  await prisma.orderItem.createMany({
    data: [
      { id: 1, orderId: 1, itemId: 7, quantity: 1, price: 781, createdAt: null, updatedAt: null },
      { id: 2, orderId: 2, itemId: 19, quantity: 1, price: 9680, createdAt: null, updatedAt: null },
      { id: 3, orderId: 3, itemId: 7, quantity: 1, price: 781, createdAt: new Date("2025-06-15T15:07:26"), updatedAt: new Date("2025-06-15T15:07:26") },
      { id: 4, orderId: 3, itemId: 18, quantity: 1, price: 704, createdAt: new Date("2025-06-15T15:07:26"), updatedAt: new Date("2025-06-15T15:07:26") },
      { id: 5, orderId: 3, itemId: 13, quantity: 1, price: 605, createdAt: new Date("2025-06-15T15:07:26"), updatedAt: new Date("2025-06-15T15:07:26") },
      { id: 10, orderId: 7, itemId: 7, quantity: 1, price: 781, createdAt: new Date("2025-07-08T22:34:25"), updatedAt: new Date("2025-07-08T22:34:25") },
      { id: 11, orderId: 7, itemId: 18, quantity: 2, price: 704, createdAt: new Date("2025-07-08T22:34:25"), updatedAt: new Date("2025-07-08T22:34:25") },
    ],
    skipDuplicates: true,
  });

  console.log("Orders and OrderItems seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });