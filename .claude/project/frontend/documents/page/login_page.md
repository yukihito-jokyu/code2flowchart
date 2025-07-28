# ファイル path

```
src/pages/login/
├── LoginPage.tsx
├── LoginPage.module.css
└── index.ts
```

# ページ の情報

## LoginPage

- Google OAuth2によるログイン機能を提供するページ
- シンプルなレイアウトでLoginFormコンポーネントを表示
- カード形式のデザインでコンテンツを整理

- 依存関係にあるファイル
  - LoginForm (@/features/auth) - Google OAuth2ログインフォームコンポーネント
  - LoginPage.module.css - ページスタイル

- **ページ構造**
  ```typescript
  export const LoginPage = () => {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <LoginForm />
        </div>
      </div>
    );
  };
  ```

- **レイアウト特徴**
  - **コンテナ**: 中央配置のレイアウト
  - **カードデザイン**: フォームを囲むカード形式
  - **シンプル**: 必要最小限の要素で構成
