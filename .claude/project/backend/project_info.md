# Backend プロジェクト情報

## 概要

FastAPI と uvicorn を使用した Python バックエンドプロジェクトです。

## 技術スタック

- **フレームワーク**: FastAPI (>=0.115.12)
- **Web サーバー**: uvicorn (>=0.34.2)
- **パッケージ管理**: uv
- **Python 要件**: >=3.11

## プロジェクト構造

```
dev/backend/
├── README.md (空ファイル)
├── main.py
├── pyproject.toml
└── uv.lock
```

## メインファイル詳細

### pyproject.toml

- プロジェクト名: "backend"
- バージョン: "0.1.0"
- 開発サーバー起動スクリプト: `uv run start` (uvicorn main:app --reload)

### main.py

- FastAPI アプリケーションのエントリーポイント
- CORS 設定で React (localhost:5173) からのアクセスを許可
- API エンドポイント: `/api/hello` (Hello from FastAPI!メッセージを返却)

## 開発コマンド

```bash
# 開発サーバー起動
uv run start

# または直接
uv run uvicorn main:app --reload
```

## API エンドポイント

- `GET /api/hello`: テスト用の hello メッセージを返却

## CORS 設定

- React 開発サーバー (http://localhost:5173) からのアクセスを許可
- 全メソッド、全ヘッダーを許可
- 認証情報の送信を許可

## Backend のドキュメント

- database の setup について
  - `.claude/project/backend/documents/database_setup.md`
- データベーススキーマ設計について
  - `.claude/project/backend/documents/database_schema.md`
