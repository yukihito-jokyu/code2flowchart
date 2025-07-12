# データベーススキーマ設計

## 概要

code2flowchartプロジェクトで使用するMySQLデータベースのスキーマ設計ドキュメントです。
ユーザー、コード、ノード、エッジの各テーブルについて詳細に説明します。

## データベース構成

### データベース名: `flow`

プロジェクトのメインデータベースとして使用。

## テーブル設計

### 1. usersテーブル

ユーザー認証と管理のためのテーブル。

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);
```

**フィールド説明:**
- `id`: ユーザーの一意識別子
- `username`: ユーザー名（ユニーク制約）
- `email`: メールアドレス（ユニーク制約）
- `password_hash`: パスワードのハッシュ値
- `created_at`: アカウント作成日時
- `updated_at`: 最終更新日時

### 2. codesテーブル

ユーザーが入力したコードとメタ情報を保存するテーブル。

```sql
CREATE TABLE codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    code_content TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'python',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);
```

**フィールド説明:**
- `id`: コードの一意識別子
- `user_id`: 作成者のユーザーID（外部キー）
- `title`: コードのタイトル
- `code_content`: 実際のコード内容
- `language`: プログラミング言語（デフォルト: python）
- `description`: コードの説明
- `created_at`: 作成日時
- `updated_at`: 最終更新日時

### 3. nodesテーブル

フローチャートのノード情報を保存するテーブル。

```sql
CREATE TABLE nodes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_id INT NOT NULL,
    node_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    code_snippet TEXT,
    info TEXT,
    type ENUM('if', 'for', 'while', 'unknown', 'normal') DEFAULT 'normal',
    position_x INT DEFAULT 0,
    position_y INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (code_id) REFERENCES codes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_node_per_code (code_id, node_id),
    INDEX idx_code_id (code_id),
    INDEX idx_node_type (type)
);
```

**フィールド説明:**
- `id`: ノードのデータベース内一意識別子
- `code_id`: 関連するコードのID（外部キー）
- `node_id`: フローチャート内でのノードID
- `title`: ノードのタイトル（一言説明）
- `code_snippet`: ノードに対応するコード片
- `info`: ノードの詳細説明
- `type`: ノードのタイプ（if/for/while/unknown/normal）
- `position_x`: フローチャート上のX座標
- `position_y`: フローチャート上のY座標
- `created_at`: 作成日時
- `updated_at`: 最終更新日時

**タイプ分類:**
- `if`: if文
- `for`: for文
- `while`: while文
- `unknown`: 未知の関数など
- `normal`: その他一般処理

### 4. edgesテーブル

ノード間の接続情報を保存するテーブル。

```sql
CREATE TABLE edges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_id INT NOT NULL,
    source_node_id INT NOT NULL,
    target_node_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (code_id) REFERENCES codes(id) ON DELETE CASCADE,
    INDEX idx_code_id (code_id),
    INDEX idx_source_node (source_node_id),
    INDEX idx_target_node (target_node_id),
    UNIQUE KEY unique_edge_per_code (code_id, source_node_id, target_node_id)
);
```

**フィールド説明:**
- `id`: エッジの一意識別子
- `code_id`: 関連するコードのID（外部キー）
- `source_node_id`: 接続元ノードのnode_id
- `target_node_id`: 接続先ノードのnode_id
- `created_at`: 作成日時

## データの流れ

1. **ユーザー登録・ログイン**: `users`テーブルでユーザー管理
2. **コード入力**: `codes`テーブルにコード内容とメタ情報を保存
3. **AIによる解析**: ChatGPT APIがコードを解析してノード・エッジ構造を生成
4. **フローチャートデータ保存**: `nodes`と`edges`テーブルに構造化データを保存
5. **可視化**: react-flowでフローチャートを描画

## インデックス設計

効率的なクエリ実行のため、以下のインデックスを設定：

- **users**: `username`, `email`にインデックス（ログイン時の検索高速化）
- **codes**: `user_id`, `created_at`にインデックス（ユーザー別履歴取得の高速化）
- **nodes**: `code_id`, `type`にインデックス（フローチャートデータ取得の高速化）
- **edges**: `code_id`, `source_node_id`, `target_node_id`にインデックス（接続情報検索の高速化）

## 外部キー制約

データ整合性を保つため、以下の外部キー制約を設定：

- `codes.user_id` → `users.id` (ON DELETE CASCADE)
- `nodes.code_id` → `codes.id` (ON DELETE CASCADE)
- `edges.code_id` → `codes.id` (ON DELETE CASCADE)

## SQLファイル

テーブル作成用のSQLファイルが以下に分割されて配置されています：

- `dev/database/init.sql`: 統合スキーマファイル
- `dev/database/sql/create_users_table.sql`: usersテーブル作成
- `dev/database/sql/create_codes_table.sql`: codesテーブル作成
- `dev/database/sql/create_nodes_table.sql`: nodesテーブル作成
- `dev/database/sql/create_edges_table.sql`: edgesテーブル作成

### ファイル構成

```
dev/database/
├── docker-compose.yml  # MySQL コンテナ設定
├── init.sql           # データベース初期化スクリプト（全テーブル統合）
└── sql/               # 個別テーブル作成SQLファイル
    ├── create_users_table.sql    # ユーザーテーブル作成
    ├── create_codes_table.sql    # コードテーブル作成
    ├── create_nodes_table.sql    # ノードテーブル作成
    └── create_edges_table.sql    # エッジテーブル作成
```

### 使用方法

**統合スキーマファイルを使用する場合:**
```bash
docker exec -i flow_mysql mysql -u flowuser -pflowpassword flow < dev/database/init.sql
```

**個別テーブルを作成する場合:**
```bash
# 依存関係に注意して順番に実行
docker exec -i flow_mysql mysql -u flowuser -pflowpassword flow < dev/database/sql/create_users_table.sql
docker exec -i flow_mysql mysql -u flowuser -pflowpassword flow < dev/database/sql/create_codes_table.sql
docker exec -i flow_mysql mysql -u flowuser -pflowpassword flow < dev/database/sql/create_nodes_table.sql
docker exec -i flow_mysql mysql -u flowuser -pflowpassword flow < dev/database/sql/create_edges_table.sql
```

## 注意事項

- ユーザーが削除されると、関連するすべてのコード、ノード、エッジも削除されます（CASCADE設定）
- ノードIDはコード内でのみユニークであり、グローバルなユニーク性は保証されていません
- パスワードは必ずハッシュ化して保存してください（BCryptなど）