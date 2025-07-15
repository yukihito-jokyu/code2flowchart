# nodes テーブル

## 概要

フローチャートのノード情報を保存するテーブル。コードから生成されたフローチャートの各ノードの詳細情報を管理する。

## スキーマ

```sql
CREATE TABLE nodes (
    uuid CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_uuid CHAR(36) NOT NULL,
    code_uuid CHAR(36) NOT NULL,
    node_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    code_snippet TEXT,
    info TEXT,
    type ENUM('if', 'for_start', 'for_end', 'while_start', 'while_end', 'unknown', 'normal') DEFAULT 'normal',
    position_x INT DEFAULT 0,
    position_y INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_uuid) REFERENCES projects(uuid) ON DELETE CASCADE,
    FOREIGN KEY (code_uuid) REFERENCES codes(uuid) ON DELETE CASCADE,
    INDEX idx_project_uuid (project_uuid),
    INDEX idx_code_uuid (code_uuid),
    INDEX idx_node_type (type),
    INDEX idx_is_deleted (is_deleted)
);
```

## フィールド説明

| フィールド名 | データ型 | 制約 | 説明 |
|-------------|----------|------|------|
| `uuid` | CHAR(36) | PRIMARY KEY | ノードの一意識別子（UUID） |
| `project_uuid` | CHAR(36) | NOT NULL, FOREIGN KEY | 所属プロジェクトの UUID |
| `code_uuid` | CHAR(36) | NOT NULL, FOREIGN KEY | 関連するコードの UUID |
| `node_id` | INT | NOT NULL | フローチャート内でのノード ID（重複可能） |
| `title` | VARCHAR(255) | NOT NULL | ノードのタイトル（一言説明） |
| `code_snippet` | TEXT | - | ノードに対応するコード片 |
| `info` | TEXT | - | ノードの詳細説明 |
| `type` | ENUM | DEFAULT 'normal' | ノードのタイプ |
| `position_x` | INT | DEFAULT 0 | フローチャート上の X 座標 |
| `position_y` | INT | DEFAULT 0 | フローチャート上の Y 座標 |
| `is_deleted` | BOOLEAN | DEFAULT FALSE | 論理削除フラグ |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 最終更新日時 |

## ノードタイプ

| タイプ | 説明 | 用途 |
|--------|------|------|
| `if` | if文 | 条件分岐処理 |
| `for_start` | for文開始 | 繰り返し処理の開始点 |
| `for_end` | for文終了 | 繰り返し処理の終了点 |
| `while_start` | while文開始 | 条件繰り返し処理の開始点 |
| `while_end` | while文終了 | 条件繰り返し処理の終了点 |
| `unknown` | 未知の関数など | 外部関数や不明な処理 |
| `normal` | その他一般処理 | 通常の処理ステップ |

## インデックス

- `idx_project_uuid`: プロジェクト別ノード取得の高速化
- `idx_code_uuid`: コード別ノード取得の高速化
- `idx_node_type`: タイプ別ノード検索の高速化
- `idx_is_deleted`: 論理削除データの除外高速化

## 関連テーブル

### 多対1の関係

- `projects`: 複数のノードは1つのプロジェクトに属する
  - 外部キー: `nodes.project_uuid` → `projects.uuid`
  - カスケード削除: プロジェクト削除時にノードも削除

- `codes`: 複数のノードは1つのコードに関連付けられる
  - 外部キー: `nodes.code_uuid` → `codes.uuid`
  - カスケード削除: コード削除時にノードも削除

### 関連する参照

- `edges`: エッジテーブルでノード間の接続情報を管理
  - `edges.source_node_id`と`edges.target_node_id`で参照される

## 論理削除

- `is_deleted`フラグによる論理削除機能を実装
- 削除時は物理削除ではなく`is_deleted = TRUE`に設定
- 通常のクエリでは`WHERE is_deleted = FALSE`条件を追加して削除済みデータを除外

## 使用例

```sql
-- ノード作成
INSERT INTO nodes (project_uuid, code_uuid, node_id, title, code_snippet, type) 
VALUES ('project-uuid', 'code-uuid', 1, '開始', 'def main():', 'normal');

-- プロジェクトのアクティブノード取得
SELECT * FROM nodes 
WHERE project_uuid = 'project-uuid' AND is_deleted = FALSE 
ORDER BY node_id;

-- 特定タイプのノード取得
SELECT * FROM nodes 
WHERE project_uuid = 'project-uuid' AND type = 'if' AND is_deleted = FALSE;

-- コード別ノード取得
SELECT * FROM nodes 
WHERE code_uuid = 'code-uuid' AND is_deleted = FALSE 
ORDER BY node_id;

-- ノードの位置更新
UPDATE nodes 
SET position_x = 100, position_y = 200 
WHERE uuid = 'node-uuid';

-- ノードの論理削除
UPDATE nodes SET is_deleted = TRUE WHERE uuid = 'node-uuid';
```

## 注意事項

- `node_id`はフローチャート内でのみ有効で、重複する可能性がある
- UUIDは自動生成され、グローバルに一意性が保証される
- 論理削除により通常のクエリでは削除済みデータを除外する必要がある
- AIによるコード解析時にこのテーブルにノード情報が生成される
- フローチャートの座標情報（position_x, position_y）はreact-flowでの表示に使用
- ノードタイプによってフローチャートでの表示形式を変更可能