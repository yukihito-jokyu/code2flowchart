# ファイル path

```
src/features/auth/components/LoginForm.tsx
src/features/auth/components/LoginForm.module.css
```

# コンポーネントの情報

## LoginForm

- **コンポーネントの説明**
  - ユーザーログイン機能を提供するReactコンポーネント
  - メール・パスワード認証とGoogle OAuth2認証の両方をサポート
  - ニューモーフィズムデザインを採用した現代的なUI
  - フォームバリデーション、エラーハンドリング、ローディング状態管理を内蔵
  - 認証成功時の通知モーダル表示とページ遷移機能

- **依存関係にあるファイル**
  - `@/components` - NotificationModal
  - `@/hooks` - useNotification
  - `../hooks` - useLogin
  - `../utils` - validateLoginForm
  - `../types` - LoginFormData, LoginFormErrors
  - `react-router-dom` - useNavigate
  - `react` - useState

- **propsの型と説明**
  ```typescript
  interface LoginFormProps {
    onSuccess?: () => void;     // ログイン成功時のコールバック関数
    onSignupClick?: () => void; // 新規登録ボタンクリック時のコールバック関数
  }
  ```

- **主要機能**
  - **メール・パスワード認証**: 従来の認証方式
  - **Google OAuth2認証**: `${API_BASE_URL}/auth/login`へのリダイレクト
  - **リアルタイムバリデーション**: 入力時のエラー表示クリア
  - **ローディング状態**: 送信中のボタン無効化と表示切り替え
  - **エラーハンドリング**: APIエラーの表示
  - **成功通知**: NotificationModalを使用した成功メッセージ
  - **レスポンシブデザイン**: モバイル対応のレイアウト

- **デザイン特徴**
  - **ニューモーフィズム**: 立体的で現代的な視覚効果
  - **グラデーション**: 美しい色彩効果
  - **アニメーション**: ホバー・クリック時の滑らかな遷移
  - **アクセシビリティ**: 適切なラベルとフォーカス管理

- **状態管理**
  ```typescript
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});
  ```

- **環境変数**
  - `VITE_API_BASE_URL`: バックエンドAPIのベースURL（Google OAuth用）