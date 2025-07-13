# プロジェクト管理システム実装

## 概要

プロジェクト管理機能は、ユーザーがプロジェクトの作成、編集、削除、復元を行える機能です。ソフトデリート機能により、誤削除からの復旧が可能な設計となっています。

## アーキテクチャ

### データベース設計

#### Project モデル

```python
class Project(Base):
    __tablename__ = "projects"

    uuid = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_uuid = Column(String(36), ForeignKey("users.uuid"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    is_deleted = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
```

**主要フィールド**:

- `uuid`: プロジェクト固有識別子
- `user_uuid`: プロジェクト所有者
- `name`: プロジェクト名（必須、最大 100 文字）
- `description`: プロジェクト説明（任意、テキスト）
- `is_deleted`: ソフトデリートフラグ
- `created_at`, `updated_at`: タイムスタンプ

### サービス層（ProjectService）

#### 主要メソッド

**プロジェクト作成**

```python
def create_project(db: Session, project_data: ProjectCreate, user_uuid: str) -> Project
```

**プロジェクト取得**

```python
def get_project_by_uuid(db: Session, project_uuid: str, user_uuid: str) -> Optional[Project]
def get_projects_by_user(db: Session, user_uuid: str, skip: int = 0, limit: int = 100) -> List[Project]
```

**ソフトデリート機能**

```python
def soft_delete_project(db: Session, project_uuid: str, user_uuid: str) -> bool
def restore_project(db: Session, project_uuid: str, user_uuid: str) -> bool
def hard_delete_project(db: Session, project_uuid: str, user_uuid: str) -> bool
```

#### ソフトデリートの実装

- **ソフトデリート**: `is_deleted = True`に設定
- **復元**: `is_deleted = False`に設定
- **ハードデリート**: データベースから物理削除

すべてのクエリで`is_deleted = False`条件を自動適用し、削除済みプロジェクトを除外します。

### API エンドポイント

#### 基本 CRUD 操作

- `POST /api/projects/` - プロジェクト作成
- `GET /api/projects/` - アクティブプロジェクト一覧
- `GET /api/projects/{uuid}` - プロジェクト詳細
- `PUT /api/projects/{uuid}` - プロジェクト更新
- `DELETE /api/projects/{uuid}` - ソフトデリート

#### 削除管理

- `GET /api/projects/deleted` - 削除済みプロジェクト一覧
- `POST /api/projects/{uuid}/restore` - プロジェクト復元
- `DELETE /api/projects/{uuid}/hard` - 完全削除

### 認証・認可

#### JWT 認証

- すべての API エンドポイントに JWT 認証が必要
- 認証ミドルウェア（`get_current_user`）で実装

#### アクセス制御

- ユーザーは自分が所有するプロジェクトのみアクセス可能
- `user_uuid`によるフィルタリングで実現

### スキーマ設計

#### リクエストスキーマ

```python
class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)

class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)
```

#### レスポンススキーマ

```python
class ProjectResponse(BaseModel):
    uuid: str
    user_uuid: str
    name: str
    description: Optional[str]
    is_deleted: bool
    created_at: datetime
    updated_at: datetime

class ProjectListResponse(BaseModel):
    projects: list[ProjectResponse]
    total: int
```

### エラーハンドリング

#### HTTP ステータスコード

- `200`: 成功
- `201`: 作成成功
- `404`: プロジェクトが見つからない
- `401`: 認証エラー
- `403`: アクセス権限なし
- `500`: サーバーエラー

#### エラーレスポンス

```json
{
  "detail": "エラーメッセージ"
}
```

### パフォーマンス最適化

#### インデックス設計

- `user_uuid`: ユーザー別プロジェクト検索用
- `is_deleted`: ソフトデリートフィルタリング用
- `created_at`: ソート用

#### ページネーション

- `skip`と`limit`パラメータによるオフセットベースページネーション
- デフォルト: limit=100

### セキュリティ考慮事項

#### データ保護

- UUID による予測困難な識別子
- ユーザー間データ分離
- ソフトデリートによるデータ保護

#### 入力検証

- Pydantic による型検証
- 文字列長制限
- SQL インジェクション対策（SQLAlchemy ORM 使用）

## 実装ファイル

### バックエンド構成

```
dev/backend/
├── models/project.py          # Projectモデル定義
├── schemas/project.py         # Pydanticスキーマ
├── services/project_service.py # ビジネスロジック
├── routes/project.py          # APIエンドポイント
└── main.py                    # ルーター統合
```

### 依存関係

- FastAPI: Web フレームワーク
- SQLAlchemy: ORM
- Pydantic: データ検証
- python-jose: JWT 認証

## データベースマイグレーション

### 既存データベースの更新

1. `users`テーブルに`is_deleted`カラム追加
2. `projects`テーブルの新規作成（`is_deleted`カラム含む）
3. インデックスの作成

### SQL 実行例

```sql
-- usersテーブル更新
ALTER TABLE users ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD INDEX idx_is_deleted (is_deleted);

-- projectsテーブル作成
CREATE TABLE projects (
    uuid CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_uuid CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_uuid (user_uuid),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_uuid) REFERENCES users(uuid)
);
```

## 今後の拡張予定

### 機能拡張

- プロジェクトの共有機能
- プロジェクトのカテゴリ分類
- プロジェクトの検索機能
- 削除期限の設定

### パフォーマンス改善

- レディスキャッシュの導入
- 全文検索の実装
- 非同期処理の活用
