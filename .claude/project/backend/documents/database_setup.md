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
└── init.sql           # データベース初期化スクリプト
```

## セットアップ手順

### 1. データベース起動
```bash
cd dev/database
docker-compose up -d
```

### 2. データベース接続確認
```bash
docker exec -it flow_mysql mysql -u flowuser -p flow
```

### 3. データベース停止
```bash
cd dev/database
docker-compose down
```

## 初期データ
- `users` テーブルにテストデータが挿入されます
- テストユーザー：test_user, admin

## 注意事項
- 本番環境では適切なパスワードとセキュリティ設定を使用してください
- データは `mysql_data` ボリュームに永続化されます