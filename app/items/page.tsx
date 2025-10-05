// app/items/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../styles/items.module.css";

type Item = {
  id: number;
  name: string;
  nameEnglish: string;
  price: number;
  image: string;
  stock: number;
};

type Country = {
  id: number;
  name: string;
};

export default function ItemsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true); // ← ローディング状態
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 12;
  const [countries, setCountries] = useState<Country[]>([]);

  const TAX_RATE = 0.1; // 10%消費税

  // フォーム値
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [price, setPrice] = useState(searchParams.get("price") || "");
  const [country, setCountry] = useState(searchParams.get("country") || "");
  const [abv, setAbv] = useState(searchParams.get("abv") || "");
  const [volume, setVolume] = useState(searchParams.get("volume") || "");
  const [inStock, setInStock] = useState(searchParams.get("inStock") === "true");
  const [sort, setSort] = useState(searchParams.get("sort") || "");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true); // ← 読み込み開始
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          keyword,
          price,
          country,
          abv,
          volume,
          inStock: inStock ? "true" : "",
          sort,
        });

        const res = await fetch(`/api/items?${params.toString()}`);
        const data = await res.json();
        setItems(data.items);
        setTotal(data.total);
      } finally {
        setLoading(false); // ← 読み込み終了
      }
    };

    fetchItems();
  }, [page, keyword, price, country, abv, volume, inStock, sort]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("/api/countries");
        const data = await res.json();
        setCountries(data);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };
    fetchCountries();
  }, []);

  const totalPages = Math.ceil(total / pageSize);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      keyword,
      price,
      country,
      abv,
      volume,
      inStock: inStock ? "true" : "",
      sort,
      page: "1",
    });
    router.push(`/items?${params.toString()}`);
  };

  return (
    <main  id={styles.maincontent}>
      <h1>商品一覧</h1>
      <section id={styles.mainsection}>
        {/* 左カラム：検索フォーム */}
        <div className={styles.sectionLeft}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="商品名を検索"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <div className={styles.filterGroup}>
              <h3>価格帯</h3>
              <select 
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
              >
                <option value="">指定なし</option>
                <option value="0-999">〜999円</option>
                <option value="1000-2999">1,000〜2,999円</option>
                <option value="3000-">3,000円〜</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <h3>原産国</h3>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">指定なし</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <h3>アルコール分</h3>
              <select 
                value={abv} 
                onChange={(e) => setAbv(e.target.value)}
              >
                <option value="">指定なし</option>
                <option value="0-5.0">〜5.0%</option>
                <option value="5.1-7.5">5.1〜7.5%</option>
                <option value="7.6-10.0">7.6〜10.0%</option>
                <option value="10.1-">10.1%〜</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <h3>容量</h3>
              <select 
                value={volume} 
                onChange={(e) => setVolume(e.target.value)} 
              >
                <option value="">指定なし</option>
                <option value="0-350">〜350ml</option>
                <option value="351-500">351〜500ml</option>
                <option value="501-750">501〜750ml</option>
                <option value="751-">751ml〜</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <h3>在庫状況</h3>
              <label>
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                />{" "}
                在庫あり
              </label>
            </div>
            <button
              type="button"
              id="clearButton"
              onClick={() => {
                // フォームの状態を初期化
                setKeyword("");
                setPrice("");
                setCountry("");
                setAbv("");
                setVolume("");
                setInStock(false);
                // 検索結果をリセット（1ページ目に遷移）
                router.push("/items?page=1");
              }}
            >
              すべてクリア
            </button>
            <button type="submit">
              検索
            </button>
          </form>
        </div>

        {/* 右カラム：商品一覧 */}
        <div className={styles.sectionRight}>
          {/* 並び替え */}
          <div className={styles.sortContainer}>
            <label>並び替え：</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">新着順</option>
              <option value="price_desc">価格が高い順</option>
              <option value="price_asc">価格が安い順</option>
              <option value="salesCount_desc">人気順</option>
            </select>
          </div>

          {/* 商品一覧 */}
          {loading ? (
            <div className={styles.spinnerContainer}>
              <div className={styles.spinner}></div>
              <p>読み込み中...</p>
            </div>
          ) : items.length === 0 ? (
            <div className={styles.noResultsMessage}>
              <p>商品が見つかりませんでした。</p>
            </div>
          ) : (
            <div className={styles.gridContainer}>
              {items.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/items/${item.nameEnglish}`} 
                  className={styles.itemCard}
                >
                  <div className={styles.itemDetails}>
                    <img 
                      src={`/img/item/${item.image}`} 
                      alt={item.name}
                    />
                    <h3>{item.name}</h3>
                    <p>¥{Math.floor(item.price * (1 + TAX_RATE)).toLocaleString()}</p>
                    <p>{item.stock > 0 ? "○ 在庫あり" : "× 売り切れ"}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ページネーション */}
          {page && totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                disabled={page === 1}
                onClick={() => router.push(`/items?page=${page - 1}`)}
              >
                ＜
              </button>
              <span>
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => router.push(`/items?page=${page + 1}`)}
              >
                ＞
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}