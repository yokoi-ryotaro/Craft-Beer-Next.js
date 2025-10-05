// app/mypage/change-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../../styles/password.module.css";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("新しいパスワードが一致しません。");
      return;
    }

    const res = await fetch("/api/mypage/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (res.ok) {
      setSuccessMessage("パスワードを変更しました。");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      const data = await res.json();
      setMessage(data.error || "パスワード変更に失敗しました。");
    }
  };

  return (
    <main id="maincontent">
      <h1>パスワード変更</h1>
      <section id={styles.mainsection}>
        <div className={styles.successMessage}>
          {successMessage && <p>{successMessage}</p>}
        </div>
        <div className={styles.errorMessage}>
          {errorMessage && <p>{errorMessage}</p>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}> 
            <label>現在のパスワード</label>
            <input
              className={styles.input}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.formRow}>
            <label>新しいパスワード</label>
            <input
              className={styles.input}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.formRow}>
            <label>新しいパスワード（確認）</label>
            <input
              className={styles.input}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.changeButton}>
            変更する
          </button>
        </form>
        <div className={styles.backMypage}>
					<Link href="/mypage" className={styles.back}>
            戻る
          </Link>
				</div>
      </section>
      
    </main>
  );
}