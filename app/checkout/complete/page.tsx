// app/checkout/complete/page.tsx
"use client";

import styles from "../../styles/complete.module.css";
import Link from "next/link";

export default function CompletePage() {
  return (
    <main id="maincontent">
      <section id={styles.mainsection}>
        <h1>ご注文ありがとうございました！</h1>
        <div className={styles.completeMassage}>
          <p>ご注文内容を確認の上、発送準備を進めさせていただきます。</p>
        </div>
        <div className={styles.mypageButton}>
          <Link href="/mypage" className="button">
            マイページへ
          </Link>
        </div>
      </section>
    </main>
  );
}