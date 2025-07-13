# ファイル path

```
src/pages/login/
├── LoginPage.tsx
├── LoginPage.module.css
└── index.ts
```

# ページ の情報

## LoginPage

- ユーザーのログイン機能を提供するページ
- メールアドレスとパスワードによる認証
- ログイン成功時のリダイレクト機能
- 新規登録ページへのモダンなナビゲーション機能

- 依存関係にあるファイル
  - LoginForm (@/features/auth) - ログインフォームコンポーネント
  - react-router-dom (useNavigate) - ページナビゲーション
  - LoginPage.module.css - ページスタイル

## ナビゲーション機能

- **モダンなボタンデザイン**: ネオモーフィズムスタイルのナビゲーションボタン
- **視覚的フィードバック**: ホバー・アクティブ状態のアニメーション
- **ユーザビリティ**: 直感的なページ間遷移
