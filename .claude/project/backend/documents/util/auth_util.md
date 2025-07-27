# 認証ユーティリティ

## 概要

認証システムで使用される各種ユーティリティ関数を提供するモジュールです。パスワードハッシュ化、JWT トークン管理、Google OAuth2 認証、セキュアなパスワード生成機能を実装しています。

### 主要機能

#### パスワード管理
- **verify_password(plain_password: str, hashed_password: str) -> bool**: 平文パスワードとハッシュ化パスワードの照合
- **get_password_hash(password: str) -> str**: bcrypt を使用したパスワードのハッシュ化
- **generate_random_password(length: int = 16) -> str**: 英数字・記号を含む安全なランダムパスワード生成

#### JWT トークン管理
- **create_access_token(data: dict, expires_delta: Optional[timedelta] = None)**: JWT アクセストークンの生成（デフォルト30分有効）
- **verify_token(token: str) -> Optional[dict]**: JWT トークンの検証とペイロード取得
- **blacklist_token(token: str)**: トークンをブラックリストに追加（ログアウト処理）

#### Google OAuth2 認証
- **get_id_info(id_token_str: str) -> dict**: Google ID トークンの検証とユーザー情報取得

### セキュリティ設定

- **SECRET_KEY**: JWT 署名用の32バイトランダムキー（secrets.token_urlsafe で生成）
- **ALGORITHM**: "HS256"（JWT 署名アルゴリズム）
- **ACCESS_TOKEN_EXPIRE_MINUTES**: 30分（アクセストークン有効期限）
- **blacklisted_tokens**: メモリ内トークンブラックリスト（本番環境では Redis 推奨）

### 依存ライブラリ

- **passlib**: bcrypt パスワードハッシュ化
- **jose**: JWT エンコード・デコード
- **google.oauth2**: Google OAuth2 認証
- **secrets**: 暗号学的に安全なランダム生成
- **string**: パスワード生成用文字セット

## ドキュメント更新履歴

- 2025-07-27: 初回作成