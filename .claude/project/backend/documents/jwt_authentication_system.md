# ファイル path

```
dev/backend/
├── auth/utils.py               # JWT生成・検証・ブラックリスト管理
├── auth/middleware.py          # 認証ミドルウェア・デコレータ
└── routes/auth.py             # JWT統合されたAPIエンドポイント
```

# JWT認証システム

## 概要

JSON Web Token (JWT) を使用したステートレス認証システム。セキュリティとスケーラビリティを両立し、フロントエンドとのAPIトークン認証を実現。

## JWT設定

### 基本パラメータ
```python
SECRET_KEY = secrets.token_urlsafe(32)  # 32バイトのランダム秘密鍵
ALGORITHM = "HS256"                     # HMAC-SHA256アルゴリズム
ACCESS_TOKEN_EXPIRE_MINUTES = 30        # 30分有効期限
```

### セキュリティ特徴
- **秘密鍵**: secrets モジュールによる暗号学的に安全なランダム生成
- **アルゴリズム**: HMAC-SHA256による署名検証
- **有効期限**: 短期間(30分)でセキュリティリスクを最小化

## トークン管理

### create_access_token(data, expires_delta)
```python
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=30))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

#### ペイロード構造
- **sub**: ユーザーUUID（主体識別子）
- **exp**: 有効期限（UNIX timestamp）
- **iat**: 発行時刻（自動付与）

### verify_token(token)
```python
def verify_token(token: str) -> Optional[dict]:
    try:
        if token in blacklisted_tokens:
            return None
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
```

#### 検証プロセス
1. **ブラックリストチェック**: ログアウト済みトークンの確認
2. **署名検証**: HMAC-SHA256による改ざん検出
3. **有効期限確認**: exp クレームの自動検証
4. **ペイロード返却**: 検証成功時のクレーム取得

## ブラックリスト機能

### メモリベース実装
```python
blacklisted_tokens = set()  # メモリ内ブラックリスト

def blacklist_token(token: str):
    blacklisted_tokens.add(token)
```

#### 特徴と制限
- **高速アクセス**: O(1) の集合操作
- **揮発性**: アプリケーション再起動で消失
- **スケーラビリティ**: 本番環境ではRedis/Memcached推奨

### 改善案（本番環境）
- Redis Cluster による分散ブラックリスト
- TTL機能による自動期限切れ
- 永続化ストレージとの統合

## 認証ミドルウェア

### HTTPBearer セキュリティ
```python
security = HTTPBearer()  # FastAPI セキュリティスキーム
```

#### Authorization ヘッダー形式
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### get_current_user (必須認証)
```python
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
```

#### 処理フロー
1. **ヘッダー抽出**: Bearer トークンの取得
2. **トークン検証**: JWT署名・有効期限・ブラックリスト確認
3. **ユーザー検索**: UUIDによるデータベース検索
4. **例外処理**: 401 Unauthorized エラーの適切な返却

### get_current_user_optional (オプション認証)
```python
async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db)
) -> Optional[User]:
```

#### 用途
- 認証オプショナルなエンドポイント
- ゲストアクセスと認証済みアクセスの混在
- エラーを発生させずNone返却

## API統合

### ログインエンドポイント
```python
@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = user_manager.authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user.uuid})
    return LoginResponse(id=user.uuid, email=user.email, token=access_token, message="Login successful")
```

### ログアウトエンドポイント
```python
@router.post("/logout", response_model=LogoutResponse)
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    current_user: User = Depends(get_current_user)
):
    blacklist_token(credentials.credentials)
    return LogoutResponse(message="Logout successful")
```

## セキュリティ考慮事項

### 強度
- **HMAC-SHA256**: 業界標準の署名アルゴリズム
- **秘密鍵管理**: メモリ内保持、環境変数からの読み込み推奨
- **短期有効期限**: セッションハイジャックリスクの軽減

### 脆弱性対策
- **リプレイ攻撃**: 有効期限による時間制限
- **中間者攻撃**: HTTPS必須（本番環境）
- **XSS攻撃**: HttpOnly Cookieの検討（将来拡張）

### 監査ログ
- 認証失敗ログ
- トークン発行・無効化ログ
- 異常なアクセスパターンの検出

## 拡張可能性

### リフレッシュトークン
- 長期間有効なリフレッシュトークン
- アクセストークンの自動更新
- より安全なセッション管理

### マルチデバイス対応
- デバイス別トークン管理
- 選択的ログアウト機能
- 同時セッション数制限