# Project API ルーター

## 概要

プロジェクト管理機能を提供するFastAPI ルーターです。認証機能と組み合わせて、プロジェクトのCRUD操作とソフトデリート機能を提供します。

## 主要な API の説明

### API の名前
Project Router - `/api/projects`

### API の概要
認証されたユーザーがプロジェクトを管理するためのRESTful APIエンドポイント群。以下の機能を提供：
- プロジェクトの作成・取得・更新・削除
- ソフトデリート・復元機能
- 削除済みプロジェクトの管理
- ページング対応の一覧取得

### エンドポイント詳細

#### 1. POST `/` - プロジェクト作成
**概要**: 新しいプロジェクトを作成
**認証**: 必須（JWT認証）
**引数の型**:
- `project: ProjectCreate` - 作成するプロジェクトデータ
- `current_user: User` - 認証されたユーザー（依存性注入）
- `db: Session` - データベースセッション（依存性注入）
**戻り値の型**: `ProjectResponse`
**エラー**: 500 - プロジェクト作成失敗

#### 2. GET `/` - プロジェクト一覧取得
**概要**: ユーザーのプロジェクト一覧を取得（削除済みは除外）
**認証**: 必須（JWT認証）
**引数の型**:
- `skip: int = 0` - スキップ件数（0以上）
- `limit: int = 100` - 取得件数（1-1000）
- `current_user: User` - 認証されたユーザー（依存性注入）
- `db: Session` - データベースセッション（依存性注入）
**戻り値の型**: `ProjectListResponse`
**特徴**: ページング対応、総件数も返却

#### 3. GET `/deleted` - 削除済みプロジェクト一覧取得
**概要**: 削除済みプロジェクト一覧を取得
**認証**: 必須（JWT認証）
**引数の型**:
- `skip: int = 0` - スキップ件数（0以上）
- `limit: int = 100` - 取得件数（1-1000）
- `current_user: User` - 認証されたユーザー（依存性注入）
- `db: Session` - データベースセッション（依存性注入）
**戻り値の型**: `ProjectListResponse`
**特徴**: ソフトデリート済みのプロジェクトのみ

#### 4. GET `/{project_uuid}` - プロジェクト詳細取得
**概要**: 指定されたプロジェクトの詳細を取得
**認証**: 必須（JWT認証）
**引数の型**:
- `project_uuid: str` - プロジェクトUUID
- `current_user: User` - 認証されたユーザー（依存性注入）
- `db: Session` - データベースセッション（依存性注入）
**戻り値の型**: `ProjectResponse`
**エラー**: 404 - プロジェクトが見つからない

#### 5. PUT `/{project_uuid}` - プロジェクト更新
**概要**: プロジェクトを更新
**認証**: 必須（JWT認証）
**引数の型**:
- `project_uuid: str` - プロジェクトUUID
- `project_update: ProjectUpdate` - 更新データ
- `current_user: User` - 認証されたユーザー（依存性注入）
- `db: Session` - データベースセッション（依存性注入）
**戻り値の型**: `ProjectResponse`
**エラー**: 404 - プロジェクトが見つからない
**特徴**: 部分更新対応

#### 6. DELETE `/{project_uuid}` - プロジェクト削除（ソフト削除）
**概要**: プロジェクトをソフトデリート
**認証**: 必須（JWT認証）
**引数の型**:
- `project_uuid: str` - プロジェクトUUID
- `current_user: User` - 認証されたユーザー（依存性注入）
- `db: Session` - データベースセッション（依存性注入）
**戻り値の型**: `ProjectDeleteResponse`
**エラー**: 404 - プロジェクトが見つからない
**特徴**: 復元可能な削除

#### 7. POST `/{project_uuid}/restore` - プロジェクト復元
**概要**: 削除済みプロジェクトを復元
**認証**: 必須（JWT認証）
**引数の型**:
- `project_uuid: str` - プロジェクトUUID
- `current_user: User` - 認証されたユーザー（依存性注入）
- `db: Session` - データベースセッション（依存性注入）
**戻り値の型**: `ProjectResponse`
**エラー**: 404 - 削除済みプロジェクトが見つからない

#### 8. DELETE `/{project_uuid}/hard` - プロジェクト完全削除
**概要**: プロジェクトを物理削除（完全削除・復元不可）
**認証**: 必須（JWT認証）
**引数の型**:
- `project_uuid: str` - プロジェクトUUID
- `current_user: User` - 認証されたユーザー（依存性注入）
- `db: Session` - データベースセッション（依存性注入）
**戻り値の型**: `ProjectDeleteResponse`
**エラー**: 404 - プロジェクトが見つからない
**特徴**: 完全削除、復元不可

### セキュリティ機能

1. **JWT認証**: 全エンドポイントで認証必須
2. **ユーザー隔離**: ユーザーは自分のプロジェクトのみアクセス可能
3. **パラメータバリデーション**: Pydanticによる自動バリデーション
4. **エラーハンドリング**: 適切なHTTPステータスコードとエラーメッセージ

### 依存関係にあるファイル群

- `fastapi` - APIRouter, Depends, HTTPException, Query
- `sqlalchemy.orm.Session` - データベースセッション
- `utils/database.py` - get_db関数
- `lib/auth/middleware.py` - get_current_user関数
- `schemas/project.py` - 全Projectスキーマ
- `services/project_service.py` - ProjectServiceクラス
- `models/user.py` - Userモデル

## ドキュメント更新履歴

- 2025-07-13: 初回作成