// app/items/page.tsx
import { Suspense } from "react";
import CartPageClient from "./CartPageClient";
import styles from "../styles/cart.module.css";

export default function CartPage() {
  return (
    <Suspense fallback={
      <main id="maincontent">
        <h1>ショッピングカート</h1>
        <section id={styles.mainsection}>
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
            <p>読み込み中...</p>
          </div>
        </section>
      </main>
    }>
      <CartPageClient />
    </Suspense>
  );
}