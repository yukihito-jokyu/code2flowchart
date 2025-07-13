# Backend プロジェクト情報

## 概要

FastAPI と uvicorn を使用した Python バックエンドプロジェクトです。

## 技術スタック

- **フレームワーク**: FastAPI (>=0.115.12)
- **Web サーバー**: uvicorn (>=0.34.2)
- **認証**: JWT (python-jose[cryptography] >=3.5.0)
- **パスワードハッシュ化**: bcrypt (passlib[bcrypt] >=1.7.4)
- **データベース**: SQLAlchemy (>=2.0.41), PyMySQL (>=1.1.1)
- **バリデーション**: Pydantic, email-validator (>=2.2.0)
- **パッケージ管理**: uv
- **Python 要件**: >=3.11

## プロジェクト構造

```
dev/backend/
├── README.md (空ファイル)
├── main.py
├── pyproject.toml
├── uv.lock
├── models/
│   ├── __init__.py
│   └── user.py                 # ユーザーモデル（SQLAlchemy）
├── schemas/
│   ├── __init__.py
│   └── auth.py                 # 認証用のPydanticスキーマ
├── lib/
│   └── auth/
│       ├── __init__.py
│       ├── utils.py            # JWT生成、パスワードハッシュ化
│       ├── user_manager.py     # ユーザー管理機能
│       └── middleware.py       # 認証ミドルウェア
├── utils/
│   ├── __init__.py
│   └── database.py             # データベース接続設定
└── routes/
    ├── __init__.py
    └── auth.py                 # 認証APIエンドポイント
```

## メインファイル詳細

### pyproject.toml

- プロジェクト名: "backend"
- バージョン: "0.1.0"
- 開発サーバー起動スクリプト: `uv run start` (uvicorn main:app --reload)

### main.py

- FastAPI アプリケーションのエントリーポイント
- CORS 設定で React (localhost:5173) からのアクセスを許可
- 認証ルーター (/api/auth) の統合
- データベーステーブルの自動作成
- API エンドポイント: `/api/hello` (Hello from FastAPI!メッセージを返却)

## 開発コマンド

```bash
# 開発サーバー起動
uv run start

# または直接
uv run uvicorn main:app --reload
```

## API エンドポイント

### 基本エンドポイント

- `GET /api/hello`: テスト用の hello メッセージを返却

### 認証エンドポイント

- `POST /api/auth/signup`: 新規ユーザー登録
- `POST /api/auth/login`: ユーザーログイン（JWT トークン発行）
- `POST /api/auth/logout`: ユーザーログアウト（トークン無効化）

## CORS 設定

- React 開発サーバー (http://localhost:5173) からのアクセスを許可
- 全メソッド、全ヘッダーを許可
- 認証情報の送信を許可

## Backend のドキュメント

### データベース関連

- database の setup について
  - `.claude/project/backend/documents/database_setup.md`
- データベーススキーマ設計について
  - `.claude/project/backend/documents/database_schema.md`

### 認証システム関連

- 認証 API 実装の詳細
  - `.claude/project/backend/documents/auth_api_implementation.md`
- ユーザー管理システムの設計
  - `.claude/project/backend/documents/user_management_system.md`
- JWT 認証システムの実装
  - `.claude/project/backend/documents/jwt_authentication_system.md`
- API セキュリティの実装
  - `.claude/project/backend/documents/api_security_implementation.md`

### プロジェクト関連

- プロジェクト管理システム実装
  - `.claude/project/backend/documents/project_management_system.md`

### 認証システム構造変更

- 認証ディレクトリ構造変更とバグ修正 (Issue #19)
  - `.claude/project/backend/documents/auth_directory_restructure.md`
