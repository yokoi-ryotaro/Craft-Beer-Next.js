// app/checkout/CheckoutPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/checkout.module.css";
import spinnerStyles from "../styles/spinner.module.css";

type CartItem = {
  id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
};

type User = {
  lastName: string | null;
  firstName: string | null;
  email: string | null;
  postCode: string | null;
  prefecture: string | null;
  city: string | null;
  street: string | null;
  building: string | null;
  phoneNumber: string | null;
};

const TAX_RATE = 0.1;

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    postCode: "",
    prefecture: "",
    city: "",
    street: "",
    building: "",
    phoneNumber: "",
    paymentMethod: "CREDIT",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/checkout");

      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.status === 404) {
        router.push("/cart");
        return;
      }

      if (!res.ok) {
        alert("データ取得に失敗しました");
        return;
      }

      const data = await res.json();
      setUser(data.user);
      setCartItems(data.items);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    if (user) {
      setForm({
        lastName: user.lastName ?? "",
        firstName: user.firstName ?? "",
        email: user.email ?? "",
        postCode: user.postCode ?? "",
        prefecture: user.prefecture ?? "",
        city: user.city ?? "",
        street: user.street ?? "",
        building: user.building ?? "",
        phoneNumber: user.phoneNumber ?? "",
        paymentMethod: "CREDIT",
      });
    }
  }, [user]);

  if (loading) return (
    <main id="maincontent">
      <h1>ご購入手続き</h1>
      <section id={styles.mainsection}>
        <div className={spinnerStyles.spinnerContainer}>
          <div className={spinnerStyles.spinner}></div>
          <p>読み込み中...</p>
        </div>
      </section>
    </main>
  );
  if (!user || !cartItems.length) return <p>カートが空です。</p>;

  const totalPrice = cartItems.reduce(
    (sum, item) => 
      sum + Math.round(item.price * (1 + TAX_RATE)) * item.quantity, 0
  );
  const shippingFee = totalPrice <= 1999 ? 1000 : totalPrice <= 4999 ? 500 : 0;
  const paymentTotal = totalPrice + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/checkout/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, cartItems }),
    });

    if (res.ok) {
      router.push("/checkout/confirm");
    } else {
      alert("エラーが発生しました");
    }
  };

  // 郵便番号入力時に自動検索
  const handlePostCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace("-", ""); // ハイフン除去
    setForm({ ...form, postCode: value });

    if (value.length === 7) {
      try {
        const res = await fetch(
          `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${value}`
        );
        const data = await res.json();

        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          setForm((prev) => ({
            ...prev,
            postCode: value,
            prefecture: result.address1,
            city: result.address2 + result.address3,
          }));
        } else {
          setErrors({ ...errors, postCode: "郵便番号に対応する住所が見つかりませんでした。" });
        }
      } catch (err) {
        console.error(err);
        setErrors({ ...errors, postCode: "住所検索に失敗しました。" });
      }
    }
  };

  return (
    <main id="maincontent">
      <h1>ご購入手続き</h1>
      <section id={styles.mainsection}>
        <div className={styles.items}>
          <table className={styles.cartTable}>
            <colgroup>
              <col style={{ width: "30%" }} />
              <col style={{ width: "40%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td className={styles.cartTd}>
                    <img 
                      src={`/img/item/${item.image}`} 
                      width="80" 
                      alt={item.name} 
                    />
                  </td>
                  <td className={styles.cartTd}>
                    {item.name}
                  </td>
                  <td className={styles.cartTd}>
                    {item.quantity}個
                  </td>
                  <td className={styles.cartTd}>
                    ¥{(Math.round(item.price * (1 + TAX_RATE)) * item.quantity).toLocaleString()}
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
        </div>

        <form onSubmit={handleSubmit}>
          <h2 className={styles.h2Title}>ご注文者情報</h2>
          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="lastName">
              姓
            </label>
            <input 
              className={styles.input} 
              type="text" 
              id="lastName" 
              name="lastName" 
              value={form.lastName} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="firstName">
              名
            </label>
            <input 
              className={styles.input}  
              type="text" 
              id="firstName" 
              name="firstName" 
              value={form.firstName} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="email">
              メールアドレス
            </label>
            <input 
              className={styles.input} 
              type="email" 
              id="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <h2 className={styles.h2Title}>配送先情報</h2>
          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="postCode">
              郵便番号
            </label>
            <input 
              className={styles.input} 
              type="text" 
              id="postCode" 
              name="postCode" 
              value={form.postCode} 
              onChange={handleChange} 
              onBlur={handlePostCodeChange} 
              required
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="prefecture">
              都道府県
            </label>
            <input 
              className={styles.input} 
              type="text" 
              id="prefecture" 
              name="prefecture" 
              value={form.prefecture} 
              onChange={handleChange} 
              required
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="city">
              市区町村
            </label>
            <input 
              className={styles.input} 
              type="text" 
              id="city" 
              name="city" 
              value={form.city} 
              onChange={handleChange} 
              required
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="street">
              番地
            </label>
            <input 
              className={styles.input} 
              type="text" 
              id="street" 
              name="street" 
              value={form.street} 
              onChange={handleChange} 
              required
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="building">
              建物名
            </label>
            <input 
              className={styles.input} 
              type="text" 
              id="building" 
              name="building" 
              value={form.building} 
              onChange={handleChange} 
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="phoneNumber">
              電話番号
            </label>
            <input 
              className={styles.input} 
              type="text" 
              id="phoneNumber" 
              name="phoneNumber" 
              value={form.phoneNumber} 
              onChange={handleChange} 
              required
            />
          </div>

          <h2 className={styles.h2Title}>決済方法</h2>
          <label>
            <input 
              className={styles.payment} 
              type="radio" 
              name="paymentMethod" 
              value="CREDIT" 
              checked={form.paymentMethod === "CREDIT"} 
              onChange={handleChange} 
            />
            クレジットカード
          </label>

          <div className={styles.buttomButton}>
            <a 
              href="/cart" 
              className={styles.backCart}
            >
              カートへ戻る
            </a>
            <button 
              type="submit" 
              className={styles.confirmButton}
            >
              確認画面へ
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}