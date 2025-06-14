# CP Store 店舗管理画面

店舗がログインして使用する管理画面です。

## 技術スタック

- **Next.js 15** - React フレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **shadcn/ui** - UIコンポーネント
- **Docker** - コンテナ化

## 機能

- 店舗情報管理
- レビュー管理
- 統計情報表示

## 開発環境セットアップ

### Docker使用

```bash
# コンテナ起動
docker compose up -d

# アクセス
http://localhost:3001
```

### ローカル開発

```bash
cd src
npm install
npm run dev
```

## API連携

バックエンドAPI（cp-store-api）と連携します。

- API URL: `http://localhost:8080/api`
- 認証: JWT トークン
- 共通API: mobile アプリと共通
