# 認証ディレクトリ構造変更ドキュメント

## 概要

Issue #19 の対応として、認証システムの構造変更と不具合修正を実施しました。

## 変更内容

### 1. ディレクトリ構造変更

**変更前:**
```
dev/backend/auth/
├── __init__.py
├── middleware.py
├── user_manager.py
└── utils.py
```

**変更後:**
```
dev/backend/lib/auth/
├── __init__.py
├── middleware.py
├── user_manager.py
└── utils.py
```

### 2. import パス修正

以下のファイルで import パスを修正しました：

#### routes/auth.py
```python
# 変更前
from auth.user_manager import UserManager
from auth.utils import create_access_token, blacklist_token
from auth.middleware import get_current_user, security

# 変更後
from lib.auth.user_manager import UserManager
from lib.auth.utils import create_access_token, blacklist_token
from lib.auth.middleware import get_current_user, security
```

#### lib/auth/middleware.py
```python
# 変更前
from auth.utils import verify_token
from auth.user_manager import UserManager

# 変更後
from lib.auth.utils import verify_token
from lib.auth.user_manager import UserManager
```

#### routes/project.py
```python
# 変更前
from auth.middleware import get_current_user

# 変更後
from lib.auth.middleware import get_current_user
```

#### lib/auth/user_manager.py
```python
# 変更前
from auth.utils import get_password_hash, verify_password

# 変更後
from lib.auth.utils import get_password_hash, verify_password
```

### 3. user_manager.py の論理修正

`UserManager` クラスの `get_user_by_email` と `get_user_by_uuid` メソッドで、削除済みユーザーのフィルタリング条件を修正しました。

**修正箇所:**
- 44行目: `get_user_by_email` メソッド
- 53行目: `get_user_by_uuid` メソッド

```python
# 変更前
if not include_deleted:
    query = query.filter(User.is_deleted is False)

# 変更後
if not include_deleted:
    query = query.filter(User.is_deleted == include_deleted)
```

## 変更理由

### ディレクトリ構造変更
- 認証機能を `lib` ディレクトリ下に移動することで、ライブラリ的な機能の整理を行う
- プロジェクトの構造をより明確にし、機能の分離を図る

### 論理修正
- `is False` から `== include_deleted` への変更により、パラメータの意図をより明確に表現
- コードの可読性向上と論理的な一貫性の確保

## 影響範囲

- **影響ファイル数**: 4ファイル
- **修正箇所数**: 合計9箇所（import修正7箇所 + 論理修正2箇所）
- **移動ファイル数**: authディレクトリ全体（4ファイル）

## 注意事項

この変更により、今後新たに認証機能を使用するファイルを作成する際は、`lib.auth` パッケージからimportする必要があります。

例:
```python
from lib.auth.user_manager import UserManager
from lib.auth.utils import create_access_token
from lib.auth.middleware import get_current_user
```

## 関連Issue

- Issue #19: is Falseの修正とauthディレクトリの移動