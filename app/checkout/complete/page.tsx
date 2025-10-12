// app/checkout/complete/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../../styles/complete.module.css";

export default function CompletePage() {
  const [verified, setVerified] = useState<boolean | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        router.replace("/");
        return;
      }
      const res = await fetch(`/api/checkout/verify?token=${token}`);
      if (res.ok) {
        setVerified(true);
      } else {
        router.replace("/");
      }
    };
    verify();
  }, [token, router]);

  if (verified === null) {
    return (
      <main id="maincontent">
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
          <p>確認中...</p>
        </div>
      </main>
    );
  }

  return (
    <main id="maincontent">
      <section id={styles.mainsection}>
        <h1>ご注文ありがとうございました！</h1>
        <p>ご注文内容を確認の上、発送準備を進めさせていただきます。</p>
        <div className={styles.mypageButton}>
          <Link href="/mypage" className="button">
            マイページへ
          </Link>
        </div>
      </section>
    </main>
  );
}