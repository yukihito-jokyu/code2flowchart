# User モデル

## 概要

ユーザー情報を管理するための SQLAlchemy モデルです。認証システムの基盤となり、プロジェクトとの関連を管理し、ソフトデリート機能を提供します。

## モデルのアーキテクチャ

### テーブル名
`users`

### カラム構成

| カラム名 | 型 | 制約 | 説明 |
|----------|-------------|------|------|
| uuid | String(36) | Primary Key | ユーザー識別子（UUID4形式） |
| username | String(50) | Unique, Not Null, Index | ユーザー名 |
| email | String(100) | Unique, Not Null, Index | メールアドレス |
| password_hash | String(255) | Not Null | ハッシュ化されたパスワード |
| is_deleted | Boolean | Not Null, Default: False, Index | ソフトデリートフラグ |
| created_at | DateTime | Server Default: now() | 作成日時 |
| updated_at | DateTime | Server Default: now(), OnUpdate: now() | 更新日時 |

### リレーションシップ

- **Project**: `projects` - ユーザーが所有するプロジェクト一覧（back_populates="user"）

### 主要機能

1. **UUID主キー**: セキュアで予測困難な識別子
2. **ユニーク制約**: username と email の重複を防止
3. **パスワードセキュリティ**: ハッシュ化されたパスワードの保存
4. **ソフトデリート**: データの論理削除（物理削除ではない）
5. **インデックス**: username、email、is_deleted にインデックスを設定し、検索性能を向上
6. **自動タイムスタンプ**: 作成・更新日時の自動記録

### 特徴

- ユーザー名は最大50文字まで
- メールアドレスは最大100文字まで
- パスワードハッシュは最大255文字まで
- プロジェクトとの1対多の関係性
- 認証システムの基盤モデル

### セキュリティ考慮事項

1. **パスワードハッシュ化**: 平文パスワードは保存せず、ハッシュ化済みのみ保存
2. **ユニーク制約**: 重複アカウントの防止
3. **ソフトデリート**: データの完全削除を避け、復元可能な削除

## 依存関係にあるファイル

- `sqlalchemy` - ORM フレームワーク
- `models/project.py` - Project モデル（リレーションシップ）
- `schemas/auth.py` - 認証関連の Pydantic スキーマ
- `lib/auth/user_manager.py` - ユーザー管理ビジネスロジック
- `routes/auth.py` - 認証 API エンドポイント

## ドキュメント更新履歴

- 2025-07-13: 初回作成