// app/api/items/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "12", 10);

  const keyword = searchParams.get("keyword") || "";
  const price = searchParams.get("price") || "";
  const country = searchParams.get("country");
  const abv = searchParams.get("abv") || "";
  const volume = searchParams.get("volume") || "";
  const inStock = searchParams.get("inStock") === "true";
  const sort = searchParams.get("sort") || "";

  // --- 検索条件組み立て ---
  const where: any = {};

  if (keyword) {
    where.name = { contains: keyword };
  }

  const TAX_RATE = 0.1;

  if (price) {
    const [minTax, maxTax] = price.split("-"); // 税込価格
    where.price = {};
    if (minTax) where.price.gte = Math.floor(parseInt(minTax) / (1 + TAX_RATE));
    if (maxTax) where.price.lte = Math.floor(parseInt(maxTax) / (1 + TAX_RATE));
  }

  if (country) {
    where.countriesId = parseInt(country, 10);
  }

  if (abv) {
    const [min, max] = abv.split("-");
    where.abv = {};
    if (min) where.abv.gte = parseFloat(min);
    if (max) where.abv.lte = parseFloat(max);
  }

  if (volume) {
    const [min, max] = volume.split("-");
    where.volume = {};
    if (min) where.volume.gte = parseInt(min);
    if (max) where.volume.lte = parseInt(max);
  }

  if (inStock) {
    where.stock = { gt: 0 };
  }

  // 並び替え
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "salesCount_desc") orderBy = { salesCount: "desc" };

  // --- DB クエリ ---
  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { country: true }, 
    }),
    prisma.item.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}