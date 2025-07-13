# ファイル path

```
dev/backend/
├── main.py                     # CORS設定・アプリケーション設定
├── auth/utils.py               # パスワードハッシュ化・JWT暗号化
├── auth/middleware.py          # 認証・認可処理
├── routes/auth.py             # セキュアなAPIエンドポイント
└── schemas/auth.py            # 入力検証スキーマ
```

# API セキュリティ実装

## 概要

FastAPI を基盤とした包括的な API セキュリティシステム。CORS、認証、認可、入力検証、暗号化を統合してセキュアな WebAPI を提供。

## CORS (Cross-Origin Resource Sharing) 設定

### 設定内容

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React開発サーバーのみ許可
    allow_credentials=True,                   # 認証情報の送信を許可
    allow_methods=["*"],                      # 全HTTPメソッドを許可
    allow_headers=["*"],                      # 全ヘッダーを許可
)
```

### セキュリティ考慮事項

- **制限的オリジン**: 開発環境の特定ポートのみ許可
- **本番環境**: プロダクションドメインに限定すべき
- **Credentials**: JWT 認証での Cookie/Header アクセスに必要

## パスワードセキュリティ

### bcrypt ハッシュ化

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
```

#### セキュリティ特徴

- **適応的ハッシュ**: 計算コストの調整可能
- **ソルト自動生成**: レインボーテーブル攻撃対策
- **定数時間比較**: タイミング攻撃防止
- **アルゴリズム進化**: deprecated="auto" で将来対応

### パスワードポリシー

```python
password: str = Field(..., min_length=8)  # Pydantic検証
```

- **最小長**: 8 文字（フロントエンドと共通）
- **複雑性**: 将来的にパターンマッチング追加可能
- **履歴**: パスワード再利用防止（将来拡張）

## 入力検証・サニタイゼーション

### Pydantic バリデーション

```python
from pydantic import BaseModel, EmailStr, Field

class SignupRequest(BaseModel):
    email: EmailStr                    # RFC準拠メール検証
    password: str = Field(..., min_length=8)  # 最小長制約
```

#### 検証レベル

1. **型検証**: 基本的なデータ型チェック
2. **形式検証**: EmailStr による RFC5322 準拠
3. **制約検証**: Field による長さ・パターン制約
4. **カスタム検証**: validator デコレータで独自ルール

### SQL インジェクション対策

```python
# SQLAlchemy ORM使用 - 自動的にパラメータ化クエリ
user = db.query(User).filter(User.email == email).first()
```

- **ORM 使用**: 生の SQL クエリを回避
- **パラメータ化**: 自動的なエスケープ処理
- **型安全性**: Python 型システムによる保護

## 認証・認可システム

### 多層認証

1. **トークン形式検証**: Bearer 形式の確認
2. **JWT 署名検証**: HMAC-SHA256 による完全性確認
3. **有効期限確認**: exp クレームの自動検証
4. **ブラックリスト確認**: ログアウト済みトークンの拒否
5. **ユーザー存在確認**: データベースでの最終確認

### 認可レベル

```python
# 必須認証エンドポイント
@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):

# オプション認証エンドポイント
async def optional_endpoint(user: Optional[User] = Depends(get_current_user_optional)):
```

## エラーハンドリング・情報漏洩防止

### 適切な HTTP ステータス

```python
# 認証失敗 - 具体的な理由を隠蔽
raise HTTPException(status_code=401, detail="Incorrect email or password")

# 認可失敗 - トークン無効
raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# リソース不存在 - ユーザー特定を防止
raise HTTPException(status_code=401, detail="User not found")
```

### セキュリティヘッダー

```python
headers={"WWW-Authenticate": "Bearer"}  # 認証方式の明示
```

## レート制限・DoS 対策

### 実装検討事項（将来拡張）

- **slowapi**: FastAPI 向けレート制限ライブラリ
- **Redis**: セッション共有・レート制限カウンタ
- **IP 制限**: 地理的・異常トラフィック対策

### 現在の対策

- **JWT 有効期限**: 短期間(30 分)でセッション制限
- **パスワードハッシュ**: 計算コスト調整でブルートフォース対策

## ログ・監査

### セキュリティイベント

```python
# 実装推奨事項
- 認証試行（成功・失敗）
- トークン発行・無効化
- 権限エラー・異常アクセス
- パスワード変更・アカウント操作
```

### 個人情報保護

- **パスワード**: ログ出力絶対禁止
- **JWT**: 部分マスキング (例: "eyJhbG...\*\*\*")
- **メールアドレス**: 必要に応じてハッシュ化

## HTTPS・暗号化

### 通信暗号化（本番要件）

```python
# 本番環境設定例
import ssl
ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
ssl_context.load_cert_chain("cert.pem", "key.pem")
```

### データベース暗号化

- **TLS 接続**: MySQL 接続の暗号化
- **機密データ**: 個人情報の暗号化ストレージ
- **鍵管理**: HSM/KMS による鍵ローテーション

## セキュリティ設定チェックリスト

### 開発環境

- [x] CORS 制限設定
- [x] JWT 短期有効期限
- [x] bcrypt パスワードハッシュ化
- [x] Pydantic 入力検証
- [x] SQLAlchemy ORM 使用

### 本番環境要件

- [ ] HTTPS 必須設定
- [ ] セキュリティヘッダー追加
- [ ] レート制限実装
- [ ] 監査ログ設定
- [ ] 鍵管理システム導入
- [ ] セキュリティスキャン実行
