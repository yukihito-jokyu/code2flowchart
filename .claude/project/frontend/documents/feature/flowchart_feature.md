# ファイル path

```
src/features/flowchart/
├── components/
│   ├── FlowchartCanvas.tsx
│   ├── NodeToolbar.tsx
│   ├── nodes/
│   │   ├── IfNode.tsx
│   │   ├── ForNode.tsx
│   │   ├── WhileNode.tsx
│   │   ├── UnknownNode.tsx
│   │   ├── NormalNode.tsx
│   │   ├── Node.module.css
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── useFlowchart.ts
│   └── index.ts
├── types/
│   ├── flowchart.ts
│   └── index.ts
└── index.ts
```

# コンポーネントの情報

## フローチャート機能（Flowchart Feature）

- **概要**: React Flowライブラリを使用したフローチャート描画機能を提供するfeatureモジュール

- **主要コンポーネント**:
  - `FlowchartCanvas`: フローチャートの描画キャンバス（ReactFlow コンポーネントのラッパー）
  - `NodeToolbar`: ノード追加・保存・クリア機能を提供するツールバー
  - **カスタムノードコンポーネント**:
    - `IfNode`: IF文を表現するひし形ノード
    - `ForNode`: FOR文を表現する六角形ノード
    - `WhileNode`: WHILE文を表現する円形ノード
    - `UnknownNode`: 不明な関数を表現する警告ノード
    - `NormalNode`: 通常処理を表現する四角形ノード

- **カスタムフック**:
  - `useFlowchart`: フローチャートの状態管理と操作機能を提供

- **型定義**:
  - `FlowchartNodeType`: ノードの種類（'if' | 'for' | 'while' | 'unknown' | 'normal'）
  - `FlowchartNodeData`: ノードのデータ構造（Record<string, unknown>を継承）
  - `FlowchartNode`: React Flowのノードを拡張したフローチャート用ノード
  - `FlowchartEdge`: React Flowのエッジ型のエイリアス
  - `FlowchartData`: フローチャート全体のデータ構造
  - `FlowchartState`: フローチャート機能の状態管理用型

- **機能詳細**:
  - **ノード操作**: 5種類のカスタムノード（IF・FOR・WHILE・不明・通常）の追加・削除・移動
  - **エッジ操作**: ノード間の接続線の描画・削除
  - **保存機能**: ローカルストレージへの保存（将来的にAPI連携予定）
  - **キーボード操作**: Deleteキーによるノード削除
  - **UI機能**: ミニマップ、コントロールパネル、背景グリッド
  - **カスタムデザイン**: 各ノードタイプに応じた独自の形状とスタイル

- **依存関係にあるファイル**:
  - `@xyflow/react`: React Flow ライブラリ
  - `@/hooks/useNotification`: 通知機能
  - プロジェクト固有の型定義やユーティリティは含まない独立したfeature

- **技術特徴**:
  - TypeScript完全対応
  - メタリックデザインのスタイリング
  - React Hook による状態管理
  - コンポーネント分離による再利用性
  - CSS Modules によるスタイル管理
  - カスタムノードのReactFlow統合
  - memo化によるパフォーマンス最適化