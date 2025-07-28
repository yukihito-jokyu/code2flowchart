# 認証ユーティリティ

## 概要

Google OAuth2認証システムで使用されるユーティリティ関数を提供するモジュールです。JWT トークン管理、Google OAuth2 認証、セキュアなパスワード生成機能を実装しています。

### 主要機能

#### JWT トークン管理
- **create_access_token(data: dict, expires_delta: Optional[timedelta] = None)**: JWT アクセストークンの生成（デフォルト30分有効）
- **verify_token(token: str) -> Optional[dict]**: JWT トークンの検証とペイロード取得

#### Google OAuth2 認証
- **get_id_info(id_token_str: str) -> dict**: Google ID トークンの検証とユーザー情報取得
  - Google の公開鍵と照合して安全に検証
  - CLIENT_ID との照合でオーディエンス検証
  - HTTPException(401) で無効なトークンをエラー処理

#### セキュアパスワード生成
- **generate_random_password(length: int = 16) -> str**: Google認証用のランダムパスワード生成
  - 英数字・記号を含む強固なパスワード
  - 最低8文字の制限（ValueError で検証）
  - 各文字種の必須含有を保証

### セキュリティ設定

- **SECRET_KEY**: JWT 署名用の32バイトランダムキー（secrets.token_urlsafe で生成）
- **ALGORITHM**: "HS256"（JWT 署名アルゴリズム）
- **ACCESS_TOKEN_EXPIRE_MINUTES**: 30分（アクセストークン有効期限）
- **CLIENT_ID**: Google OAuth2 クライアントID（環境変数から取得）

### 依存ライブラリ

- **jose**: JWT エンコード・デコード
- **google.oauth2**: Google OAuth2 ID トークン検証
- **google.auth.transport**: Google 認証リクエスト処理
- **fastapi**: HTTPException エラー処理
- **secrets**: 暗号学的に安全なランダム生成
- **string**: パスワード生成用文字セット
- **dotenv**: 環境変数読み込み