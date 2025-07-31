# フローチャート生成API

## 概要

コードを解析してフローチャートを生成するAPIを提供します。Azure OpenAI APIを使用したAI生成と静的解析によるフォールバック機能を持つ、ノードとエッジからなるフローチャートデータ生成システムです。

## 主要な API の説明

### POST `/api/flowchart/generate` - フローチャート生成

### API の概要
入力されたコードを解析し、フローチャート形式のノードとエッジを生成します。認証が必要です。

### 引数の型
- `request: FlowchartGenerateRequest`
  - `code_content: str` - 解析対象のコード（必須、最小長1）
  - `language: str` - プログラミング言語（デフォルト: "python"）
- `current_user: User` - 認証済みユーザー（依存性注入）
- `db: Session` - データベースセッション（依存性注入）
- `flowchart_service: FlowchartService` - フローチャートサービス（依存性注入）

### 戻り値の型
- `FlowchartGenerateResponse`
  - `nodes: List[FlowchartNodeCreate]` - フローチャートノードリスト
  - `edges: List[EdgeCreate]` - フローチャートエッジリスト

### エラー処理
- **500 Internal Server Error**: フローチャート生成に失敗した場合
  - 詳細なエラーメッセージを含むJSON応答

### 処理フロー
1. リクエストの検証（認証、リクエストボディ）
2. FlowchartServiceによるフローチャート生成
3. 生成結果の返却
4. エラー時は500エラーとエラーメッセージを返却

### GET `/api/flowchart/health` - ヘルスチェック

### API の概要
フローチャート生成サービスの稼働状況を確認します。認証不要のパブリックエンドポイントです。

### 引数の型
- `flowchart_service: FlowchartService` - フローチャートサービス（依存性注入）

### 戻り値の型
- `Dict[str, str]`
  - `status`: "healthy"
  - `service`: "flowchart_generation"
  - `message`: "フローチャート生成サービスは正常に動作しています"

## サービス依存性注入機能

### `get_flowchart_service()` - FlowchartServiceファクトリ

### 機能概要
FlowchartServiceのインスタンスを生成し、Azure OpenAI設定の検証を行います。

### 環境変数検証
- `AZURE_OPENAI_API_KEY` - Azure OpenAI APIキー（必須）
- `AZURE_OPENAI_ENDPOINT` - Azure OpenAIエンドポイント（必須）
- `AZURE_OPENAI_API_VERSION` - Azure OpenAI APIバージョン
- `AZURE_OPENAI_DEPLOYMENT_NAME` - Azure OpenAIデプロイメント名

### エラー処理
- **500 Internal Server Error**: 必須環境変数が未設定の場合
  - メッセージ: "Azure OpenAI設定が不正です。API_KEYとENDPOINTを確認してください。"

### 依存関係にあるファイル群

**外部ライブラリ**:
- `fastapi` - APIRouter, Depends, HTTPException, status
- `sqlalchemy.orm` - Session
- `typing` - Dict
- `os` - 環境変数取得
- `dotenv` - load_dotenv

**内部モジュール**:
- `utils/database` - get_db
- `lib/auth/middleware` - get_current_user
- `models/user` - User
- `schemas/node` - FlowchartGenerateRequest, FlowchartGenerateResponse
- `services/flowchart_service` - FlowchartService

**環境変数**:
- `AZURE_OPENAI_API_KEY` - Azure OpenAI APIキー
- `AZURE_OPENAI_ENDPOINT` - Azure OpenAIエンドポイント
- `AZURE_OPENAI_API_VERSION` - Azure OpenAI APIバージョン
- `AZURE_OPENAI_DEPLOYMENT_NAME` - Azure OpenAIデプロイメント名

## ドキュメント更新履歴

- 2025-07-31: Azure OpenAI統合とエラーハンドリング機能の実装内容を最新状態に更新