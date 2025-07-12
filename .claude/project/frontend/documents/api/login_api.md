# ファイル path

```
src/features/auth/api/auth.ts
```

# 関数の情報

## login

- ユーザーのログイン認証を行うAPI関数
- メールアドレスとパスワードでの認証処理

- 呼び出している api
  - POST /api/auth/login - バックエンドのログインエンドポイント

- 引数
  - data: LoginRequest
    - email: string - ユーザーのメールアドレス
    - password: string - ユーザーのパスワード

- 戻り値
  - Promise<LoginResponse>
    - id: string - ユーザーID
    - email: string - ユーザーのメールアドレス
    - token: string - 認証トークン
    - message: string - レスポンスメッセージ