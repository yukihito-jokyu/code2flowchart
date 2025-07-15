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
│   ├── user.py                 # ユーザーモデル（SQLAlchemy）
│   └── project.py              # プロジェクトモデル（SQLAlchemy）
├── schemas/
│   ├── __init__.py
│   ├── auth.py                 # 認証用のPydanticスキーマ
│   └── project.py              # プロジェクト用のPydanticスキーマ
├── lib/
│   └── auth/
│       ├── __init__.py
│       ├── utils.py            # JWT生成、パスワードハッシュ化
│       ├── user_manager.py     # ユーザー管理機能
│       └── middleware.py       # 認証ミドルウェア
├── services/
│   ├── __init__.py
│   └── project_service.py      # プロジェクト管理ビジネスロジック
├── utils/
│   ├── __init__.py
│   └── database.py             # データベース接続設定
└── routes/
    ├── __init__.py
    ├── auth.py                 # 認証APIエンドポイント
    └── project.py              # プロジェクトAPIエンドポイント
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
- プロジェクトルーター (/api/projects) の統合
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

### プロジェクトエンドポイント

- `POST /api/projects/`: プロジェクト作成
- `GET /api/projects/`: プロジェクト一覧取得
- `GET /api/projects/{project_uuid}`: プロジェクト詳細取得
- `PUT /api/projects/{project_uuid}`: プロジェクト更新
- `DELETE /api/projects/{project_uuid}`: プロジェクト削除（ソフト削除）
- `POST /api/projects/{project_uuid}/restore`: プロジェクト復元
- `DELETE /api/projects/{project_uuid}/hard`: プロジェクト完全削除
- `GET /api/projects/deleted`: 削除済みプロジェクト一覧取得

## CORS 設定

- React 開発サーバー (http://localhost:5173) からのアクセスを許可
- 全メソッド、全ヘッダーを許可
- 認証情報の送信を許可

## Backend のドキュメント

### コーディング規約

- `.claude/project/backend/coding_role.md`

### モデル関連

- ユーザーモデルの設計
  - `.claude/project/backend/documents/model/user_model.md`
- プロジェクトモデルの設計
  - `.claude/project/backend/documents/model/project_model.md`
- プロジェクトコードモデルの設計
  - `.claude/project/backend/documents/model/project_code_model.md`

### スキーマ関連

- 認証スキーマの設計
  - `.claude/project/backend/documents/schema/auth_schema.md`
- プロジェクトスキーマの設計
  - `.claude/project/backend/documents/schema/project_schema.md`
- プロジェクトコードスキーマの設計
  - `.claude/project/backend/documents/schema/project_code_schema.md`

### API ルート関連

- 認証 API の実装
  - `.claude/project/backend/documents/route/auth_route.md`
- プロジェクト API の実装
  - `.claude/project/backend/documents/route/project_route.md`
- プロジェクトコード API の実装
  - `.claude/project/backend/documents/route/project_code_route.md`

### サービス関連

- プロジェクトサービスの実装
  - `.claude/project/backend/documents/service/project_service.md`
- プロジェクトコードサービスの実装
  - `.claude/project/backend/documents/service/project_code_service.md`

### ユーティリティ関連

- データベースユーティリティの実装
  - `.claude/project/backend/documents/util/database_util.md`
