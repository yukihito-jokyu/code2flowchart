# ファイル path

```
src/features/auth/
├── api/
│   ├── auth.ts
│   └── index.ts
├── components/
│   ├── LoginForm.tsx
│   ├── LoginForm.module.css
│   ├── SignupForm.tsx
│   ├── SignupForm.module.css
│   └── index.ts
├── hooks/
│   ├── useLogin.ts
│   ├── useSignup.ts
│   └── index.ts
├── types/
│   ├── auth.ts
│   └── index.ts
├── utils/
│   ├── validation.ts
│   └── index.ts
└── index.ts
```

# 機能の情報

## Auth Feature (認証機能)

- メール・パスワードによるユーザー新規登録・ログイン機能を提供
- フォームバリデーション、API通信、エラーハンドリングを統合
- メタリックなデザインのUIコンポーネント
- トークンベースの認証システム
- モダンなナビゲーションボタンによるページ間遷移

- 依存関係にあるファイル
  - axios (HTTP通信)
  - react-router-dom (ルーティング)
  - React 19 hooks (useState, useEffect)

- 機能の説明
  - **API層**: 新規登録・ログインエンドポイントとの通信
  - **Component層**: SignupForm・LoginFormコンポーネント（メタリックデザイン + ナビゲーション機能）
  - **Hook層**: 新規登録・ログイン処理のビジネスロジック
  - **Types層**: TypeScript型定義による型安全性
  - **Utils層**: フォームバリデーション関数

## ナビゲーション機能

### デザインの特徴
- **ネオモーフィズムスタイル**: 立体的で現代的なボタンデザイン
- **アニメーション効果**: ホバー時のシャイン・エフェクトとシャドウ変化
- **視覚的区切り**: 「または」の区切り線でナビゲーション領域を明確化
- **レスポンシブ**: スムーズなトランジションとインタラクション

### ユーザーフロー
- **ログインページ**: 新規登録ページへの遷移ボタン
- **新規登録ページ**: ログインページへの遷移ボタン
- **成功時の自動リダイレクト**: 新規登録完了後はログインページへ自動遷移