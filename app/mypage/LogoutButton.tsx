// app/mypage/logout.tsx
"use client";

import { useRouter } from "next/navigation";
import styles from "../styles/mypage.module.css";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <button type="button" onClick={handleLogout} className={styles.logoutButton}>
      ログアウト
    </button>
  );
}