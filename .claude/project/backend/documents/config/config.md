# アプリケーション設定

## 概要

Google OAuth2 認証に関する設定定数を管理するモジュールです。Google Cloud Console で設定したクライアント認証情報とリダイレクト URI を定義しています。

### 設定項目

#### ディレクトリ設定
- **APP_DIR**: アプリケーションソースのルートディレクトリ（`Path(__file__).resolve().parent.parent`）

#### Google OAuth2 設定
- **GOOGLE_CLIENT_SECRET_FILE**: Google Client Secret JSON ファイルのパス
  - 配置場所: `config/api_keys/client_secret.json`
  - Google Cloud Console からダウンロードした認証情報ファイル

#### OAuth2 フロー設定
- **REDIRECT_URI**: 認証後のリダイレクト先 URI
  - 値: `"http://localhost:8000/api/auth/google-oauth/callback"`
  - Google Cloud Console の「承認済みのリダイレクト URI」と一致する必要がある

#### 認可スコープ
- **SCOPES**: 要求する認可スコープのリスト
  - `"openid"`: OpenID Connect 認証
  - `"https://www.googleapis.com/auth/userinfo.email"`: メールアドレス取得
  - `"https://www.googleapis.com/auth/userinfo.profile"`: プロフィール情報取得

### セキュリティ考慮事項

- **client_secret.json**: 機密情報のため Git 管理対象外
- **リダイレクト URI**: Google Cloud Console で事前に許可リストに登録必須
- **スコープ制限**: 最小権限の原則に従い必要最小限のスコープのみ要求

### 依存ライブラリ

- **pathlib.Path**: ファイルパス操作

## ドキュメント更新履歴

- 2025-07-27: 初回作成