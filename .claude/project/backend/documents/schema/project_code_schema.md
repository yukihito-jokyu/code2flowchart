# ProjectCode Schema

## 概要

ProjectCode Schema は、プロジェクトレベルのコード管理機能におけるデータ検証とシリアライゼーションを担当するPydanticスキーマです。API のリクエスト・レスポンスデータの型安全性を保証します。

## 主要な schema の説明

### ProjectCodeBase

### schema の概要

プロジェクトコードの基本的な属性を定義する基底スキーマです。

### schema のアーキテクチャ

```python
class ProjectCodeBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="コードタイトル")
    code_content: str = Field(..., min_length=1, description="コード内容")
    language: str = Field(default="python", max_length=50, description="プログラミング言語")
    description: Optional[str] = Field(None, max_length=1000, description="コード説明")
```

### 依存関係にあるファイル群

- `models/project_code.py` - データベースモデル
- `routes/project_code.py` - API エンドポイント

### ProjectCodeCreate

### schema の概要

新しいプロジェクトコードを作成する際のリクエストデータを定義します。

### schema のアーキテクチャ

```python
class ProjectCodeCreate(ProjectCodeBase):
    project_uuid: str = Field(..., description="プロジェクトUUID")
```

### 依存関係にあるファイル群

- `routes/project_code.py` - 作成API エンドポイント
- `services/project_code_service.py` - 作成ビジネスロジック

### ProjectCodeUpdate

### schema の概要

プロジェクトコードの更新時に使用するリクエストデータを定義します。すべてのフィールドがオプショナルです。

### schema のアーキテクチャ

```python
class ProjectCodeUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255, description="コードタイトル")
    code_content: Optional[str] = Field(None, min_length=1, description="コード内容")
    language: Optional[str] = Field(None, max_length=50, description="プログラミング言語")
    description: Optional[str] = Field(None, max_length=1000, description="コード説明")
```

### 依存関係にあるファイル群

- `routes/project_code.py` - 更新API エンドポイント
- `services/project_code_service.py` - 更新ビジネスロジック

### ProjectCodeResponse

### schema の概要

API レスポンスで返されるプロジェクトコードの完全な情報を定義します。

### schema のアーキテクチャ

```python
class ProjectCodeResponse(ProjectCodeBase):
    uuid: str = Field(..., description="コードUUID")
    project_uuid: str = Field(..., description="プロジェクトUUID")
    is_deleted: bool = Field(..., description="削除フラグ")
    created_at: datetime = Field(..., description="作成日時")
    updated_at: datetime = Field(..., description="更新日時")
    
    class Config:
        from_attributes = True
```

### 依存関係にあるファイル群

- `routes/project_code.py` - 全APIエンドポイント
- `models/project_code.py` - データベースモデル

### ProjectCodeListResponse

### schema の概要

複数のプロジェクトコードを一覧取得する際のレスポンス構造を定義します。

### schema のアーキテクチャ

```python
class ProjectCodeListResponse(BaseModel):
    codes: list[ProjectCodeResponse] = Field(..., description="コードリスト")
    total: int = Field(..., description="総件数")
```

### 依存関係にあるファイル群

- `routes/project_code.py` - 一覧取得API エンドポイント
- `services/project_code_service.py` - 一覧取得ビジネスロジック

### ProjectCodeDeleteResponse

### schema の概要

プロジェクトコード削除時のレスポンス構造を定義します。

### schema のアーキテクチャ

```python
class ProjectCodeDeleteResponse(BaseModel):
    message: str = Field(..., description="削除完了メッセージ")
    uuid: str = Field(..., description="削除されたコードUUID")
```

### 依存関係にあるファイル群

- `routes/project_code.py` - 削除API エンドポイント
- `services/project_code_service.py` - 削除ビジネスロジック

## ドキュメント更新履歴

- 2024-01-XX: 初版作成 - ProjectCode スキーマの実装 (Issue #25)