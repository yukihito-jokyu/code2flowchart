# ファイル path

```
dev/backend/
├── main.py                     # FastAPIアプリケーションのエントリーポイント
├── pyproject.toml              # プロジェクト設定と依存関係
├── models/
│   ├── __init__.py
│   └── user.py                 # ユーザーモデル（SQLAlchemy）
├── schemas/
│   ├── __init__.py
│   └── auth.py                 # 認証用のPydanticスキーマ
├── auth/
│   ├── __init__.py
│   ├── utils.py                # JWT生成、パスワードハッシュ化
│   ├── user_manager.py         # ユーザー管理機能
│   └── middleware.py           # 認証ミドルウェア
├── utils/
│   ├── __init__.py
│   └── database.py             # データベース接続設定
└── routes/
    ├── __init__.py
    └── auth.py                 # 認証APIエンドポイント
```

# 認証 API 実装

## 概要

FastAPI を使用した JWT 認証システムの実装。セッションベースの認証機能を提供し、フロントエンドの React アプリケーションと連携。

## 実装内容

### 認証エンドポイント

#### POST /api/auth/signup

- **機能**: 新規ユーザー登録
- **リクエスト**: `{ email: string, password: string }`
- **レスポンス**: `{ id: string, email: string, message: string }`
- **処理**:
  - メールアドレス重複チェック
  - パスワードの bcrypt ハッシュ化
  - UUID ベースのユーザー作成
  - MySQL データベースに保存

#### POST /api/auth/login

- **機能**: ユーザーログイン
- **リクエスト**: `{ email: string, password: string }`
- **レスポンス**: `{ id: string, email: string, token: string, message: string }`
- **処理**:
  - メールアドレスでユーザー検索
  - パスワード検証（bcrypt）
  - JWT アクセストークン生成（30 分有効期限）
  - ユーザー情報とトークンを返却

#### POST /api/auth/logout

- **機能**: ユーザーログアウト
- **ヘッダー**: `Authorization: Bearer <token>`
- **レスポンス**: `{ message: string }`
- **処理**:
  - JWT トークンの検証
  - トークンブラックリスト追加
  - セッション無効化

### 技術詳細

#### JWT 認証システム

- **ライブラリ**: python-jose[cryptography]
- **アルゴリズム**: HS256
- **有効期限**: 30 分
- **秘密鍵**: secrets.token_urlsafe(32)で生成
- **ブラックリスト**: メモリ内セット（本番環境では Redis 推奨）

#### パスワードセキュリティ

- **ハッシュ化**: bcrypt (passlib[bcrypt])
- **ソルト**: 自動生成
- **検証**: verify_password 関数で安全な比較

#### データベース連携

- **ORM**: SQLAlchemy 2.0.41
- **ドライバー**: PyMySQL 1.1.1
- **接続**: 既存の MySQL データベース（flowuser/flowpassword@localhost:3306/flow）
- **UUID**: Python 側で uuid.uuid4()生成

#### 認証ミドルウェア

- **HTTPBearer**: FastAPI のセキュリティスキーム使用
- **get_current_user**: 必須認証デコレータ
- **get_current_user_optional**: オプション認証デコレータ
- **トークン検証**: JWT デコード + ブラックリストチェック

### エラーハンドリング

- **400 Bad Request**: 既存ユーザー登録、バリデーション エラー
- **401 Unauthorized**: 認証失敗、無効なトークン
- **500 Internal Server Error**: データベースエラー、システムエラー

### セキュリティ対策

- **CORS 設定**: React 開発サーバー（localhost:5173）のみ許可
- **パスワード強度**: フロントエンドで 8 文字以上を強制
- **JWT 有効期限**: 30 分で自動失効
- **トークンブラックリスト**: ログアウト時の即座無効化

### 依存関係

```toml
dependencies = [
    "fastapi>=0.115.12",
    "email-validator>=2.2.0",
    "passlib[bcrypt]>=1.7.4",
    "pymysql>=1.1.1",
    "python-jose[cryptography]>=3.5.0",
    "python-multipart>=0.0.20",
    "sqlalchemy>=2.0.41",
    "uvicorn>=0.34.2",
]
```
