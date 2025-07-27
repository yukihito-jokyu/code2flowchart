# ProjectCode Route

## 概要

ProjectCode Route は、プロジェクトレベルのコード管理機能におけるREST API エンドポイントを提供します。CRUD操作を通じて、ノードと紐づかない独立したコードの管理を行います。

## 主要な API の説明

### create_project_code

### API の概要

新しいプロジェクトコードを作成します。

### 引数の型

```python
project_code: ProjectCodeCreate
current_user: User = Depends(get_current_user)
db: Session = Depends(get_db)
```

### 戻り値の型

```python
ProjectCodeResponse
```

### 依存関係にあるファイル群

- `schemas/project_code.py` - ProjectCodeCreate, ProjectCodeResponse
- `services/project_code_service.py` - ProjectCodeService.create_project_code
- `lib/auth/middleware.py` - get_current_user

### get_project_codes

### API の概要

指定されたプロジェクトのコード一覧を取得します（ページネーション対応）。

### 引数の型

```python
project_uuid: str
skip: int = Query(0, ge=0, description="スキップ件数")
limit: int = Query(100, ge=1, le=1000, description="取得件数")
current_user: User = Depends(get_current_user)
db: Session = Depends(get_db)
```

### 戻り値の型

```python
ProjectCodeListResponse
```

### 依存関係にあるファイル群

- `schemas/project_code.py` - ProjectCodeListResponse
- `services/project_code_service.py` - ProjectCodeService.get_project_codes_by_project
- `lib/auth/middleware.py` - get_current_user

### get_project_code

### API の概要

指定されたUUIDのプロジェクトコード詳細を取得します。

### 引数の型

```python
code_uuid: str
current_user: User = Depends(get_current_user)
db: Session = Depends(get_db)
```

### 戻り値の型

```python
ProjectCodeResponse
```

### 依存関係にあるファイル群

- `schemas/project_code.py` - ProjectCodeResponse
- `services/project_code_service.py` - ProjectCodeService.get_project_code_by_uuid
- `lib/auth/middleware.py` - get_current_user

### update_project_code

### API の概要

指定されたUUIDのプロジェクトコードを更新します。

### 引数の型

```python
code_uuid: str
project_code_update: ProjectCodeUpdate
current_user: User = Depends(get_current_user)
db: Session = Depends(get_db)
```

### 戻り値の型

```python
ProjectCodeResponse
```

### 依存関係にあるファイル群

- `schemas/project_code.py` - ProjectCodeUpdate, ProjectCodeResponse
- `services/project_code_service.py` - ProjectCodeService.update_project_code
- `lib/auth/middleware.py` - get_current_user

### delete_project_code

### API の概要

指定されたUUIDのプロジェクトコードをソフトデリートします。

### 引数の型

```python
code_uuid: str
current_user: User = Depends(get_current_user)
db: Session = Depends(get_db)
```

### 戻り値の型

```python
ProjectCodeDeleteResponse
```

### 依存関係にあるファイル群

- `schemas/project_code.py` - ProjectCodeDeleteResponse
- `services/project_code_service.py` - ProjectCodeService.soft_delete_project_code
- `lib/auth/middleware.py` - get_current_user

## API エンドポイント

| メソッド | エンドポイント | 機能 |
|---------|----------------|------|
| POST | `/api/project-codes/make` | プロジェクトコード作成 |
| GET | `/api/project-codes/project/{project_uuid}` | プロジェクトコード一覧取得 |
| GET | `/api/project-codes/{code_uuid}` | プロジェクトコード詳細取得 |
| PUT | `/api/project-codes/{code_uuid}` | プロジェクトコード更新 |
| DELETE | `/api/project-codes/{code_uuid}` | プロジェクトコード削除 |

## 認証・認可

すべてのエンドポイントは JWT Bearer トークンによる認証が必要です。ユーザーは自身のプロジェクトに関連するコードのみアクセス可能です。

## エラーハンドリング

- 400: バリデーションエラー
- 401: 認証エラー
- 403: 認可エラー
- 404: リソースが見つからない
- 500: サーバーエラー

## ドキュメント更新履歴

- 2025-07-27: 最新実装に合わせて更新（エンドポイントパス修正）
- 2024-01-XX: 初版作成 - ProjectCode Route の実装 (Issue #25)