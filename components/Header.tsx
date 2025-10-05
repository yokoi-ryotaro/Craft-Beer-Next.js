"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <div className="logo">
            <Link href="/">
              <img src="/img/logo.png" alt="logo" />
            </Link>
          </div>
          <div className="site-name">
            <Link href="/">
              <h1>CRAFT BEER SHOP</h1>
            </Link>
          </div>
        </div>
        <div className="header-right">
          <nav className="header-links">
            <ul>
              <li><Link href="/">ホーム</Link></li>
              <li><Link href="/items">商品一覧</Link></li>
              <li><Link href="/cart">カート</Link></li>
              <li><Link href="/mypage">マイページ</Link></li>
              <li><Link href="/login">ログイン</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}