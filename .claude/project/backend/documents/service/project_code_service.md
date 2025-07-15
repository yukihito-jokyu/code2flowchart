# ProjectCode Service

## 概要

ProjectCode Service は、プロジェクトレベルのコード管理機能におけるビジネスロジックを担当するサービスクラスです。データベース操作、データ変換、業務ルールの適用を行います。

## 主要な service の説明

### service の名前

ProjectCodeService

### service の概要

プロジェクトコードに関する CRUD 操作とビジネスロジックを提供する静的メソッドクラスです。

### 主要なメソッドの説明

#### create_project_code

**概要**: 新しいプロジェクトコードを作成します。

**引数**:
```python
db: Session - データベースセッション
project_code_data: ProjectCodeCreate - 作成データ
user_uuid: str - ユーザーUUID
```

**戻り値**: `ProjectCode` - 作成されたプロジェクトコード

**処理内容**:
1. プロジェクトの存在確認とアクセス権限チェック
2. 新しいProjectCodeインスタンスの作成
3. データベースへの保存とコミット

#### get_project_code_by_uuid

**概要**: UUIDでプロジェクトコードを取得します。

**引数**:
```python
db: Session - データベースセッション
code_uuid: str - コードUUID
user_uuid: str - ユーザーUUID
```

**戻り値**: `Optional[ProjectCode]` - プロジェクトコード（存在しない場合はNone）

**処理内容**:
1. データベースからコードを検索
2. ユーザー権限とソフトデリート状態の確認
3. 結果を返却

#### get_project_codes_by_project

**概要**: プロジェクトに関連するコード一覧を取得します。

**引数**:
```python
db: Session - データベースセッション
project_uuid: str - プロジェクトUUID
user_uuid: str - ユーザーUUID
skip: int - スキップ件数（デフォルト: 0）
limit: int - 取得件数（デフォルト: 100）
```

**戻り値**: `List[ProjectCode]` - プロジェクトコード一覧

**処理内容**:
1. データベースからコード一覧を取得
2. ページネーション処理
3. 更新日時の降順でソート

#### get_project_codes_count

**概要**: プロジェクトに関連するコードの総数を取得します。

**引数**:
```python
db: Session - データベースセッション
project_uuid: str - プロジェクトUUID
user_uuid: str - ユーザーUUID
```

**戻り値**: `int` - コード総数

**処理内容**:
1. データベースからコード数をカウント
2. ソフトデリート済みは除外

#### update_project_code

**概要**: プロジェクトコードを更新します。

**引数**:
```python
db: Session - データベースセッション
code_uuid: str - コードUUID
user_uuid: str - ユーザーUUID
project_code_data: ProjectCodeUpdate - 更新データ
```

**戻り値**: `Optional[ProjectCode]` - 更新されたプロジェクトコード

**処理内容**:
1. 既存コードの取得と権限確認
2. 更新データの適用
3. updated_at の更新とコミット

#### soft_delete_project_code

**概要**: プロジェクトコードをソフトデリートします。

**引数**:
```python
db: Session - データベースセッション
code_uuid: str - コードUUID
user_uuid: str - ユーザーUUID
```

**戻り値**: `bool` - 削除成功時はTrue

**処理内容**:
1. 既存コードの取得と権限確認
2. is_deleted フラグの更新
3. updated_at の更新とコミット

## セキュリティ考慮事項

- 全メソッドでユーザー権限の確認を実施
- プロジェクトの存在確認とアクセス権限チェック
- ソフトデリート済みデータの適切な除外

## エラーハンドリング

- プロジェクトが存在しない場合は例外を発生
- 権限がない場合は None を返却
- データベースエラーは上位層に委譲

- 依存関係にあるファイル群

- `models/project_code.py` - データベースモデル
- `models/project.py` - プロジェクトモデル
- `schemas/project_code.py` - データ検証スキーマ
- `routes/project_code.py` - API エンドポイント
- `utils/database.py` - データベース接続

## ドキュメント更新履歴

- 2024-01-XX: 初版作成 - ProjectCode Service の実装 (Issue #25)