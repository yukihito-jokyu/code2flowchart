# ファイル path

```
src/features/flowchart/utils/flowchartConverter.ts
```

# コンポーネントの情報

## convertApiResponseToFlowchart

- コンポーネントの説明
  - バックエンドAPIのレスポンスをフロントエンドのフローチャート形式に変換するユーティリティ関数
  - APIから取得したノードとエッジのデータをReact Flow用のデータ構造に変換
  - ノードタイプのマッピング機能を提供し、バックエンドとフロントエンドの命名規則の違いを吸収

- 依存関係にあるファイル
  - `../api/index` - FlowchartGenerateResponse, FlowchartNodeResponse, FlowchartEdgeResponse型定義
  - `../types/index` - FlowchartNode, FlowchartEdge, FlowchartNodeType型定義

- plops の型と説明
  ```typescript
  // 入力パラメータ
  interface FlowchartGenerateResponse {
    nodes: FlowchartNodeResponse[];  // バックエンドからのノードデータ配列
    edges: FlowchartEdgeResponse[];  // バックエンドからのエッジデータ配列
  }

  // 戻り値の型
  interface ConvertedFlowchart {
    nodes: FlowchartNode[];  // React Flow用ノードデータ配列
    edges: FlowchartEdge[];  // React Flow用エッジデータ配列
  }

  // ノードタイプマッピング
  type NodeTypeMapping = {
    if: 'if';
    for_start: 'forStart';
    for_end: 'forEnd';
    while_start: 'whileStart';
    while_end: 'whileEnd';
    unknown: 'unknown';
    normal: 'normal';
  }
  ```

## mapNodeTypeFromBackend

- コンポーネントの説明
  - バックエンドのノードタイプをフロントエンドの命名規則に変換する静的関数
  - スネークケースからキャメルケースへの変換を担当
  - 未知のタイプの場合は 'normal' をデフォルト値として返す

- 依存関係にあるファイル
  - `../types/index` - FlowchartNodeType型定義

- plops の型と説明
  ```typescript
  // 入力パラメータ
  backendType: string  // バックエンドから取得したノードタイプ（スネークケース）

  // 戻り値の型
  FlowchartNodeType    // フロントエンド用ノードタイプ（キャメルケース）
  ```

## 変換処理の詳細

### ノード変換機能
- **ID変換**: 数値IDを文字列IDに変換（React Flow要件）
- **位置座標**: バックエンドの座標をそのまま使用
- **ノードタイプ**: `mapNodeTypeFromBackend`でキャメルケースに変換
- **データ構造**: title, code, info をdata オブジェクトに格納

### エッジ変換機能
- **エッジID生成**: ソースとターゲットIDから一意のエッジIDを生成（`e${source}-${target}`）
- **ID変換**: 数値IDを文字列IDに変換
- **ソースハンドル**: 'None'以外の場合のみsourceHandleプロパティを設定
- **エッジ設定**: type='step', animated=true をデフォルト設定

### エラーハンドリング
- 未知のノードタイプは 'normal' にフォールバック
- 型安全性を保証するTypeScriptインターフェース使用

## 更新履歴

- 2025-07-31: 初版作成 - バックエンドAPI統合に対応したコンバーター機能を実装