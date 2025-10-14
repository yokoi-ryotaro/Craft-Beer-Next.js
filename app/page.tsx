"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./styles/top.css";
import spinnerStyles from "./styles/spinner.module.css";

type Item = {
  id: number;
  name: string;
  nameEnglish: string;
  image: string;
};

export default function HomePage() {
  const [newItems, setNewItems] = useState<Item[]>([]);
  const [bestSellers, setBestSellers] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const newSwiperRef = useRef<any>(null);
  const bestSwiperRef = useRef<any>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/top");
        const data = await res.json();
        setNewItems(data.newItems);
        setBestSellers(data.bestSellers);
      } catch (err) {
        console.error("Failed to fetch items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // データ更新後に自動再生開始
  useEffect(() => {
    if (newSwiperRef.current && newSwiperRef.current.autoplay) {
      newSwiperRef.current.autoplay.start();
    }
  }, [newItems]);

  useEffect(() => {
    if (bestSwiperRef.current && bestSwiperRef.current.autoplay) {
      bestSwiperRef.current.autoplay.start();
    }
  }, [bestSellers]);

  return (
    <main id="maincontent">
      {/* メインビジュアル */}
      <div id="mainvisual">
        <img src="/img/mainvisual.jpg" alt="mainvisual" />
      </div>

      {/* 新着商品 */}
      <div className="collection">
        <div className="collection-title">
          <h2 className="title_h2">
            <Link href="/items">NEW!!</Link>
          </h2>
          <div className="collection_description">
            <p>新着商品</p>
          </div>
        </div>
        <div className="swiper-area">
          {loading ? (
            <div className={spinnerStyles.spinnerContainer}>
              <div className={spinnerStyles.spinner}></div>
              <p>読み込み中...</p>
            </div>
          ) : (
            <Swiper
              onSwiper={(swiper) => (newSwiperRef.current = swiper)}
              className="new"
              modules={[Navigation, Autoplay]}
              slidesPerView="auto"
              centeredSlides={true}
              navigation
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              speed={800}
              grabCursor={true}
              loop={true}
            >
              {newItems.map((item) => (
                <SwiperSlide key={item.id}>
                  <Link href={`/items/${item.nameEnglish}`}>
                    <div className="slide">
                      <div className="slide-media">
                        <img src={`/img/item/${item.image}`} alt={item.name} />
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        <div className="collection_all">
          <Link href="/items" className="button">
            すべてを見る
          </Link>
        </div>
      </div>

      {/* 人気商品 */}
      <div className="collection">
        <div className="collection-title">
          <h2 className="title_h2">
            <Link href="/items?sort=salesCount_desc">Best Sellers</Link>
          </h2>
          <div className="collection_description">
            <p>人気商品</p>
          </div>
        </div>
        <div className="swiper-area">
          {loading ? (
            <div className={spinnerStyles.spinnerContainer}>
              <div className={spinnerStyles.spinner}></div>
              <p>読み込み中...</p>
            </div>
          ) : (
            <Swiper
              onSwiper={(swiper) => (bestSwiperRef.current = swiper)}
              className="best"
              modules={[Navigation, Autoplay]}
              slidesPerView="auto"
              centeredSlides={true}
              navigation
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              speed={800}
              grabCursor={true}
              loop={true}
            >
              {bestSellers.map((item) => (
                <SwiperSlide key={item.id}>
                  <Link href={`/items/${item.nameEnglish}`}>
                    <div className="slide">
                      <div className="slide-media">
                        <img src={`/img/item/${item.image}`} alt={item.name} />
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        <div className="collection_all">
          <Link href="/items?sort=salesCount_desc" className="button">
            すべてを見る
          </Link>
        </div>
      </div>
    </main>
  );
}