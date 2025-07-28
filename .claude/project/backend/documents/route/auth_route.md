# Auth API ルーター

## 概要

Google OAuth2認証機能を提供するFastAPI ルーターです。Google アカウントを使用したログイン機能とJWTトークンベースの認証システムを実装します。

## 主要な API の説明

### API の名前
Auth Router - `/auth`

### API の概要
Google OAuth2認証に関する以下の機能を提供するRESTful APIエンドポイント群：
- Google OAuth2認証（Google アカウントログイン）
- 自動ユーザー作成・管理
- JWTトークン発行とフロントエンドリダイレクト

### エンドポイント詳細

#### 1. GET `/login` - Google OAuth ログイン画面表示
**概要**: Google OAuth2ログイン画面へのリダイレクト
**認証**: 不要（パブリックエンドポイント）
**引数の型**: なし
**戻り値の型**: `RedirectResponse`
**処理フロー**:
1. Google OAuth2 Flowを初期化
2. Google認証URLを生成
3. Google認証画面にリダイレクト
**特徴**:
- Google OAuth2認証フローの開始
- クライアントシークレットファイルを使用
- スコープとリダイレクトURIを設定

#### 2. GET `/google-oauth/callback` - Google OAuth コールバック
**概要**: Google OAuth認証後のコールバック処理
**認証**: 不要（Google OAuth処理）
**引数の型**:
- `request: Request` - リクエストオブジェクト（認可コード含む）
- `db: Session` - データベースセッション（依存性注入）
**戻り値の型**: `RedirectResponse`
**エラー**: 
- 400 - 認可コードが見つからない場合
- 401 - 無効なIDトークン
**処理フロー**:
1. 認可コードを取得
2. アクセストークンとIDトークンを取得
3. IDトークンからユーザー情報を抽出
4. ユーザーが存在しない場合は自動作成
5. JWTトークンを生成
6. フロントエンドにトークンと共にリダイレクト
**特徴**:
- Google認証情報の検証
- 新規ユーザーの自動作成
- ランダムパスワード生成（Google認証用）
- ダッシュボードへのリダイレクト

### セキュリティ機能

1. **Google OAuth2認証**: 
   - Googleの公開鍵による安全なIDトークン検証
   - 認証プロバイダーによる信頼性の高い認証

2. **JWT認証**:
   - アクセストークンの生成と検証
   - トークンベースの認証システム

3. **自動パスワード生成**:
   - Google認証用のランダムパスワード生成
   - 英数字・記号を含む強固なパスワード

4. **重複チェック**:
   - メールアドレスの重複防止
   - ユニークユーザー制約

### 認証フロー

1. **Google認証開始**: `/login` → Google認証画面へリダイレクト
2. **Google認証**: ユーザーがGoogle認証を完了
3. **コールバック処理**: `/google-oauth/callback` → IDトークン検証 → ユーザー作成/取得
4. **JWTトークン発行**: アクセストークン生成
5. **フロントエンドリダイレクト**: ダッシュボードにトークンと共にリダイレクト

### エラーハンドリング

- **400 Bad Request**: 認可コード不在
- **401 Unauthorized**: 無効なIDトークン

### 依存関係にあるファイル群

- `fastapi` - APIRouter, Depends, Request
- `fastapi.responses` - RedirectResponse, JSONResponse
- `sqlalchemy.orm` - Session
- `google_auth_oauthlib.flow` - Flow（Google OAuth2処理）
- `lib/auth/user_manager` - UserManager
- `lib/auth/utils` - create_access_token, get_id_info, generate_random_password
- `utils/database` - get_db
- `config/config` - SCOPES, GOOGLE_CLIENT_SECRET_FILE, REDIRECT_URI
- `dotenv` - 環境変数読み込み