// app/items/[nameEnglish]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ItemDetail from "./ItemDetail";
import styles from "../../styles/itemDetail.module.css";

export default function ItemDetailPage() {
  const { nameEnglish } = useParams();
  const [item, setItem] = useState<any>(null);
  const [priceWithTax, setPriceWithTax] = useState<number | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      const res = await fetch(`/api/items/${nameEnglish}`);
      if (res.ok) {
        const data = await res.json();
        setItem(data.item);
        setPriceWithTax(data.priceWithTax);
      }
    };
    if (nameEnglish) fetchItem();
  }, [nameEnglish]);

  if (!item) return (
    <main id={styles.maincontent}>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
        <p>読み込み中...</p>
      </div>
    </main>
  );

  return <ItemDetail item={item} priceWithTax={priceWithTax!} />;
}