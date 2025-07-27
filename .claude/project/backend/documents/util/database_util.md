# Database ユーティリティ

## 概要

データベース接続の設定と管理を行うユーティリティモジュールです。SQLAlchemyエンジンの初期化、セッション管理、テーブル作成機能を提供します。

## 主要機能

### データベース接続設定

**環境変数による設定**: 本番・開発環境の自動切り替え
- 環境判定: `ENV` 環境変数（`production` の場合は本番環境）
- 本番環境: `.env.production` ファイルを読み込み
- 開発環境: `.env` ファイルを読み込み（デフォルト）

**データベース接続パラメータ**:
- `DB_USER`: データベースユーザー名
- `DB_PASSWORD`: データベースパスワード
- `DB_HOST`: データベースホスト
- `DB_NAME`: データベース名
- 接続文字列: `mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}`

### SQLAlchemy エンジン設定

**engine**: データベースエンジンの作成
- 接続文字列: DATABASE_URL
- ドライバー: PyMySQL
- データベース: MySQL

**SessionLocal**: セッションファクトリー
- autocommit: False（手動コミット）
- autoflush: False（手動フラッシュ）
- bind: engine

### 主要関数

#### get_db()
**概要**: データベースセッションを提供する依存性注入関数
**戻り値**: `Session` - SQLAlchemyセッション
**用途**: FastAPI の Depends() で使用
**特徴**: 
- ジェネレータ関数（yield使用）
- 自動的にセッションをクローズ
- コンテキスト管理による安全なリソース管理

```python
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

#### create_tables()
**概要**: データベーステーブルを作成
**戻り値**: None
**用途**: アプリケーション初期化時のテーブル作成
**特徴**:
- Base.metadata.create_all() を使用
- 存在しないテーブルのみ作成（既存テーブルは保護）

```python
def create_tables():
    Base.metadata.create_all(bind=engine)
```

### 依存関係

**外部ライブラリ**:
- `sqlalchemy` - データベース ORM
- `dotenv` - 環境変数ファイル読み込み
- `os` - 環境変数取得

**内部依存**:
- `models/user.py` - Base モデル定義

### セキュリティ考慮事項

1. **環境変数使用**: ハードコードを避け、環境変数で接続情報を管理
2. **環境分離**: 本番・開発環境で異なる設定ファイルを使用
3. **設定ファイル管理**: `.env` ファイルをgitignoreで除外
4. **セッション管理**: 適切なリソース管理でメモリリークを防止

### 使用例

```python
# FastAPI エンドポイントでの使用
@app.get("/")
def read_users(db: Session = Depends(get_db)):
    # セッション使用
    users = db.query(User).all()
    return users
    # セッションは自動的にクローズされる
```

## ドキュメント更新履歴

- 2025-07-27: 環境変数による設定機能追加、セキュリティ考慮事項更新
- 2025-07-13: 初回作成