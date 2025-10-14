// app/items/page.tsx
import { Suspense } from "react";
import CartPageClient from "./CartPageClient";
import styles from "../styles/cart.module.css";
import spinnerStyles from "../styles/spinner.module.css";

export default function CartPage() {
  return (
    <Suspense fallback={
      <main id="maincontent">
        <h1>ショッピングカート</h1>
        <section id={styles.mainsection}>
          <div className={spinnerStyles.spinnerContainer}>
            <div className={spinnerStyles.spinner}></div>
            <p>読み込み中...</p>
          </div>
        </section>
      </main>
    }>
      <CartPageClient />
    </Suspense>
  );
}