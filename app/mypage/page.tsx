// app/mypage/page.tsx
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "../styles/mypage.module.css";

const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // 月は0始まり
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
};

export default async function MypagePage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { firstName: true, lastName: true }, 
  });

  if (!dbUser) {
    redirect("/login");
  }

  const fullName = `${dbUser.lastName} ${dbUser.firstName}`;

  const orders = await prisma.order.findMany({
    where: { userId: sessionUser.id },
    include: { orderItems: { include: { item: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main id="maincontent">
      <h1>マイページ</h1>
      <section className={styles.mainsection}>
        <p>ようこそ、{fullName} さん！</p>
        <h2 className={styles.h2}>ご注文履歴</h2>
        <div>
          {orders.length === 0 ? (
            <>
            <div className={styles.orderEmpty}>
              <div className={styles.orderEmptyMessage}>
                <p>注文履歴がありません。</p>
              </div>
              <div className={styles.shopping}>
                <Link href="/items" className={styles.button}>買い物を続ける</Link>
              </div>
            </div>
            </>
          ) : (
            orders.map((order) => (
              <div key={order.id} className={styles.orders}>
                <div className={styles.orderHeader}>
                  <div className={styles.headerInner}>
                    <div className={styles.headerLeft}>
                      <div className={styles.headerItem}>
                        <li className={styles.headerList}>
                          <div className={styles.headerRow}>
                            <span className={styles.sizeMini}>注文日</span>
                          </div>
                          <div className={styles.headerRow}>
                            <span>{formatDate(new Date(order.createdAt!))}</span>
                          </div>
                        </li>
                      </div>
                      <div className={styles.headerItem}>
                        <li className={styles.headerList}>
                          <div className={styles.headerRow}>
                            <span className={styles.sizeMini}>合計</span>
                          </div>
                          <div className={styles.headerRow}>
                            <span>¥{order.paymentTotal.toLocaleString()}</span>円
                          </div>
                        </li>
                      </div>
                    </div>
                    <div className="headerRight">
                      <div className={styles.headerItem}>
                        <li className={styles.headerList}>
                          <div className={styles.headerRow}>
                            <span className={styles.sizeMini}>注文番号 {order.id}</span>
                          </div>
                          <div className={styles.headerRow}>
                            <Link href={`/mypage/orders/${order.id}`} className={styles.orderDetails}>
                              注文内容を表示
                            </Link>
                          </div>
                        </li>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.orderFooter}>
                  <div className={styles.footerInner}>
                    <div className={styles.orderItem}>
                      <div className={styles.itemInner}>
                        {order.orderItems.map((oi) => (
                        <li key={oi.id}>
                          <div className={styles.img}>
                            <img src={`/img/item/${oi.item.image}`} width="80" />
                          </div>
                          <div className={styles.name}>
                            <Link href={`/items/${oi.item.nameEnglish}`} className={styles.itemName}>
                              {oi.item.name}
                            </Link>
                          </div>
                          <div className={styles.quantity}>
                            <p>{oi.quantity}個</p>
                          </div>
                        </li>
                        ))}
                      </div>
                    </div>
                    <div className={styles.orderButton}>
                      <div className={styles.aButton}>
                        <Link href={`/mypage/orders/${order.id}`} className={styles.sizeMini}>
                          配送状況を確認
                        </Link>
                      </div>
                    </div>
                  </div> 
                </div>
              </div>
            ))
          )}
        </div>
        <div className="pass">
          <Link href="/mypage/change-password" className={styles.changePass}>
            ▲▼パスワードの変更はこちら▼▲
          </Link>
        </div>
        <LogoutButton />
      </section>
    </main>
  );
}