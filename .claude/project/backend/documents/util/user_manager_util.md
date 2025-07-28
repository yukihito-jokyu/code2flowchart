# ユーザー管理クラス

## 概要

Google OAuth2認証に対応したユーザー操作を管理するクラスです。Google認証によるユーザーの自動作成・取得機能を提供し、SQLAlchemy を使用したデータベース操作を抽象化しています。

### UserManagerクラス

#### 初期化
- **__init__(self, db: Session)**: データベースセッションを受け取り初期化

#### Google OAuth2対応ユーザー作成機能
- **create_user(self, email: str, password: str, user_name: str = None) -> Optional[User]**: Google認証用新規ユーザーの作成
  - **ユーザー名自動生成**: user_name が提供されない場合、メールアドレスの@より前の部分を使用
  - **重複回避システム**: 同じユーザー名が存在する場合は数字を付加（削除済みユーザーも含めてチェック）
  - **ランダムパスワード設定**: Google認証用のランダムパスワードをそのまま保存
  - **エラーハンドリング**: IntegrityError 発生時の自動ロールバック処理

#### ユーザー取得機能
- **get_user_by_email(self, email: str, include_deleted: bool = False) -> Optional[User]**: メールアドレスによるユーザー取得
  - Google OAuth2認証時の既存ユーザーチェックに使用
  - 削除済みユーザーの除外オプション（デフォルト: 除外）
- **get_user_by_uuid(self, uuid: str, include_deleted: bool = False) -> Optional[User]**: UUIDによるユーザー取得
  - JWTトークンからのユーザー識別に使用
  - 削除済みユーザーの除外オプション（デフォルト: 除外）

### Google OAuth2認証フロー

1. **新規ユーザー**: `get_user_by_email` でユーザーが存在しない場合、`create_user` で自動作成
2. **既存ユーザー**: Google認証でログインしたユーザーは既存アカウントを使用
3. **ユーザー名生成**: Googleアカウントの表示名または自動生成されたユーザー名を使用

### セキュリティ機能

- **重複チェック**: ユーザー名の重複を防ぐ自動採番システム
- **削除済みユーザー管理**: 論理削除されたユーザーの適切な除外処理
- **Google認証専用パスワード**: ランダム生成されたパスワードで直接ログイン不可
- **データベース整合性**: IntegrityError の適切なハンドリング

### 依存関係

- **sqlalchemy.orm.Session**: データベースセッション管理
- **sqlalchemy.exc.IntegrityError**: データベース制約エラーハンドリング
- **models.user.User**: ユーザーモデル
- **typing.Optional**: 型ヒント