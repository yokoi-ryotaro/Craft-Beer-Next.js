// app/checkout/confirm/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/confirm.module.css";

type CartItem = {
  id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
};

type UserForm = {
  lastName: string;
  firstName: string;
  email: string;
  postCode: string;
  prefecture: string;
  city: string;
  street: string;
  building: string;
  phoneNumber: string;
  paymentMethod: string;
  cartItems: CartItem[];
};

const TAX_RATE = 0.1;

export default function ConfirmPage() {
  const [data, setData] = useState<UserForm | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // ✅ ログイン状態チェック
    const checkLogin = async () => {
      const res = await fetch("/api/auth/check");
      if (!res.ok) {
        router.push("/login?message=please-login");
        return;
      }
      setIsAuthenticated(true);
    };
    checkLogin();
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      const res = await fetch("/api/checkout/confirm");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        router.push("/cart"); // データなければ戻す
      }
    };
    fetchData();
  }, [isAuthenticated, router]);

  if (isAuthenticated === null || !data) {
    return (
      <main id="maincontent">
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
          <p>読み込み中...</p>
        </div>
      </main>
    );
  }

  const totalPrice = data.cartItems.reduce(
    (sum, item) => 
      sum + Math.round(item.price * (1 + TAX_RATE)) * item.quantity,0
  );
  const shippingFee = totalPrice <= 1999 ? 1000 : totalPrice <= 4999 ? 500 : 0;
  const paymentTotal = totalPrice + shippingFee;

  const handleConfirm = async () => {
    const payload = { ...data, paymentTotal }; 
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("決済セッションの作成に失敗しました");
      return;
    }

    const { url } = await res.json();
    window.location.href = url; // Stripe決済ページへ遷移
  };

  return (
    <main id="maincontent">
      <h1>ご注文内容確認</h1>
      <section id={styles.mainsection}>
        {/* 商品一覧 */}
        <table className={styles.cartTable}>
          <tbody>
            {data.cartItems.map((item) => (
              <tr key={item.id}>
                <td className={styles.cartTd}>
                  <img
                    src={`/img/item/${item.image}`}
                    width="80"
                    alt={item.name}
                  />
                </td>
                <td className={styles.cartTd}>{item.name}</td>
                <td className={styles.cartTd}>{item.quantity}個</td>
                <td className={styles.cartTd}>
                  ¥{(Math.round((item.price * (1 + TAX_RATE))) * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.totalPrice}>
          <p>商品合計：¥{totalPrice.toLocaleString()}</p>
          <p>送料：¥{shippingFee.toLocaleString()}</p>
          <div className={styles.paymentTotal}>
            <p>お支払合計：¥{paymentTotal.toLocaleString()}</p>
          </div>
        </div>

        {/* ユーザー情報（表示専用） */}
        <h2 className={styles.h2Title}>ご注文者情報</h2>
        <div className={styles.formRow}>
          <div className={styles.formLabel}>姓：</div>
          <div className={styles.value}>
            {data.lastName}
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formLabel}>名：</div>
          <div className={styles.value}>
            {data.firstName}
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formLabel}>メールアドレス：</div>
          <div className={styles.value}>
            {data.email}
          </div>
        </div>
        <h2 className={styles.h2Title}>配送先情報</h2>
        <div className={styles.formRow}>
          <div className={styles.formLabel}>郵便番号：</div>
          <div className={styles.value}>
            {data.postCode}
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formLabel}>都道府県：</div>
          <div className={styles.value}>
            {data.prefecture}
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formLabel}>市区町村：</div>
          <div className={styles.value}>
            {data.city}
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formLabel}>番地：</div>
          <div className={styles.value}>
            {data.street}
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formLabel}>建物名：</div>
          <div className={styles.value}>
            {data.building}
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formLabel}>電話番号：</div>
          <div className={styles.value}>
            {data.phoneNumber}
          </div>
        </div>
        <h2 className={styles.h2Title}>決済方法</h2>
        <div className={styles.payment}>
          {data.paymentMethod === "CREDIT" ? "クレジットカード" : "その他"}
        </div>

        <div className={styles.buttomButton}>
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            className={styles.backCheckout}
          >
            修正する
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={styles.confirmButton}
          >
            決済する
          </button>
        </div>
      </section>
    </main>
  );
}