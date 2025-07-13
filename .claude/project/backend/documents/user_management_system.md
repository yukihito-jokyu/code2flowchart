# ファイル path

```
dev/backend/
├── models/user.py              # ユーザーデータモデル
├── auth/user_manager.py        # ユーザー管理ロジック
├── schemas/auth.py             # API入出力スキーマ
└── utils/database.py           # データベース接続管理
```

# ユーザー管理システム

## 概要

SQLAlchemyを使用したユーザーデータの管理システム。UUIDベースの主キーとbcryptによるパスワードセキュリティを実装。

## データモデル

### User Model (SQLAlchemy)

```python
class User(Base):
    __tablename__ = "users"
    
    uuid = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
```

#### フィールド詳細
- **uuid**: Python側で生成されるUUIDv4（36文字の文字列）
- **username**: メールアドレスから自動生成（@より前の部分、重複時は数字付加）
- **email**: ユニーク制約付きメールアドレス
- **password_hash**: bcryptハッシュ化されたパスワード（255文字）
- **created_at/updated_at**: 自動管理されるタイムスタンプ

## ユーザー管理機能

### UserManager Class

#### create_user(email, password)
- 新規ユーザーの作成
- usernameの自動生成と重複回避
- パスワードのbcryptハッシュ化
- データベーストランザクション管理
- IntegrityError例外ハンドリング

#### get_user_by_email(email)
- メールアドレスによるユーザー検索
- インデックス最適化済み

#### get_user_by_uuid(uuid)
- UUIDによるユーザー検索
- 認証後のユーザー情報取得に使用

#### authenticate_user(email, password)
- ユーザー認証の実行
- メールアドレス存在確認
- パスワード検証（bcrypt）
- 認証成功時にUserオブジェクト返却

## Pydantic スキーマ

### リクエストスキーマ
```python
class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
```

### レスポンススキーマ
```python
class SignupResponse(BaseModel):
    id: str          # UUID
    email: str
    message: str

class LoginResponse(BaseModel):
    id: str          # UUID
    email: str
    token: str       # JWT
    message: str
```

## データベース接続

### 設定
- **URL**: mysql+pymysql://flowuser:flowpassword@localhost:3306/flow
- **接続プール**: SQLAlchemy Engine
- **セッション管理**: SessionLocal (autocommit=False, autoflush=False)
- **依存性注入**: FastAPIのDepends()でセッション管理

### get_db() Generator
```python
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## セキュリティ実装

### パスワード処理
- **ハッシュ化**: passlib.context.CryptContext + bcrypt
- **ソルト**: bcrypt内蔵の自動ソルト生成
- **検証**: 定数時間比較でタイミング攻撃を防止

### ユーザー識別
- **主キー**: UUIDv4 (128bit ランダム)
- **衝突確率**: 実質的にゼロ
- **推測困難性**: 暗号学的に安全

### データ整合性
- **ユニーク制約**: email, username
- **インデックス**: 検索性能の最適化
- **外部キー**: 将来の機能拡張に対応

## エラーハンドリング

### IntegrityError処理
- データベース制約違反の捕捉
- ロールバック処理
- None返却でエラー伝播

### バリデーション
- Pydantic による自動バリデーション
- EmailStr型による厳密なメール検証
- Field制約による最小パスワード長