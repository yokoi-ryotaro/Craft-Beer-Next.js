// app/cart/page.tsx
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import CartItemRow from "./CartItemRow";
import styles from "../styles/cart.module.css";

const TAX_RATE = 0.1;

export default async function CartPage() {
  
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    redirect("/login?message=please-login");
  }
  // 1ユーザー=1カート 前提
  const cart = await prisma.cart.findFirst({
    where: { userId: sessionUser?.id },
    include: { 
      items: { 
        include: { item: true },
        orderBy: { createdAt: "asc" }, 
      },
    },
  });

  const cartItems = cart?.items ?? [];

  const totalPrice = cartItems.reduce(
    (sum, ci) => 
      sum + Math.round((ci.item.price ?? 0) * (1 + TAX_RATE)) * ci.quantity,0
  );
  const shippingFee = totalPrice <= 1999 ? 1000 : totalPrice <= 4999 ? 500 : 0;
  const paymentTotal = totalPrice + shippingFee;

  return (
    <main id="maincontent">
      <h1>ショッピングカート</h1>
      <section id={styles.mainsection}>
        {cartItems.length === 0 ? (
          <div className={styles.cartEmpty}>
            <div className={styles.cartEmptyMessage}>
              <p>カート内に商品はありません。</p>
            </div>
            <div className={styles.shopping}>
              <Link href="/items" className={styles.button}>買い物を続ける</Link>
            </div>
          </div>
        ) : (
        <>
          <table className={styles.cartTable}>
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>商品</th>
                <th></th>
                <th>数量</th>
                <th></th>
                <th>合計</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((ci) => (
                <CartItemRow key={ci.id} cartItem={ci} />
              ))}
            </tbody>
          </table>
        </>
        )}
        <div className={styles.aboutShipping}>
          <h4>★配送料について★</h4>
          <p>
            ご注文金額に応じて送料（基本送料）が発生します。
            <br />
            <br />・ご注文金額 1,999円まで
            <br />　●基本送料：1,000円（税込）
            <br />・ご注文金額 2,000円～4,999円まで　
            <br />　●基本送料：500円（税込）
            <br />・ご注文金額5,000円～
            <br />　●基本送料：無料
          </p>
        </div>
        {cartItems.length === 0 ? (
          <></>
        ) : (
        <>
          <div className={styles.totalPrice}>
            <div className={styles.cartTotal}>カート内合計：¥{totalPrice.toLocaleString()}</div>
            <div className={styles.shippingFee}>送料：¥{shippingFee.toLocaleString()}</div>
            <div className={styles.paymentTotal}>お支払合計：¥{paymentTotal.toLocaleString()}</div>
          </div>
          <div className={styles.proceedToCheckout}>
            <form action="/checkout" method="get">
              <button type="submit" className={styles.checkout}>
                ご購入手続きへ
              </button>
            </form>
          </div>
        </>
        )}
      </section>
    </main>
  );
}