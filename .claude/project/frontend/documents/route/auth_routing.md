# ファイル path

```
src/routes/
├── config.ts
└── index.ts
src/main.tsx (RouterProvider統合)
```

# ルーティングの情報

## Auth Routing (認証関連ルーティング)

- ルーティングと参照しているコンポーネント

  - `/` → App コンポーネント (ホームページ)
  - `/signup` → SignupPage コンポーネント (新規登録ページ)

- 依存関係にあるファイル
  - react-router-dom (CreateBrowserRouter, RouterProvider)
  - pages/signup/SignupPage
  - sections/App/App
- ルーティング設定の特徴
  - **実装方式**: CreateBrowserRouter 使用
  - **統合方法**: main.tsx で RouterProvider 直接使用
  - **構成**: Component 形式でコンポーネント参照 (JSX 記法なし)
  - **拡張性**: config.ts で設定を集約管理
