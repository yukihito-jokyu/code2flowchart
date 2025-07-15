# projects テーブル

## 概要

ユーザーのプロジェクトを管理するテーブル。

## スキーマ

```sql
CREATE TABLE projects (
    uuid CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_uuid CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE,
    INDEX idx_user_uuid (user_uuid),
    INDEX idx_created_at (created_at),
    INDEX idx_is_deleted (is_deleted)
);
```

## フィールド説明

| フィールド名 | データ型 | 制約 | 説明 |
|-------------|----------|------|------|
| `uuid` | CHAR(36) | PRIMARY KEY | プロジェクトの一意識別子（UUID） |
| `user_uuid` | CHAR(36) | NOT NULL, FOREIGN KEY | 作成者のユーザー UUID |
| `name` | VARCHAR(255) | NOT NULL | プロジェクト名 |
| `description` | TEXT | - | プロジェクトの説明 |
| `is_deleted` | BOOLEAN | DEFAULT FALSE | 論理削除フラグ |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 最終更新日時 |

## インデックス

- `idx_user_uuid`: ユーザー別プロジェクト取得の高速化
- `idx_created_at`: 作成日時での並び替え高速化
- `idx_is_deleted`: 論理削除データの除外高速化

## 関連テーブル

### 多対1の関係

- `users`: 複数のプロジェクトは1つのユーザーに属する
  - 外部キー: `projects.user_uuid` → `users.uuid`
  - カスケード削除: ユーザー削除時にプロジェクトも削除

### 1対多の関係

- `codes`: 1つのプロジェクトは複数のコードを持つことができる
  - 外部キー: `codes.project_uuid` → `projects.uuid`
  - カスケード削除: プロジェクト削除時にコードも削除

- `project_codes`: 1つのプロジェクトは複数の独立したコードを持つことができる
  - 外部キー: `project_codes.project_uuid` → `projects.uuid`
  - カスケード削除: プロジェクト削除時にプロジェクトコードも削除

- `nodes`: 1つのプロジェクトは複数のノードを持つことができる
  - 外部キー: `nodes.project_uuid` → `projects.uuid`
  - カスケード削除: プロジェクト削除時にノードも削除

- `edges`: 1つのプロジェクトは複数のエッジを持つことができる
  - 外部キー: `edges.project_uuid` → `projects.uuid`
  - カスケード削除: プロジェクト削除時にエッジも削除

## 論理削除

- `is_deleted`フラグによる論理削除機能を実装
- 削除時は物理削除ではなく`is_deleted = TRUE`に設定
- 通常のクエリでは`WHERE is_deleted = FALSE`条件を追加して削除済みデータを除外

## 使用例

```sql
-- プロジェクト作成
INSERT INTO projects (user_uuid, name, description) 
VALUES ('user-uuid', 'My Project', 'プロジェクトの説明');

-- ユーザーのアクティブプロジェクト取得
SELECT * FROM projects 
WHERE user_uuid = 'user-uuid' AND is_deleted = FALSE 
ORDER BY created_at DESC;

-- プロジェクトの論理削除
UPDATE projects SET is_deleted = TRUE WHERE uuid = 'project-uuid';

-- 削除されたプロジェクトの復旧
UPDATE projects SET is_deleted = FALSE WHERE uuid = 'project-uuid';
```

## 注意事項

- プロジェクト削除時は関連するすべてのコード、ノード、エッジがカスケード削除される
- UUIDは自動生成され、グローバルに一意性が保証される
- 論理削除により通常のクエリでは削除済みデータを除外する必要がある
- プロジェクト中心の設計により、すべてのデータはプロジェクト単位で管理される