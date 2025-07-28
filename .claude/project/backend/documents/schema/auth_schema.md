# Auth スキーマ

## 概要

Google OAuth2認証関連のAPI入出力データ構造を定義するPydanticスキーマです。エラーハンドリングとJWTトークン形式の定義を提供します。

## 主要な schema の説明

### schema の名前
auth.py - 認証関連スキーマ集

### schema の概要
Google OAuth2認証システムAPIの以下の場面で使用されるデータ構造を定義：
- 認証エラー時の出力データ
- JWTトークン形式の定義

### schema のアーキテクチャ

#### 1. AuthError
**用途**: 認証エラー時の出力データ
**フィールド**:
- `message: str` - エラーメッセージ
- `code: str | None` - エラーコード（任意）
**特徴**: 統一されたエラー形式、Google OAuth2エラーに対応

#### 2. Token
**用途**: JWTトークンの標準形式
**フィールド**:
- `access_token: str` - JWTトークン
- `token_type: str` - トークンタイプ（デフォルト: "bearer"）
**特徴**: OAuth2標準に準拠、Google OAuth2認証後のトークン発行に使用

### バリデーション機能

1. **データ型検証**:
   - Pydanticによる自動型チェック
   - 不正なデータ型の自動拒否

2. **エラーメッセージ標準化**:
   - 統一されたエラー形式
   - Google OAuth2エラーの適切な処理

### セキュリティ考慮事項

1. **トークン形式**: 標準的なBearer Token形式を採用
2. **エラー情報の制御**: 適切なエラーコードとメッセージの提供

### 依存関係にあるファイル群

- `pydantic` - BaseModel
- `routes/auth.py` - 認証APIエンドポイント（使用先）