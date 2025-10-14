// app/checkout/complete/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../styles/complete.module.css";
import spinnerStyles from "../../styles/spinner.module.css";

export default function CompletePage() {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  // ログイン状態チェック
    const checkLogin = async () => {
      const res = await fetch("/api/auth/check");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      setIsAuthenticated(true);
    };
    checkLogin();

  // ローディング中（ログイン確認中）
  if (isAuthenticated === null) {
    return (
      <main id="maincontent">
        <div className={spinnerStyles.spinnerContainer}>
          <div className={spinnerStyles.spinner}></div>
          <p>読み込み中...</p>
        </div>
      </main>
    );
  }

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