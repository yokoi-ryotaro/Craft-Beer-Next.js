// app/login/page.tsx
"use client";

import { Suspense } from "react";
import LoginForm from "./LoginForm";
import styles from "../styles/login.module.css";
import spinnerStyles from "../styles/spinner.module.css";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main id="maincontent">
        <h1>ログイン</h1>
        <section id={styles.mainsection}>
          <div className={spinnerStyles.spinnerContainer}>
            <div className={spinnerStyles.spinner}></div>
            <p>読み込み中...</p>
          </div>
        </section>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}