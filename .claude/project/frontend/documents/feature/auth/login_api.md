# ファイル path

```
src/features/auth/api/auth.ts
```

# 関数の情報

## signup

- 機能
  - 新規ユーザー登録を行う

- 呼び出している api
  - POST /auth/signup

- 引数の型
  - data: SignupRequest

- 戻り値の型
  - Promise<SignupResponse>

- 依存関係にあるファイル
  - ../types

## login

- 機能
  - ユーザーのログイン認証を行う
  - メールアドレスとパスワードでの認証処理

- 呼び出している api
  - POST /auth/login

- 引数の型
  - data: LoginRequest
    - email: string - ユーザーのメールアドレス
    - password: string - ユーザーのパスワード

- 戻り値の型
  - Promise<LoginResponse>
    - id: string - ユーザー ID
    - email: string - ユーザーのメールアドレス
    - token: string - 認証トークン
    - message: string - レスポンスメッセージ

- 依存関係にあるファイル
  - ../types

## logout

- 機能
  - ユーザーのログアウト処理を行う
  - サーバー側でセッションを無効化

- 呼び出している api
  - POST /auth/logout

- 引数の型
  - なし（認証ヘッダーのみ）

- 戻り値の型
  - Promise<LogoutResponse>

- 依存関係にあるファイル
  - ../types

# APIクライアント設定

## 環境変数設定
- `VITE_API_BASE_URL`: APIベースURL
- Viteの環境変数として管理

## Axiosインスタンス設定
- baseURL: 環境変数から取得
- Content-Type: application/json

## エラーハンドリング
- レスポンスインターセプターで統一的なエラー処理
- エラーレスポンスから `detail` または `message` を抽出
- ネットワークエラー時の適切なメッセージ

## 認証ヘッダー
- `getAuthHeaders` 関数でJWTトークンを取得
- localStorage から `authToken` を取得して Authorization ヘッダーに設定
- ログアウト時のみ認証ヘッダーを使用
