// app/cart/CartItemRow.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../styles/cart.module.css";

type Item = {
  id: number;
  name: string | null;
  nameEnglish: string | null;
  image?: string | null;
  price?: number | null;
};

type CartItem = {
  id: number;
  cartId: number;
  itemId: number;
  quantity: number;
  item: Item;
};

export default function CartItemRow({ cartItem }: { cartItem: CartItem }) {
  const [quantity, setQuantity] = useState<number>(cartItem.quantity);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateQty = async (newQty: number) => {
    if (newQty < 1) return;
    setLoading(true);
    const res = await fetch("/api/cart/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: cartItem.itemId, quantity: newQty }),
    });
    setLoading(false);
    if (res.ok) {
      setQuantity(newQty);
      router.refresh(); // サーバー版 page を再フェッチして合計等を更新
    } else {
      // エラー処理
      console.error("update failed");
    }
  };

  const deleteItem = async () => {
    if (!confirm("本当に削除しますか？")) return;
    setLoading(true);
    const res = await fetch("/api/cart/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: cartItem.itemId }),
    });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      console.error("delete failed");
    }
  };

  return (
    <tr className={styles.cartRow}>
      <td>
        <Link href={`/items/${cartItem.item.nameEnglish}`} className={styles.itemImage}>
          <img src={`/img/item/${cartItem.item.image ?? "noimg.png"}`} width="100" />
        </Link>
      </td>
      <td>
        <Link href={`/items/${cartItem.item.nameEnglish}`} className={styles.itemName}>
          {cartItem.item.name}
        </Link>
      </td>
      <td>
        <div className={styles.quantityButton}>
          <button onClick={() => updateQty(quantity - 1)} disabled={loading || quantity <= 1}>ー</button>
          <input
            className={styles.quantity}
            type="number"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(Number(e.target.value))}
            onBlur={() => updateQty(quantity)}
            disabled={loading}
          />
          <button onClick={() => updateQty(quantity + 1)} disabled={loading}>＋</button>
        </div>
      </td>
      <td>
        <div className={styles.delete}>
          <button onClick={deleteItem} disabled={loading}>削除</button>
        </div>
      </td>
      <td>¥{Math.round((cartItem.item.price ?? 0) * (1.1) * quantity).toLocaleString()}</td>
    </tr>
  );
}