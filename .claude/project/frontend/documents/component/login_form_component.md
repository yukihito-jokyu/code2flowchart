# ファイル path

```
src/features/auth/components/LoginForm.tsx
src/features/auth/components/LoginForm.module.css
```

# コンポーネントの情報

## LoginForm

- **コンポーネントの説明**
  - Google OAuth2による認証機能を提供するReactコンポーネント
  - シンプルなワンクリック認証を実現
  - モダンなボタンデザインによる直感的なUI

- **依存関係にあるファイル**
  - `react` - React基本機能

- **propsの型と説明**
  ```typescript
  // propsは使用されていません
  ```

- **主要機能**
  - **Google OAuth2認証**: `${API_BASE_URL}/auth/login`へのリダイレクト
  - **ワンクリック認証**: 複雑なフォーム入力不要

- **コンポーネント構造**
  ```typescript
  export const LoginForm = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const handleGoogleLogin = () => {
      window.location.href = `${API_BASE_URL}/auth/login`;
    };

    return (
      <div className={styles.form}>
        <h2 className={styles.title}>ログイン</h2>
        <p className={styles.description}>
          Googleアカウントでログインしてください
        </p>
        
        <div className={styles.submitField}>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className={styles.googleButton}
          >
            Googleでログイン
          </button>
        </div>
      </div>
    );
  };
  ```

- **環境変数**
  - `VITE_API_BASE_URL`: バックエンドAPIのベースURL（Google OAuth用）