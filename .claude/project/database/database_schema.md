# データベーススキーマ設計（UUID 版）

## 概要

code2flowchart プロジェクトで使用する MySQL データベースのスキーマ設計ドキュメントです。
UUID ベースの主キーとプロジェクト中心の設計により、安全で拡張性の高いデータ構造を実現しています。

## データベース構成

### データベース名: `flow`

プロジェクトのメインデータベースとして使用。

## 設計原則

- **UUID 主キー**: 全テーブルで UUID を主キーとして使用し、セキュリティと一意性を確保
- **プロジェクト中心設計**: プロジェクトを中心とした階層構造でデータを管理
- **外部キー制約**: データ整合性を保つための適切な制約設定

## テーブル設計

### 1. users テーブル

ユーザー認証と管理のためのテーブル。

```sql
CREATE TABLE users (
    uuid CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_is_deleted (is_deleted)
);
```

**フィールド説明:**

- `uuid`: ユーザーの一意識別子（UUID）
- `username`: ユーザー名（ユニーク制約）
- `email`: メールアドレス（ユニーク制約）
- `password_hash`: パスワードのハッシュ値
- `is_deleted`: 論理削除フラグ（デフォルト: FALSE）
- `created_at`: アカウント作成日時
- `updated_at`: 最終更新日時

### 2. projects テーブル

ユーザーのプロジェクトを管理するテーブル。

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

**フィールド説明:**

- `uuid`: プロジェクトの一意識別子（UUID）
- `user_uuid`: 作成者のユーザー UUID（外部キー）
- `name`: プロジェクト名
- `description`: プロジェクトの説明
- `is_deleted`: 論理削除フラグ（デフォルト: FALSE）
- `created_at`: 作成日時
- `updated_at`: 最終更新日時

### 3. codes テーブル

プロジェクト内のコードとメタ情報を保存するテーブル。

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

**フィールド説明:**

- `uuid`: コードの一意識別子（UUID）
- `project_uuid`: 所属プロジェクトの UUID（外部キー）
- `title`: コードのタイトル
- `code_content`: 実際のコード内容
- `language`: プログラミング言語（デフォルト: python）
- `description`: コードの説明
- `is_deleted`: 論理削除フラグ（デフォルト: FALSE）
- `created_at`: 作成日時
- `updated_at`: 最終更新日時

### 4. nodes テーブル

フローチャートのノード情報を保存するテーブル。

```sql
CREATE TABLE nodes (
    uuid CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_uuid CHAR(36) NOT NULL,
    code_uuid CHAR(36) NOT NULL,
    node_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    code_snippet TEXT,
    info TEXT,
    type ENUM('if', 'for', 'while', 'unknown', 'normal') DEFAULT 'normal',
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

**フィールド説明:**

- `uuid`: ノードの一意識別子（UUID）
- `project_uuid`: 所属プロジェクトの UUID（外部キー）
- `code_uuid`: 関連するコードの UUID（外部キー）
- `node_id`: フローチャート内でのノード ID（重複可能）
- `title`: ノードのタイトル（一言説明）
- `code_snippet`: ノードに対応するコード片
- `info`: ノードの詳細説明
- `type`: ノードのタイプ（if/for/while/unknown/normal）
- `position_x`: フローチャート上の X 座標
- `position_y`: フローチャート上の Y 座標
- `is_deleted`: 論理削除フラグ（デフォルト: FALSE）
- `created_at`: 作成日時
- `updated_at`: 最終更新日時

**タイプ分類:**

- `if`: if 文
- `for`: for 文
- `while`: while 文
- `unknown`: 未知の関数など
- `normal`: その他一般処理

### 5. project_codes テーブル

プロジェクトレベルで独立したコードを管理するテーブル。既存のcodesテーブルがノードと紐づくコードを管理するのに対し、こちらはノードと紐づかない独立したコードを管理します。

```sql
CREATE TABLE project_codes (
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
    INDEX idx_project_codes_project_uuid (project_uuid),
    INDEX idx_project_codes_created_at (created_at),
    INDEX idx_project_codes_is_deleted (is_deleted),
    INDEX idx_project_codes_language (language)
);
```

**フィールド説明:**

- `uuid`: プロジェクトコードの一意識別子（UUID）
- `project_uuid`: 所属プロジェクトの UUID（外部キー）
- `title`: コードのタイトル
- `code_content`: 実際のコード内容
- `language`: プログラミング言語（デフォルト: python）
- `description`: コードの説明
- `is_deleted`: 論理削除フラグ（デフォルト: FALSE）
- `created_at`: 作成日時
- `updated_at`: 最終更新日時

**codesテーブルとの違い:**

- **codes**: ノードと紐づくコード（nodes.code_uuidで参照される）
- **project_codes**: プロジェクトレベルの独立したコード（ノードと紐づかない）

### 6. edges テーブル

ノード間の接続情報を保存するテーブル。

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

**フィールド説明:**

- `uuid`: エッジの一意識別子（UUID）
- `project_uuid`: 所属プロジェクトの UUID（外部キー）
- `source_node_id`: 接続元ノードの node_id（重複可能）
- `target_node_id`: 接続先ノードの node_id（重複可能）
- `is_deleted`: 論理削除フラグ（デフォルト: FALSE）
- `created_at`: 作成日時

## データの流れ

1. **ユーザー登録・ログイン**: `users`テーブルでユーザー管理
2. **プロジェクト作成**: `projects`テーブルでユーザー別プロジェクト管理
3. **コード入力**: `codes`テーブルにプロジェクト内コードとメタ情報を保存
4. **AI による解析**: ChatGPT API がコードを解析してノード・エッジ構造を生成
5. **フローチャートデータ保存**: `nodes`と`edges`テーブルにプロジェクト単位で構造化データを保存
6. **可視化**: react-flow でフローチャートを描画

## インデックス設計

効率的なクエリ実行のため、以下のインデックスを設定：

- **users**: `username`, `email`, `is_deleted`にインデックス（ログイン時の検索高速化と論理削除データの除外）
- **projects**: `user_uuid`, `created_at`, `is_deleted`にインデックス（ユーザー別プロジェクト取得の高速化と論理削除データの除外）
- **codes**: `project_uuid`, `created_at`, `is_deleted`にインデックス（プロジェクト別コード取得の高速化と論理削除データの除外）
- **nodes**: `project_uuid`, `code_uuid`, `type`, `is_deleted`にインデックス（フローチャートデータ取得の高速化と論理削除データの除外）
- **edges**: `project_uuid`, `is_deleted`にインデックス（プロジェクト単位での接続情報取得と論理削除データの除外）

## 外部キー制約

データ整合性を保つため、以下の外部キー制約を設定：

- `projects.user_uuid` → `users.uuid` (ON DELETE CASCADE)
- `codes.project_uuid` → `projects.uuid` (ON DELETE CASCADE)
- `nodes.project_uuid` → `projects.uuid` (ON DELETE CASCADE)
- `nodes.code_uuid` → `codes.uuid` (ON DELETE CASCADE)
- `edges.project_uuid` → `projects.uuid` (ON DELETE CASCADE)

## 階層構造

データは以下の階層構造で管理されます：

```
users (ユーザー)
 │
 ├─ projects (プロジェクト)
     │
     ├─ codes (コード)
     │   │
     │   └─ nodes (ノード)
     │
     └─ edges (エッジ)
```

## SQL ファイル

テーブル作成用の SQL ファイルが以下に分割されて配置されています：

- `dev/database/init.sql`: 統合スキーマファイル（UUID 版）
- `dev/database/sql/create_users_table.sql`: users テーブル作成
- `dev/database/sql/create_projects_table.sql`: projects テーブル作成
- `dev/database/sql/create_codes_table.sql`: codes テーブル作成
- `dev/database/sql/create_nodes_table.sql`: nodes テーブル作成
- `dev/database/sql/create_edges_table.sql`: edges テーブル作成

### ファイル構成

```
dev/database/
├── docker-compose.yml  # MySQL コンテナ設定
├── init.sql           # データベース初期化スクリプト（UUID版・全テーブル統合）
└── sql/               # 個別テーブル作成SQLファイル
    ├── create_users_table.sql    # ユーザーテーブル作成
    ├── create_projects_table.sql # プロジェクトテーブル作成
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
docker exec -i flow_mysql mysql -u flowuser -pflowpassword flow < dev/database/sql/create_projects_table.sql
docker exec -i flow_mysql mysql -u flowuser -pflowpassword flow < dev/database/sql/create_codes_table.sql
docker exec -i flow_mysql mysql -u flowuser -pflowpassword flow < dev/database/sql/create_nodes_table.sql
docker exec -i flow_mysql mysql -u flowuser -pflowpassword flow < dev/database/sql/create_edges_table.sql
```

## 論理削除機能

このデータベース設計では**論理削除（Soft Delete）**機能を実装しています。

### 論理削除とは

- データを物理的に削除せず、`is_deleted`フラグを`TRUE`に設定することでデータを「削除済み」としてマークする仕組み
- 物理削除とは異なり、データはデータベースに残り続けるため、必要時にデータを復旧できる
- 誤操作やシステム障害からの復旧、データ監査などの用途に有効

### is_deleted フィールドの仕様

- **データ型**: `BOOLEAN`
- **デフォルト値**: `FALSE`（削除されていない状態）
- **削除時の動作**: `is_deleted = TRUE`に設定
- **インデックス**: 検索性能向上のため全テーブルに`idx_is_deleted`インデックスを設定

### 使用例

```sql
-- データの論理削除
UPDATE users SET is_deleted = TRUE WHERE uuid = 'target-uuid';

-- 削除されていないデータのみを取得
SELECT * FROM users WHERE is_deleted = FALSE;

-- 削除されたデータの復旧
UPDATE users SET is_deleted = FALSE WHERE uuid = 'target-uuid';
```

## 注意事項

- ユーザーが削除されると、関連するすべてのプロジェクト、コード、ノード、エッジも削除されます（CASCADE 設定）
- プロジェクトが削除されると、関連するコード、ノード、エッジも削除されます
- ノード ID はフローチャート内でのみ有効であり、重複する可能性があります
- source_node_id と target_node_id も同様に重複する可能性があります
- UUID は自動生成され、グローバルに一意であることが保証されます
- パスワードは必ずハッシュ化して保存してください（BCrypt など）
- **論理削除されたデータは通常のクエリでは除外する必要があります**（`WHERE is_deleted = FALSE`条件を追加）
- **論理削除により、データベースサイズが増加する可能性があります**（定期的なクリーンアップを検討）

## 更新履歴

### v2.0 (UUID 版) - 2025-01-12

- 全テーブルで UUID 主キーを采用
- projects テーブルを追加し、プロジェクト中心の設計に変更
- edges テーブルから code_uuid を削除、プロジェクトレベルでの管理に簡略化
- node_id 関連のユニーク制約とインデックスを削除（重複可能に変更）
