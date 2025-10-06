// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// 👇 ここでキャッシュしておく
export const prisma =
  globalForPrisma.prisma ??
  (globalForPrisma.prisma = new PrismaClient({
    log: ["query", "error", "warn"],
  }));