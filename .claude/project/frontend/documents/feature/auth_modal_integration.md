# ファイル path

```
src/features/auth/
├ components/
│   ├ LoginForm.tsx          # モーダル統合済みログインフォーム
│   └ SignupForm.tsx         # モーダル統合済みサインアップフォーム
├ hooks/
│   ├ useLogin.ts            # Redux統合ログインフック
│   ├ useSignup.ts           # サインアップフック
│   ├ useLogout.ts           # Redux統合ログアウトフック
│   └ useAuth.ts             # Redux selector統合認証フック

src/pages/logout/
├ LogoutPage.tsx             # モーダル統合済みログアウトページ
└ LogoutPage.module.css

src/components/Modal/         # モーダルシステム
src/hooks/useNotification.ts  # 通知管理フック
```

# コンポーネントの情報

## 認証フロー統合機能

- Redux 状態管理とモーダル通知を統合した完全な認証システム
- ユーザーフレンドリーな通知とスムーズなページ遷移を実現
- アラートをモダンなモーダルに完全置換

- 依存関係にあるファイル

### ログインフロー

1. **LoginForm**:

   - フォーム送信 → Redux dispatch (loginStart)
   - API 成功 → Redux dispatch (loginSuccess) + ローカルストレージ保存
   - 成功モーダル表示 → 確認後ダッシュボードリダイレクト

2. **useLogin Hook**:
   - Redux actions: `loginStart`, `loginSuccess`, `loginFailure`
   - エラーハンドリング: フォーム内エラー表示

### サインアップフロー

1. **SignupForm**:
   - フォーム送信 → API 通信
   - 成功モーダル表示 → 確認後ログインページリダイレクト
   - 自動ログインは行わず、明示的なログインを促進

### ログアウトフロー

1. **LogoutPage**:
   - 確認画面 → ユーザー情報表示
   - ログアウト実行 → Redux dispatch (logout) + API 通信
   - 成功モーダル表示 → 確認後ログインページリダイレクト

### Redux 統合

- **状態管理**: 全認証状態を Redux で一元管理
- **永続化**: ローカルストレージとの自動同期
- **復元**: アプリ起動時の認証状態復元

### モーダル通知システム

- **成功通知**: 緑色のグラデーション、チェックアイコン
- **エラー通知**: 赤色のグラデーション、エラーアイコン
- **カスタムアクション**: 確認ボタンでのページ遷移

- plops の説明

従来の alert()を完全に廃止し、視覚的に美しく機能的なモーダル通知システムを導入。ユーザー体験を大幅に向上させ、モダンな Web アプリケーションの標準に準拠。
