# フローチャート生成サービス

## 概要

コードを解析してフローチャートを生成するサービスです。Azure OpenAI APIを使用したAI解析と、Pythonの静的解析を組み合わせた二段階のフローチャート生成システムを提供します。

## 主要な service の説明

### FlowchartService

### service の概要

入力されたコードをAI生成または静的解析で処理し、フローチャート形式のノードとエッジを生成します。Azure OpenAI APIによるAI生成を第一選択とし、失敗時にはPythonのASTを使った静的解析にフォールバックする堅牢な設計です。

### 主要なメソッドの説明

#### `__init__(api_key: str, endpoint: str, api_version: str, deployment_name: str)`
**機能**: Azure OpenAIクライアントの初期化と設定保存
**処理内容**:
- AzureOpenAIクライアントの作成
- 認証情報（API key、endpoint、API version）の設定
- デプロイメント名の保存
- 初期化完了ログの出力
**エラー処理**: 初期化失敗時はログ出力後、例外を再発生

#### `async generate_flowchart(code: str, language: str = "python") -> FlowchartGenerateResponse`
**機能**: フローチャート生成のメインエンドポイント
**処理フロー**:
1. AI生成（`_generate_with_ai`）を試行
2. AI生成が失敗した場合、フォールバック処理（`_generate_fallback_flowchart`）を実行
3. 生成されたデータをFlowchartGenerateResponse形式に変換
4. ノードとエッジの検証・変換処理
**戻り値**: `FlowchartGenerateResponse`（ノードリストとエッジリスト）
**エラー処理**: 変換エラー時は警告ログを出力し、エラーノード/エッジをスキップ

#### `async _generate_with_ai(code: str, language: str) -> Dict[str, Any]`
**機能**: Azure OpenAI APIを使用したAI生成処理
**処理内容**:
- 詳細なプロンプトエンジニアリングによるフローチャート生成指示
- ChatCompletions APIへのリクエスト送信
- JSON応答の正規表現による抽出と解析
- 生成結果の構造検証
**プロンプト特徴**:
  - step by step実行指示
  - ノードタイプの詳細定義（if/for_start/for_end/while_start/while_end/unknown/normal）
  - エッジのsourceHandle設定（条件分岐の真偽値対応）
  - 位置座標の自動計算（Y軸200間隔、X軸150間隔）
**フォールバック**: AI生成失敗時は`_generate_fallback_flowchart`に移行

#### `_generate_fallback_flowchart(code: str, language: str) -> Dict[str, Any]`
**機能**: AI生成失敗時のフォールバック処理
**処理分岐**:
- Python: `_analyze_python_code`による静的解析
- その他の言語: 基本ノード生成
**処理内容**:
1. 言語別のノード生成
2. `_calculate_positions`による位置計算
3. `_generate_edges`によるエッジ生成
4. 最終データ構造の組み立て

#### `@staticmethod _analyze_python_code(code: str) -> List[Dict[str, Any]]`
**機能**: Pythonコードの静的解析によるノード抽出
**解析対象**:
- `ast.If`: 条件分岐（if文、elif文）
- `ast.For`: for文による繰り返し処理
- `ast.While`: while文による条件繰り返し処理
- `ast.FunctionDef`: 関数定義
**データ抽出**:
- ノードID（連番）
- ノードタイプ（NodeType enum）
- タイトル（構文種別＋ID）
- コードスニペット（`ast.get_source_segment`使用）
- 説明文
- 行番号
**エラー処理**: 構文エラー時は「構文エラー」ノードを生成

#### `@staticmethod _generate_edges(nodes: List[Dict[str, Any]]) -> List[EdgeCreate]`
**機能**: ノード間の順次実行エッジ生成
**処理**: 隣接するノード間にエッジを作成（基本的な制御フロー）
**戻り値**: `EdgeCreate`オブジェクトのリスト

#### `@staticmethod _calculate_positions(nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]`
**機能**: フローチャートノードの2D配置位置計算
**配置ルール**:
- 基本X座標: 200
- FOR_START/WHILE_START: X+50（右寄り）
- FOR_END/WHILE_END: X-50（左寄り）
- Y座標: 100間隔で順次配置
**戻り値**: 位置情報を含むノードデータ

### 依存関係にあるファイル群

**外部ライブラリ**:
- `openai.AzureOpenAI` - Azure OpenAI APIクライアント
- `ast` - Python抽象構文木解析
- `json` - JSON形式データ処理
- `re` - 正規表現による文字列抽出
- `logging` - ログ出力
- `typing` - 型ヒント

**内部モジュール**:
- `schemas.node` - FlowchartNodeCreate, EdgeCreate, FlowchartGenerateResponse, NodeType

**ログ機能**:
- 処理開始・完了の詳細ログ
- エラー・警告時のログ出力
- デバッグ情報（コード長、生成ノード数など）

## ドキュメント更新履歴

- 2025-07-31: Azure OpenAI統合とフォールバック機能の実装内容を最新状態に更新