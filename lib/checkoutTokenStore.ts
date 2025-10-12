// /lib/checkoutTokenStore.ts

type TokenRecord = {
  userId: number;
  expiresAt: number; // 有効期限（ミリ秒）
};

class CheckoutTokenStore {
  private tokens = new Map<string, TokenRecord>();
  private ttl = 5 * 60 * 1000; // 有効期限: 5分（必要に応じて変更）

  // ✅ トークン登録
  add(token: string, userId: number) {
    const expiresAt = Date.now() + this.ttl;
    this.tokens.set(token, { userId, expiresAt });
  }

  // ✅ トークン検証（有効なら削除してtrue）
  verify(token: string): boolean {
    const record = this.tokens.get(token);
    if (!record) return false;

    if (Date.now() > record.expiresAt) {
      this.tokens.delete(token);
      return false;
    }

    this.tokens.delete(token); // 使い捨て
    return true;
  }
}

// ✅ シングルトンとしてエクスポート
export const checkoutTokenStore = new CheckoutTokenStore();