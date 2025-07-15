# データベース環境構築

## 概要

Docker を使用した MySQL データベース環境のセットアップについて説明します。

## 構成

- データベース：MySQL 8.0
- データベース名：flow
- ユーザー：flowuser
- パスワード：flowpassword
- ポート：3306

## ファイル構成

```
dev/database/
├── docker-compose.yml  # MySQL コンテナ設定
├── init.sql           # データベース初期化スクリプト
└── sql/               # 個別テーブル作成SQLファイル
    ├── create_users_table.sql
    ├── create_projects_table.sql
    ├── create_codes_table.sql
    ├── create_nodes_table.sql
    └── create_edges_table.sql
```

## セットアップ手順

### 1. データベース起動

```bash
cd dev/database
docker start flow_mysql
```

### 2. データベース接続確認

```bash
docker exec -it flow_mysql mysql -u flowuser -p flow
```

password:flowpassword

### 3. データベース停止

```bash
cd dev/database
docker stop flow_mysql
```

## 初期データ

- `users` テーブルにテストデータが挿入されます
- テストユーザー：test_user, admin

## 注意事項

- 本番環境では適切なパスワードとセキュリティ設定を使用してください
- データは `mysql_data` ボリュームに永続化されます

## テーブル設計ドキュメント

各テーブルの詳細な設計ドキュメントは以下に配置されています：

- [usersテーブル](./documents/users_table.md) - ユーザー認証と管理
- [projectsテーブル](./documents/projects_table.md) - プロジェクト管理
- [codesテーブル](./documents/codes_table.md) - ノードと紐づくコード管理
- [project_codesテーブル](./documents/project_codes_table.md) - プロジェクトレベルの独立したコード管理
- [nodesテーブル](./documents/nodes_table.md) - フローチャートのノード情報
- [edgesテーブル](./documents/edges_table.md) - ノード間の接続情報

詳細なスキーマ設計については [database_schema.md](./database_schema.md) を参照してください。
