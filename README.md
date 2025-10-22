# 🍺 Craft Beer EC Site

> **Next.js × Prisma × Stripe** によるクラフトビールECサイト  
> ユーザー登録・カート・注文・決済機能を備えたフルスタックアプリケーション

---

## 🚀 プロジェクト概要

本アプリケーションは、クラフトビールのオンライン販売を想定したECサイトです。  
**Next.js（App Router）** をフロントエンド／バックエンド統合環境として使用し、  
**Prisma ORM + PostgreSQL** によるデータ管理、**Stripe** による決済を実装しています。

---

## 🧩 技術スタック（Tech Stack）

| 分類 | 使用技術 | 説明 |
|------|------------|------|
| フレームワーク | **Next.js 15 (App Router)** | SSR・SSG・APIを統合した最新フレームワーク |
| 言語 | **TypeScript 5.9** | 型安全で保守性の高い開発 |
| スタイリング | **Tailwind CSS 4**, **Swiper 12** | レスポンシブ対応のモダンUIとスライダー機能 |
| ORM | **Prisma 6** | 型安全なDB操作とマイグレーション管理 |
| DB | **PostgreSQL** | ECサイトの主要データ（商品・注文・ユーザー等）管理 |
| 認証 | **bcryptjs**, **jose** | パスワード暗号化 + JWT認証 |
| 決済 | **Stripe 19** | 安全なクレジットカード決済処理 |
| コード品質 | **ESLint 9**, **eslint-config-next** | 静的解析による品質維持 |

---








This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
