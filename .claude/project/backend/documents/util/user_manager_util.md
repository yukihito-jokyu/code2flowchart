# ユーザー管理クラス

## 概要

データベースに対するユーザー操作を管理するクラスです。ユーザーの作成、取得、認証機能を提供し、SQLAlchemy を使用したデータベース操作を抽象化しています。

### UserManagerクラス

#### 初期化
- **__init__(self, db: Session)**: データベースセッションを受け取り初期化

#### ユーザー作成機能
- **create_user(self, email: str, password: str, user_name: str = None) -> Optional[User]**: 新規ユーザーの作成
  - メールアドレスからユーザー名を自動生成（@より前の部分）
  - 重複するユーザー名の場合は数字を付加（削除済みユーザーも含めてチェック）
  - パスワードの自動ハッシュ化
  - IntegrityError 発生時の自動ロールバック処理

#### ユーザー取得機能
- **get_user_by_email(self, email: str, include_deleted: bool = False) -> Optional[User]**: メールアドレスによるユーザー取得
  - 削除済みユーザーの除外オプション（デフォルト: 除外）
- **get_user_by_uuid(self, uuid: str, include_deleted: bool = False) -> Optional[User]**: UUIDによるユーザー取得
  - 削除済みユーザーの除外オプション（デフォルト: 除外）

#### 認証機能
- **authenticate_user(self, email: str, password: str) -> Optional[User]**: ユーザー認証
  - メールアドレスとパスワードによる認証
  - 削除済みユーザーは認証不可
  - パスワード検証は auth_util の verify_password を使用

### セキュリティ機能

- **重複チェック**: ユーザー名の重複を防ぐ自動採番システム
- **削除済みユーザー管理**: 論理削除されたユーザーの適切な除外処理
- **パスワードセキュリティ**: 平文パスワードは保存せず、ハッシュ化のみ処理
- **データベース整合性**: IntegrityError の適切なハンドリング

### 依存関係

- **sqlalchemy.orm.Session**: データベースセッション管理
- **sqlalchemy.exc.IntegrityError**: データベース制約エラーハンドリング
- **models.user.User**: ユーザーモデル
- **lib.auth.utils**: パスワードハッシュ化・検証機能

## ドキュメント更新履歴

- 2025-07-27: 初回作成