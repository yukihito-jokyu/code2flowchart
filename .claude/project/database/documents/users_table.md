# users テーブル

## 概要

ユーザー認証と管理のためのテーブル。

## スキーマ

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

## フィールド説明

| フィールド名 | データ型 | 制約 | 説明 |
|-------------|----------|------|------|
| `uuid` | CHAR(36) | PRIMARY KEY | ユーザーの一意識別子（UUID） |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | ユーザー名（ユニーク制約） |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | メールアドレス（ユニーク制約） |
| `password_hash` | VARCHAR(255) | NOT NULL | パスワードのハッシュ値 |
| `is_deleted` | BOOLEAN | DEFAULT FALSE | 論理削除フラグ |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | アカウント作成日時 |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 最終更新日時 |

## インデックス

- `idx_username`: ユーザー名での検索高速化
- `idx_email`: メールアドレスでの検索高速化
- `idx_is_deleted`: 論理削除データの除外高速化

## 関連テーブル

### 1対多の関係

- `projects`: 1つのユーザーは複数のプロジェクトを持つことができる
  - 外部キー: `projects.user_uuid` → `users.uuid`
  - カスケード削除: ユーザー削除時に関連プロジェクトも削除

## 論理削除

- `is_deleted`フラグによる論理削除機能を実装
- 削除時は物理削除ではなく`is_deleted = TRUE`に設定
- 通常のクエリでは`WHERE is_deleted = FALSE`条件を追加して削除済みデータを除外

## 使用例

```sql
-- ユーザー作成
INSERT INTO users (username, email, password_hash) 
VALUES ('test_user', 'test@example.com', 'hashed_password');

-- アクティブユーザーの取得
SELECT * FROM users WHERE is_deleted = FALSE;

-- ユーザーの論理削除
UPDATE users SET is_deleted = TRUE WHERE uuid = 'user-uuid';

-- 削除されたユーザーの復旧
UPDATE users SET is_deleted = FALSE WHERE uuid = 'user-uuid';
```

## 注意事項

- パスワードは必ずハッシュ化して保存（BCryptなど推奨）
- UUIDは自動生成され、グローバルに一意性が保証される
- ユーザー削除時は関連するすべてのデータがカスケード削除される
- 論理削除により通常のクエリでは削除済みデータを除外する必要がある