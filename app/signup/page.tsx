// app/signup/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/signup.module.css";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    postCode: "",
    prefecture: "",
    city: "",
    street: "",
    building: "",
    phoneNumber: "",
    birthday: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // 郵便番号入力時に自動検索
  const handlePostCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace("-", ""); // ハイフン除去
    setForm({ ...form, postCode: value });

    if (value.length === 7) {
      try {
        const res = await fetch(
          `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${value}`
        );
        const data = await res.json();

        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          setForm((prev) => ({
            ...prev,
            postCode: value,
            prefecture: result.address1,
            city: result.address2 + result.address3,
          }));
        } else {
          setErrors({ ...errors, postCode: "郵便番号に対応する住所が見つかりませんでした。" });
        }
      } catch (err) {
        console.error(err);
        setErrors({ ...errors, postCode: "住所検索に失敗しました。" });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});


    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors(data.errors || { global: data.error || "登録に失敗しました" });
    } else {
      router.push("/login?signup=success");
    }
  };

  return (
    <main id="maincontent">
      <h1>ユーザー登録</h1>
      <section id={styles.mainsection} >
        <form onSubmit={handleSubmit}>

          <div className={styles.formRow}>
            <label htmlFor="email" className={styles.formRowLabel}>
              メールアドレス
              <span className={styles.required}>必須</span>
            </label>
            <div className={styles.form}>
              {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
              <input 
                className={styles.input}
                type="email" 
                id="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <label htmlFor="password" className={styles.formRowLabel}>
              パスワード
              <span className={styles.required}>必須</span>
            </label>
            <div className={styles.form}>
              {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
              <input 
                className={styles.input}
                type="password" 
                id="password" 
                value={form.password} 
                placeholder="8〜20文字で入力してください"
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <label htmlFor="lastName" className={styles.formRowLabel}>
              姓
              <span className={styles.required}>必須</span>
            </label>
            <div className={styles.form}>
              {errors.lastName && <p className={styles.errorMessage}>{errors.lastName}</p>}
              <input 
                className={styles.input}
                type="text" 
                id="lastName" 
                value={form.lastName} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <label htmlFor="firstName" className={styles.formRowLabel}>
              名
              <span className={styles.required}>必須</span>
            </label>
            <div className={styles.form}>
              {errors.firstName && <p className={styles.errorMessage}>{errors.firstName}</p>}
              <input 
                className={styles.input}
                type="text" 
                id="firstName" 
                value={form.firstName} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <label htmlFor="lastNameKana" className={styles.formRowLabel}>
              姓（かな）
            </label>
            <div className={styles.form}>
              <input
                className={styles.input}
                type="text" 
                id="lastNameKana" 
                value={form.lastNameKana} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <label htmlFor="firstNameKana" className={styles.formRowLabel}>
              名（かな）
            </label>
            <div className={styles.form}>
              <input
                className={styles.input} 
                type="text" 
                id="firstNameKana" 
                value={form.firstNameKana} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <label htmlFor="postCode" className={styles.formRowLabel}>
              郵便番号
              <span className={styles.required}>必須</span>
            </label>
            <div className={styles.form}>
              {errors.postCode && <p className={styles.errorMessage}>{errors.postCode}</p>}
              <input
                className={styles.input}
                type="text"
                id="postCode"
                value={form.postCode}
                onChange={handleChange}
                onBlur={handlePostCodeChange} // フォーカス外れたときに検索
                placeholder="例: 1500001"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <label htmlFor="prefecture" className={styles.formRowLabel}>
              都道府県
              <span className={styles.required}>必須</span>
            </label>
            <div className={styles.form}>
              {errors.prefecture && <p className={styles.errorMessage}>{errors.prefecture}</p>}
              <input
                className={styles.input}
                type="text"
                id="prefecture"
                value={form.prefecture}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <label htmlFor="city" className={styles.formRowLabel}>
              市区町村
              <span className={styles.required}>必須</span>
            </label>
            <div className={styles.form}>
              {errors.city && <p className={styles.errorMessage}>{errors.city}</p>}
              <input
                className={styles.input}
                type="text"
                id="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <label htmlFor="street" className={styles.formRowLabel}>
              番地
              <span className={styles.required}>必須</span>
            </label>
            <div className={styles.form}>
              {errors.street && <p className={styles.errorMessage}>{errors.street}</p>}
              <input 
                className={styles.input}
                type="text" 
                id="street" 
                value={form.street} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className={styles.formRow} >
            <label htmlFor="building" className={styles.formRowLabel}>
              建物名
            </label>
            <div className={styles.form}>
              <input 
                className={styles.input}
                type="text" 
                id="building" 
                value={form.building} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <label htmlFor="phoneNumber" className={styles.formRowLabel}>
              電話番号
              <span className={styles.required}>必須</span>
            </label>
            <div className={styles.form}>
              {errors.phoneNumber && <p className={styles.errorMessage}>{errors.phoneNumber}</p>}
              <input
                className={styles.input} 
                type="text" 
                id="phoneNumber" 
                value={form.phoneNumber} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <label htmlFor="birthday" className={styles.formRowLabel}>
              生年月日
            </label>
            <div className={styles.form}>
              <input 
                className={styles.input}
                type="date" 
                id="birthday" 
                value={form.birthday} 
                onChange={handleChange} 
              />  
            </div>
          </div>

          <button type="submit" className={styles.signupButton}>
            登録
          </button>
        </form>
      </section>
    </main>
  );
}