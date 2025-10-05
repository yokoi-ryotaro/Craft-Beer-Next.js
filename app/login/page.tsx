// app/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../styles/login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const signupSuccess = searchParams.get("signup") === "success";
  const loginMessage = searchParams.get("message") === "please-login"; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/mypage"); // ログイン成功後はトップページへ
    } else {
      const data = await res.json();
      setErrorMessage(data.error || " メールアドレスまたはパスワードが正しくありません。");
    }
  };

  return (
    <main id={styles.maincontent}>
      <h1>ログイン</h1>
      <section id={styles.mainsection}>
        {signupSuccess && (
          <div className={styles.successMessage}>ユーザー登録が完了しました。ログインしてください。</div>
        )}
        {loginMessage && (
          <div className={styles.errorMessage}>ログインしてください。</div>
        )}
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label htmlFor="email">メールアドレス</label>
            <div className={styles.form}>
              <input
                type="email"
                id="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <label htmlFor="password">パスワード</label>
            <div className={styles.form}>
              <input
                type="password"
                id="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className={styles.loginButton}>
            ログイン
          </button>
        </form>
        <a className={styles.signup} href="/signup">
          アカウントを作成する
        </a>
      </section>
    </main>
  );
}