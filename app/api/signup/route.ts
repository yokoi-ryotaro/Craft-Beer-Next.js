// app/api/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


export async function POST(req: Request) {
  try {
    const data = await req.json();
    const errors: Record<string, string> = {};

    // 必須チェック
    if (!data.email) errors.email = "メールアドレスを入力してください。";
    if (!data.password) {
      errors.password = "パスワードを入力してください。";
    } else if (data.password.length < 8 || data.password.length > 20) {
      errors.password = "パスワードは8〜20文字で入力してください。";
    }
    if (!data.lastName) errors.lastName = "姓を入力してください。";
    if (!data.firstName) errors.firstName = "名を入力してください。";
    if (!data.postCode) errors.postCode = "郵便番号を入力してください。";
    if (!data.prefecture) errors.prefecture = "都道府県を入力してください。";
    if (!data.city) errors.city = "市区町村を入力してください。";
    if (!data.street) errors.street = "番地を入力してください。";
    if (!data.phoneNumber) errors.phoneNumber = "電話番号を入力してください。";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // メールアドレスの重複確認
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return NextResponse.json(
        { errors: { email: "このメールアドレスはすでに使用されています。" } },
        { status: 400 }
      );
    }

    // パスワードハッシュ化
    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        lastName: data.lastName,
        firstName: data.firstName,
        lastNameKana: data.lastNameKana || null,
        firstNameKana: data.firstNameKana || null,
        postCode: data.postCode,
        prefecture: data.prefecture,
        city: data.city,
        street: data.street,
        building: data.building || null,
        phoneNumber: data.phoneNumber,
        birthday: data.birthday ? new Date(data.birthday) : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "サーバーエラーが発生しました。" }, { status: 500 });
  }
}