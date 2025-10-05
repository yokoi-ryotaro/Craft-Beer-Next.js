"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="question">
            <Link href="/">よくあるご質問</Link>
          </div>
        </div>
        <div className="footer-right">
          <nav className="footer-links">
            <ul>
              <li><Link href="/">会社情報</Link></li>
              <li><Link href="/">利用規約</Link></li>
              <li><Link href="/">プライバシーポリシー</Link></li>
              <li><Link href="/">お問い合せ</Link></li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="sns">
        <ul>
          <li>
            <Link href="/">
              <img src="/img/sns/X.png" alt="X"/>
            </Link>
          </li>
          <li>
            <Link href="/">
              <img src="/img/sns/Instagram.png" alt="Instagram"/>
            </Link>
          </li>
          <li>
            <Link href="/">
              <img src="/img/sns/Facebook.png" alt="Facebook"/>
            </Link>
          </li>
        </ul>
      </div>
      <div className="copyright">
        <p>&copy; 2025 クラフトビールECサイト</p>
      </div>
    </footer>
  );
}