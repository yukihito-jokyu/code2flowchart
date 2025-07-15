# edges テーブル

## 概要

ノード間の接続情報を保存するテーブル。フローチャートでのノード間の流れや関係性を管理する。

## スキーマ

```sql
CREATE TABLE edges (
    uuid CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_uuid CHAR(36) NOT NULL,
    source_node_id INT NOT NULL,
    target_node_id INT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_uuid) REFERENCES projects(uuid) ON DELETE CASCADE,
    INDEX idx_project_uuid (project_uuid),
    INDEX idx_is_deleted (is_deleted)
);
```

## フィールド説明

| フィールド名 | データ型 | 制約 | 説明 |
|-------------|----------|------|------|
| `uuid` | CHAR(36) | PRIMARY KEY | エッジの一意識別子（UUID） |
| `project_uuid` | CHAR(36) | NOT NULL, FOREIGN KEY | 所属プロジェクトの UUID |
| `source_node_id` | INT | NOT NULL | 接続元ノードの node_id（重複可能） |
| `target_node_id` | INT | NOT NULL | 接続先ノードの node_id（重複可能） |
| `is_deleted` | BOOLEAN | DEFAULT FALSE | 論理削除フラグ |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 作成日時 |

## インデックス

- `idx_project_uuid`: プロジェクト別エッジ取得の高速化
- `idx_is_deleted`: 論理削除データの除外高速化

## 関連テーブル

### 多対1の関係

- `projects`: 複数のエッジは1つのプロジェクトに属する
  - 外部キー: `edges.project_uuid` → `projects.uuid`
  - カスケード削除: プロジェクト削除時にエッジも削除

### 関連する参照

- `nodes`: エッジはノード間の接続を表現
  - `source_node_id`と`target_node_id`は`nodes.node_id`を参照（外部キー制約なし）
  - 同一プロジェクト内のノード間でのみ接続が有効

## 論理削除

- `is_deleted`フラグによる論理削除機能を実装
- 削除時は物理削除ではなく`is_deleted = TRUE`に設定
- 通常のクエリでは`WHERE is_deleted = FALSE`条件を追加して削除済みデータを除外

## 使用例

```sql
-- エッジ作成
INSERT INTO edges (project_uuid, source_node_id, target_node_id) 
VALUES ('project-uuid', 1, 2);

-- プロジェクトのアクティブエッジ取得
SELECT * FROM edges 
WHERE project_uuid = 'project-uuid' AND is_deleted = FALSE;

-- 特定ノードからの出力エッジ取得
SELECT * FROM edges 
WHERE project_uuid = 'project-uuid' AND source_node_id = 1 AND is_deleted = FALSE;

-- 特定ノードへの入力エッジ取得
SELECT * FROM edges 
WHERE project_uuid = 'project-uuid' AND target_node_id = 2 AND is_deleted = FALSE;

-- ノードとエッジの結合クエリ（フローチャート構築用）
SELECT 
    e.uuid as edge_uuid,
    e.source_node_id,
    e.target_node_id,
    sn.title as source_title,
    tn.title as target_title
FROM edges e
LEFT JOIN nodes sn ON e.source_node_id = sn.node_id AND e.project_uuid = sn.project_uuid
LEFT JOIN nodes tn ON e.target_node_id = tn.node_id AND e.project_uuid = tn.project_uuid
WHERE e.project_uuid = 'project-uuid' AND e.is_deleted = FALSE;

-- エッジの論理削除
UPDATE edges SET is_deleted = TRUE WHERE uuid = 'edge-uuid';
```

## 注意事項

- `source_node_id`と`target_node_id`は`nodes.node_id`を参照するが、外部キー制約は設定されていない
- ノードIDは同一プロジェクト内でのみ有効で、重複する可能性がある
- UUIDは自動生成され、グローバルに一意性が保証される
- 論理削除により通常のクエリでは削除済みデータを除外する必要がある
- AIによるコード解析時にこのテーブルにエッジ情報が生成される
- フローチャートの描画時にreact-flowでエッジ情報として使用される
- プロジェクトレベルでの管理により、異なるプロジェクト間での接続は不可
- エッジの削除や変更時は関連するノードの存在確認が必要