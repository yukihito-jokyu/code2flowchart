# フローチャート生成サービス

## 概要

コードを解析してフローチャートを生成するサービスです。Azure OpenAI APIを使用したAI解析と、Pythonの静的解析を組み合わせて、高精度なフローチャート生成を提供します。

## 主要な service の説明

### service の名前

FlowchartService

### service の概要

入力されたコードをAIまたは静的解析で処理し、フローチャート形式のノードとエッジを生成します。主にAzure OpenAI APIを使用しますが、失敗時にはPythonのASTを使った静的解析にフォールバックする仕組みを持っています。

### 主要なメソッドの説明

#### `__init__(api_key: str, endpoint: str, api_version: str, deployment_name: str)`
- Azure OpenAIクライアントの初期化
- 必要な認証情報と設定を保存

#### `generate_flowchart(code: str, language: str = "python") -> FlowchartGenerateResponse`
- フローチャート生成のメインメソッド
- AI生成を優先し、失敗時はフォールバック処理を実行
- 最終的にFlowchartGenerateResponse形式で結果を返却

#### `_generate_with_ai(code: str, language: str) -> Dict[str, Any]` (private)
- Azure OpenAI APIを使用したAI生成処理
- プロンプトエンジニアリングによりフローチャート情報を抽出
- JSON形式での応答を解析して構造化データを生成

#### `_generate_fallback_flowchart(code: str, language: str) -> Dict[str, Any]` (private)
- AI生成失敗時のフォールバック処理
- Pythonの場合は静的解析、その他の言語は基本ノード生成

#### `_analyze_python_code(code: str) -> List[Dict[str, Any]]` (static)
- Pythonコードの静的解析
- ASTを使用してif文、for文、while文、関数定義を検出
- 各構文要素をフローチャートノードに変換

#### `_generate_edges(nodes: List[Dict[str, Any]]) -> List[EdgeCreate]` (static)
- ノード間の順次実行エッジを生成
- 基本的な制御フローに基づくエッジ作成

#### `_calculate_positions(nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]` (static)
- フローチャートノードの配置位置を計算
- ノードタイプに応じて適切な座標を設定

- 依存関係にあるファイル群
  - `schemas/node.py` - フローチャート生成用スキーマ定義
  - `openai` - Azure OpenAI APIクライアント
  - `ast` - Python標準ライブラリの抽象構文木
  - `json`, `re`, `logging` - 標準ライブラリ

## ドキュメント更新履歴

- 2025-07-29: 初版作成 - FlowchartService実装