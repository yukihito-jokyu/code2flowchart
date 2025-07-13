# ProjectService

## 概要

プロジェクト関連のビジネスロジックを提供するサービスクラスです。CRUD操作とソフトデリート機能を実装し、データベースとの相互作用を管理します。

## 主要な service の説明

### service の名前
ProjectService

### service の概要
プロジェクト管理の核となるビジネスロジックを提供し、以下の機能を実装：
- プロジェクトの作成・読取・更新・削除（CRUD）
- ソフトデリート・復元機能
- ユーザー単位でのプロジェクト管理
- ページング機能付きリスト取得

### 主要なメソッドの説明

#### 1. create_project
**概要**: 新しいプロジェクトを作成
- **引数**: 
  - `db: Session` - データベースセッション
  - `project_data: ProjectCreate` - 作成するプロジェクトデータ
  - `user_uuid: str` - プロジェクト所有者のUUID
- **戻り値**: `Project` - 作成されたプロジェクト
- **機能**: UUID自動生成、データベースへの保存とコミット

#### 2. get_project_by_uuid
**概要**: UUIDでプロジェクトを取得（ソフトデリート済みは除外）
- **引数**:
  - `db: Session` - データベースセッション
  - `project_uuid: str` - プロジェクトUUID
  - `user_uuid: str` - ユーザーUUID
- **戻り値**: `Optional[Project]` - プロジェクト（見つからない場合はNone）
- **機能**: ユーザー認証とソフトデリートフィルタリング

#### 3. get_projects_by_user
**概要**: ユーザーのプロジェクト一覧を取得（ページング対応）
- **引数**:
  - `db: Session` - データベースセッション
  - `user_uuid: str` - ユーザーUUID
  - `skip: int = 0` - スキップ件数
  - `limit: int = 100` - 取得件数
- **戻り値**: `List[Project]` - プロジェクトリスト
- **機能**: 更新日時降順でソート、ソフトデリート除外

#### 4. get_projects_count
**概要**: ユーザーのプロジェクト数を取得
- **引数**:
  - `db: Session` - データベースセッション
  - `user_uuid: str` - ユーザーUUID
- **戻り値**: `int` - プロジェクト数
- **機能**: ソフトデリート除外でカウント

#### 5. update_project
**概要**: プロジェクトを更新
- **引数**:
  - `db: Session` - データベースセッション
  - `project_uuid: str` - プロジェクトUUID
  - `user_uuid: str` - ユーザーUUID
  - `project_data: ProjectUpdate` - 更新データ
- **戻り値**: `Optional[Project]` - 更新されたプロジェクト
- **機能**: 部分更新対応、updated_at自動更新

#### 6. soft_delete_project
**概要**: プロジェクトをソフトデリート
- **引数**:
  - `db: Session` - データベースセッション
  - `project_uuid: str` - プロジェクトUUID
  - `user_uuid: str` - ユーザーUUID
- **戻り値**: `bool` - 成功/失敗
- **機能**: is_deletedフラグを設定、復元可能

#### 7. restore_project
**概要**: ソフトデリートされたプロジェクトを復元
- **引数**:
  - `db: Session` - データベースセッション
  - `project_uuid: str` - プロジェクトUUID
  - `user_uuid: str` - ユーザーUUID
- **戻り値**: `bool` - 成功/失敗
- **機能**: is_deletedフラグをリセット

#### 8. get_deleted_projects
**概要**: 削除済みプロジェクト一覧を取得
- **引数**:
  - `db: Session` - データベースセッション
  - `user_uuid: str` - ユーザーUUID
  - `skip: int = 0` - スキップ件数
  - `limit: int = 100` - 取得件数
- **戻り値**: `List[Project]` - 削除済みプロジェクトリスト
- **機能**: ソフトデリート済みのプロジェクトのみ取得

#### 9. hard_delete_project
**概要**: プロジェクトを物理削除（完全削除）
- **引数**:
  - `db: Session` - データベースセッション
  - `project_uuid: str` - プロジェクトUUID
  - `user_uuid: str` - ユーザーUUID
- **戻り値**: `bool` - 成功/失敗
- **機能**: データベースから完全削除、復元不可

### 依存関係にあるファイル群

- `models/project.py` - Projectモデル
- `schemas/project.py` - ProjectCreate, ProjectUpdateスキーマ
- `sqlalchemy.orm.Session` - データベースセッション
- `datetime` - タイムスタンプ更新

## ドキュメント更新履歴

- 2025-07-13: 初回作成