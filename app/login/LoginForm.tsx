// app/login/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../styles/login.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const signupSuccess = searchParams.get("signup") === "success";
  const loginMessage = searchParams.get("message") === "please-login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Cookie をブラウザに保持
      });

      if (res.ok) {
        // ログイン成功 → マイページに遷移
        router.push("/mypage");
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "メールアドレスまたはパスワードが正しくありません。");
      }
    } catch (err) {
      setErrorMessage("通信エラーが発生しました。再度お試しください。");
      console.error(err);
    }
  };

  return (
    <main id={styles.maincontent}>
      <h1>ログイン</h1>
      <section id={styles.mainsection}>
        {signupSuccess && <div className={styles.successMessage}>ユーザー登録が完了しました。ログインしてください。</div>}
        {loginMessage && <div className={styles.errorMessage}>ログインしてください。</div>}
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label htmlFor="email">メールアドレス</label>
            <div className={styles.form}>
              <input type="email" id="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className={styles.formRow}>
            <label htmlFor="password">パスワード</label>
            <div className={styles.form}>
              <input type="password" id="password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className={styles.loginButton}>ログイン</button>
        </form>
        <a className={styles.signup} href="/signup">アカウントを作成する</a>
      </section>
    </main>
  );
}