# フローチャート生成API

## 概要

コードを解析してフローチャートを生成するAPIを提供します。Azure OpenAI APIを使用してコードの静的解析を行い、ノードとエッジからなるフローチャートデータを生成します。

## 主要な API の説明

### POST /api/flowchart/generate

### API の概要

入力されたコードを解析し、フローチャート形式のノードとエッジを生成して返します。Azure OpenAI APIによる解析を優先し、失敗時は静的解析にフォールバックします。

### 引数の型

- **request**: `FlowchartGenerateRequest`
  - `code_content`: str - 解析対象のコード
  - `language`: str - プログラミング言語（デフォルト: "python"）
- **current_user**: `User` - 認証済みユーザー（依存性注入）
- **db**: `Session` - データベースセッション（依存性注入）
- **flowchart_service**: `FlowchartService` - フローチャートサービス（依存性注入）

### 戻り値の型

- **FlowchartGenerateResponse**
  - `nodes`: List[FlowchartNodeCreate] - フローチャートノードリスト
  - `edges`: List[EdgeCreate] - フローチャートエッジリスト

### GET /api/flowchart/health

### API の概要

フローチャート生成サービスのヘルスチェックを行います。サービスの動作状況を確認できます。

### 引数の型

- **flowchart_service**: `FlowchartService` - フローチャートサービス（依存性注入）

### 戻り値の型

- **Dict[str, str]**
  - `status`: "healthy"
  - `service`: "flowchart_generation"
  - `message`: ヘルスチェックメッセージ

### 依存関係にあるファイル群

- `schemas/node.py` - フローチャート生成用スキーマ定義
- `services/flowchart_service.py` - フローチャート生成ロジック
- `utils/database.py` - データベース接続
- `lib/auth/middleware.py` - 認証ミドルウェア
- `models/user.py` - ユーザーモデル

## ドキュメント更新履歴

- 2025-07-29: 初版作成 - フローチャート生成API実装