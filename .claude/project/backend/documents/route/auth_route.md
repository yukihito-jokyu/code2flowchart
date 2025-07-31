# Auth API ルーター

## 概要

Google OAuth2認証機能を提供するFastAPI ルーターです。Google アカウントを使用したログイン機能とJWTトークンベースの認証システムを実装しています。

## 主要な API の説明

### GET `/login` - Google OAuth ログイン画面表示

### API の概要
Google OAuth2ログイン画面へのリダイレクトを行います。

### 引数の型
なし

### 戻り値の型
`RedirectResponse` - Google認証画面へのリダイレクト

### 処理フロー
1. Google OAuth2 Flowを初期化（クライアントシークレット、スコープ、リダイレクトURIを使用）
2. 認証URLを生成（offline アクセス、増分認証スコープを設定）
3. Google認証画面にリダイレクト

### GET `/google-oauth/callback` - Google OAuth コールバック

### API の概要
Google OAuth認証後のコールバック処理を行い、ユーザー認証とJWTトークン発行を実行します。

### 引数の型
- `request: Request` - FastAPIリクエストオブジェクト（認可コード含む）
- `db: Session` - データベースセッション（依存性注入）

### 戻り値の型
- `RedirectResponse` - フロントエンドダッシュボードへのリダイレクト
- `JSONResponse` - エラー時のJSON応答（400）

### 処理フロー
1. クエリパラメータから認可コードを取得
2. 認可コードが存在しない場合、400エラーを返却
3. Google OAuth2 Flowを再生成
4. 認可コードを使用してアクセストークンとIDトークンを取得
5. IDトークンからユーザー情報（email、name）を抽出
6. メールアドレスでユーザーを検索
7. ユーザーが存在しない場合、ランダムパスワードを生成して新規ユーザーを作成
8. ユーザーUUIDを使用してJWTアクセストークンを生成
9. フロントエンドドメインにトークン、メール、ID、ユーザー名をクエリパラメータとして付与してリダイレクト

### 依存関係にあるファイル群

**外部ライブラリ**:
- `fastapi` - APIRouter, Depends, Request, RedirectResponse, JSONResponse
- `sqlalchemy.orm` - Session
- `google_auth_oauthlib.flow` - Flow
- `dotenv` - load_dotenv
- `os` - 環境変数取得

**内部モジュール**:
- `lib/auth/user_manager` - UserManager
- `lib/auth/utils` - create_access_token, get_id_info, generate_random_password
- `utils/database` - get_db
- `config/config` - SCOPES, GOOGLE_CLIENT_SECRET_FILE, REDIRECT_URI

**環境変数**:
- `FRONT_DOMAIN` - フロントエンドのドメインURL

## ドキュメント更新履歴

- 2025-07-31: Google OAuth2認証機能の実装内容を最新状態に更新