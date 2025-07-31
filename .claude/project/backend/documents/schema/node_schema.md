# Node スキーマ

## 概要

ノード関連のAPI入出力データ構造を定義するPydanticスキーマです。フローチャートのノード情報に関するバリデーション機能とデータ変換機能を提供します。

## 主要な schema の説明

### schema の名前
node.py - ノード関連スキーマ集

### schema の概要
ノードAPIの以下の場面で使用されるデータ構造を定義：
- ノード作成時の入力データ
- ノード更新時の入力データ
- ノード情報のレスポンスデータ
- ノード一覧のレスポンスデータ
- ノード削除時のレスポンスデータ

### schema のアーキテクチャ

#### 1. NodeType (Enum)
**用途**: ノードタイプの定義
**値**:
- `IF` - if文（条件分岐処理）
- `FOR_START` - for文開始（繰り返し処理の開始点）
- `FOR_END` - for文終了（繰り返し処理の終了点）
- `WHILE_START` - while文開始（条件繰り返し処理の開始点）
- `WHILE_END` - while文終了（条件繰り返し処理の終了点）
- `UNKNOWN` - 未知の関数など（外部関数や不明な処理）
- `NORMAL` - その他一般処理（通常の処理ステップ）

#### 2. NodeBase
**用途**: 共通のノード基本フィールド
**フィールド**:
- `node_id: int` - ノードID
- `title: str` - ノードタイトル（1-255文字）
- `code_snippet: Optional[str]` - コードスニペット（任意）
- `info: Optional[str]` - ノード情報（任意）
- `type: NodeType` - ノードタイプ（デフォルト: NORMAL）
- `position_x: int` - X座標（デフォルト: 0）
- `position_y: int` - Y座標（デフォルト: 0）

#### 3. NodeCreate
**用途**: ノード作成時の入力データ
**継承**: NodeBase
**追加フィールド**:
- `project_uuid: str` - プロジェクトUUID
- `code_uuid: str` - コードUUID
**特徴**: 基本フィールドに加えて外部キー情報を含む

#### 4. NodeUpdate
**用途**: ノード更新時の入力データ
**フィールド**:
- `title: Optional[str]` - ノードタイトル（1-255文字、任意）
- `code_snippet: Optional[str]` - コードスニペット（任意）
- `info: Optional[str]` - ノード情報（任意）
- `type: Optional[NodeType]` - ノードタイプ（任意）
- `position_x: Optional[int]` - X座標（任意）
- `position_y: Optional[int]` - Y座標（任意）
**特徴**: 部分更新対応（全フィールドが任意）

#### 5. NodeResponse
**用途**: ノード情報のレスポンスデータ
**継承**: NodeBase
**追加フィールド**:
- `uuid: str` - ノードUUID
- `project_uuid: str` - プロジェクトUUID
- `code_uuid: str` - コードUUID
- `is_deleted: bool` - 削除フラグ
- `created_at: datetime` - 作成日時
- `updated_at: datetime` - 更新日時
**設定**: `from_attributes = True` でSQLAlchemyモデルからの変換対応

#### 6. NodeListResponse
**用途**: ノード一覧のレスポンスデータ
**フィールド**:
- `nodes: list[NodeResponse]` - ノードリスト
- `total: int` - 総件数
**特徴**: ページネーション対応

#### 7. NodeDeleteResponse
**用途**: ノード削除時のレスポンスデータ
**フィールド**:
- `message: str` - 削除完了メッセージ
- `uuid: str` - 削除されたノードUUID

## フローチャート生成用スキーマ

### 8. EdgeCreate
**用途**: フローチャートのエッジ（矢印）作成
**フィールド**:
- `source: int` - ソースノードID
- `target: int` - ターゲットノードID
- `source_handle: str` - ソースの種類（条件分岐の結果など）
**特徴**: ノード間の関係性を表現、条件分岐の真偽値情報を含む

### 9. FlowchartNodeCreate
**用途**: フローチャート生成時のノード作成
**フィールド**:
- `id: int` - ノードID
- `title: str` - ノードタイトル（1-255文字）
- `code: Optional[str]` - コードスニペット（任意）
- `info: Optional[str]` - ノード説明（任意）
- `type: NodeType` - ノードタイプ（デフォルト: NORMAL）
- `position: dict` - ノード位置（x、y座標）
**特徴**: フローチャート表示用に最適化されたノード形式

### 10. FlowchartGenerateRequest
**用途**: フローチャート生成リクエスト
**フィールド**:
- `code_content: str` - 解析対象のコード（必須）
- `language: str` - プログラミング言語（デフォルト: "python"）
**特徴**: コード解析のためのリクエストデータ

### 11. FlowchartGenerateResponse
**用途**: フローチャート生成レスポンス
**フィールド**:
- `nodes: list[FlowchartNodeCreate]` - フローチャートノードリスト
- `edges: list[EdgeCreate]` - フローチャートエッジリスト
**特徴**: 生成されたフローチャートの完全なデータ構造

## バリデーション機能

### 入力データバリデーション
- **title**: 1-255文字の文字列（必須）
- **node_id**: 整数値（必須）
- **position_x/position_y**: 整数値（デフォルト: 0）
- **type**: NodeType enumの値（デフォルト: NORMAL）

### 出力データバリデーション
- **uuid/project_uuid/code_uuid**: 文字列形式のUUID
- **created_at/updated_at**: datetime形式のタイムスタンプ
- **is_deleted**: boolean値

## 依存関係にあるファイル

- `models/node.py` - Node SQLAlchemy モデル（データ変換元）
- `schemas/project.py` - Project スキーマ（関連スキーマ）
- `services/node_service.py` - Node ビジネスロジック（将来実装予定）
- `routes/node.py` - Node API エンドポイント（将来実装予定）
- `services/flowchart_service.py` - フローチャート生成サービス（フローチャート関連スキーマ使用）
- `routes/flowchart.py` - フローチャート生成API（フローチャート関連スキーマ使用）

## ドキュメント更新履歴

- 2025-07-31: フローチャート生成機能の実装内容を最新状態に更新
  - EdgeCreateスキーマにsource_handleフィールドを追加
  - AI生成フローチャートに対応した詳細な説明を更新