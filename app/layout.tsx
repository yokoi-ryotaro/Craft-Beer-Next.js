import type { Metadata } from "next";
import "./styles/ress.css";
import "./styles/common.css";
import "./styles/header.css";
import "./styles/footer.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CRAFT BEER SHOP",
  description: "クラフトビールECサイト",
  icons: { icon: "/img/logo.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}