# ファイル path

```
src/features/auth/
├── components/
│   ├── LoginForm.tsx
│   ├── LoginForm.module.css
│   └── index.ts
├── hooks/
│   └── index.ts
├── types/
│   ├── auth.ts
│   └── index.ts
└── index.ts
```

# 機能の情報

## Auth Feature (認証機能)

- Google OAuth2による認証機能を提供
- シンプルなワンクリック認証システム
- モダンなボタンデザインによるユーザーインターフェース

- 依存関係にあるファイル

  - react-router-dom (ルーティング)
  - React 19 hooks

- 機能の説明
  - **Component 層**: LoginForm コンポーネント（Google OAuth2認証ボタン）
  - **Types 層**: TypeScript 型定義による型安全性
