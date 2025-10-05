// app/items/page.tsx
import { Suspense } from "react";
import ItemsPageClient from "./ItemsPageClient";
import styles from "../styles/items.module.css";

export default function ItemsPage() {
  return (
    <Suspense fallback={
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
        <p>読み込み中...</p>
      </div>
    }>
      <ItemsPageClient />
    </Suspense>
  );
}