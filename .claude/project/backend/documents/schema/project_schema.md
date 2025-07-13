# Project スキーマ

## 概要

プロジェクト関連のAPI入出力データ構造を定義するPydanticスキーマです。バリデーション機能とデータ変換機能を提供します。

## 主要な schema の説明

### schema の名前
project.py - プロジェクト関連スキーマ集

### schema の概要
プロジェクトAPIの以下の場面で使用されるデータ構造を定義：
- プロジェクト作成時の入力データ
- プロジェクト更新時の入力データ
- プロジェクト情報のレスポンスデータ
- プロジェクト一覧のレスポンスデータ
- プロジェクト削除時のレスポンスデータ

### schema のアーキテクチャ

#### 1. ProjectBase
**用途**: 共通のプロジェクト基本フィールド
**フィールド**:
- `name: str` - プロジェクト名（1-100文字）
- `description: Optional[str]` - プロジェクト説明（最大1000文字、任意）

#### 2. ProjectCreate
**用途**: プロジェクト作成時の入力データ
**継承**: ProjectBase
**特徴**: 基本フィールドをそのまま継承

#### 3. ProjectUpdate
**用途**: プロジェクト更新時の入力データ
**フィールド**:
- `name: Optional[str]` - プロジェクト名（1-100文字、任意）
- `description: Optional[str]` - プロジェクト説明（最大1000文字、任意）
**特徴**: 部分更新対応（全フィールドが任意）

#### 4. ProjectResponse
**用途**: プロジェクト情報のレスポンスデータ
**継承**: ProjectBase
**追加フィールド**:
- `uuid: str` - プロジェクトUUID
- `user_uuid: str` - ユーザーUUID
- `is_deleted: bool` - 削除フラグ
- `created_at: datetime` - 作成日時
- `updated_at: datetime` - 更新日時
**設定**: `from_attributes = True` でSQLAlchemyモデルからの変換対応

#### 5. ProjectListResponse
**用途**: プロジェクト一覧のレスポンスデータ
**フィールド**:
- `projects: list[ProjectResponse]` - プロジェクトリスト
- `total: int` - 総件数
**特徴**: ページング情報を含む

#### 6. ProjectDeleteResponse
**用途**: プロジェクト削除時のレスポンスデータ
**フィールド**:
- `message: str` - 削除完了メッセージ
- `uuid: str` - 削除されたプロジェクトUUID
**特徴**: 削除操作の確認情報

### バリデーション機能

1. **文字列長制限**:
   - プロジェクト名: 1-100文字
   - プロジェクト説明: 最大1000文字

2. **必須フィールド**:
   - 作成時: name（必須）
   - 更新時: 全フィールド任意（部分更新対応）

3. **データ型検証**:
   - Pydanticによる自動型チェック
   -日時形式の自動変換

### 依存関係にあるファイル群

- `pydantic` - BaseModel, Field
- `datetime` - datetime型
- `typing` - Optional型
- `models/project.py` - SQLAlchemyモデル（変換元）
- `routes/project.py` - APIエンドポイント（使用先）
- `services/project_service.py` - ビジネスロジック（使用先）

## ドキュメント更新履歴

- 2025-07-13: 初回作成