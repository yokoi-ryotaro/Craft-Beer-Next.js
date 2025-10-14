// app/mypage/page.tsx
import { Suspense } from "react";
import MypagePageClient from "./MypagePageClient";
import styles from "../styles/mypage.module.css";
import spinnerStyles from "../styles/spinner.module.css";

export default function MypagePage() {
  return (
    <Suspense fallback={
      <main id="maincontent">
        <h1>マイページ</h1>
        <section id={styles.mainsection}>
          <div className={spinnerStyles.spinnerContainer}>
            <div className={spinnerStyles.spinner}></div>
            <p>読み込み中...</p>
          </div>
        </section>
      </main>
    }>
      <MypagePageClient />
    </Suspense>
  );
}