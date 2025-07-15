# codes テーブル

## 概要

プロジェクト内のコードとメタ情報を保存するテーブル。ノードと紐づくコードを管理する。

## スキーマ

```sql
CREATE TABLE codes (
    uuid CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_uuid CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    code_content TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'python',
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_uuid) REFERENCES projects(uuid) ON DELETE CASCADE,
    INDEX idx_project_uuid (project_uuid),
    INDEX idx_created_at (created_at),
    INDEX idx_is_deleted (is_deleted)
);
```

## フィールド説明

| フィールド名 | データ型 | 制約 | 説明 |
|-------------|----------|------|------|
| `uuid` | CHAR(36) | PRIMARY KEY | コードの一意識別子（UUID） |
| `project_uuid` | CHAR(36) | NOT NULL, FOREIGN KEY | 所属プロジェクトの UUID |
| `title` | VARCHAR(255) | NOT NULL | コードのタイトル |
| `code_content` | TEXT | NOT NULL | 実際のコード内容 |
| `language` | VARCHAR(50) | DEFAULT 'python' | プログラミング言語 |
| `description` | TEXT | - | コードの説明 |
| `is_deleted` | BOOLEAN | DEFAULT FALSE | 論理削除フラグ |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 最終更新日時 |

## インデックス

- `idx_project_uuid`: プロジェクト別コード取得の高速化
- `idx_created_at`: 作成日時での並び替え高速化
- `idx_is_deleted`: 論理削除データの除外高速化

## 関連テーブル

### 多対1の関係

- `projects`: 複数のコードは1つのプロジェクトに属する
  - 外部キー: `codes.project_uuid` → `projects.uuid`
  - カスケード削除: プロジェクト削除時にコードも削除

### 1対多の関係

- `nodes`: 1つのコードは複数のノードに関連付けることができる
  - 外部キー: `nodes.code_uuid` → `codes.uuid`
  - カスケード削除: コード削除時にノードも削除

## project_codes テーブルとの違い

| 項目 | codes テーブル | project_codes テーブル |
|------|----------------|------------------------|
| 用途 | ノードと紐づくコード | プロジェクトレベルの独立したコード |
| 参照 | `nodes.code_uuid`で参照される | ノードと紐づかない |
| 役割 | フローチャート生成用 | プロジェクト管理用 |

## 論理削除

- `is_deleted`フラグによる論理削除機能を実装
- 削除時は物理削除ではなく`is_deleted = TRUE`に設定
- 通常のクエリでは`WHERE is_deleted = FALSE`条件を追加して削除済みデータを除外

## 使用例

```sql
-- コード作成
INSERT INTO codes (project_uuid, title, code_content, language, description) 
VALUES ('project-uuid', 'メイン処理', 'def main():\n    print("Hello")', 'python', 'メイン関数');

-- プロジェクトのアクティブコード取得
SELECT * FROM codes 
WHERE project_uuid = 'project-uuid' AND is_deleted = FALSE 
ORDER BY created_at DESC;

-- 特定言語のコード取得
SELECT * FROM codes 
WHERE project_uuid = 'project-uuid' AND language = 'python' AND is_deleted = FALSE;

-- コードの論理削除
UPDATE codes SET is_deleted = TRUE WHERE uuid = 'code-uuid';

-- 削除されたコードの復旧
UPDATE codes SET is_deleted = FALSE WHERE uuid = 'code-uuid';
```

## 注意事項

- コード削除時は関連するすべてのノードがカスケード削除される
- UUIDは自動生成され、グローバルに一意性が保証される
- 論理削除により通常のクエリでは削除済みデータを除外する必要がある
- AIによるフローチャート生成時にこのテーブルのコードが解析される
- `language`フィールドで言語固有の処理を分岐できる