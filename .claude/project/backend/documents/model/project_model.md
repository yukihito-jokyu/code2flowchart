# Project モデル

## 概要

プロジェクト情報を管理するための SQLAlchemy モデルです。ユーザーが作成・管理するプロジェクトの基本情報を格納し、ソフトデリート機能を提供します。

## モデルのアーキテクチャ

### テーブル名
`projects`

### カラム構成

| カラム名 | 型 | 制約 | 説明 |
|----------|-------------|------|------|
| uuid | String(36) | Primary Key | プロジェクト識別子（UUID4形式） |
| user_uuid | String(36) | Foreign Key, Not Null, Index | プロジェクト所有者のユーザーUUID |
| name | String(100) | Not Null | プロジェクト名 |
| description | Text | Nullable | プロジェクト説明 |
| is_deleted | Boolean | Not Null, Default: False, Index | ソフトデリートフラグ |
| created_at | DateTime | Server Default: now() | 作成日時 |
| updated_at | DateTime | Server Default: now(), OnUpdate: now() | 更新日時 |

### リレーションシップ

- **User**: `user` - プロジェクト所有者への参照（back_populates="projects"）

### 主要機能

1. **UUID主キー**: セキュアで予測困難な識別子
2. **外部キー制約**: ユーザーテーブルとの整合性保証
3. **ソフトデリート**: データの論理削除（物理削除ではない）
4. **インデックス**: user_uuid と is_deleted にインデックスを設定し、検索性能を向上
5. **自動タイムスタンプ**: 作成・更新日時の自動記録

### 特徴

- プロジェクト名は最大100文字まで
- 説明はText型で長文に対応
- is_deletedフラグによるソフトデリート機能
- ユーザーとの1対多の関係性

## 依存関係にあるファイル

- `models/user.py` - User モデル（リレーションシップ）
- `schemas/project.py` - Project 関連の Pydantic スキーマ
- `services/project_service.py` - Project ビジネスロジック
- `routes/project.py` - Project API エンドポイント

## ドキュメント更新履歴

- 2025-07-13: 初回作成