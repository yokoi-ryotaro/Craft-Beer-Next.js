// app/items/page.tsx
import { Suspense } from "react";
import ItemsPageClient from "./ItemsPageClient";
import styles from "../styles/items.module.css";

export default function ItemsPage() {
  return (
    <Suspense fallback={
      <main id="maincontent">
        <h1>商品一覧</h1>
        <section id={styles.mainsection}>
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
            <p>読み込み中...</p>
          </div>
        </section>
      </main>
    }>
      <ItemsPageClient />
    </Suspense>
  );
}