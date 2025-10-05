// app/items/[nameEnglish]/ItemDetail.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/itemDetail.module.css";

type Item = {
  id: number;
  name: string;
  nameEnglish: string;
  image: string;
  price: number;
  stock: number;
  isSoldOut: boolean;
  country: { name: string };
  abv: number;
  volume: number;
  itemDetails: string;
};

export default function ItemDetail({
  item,
  priceWithTax,
}: {
  item: Item;
  priceWithTax: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQuantity = () => setQuantity((q) => Math.min(item.stock, q + 1));

  const addToCart = async () => {
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: item.id,
        quantity,
      }),
    });

    if (res.status === 401) {
      alert("ログインしてください");
      return;
    }

    if (res.ok) {
      alert(`${item.name} を ${quantity}個 カートに追加しました！`);
      router.push("/cart");
    } else {
      alert("カートに追加できませんでした。もう一度お試しください。");
    }
  };

  return (
    <main id={styles.maincontent}>
      <section id={styles.mainsection}>
        {/* 左カラム */}
        <div className={styles.itemLeft}>
          <div className={styles.itemImg}>
            <img 
              src={`/img/item/${item.image}`} 
              alt={item.name} 
            />
          </div>
        </div>

        {/* 右カラム */}
        <div className={styles.itemRight}>
          <div className={styles.itemInfo}>
            <div className={styles.itemName}>
              <h1>{item.name}</h1>
            </div>

            <div className={styles.itemPrice}>
              <div className={styles.tax}>
                税込 :
              </div>
              <div className={styles.priceWithTax}>
                ¥{priceWithTax.toLocaleString()}
              </div>
            </div>

            <div className={styles.stock}>
              {item.isSoldOut && 
              <p className={styles.soldOut}>× 売り切れ</p>}
            </div>

            <div className={styles.itemDetails}>
              <p>原産国 : {item.country?.name}</p>
              <p>アルコール分 : {item.abv}%</p>
              <p>容量 : {item.volume}ml</p>
            </div>

            <div className={styles.description}>
              <p>{item.itemDetails}</p>
            </div>

            {!item.isSoldOut && (
              <>
                <div className={styles.quantityArea}>
                  <div className={styles.quantity}>
                    数量
                  </div>
                  <div className={styles.quantityButton}>
                    <button
                      type="button"
                      id={styles.decreaseQuantity}
                      onClick={decreaseQuantity}
                    >
                      ー
                    </button>
                    <input
                      type="number"
                      id={styles.quantity}
                      name="quantity"
                      value={quantity}
                      min={1}
                      max={item.stock}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                    <button
                      type="button"
                      id={styles.increaseQuantity}
                      onClick={increaseQuantity}
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.addToCartBtn}
                  onClick={addToCart}
                >
                  カートに追加
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}