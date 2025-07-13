# ファイル path

```
src/stores/
├ auth/
│   ├ types.ts          # 状態の型を定義するファイル
│   ├ slice.ts          # スライスを定義するファイル  
│   └ selectors.ts      # セレクタを定義するファイル
├ services/             # API 通信用（将来拡張用）
├ rootReducer.ts        # リデューサーを一つにまとめるファイル
├ store.ts              # アプリケーション全体のストアを作成するファイル
└ index.ts              # エクスポート用のファイル
```

# ストア の情報

## Redux状態管理アーキテクチャ

- Redux Toolkitを使用したモダンな状態管理システム
- ローカルドキュメントで定義されたディレクトリ構造に完全準拠
- 機能別にsliceを分離し、型安全性とメンテナンス性を確保

- 保持している情報の説明

### 認証ストア (auth)
- **User**: ユーザー情報（id, email）
- **isAuthenticated**: 認証状態（boolean）
- **isLoading**: ローディング状態（boolean）
- **ローカルストレージ連携**: 認証情報の永続化

### Actions
- **loginStart**: ログイン開始
- **loginSuccess**: ログイン成功（ユーザー情報とトークン保存）
- **loginFailure**: ログイン失敗
- **logout**: ログアウト（全データ削除）
- **restoreAuth**: 認証状態復元（アプリ起動時）
- **setLoading**: ローディング状態設定

### Selectors
- **selectAuth**: 認証状態全体を取得
- **selectUser**: ユーザー情報を取得
- **selectIsAuthenticated**: 認証状態を取得
- **selectIsLoading**: ローディング状態を取得