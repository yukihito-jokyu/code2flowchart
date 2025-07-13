# Auth API ルーター

## 概要

ユーザー認証機能を提供するFastAPI ルーターです。ユーザー登録、ログイン、ログアウト機能と、JWTトークンベースの認証システムを実装します。

## 主要な API の説明

### API の名前
Auth Router - `/api/auth`

### API の概要
ユーザー認証に関する以下の機能を提供するRESTful APIエンドポイント群：
- ユーザー新規登録
- ユーザーログイン（JWT トークン発行）
- ユーザーログアウト（トークン無効化）
- パスワードハッシュ化とトークン管理

### エンドポイント詳細

#### 1. POST `/signup` - ユーザー新規登録
**概要**: 新しいユーザーアカウントを作成
**認証**: 不要（パブリックエンドポイント）
**引数の型**:
- `signup_data: SignupRequest` - 登録データ（メール、パスワード）
- `db: Session` - データベースセッション（依存性注入）
**戻り値の型**: `SignupResponse`
**エラー**: 
- 400 - 既存ユーザーが存在する場合
- 500 - ユーザー作成失敗
**特徴**:
- メールアドレスの重複チェック
- パスワードの自動ハッシュ化
- ユーザーUUID自動生成

#### 2. POST `/login` - ユーザーログイン
**概要**: ユーザー認証とJWTトークン発行
**認証**: 不要（パブリックエンドポイント）
**引数の型**:
- `login_data: LoginRequest` - ログインデータ（メール、パスワード）
- `db: Session` - データベースセッション（依存性注入）
**戻り値の型**: `LoginResponse`
**エラー**: 
- 401 - メールアドレスまたはパスワードが不正
**特徴**:
- メール・パスワード認証
- JWTアクセストークン生成
- ユーザー情報と共にトークンを返却

#### 3. POST `/logout` - ユーザーログアウト
**概要**: ユーザーセッション終了とトークン無効化
**認証**: 必須（JWT認証）
**引数の型**:
- `credentials: HTTPAuthorizationCredentials` - Authorizationヘッダー（依存性注入）
- `current_user: User` - 認証されたユーザー（依存性注入）
**戻り値の型**: `LogoutResponse`
**特徴**:
- トークンをブラックリストに追加
- セキュアなセッション終了

### セキュリティ機能

1. **パスワードハッシュ化**: 
   - bcryptによる安全なパスワードハッシュ化
   - 平文パスワードは保存しない

2. **JWT認証**:
   - アクセストークンの生成と検証
   - トークンベースの認証システム

3. **トークン無効化**:
   - ログアウト時のトークンブラックリスト機能
   - セキュアなセッション管理

4. **重複チェック**:
   - メールアドレスの重複防止
   - ユニークユーザー制約

### 認証フロー

1. **登録**: メール・パスワード → パスワードハッシュ化 → ユーザー作成
2. **ログイン**: メール・パスワード → 認証 → JWTトークン発行
3. **API利用**: Authorizationヘッダーでトークン送信 → トークン検証 → API実行
4. **ログアウト**: トークンをブラックリストに追加 → セッション終了

### エラーハンドリング

- **400 Bad Request**: 既存ユーザー登録試行
- **401 Unauthorized**: 認証失敗
- **500 Internal Server Error**: サーバー内部エラー

### 依存関係にあるファイル群

- `fastapi` - APIRouter, Depends, HTTPException, status
- `fastapi.security` - HTTPAuthorizationCredentials
- `sqlalchemy.orm.Session` - データベースセッション
- `schemas/auth.py` - 全認証スキーマ
- `lib/auth/user_manager.py` - UserManagerクラス
- `lib/auth/utils.py` - create_access_token, blacklist_token関数
- `lib/auth/middleware.py` - get_current_user, security関数
- `utils/database.py` - get_db関数
- `models/user.py` - Userモデル

## ドキュメント更新履歴

- 2025-07-13: 初回作成