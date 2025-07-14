# ファイル path

```
dev/frontend/src/features/flowchart/components/nodes/
├── IfNode.tsx
├── ForNode.tsx
├── WhileNode.tsx
├── UnknownNode.tsx
├── NormalNode.tsx
├── Node.module.css
└── index.ts
```

# コンポーネントの情報

## カスタムノードコンポーネント

- フローチャート機能で使用される5種類のカスタムノードUIコンポーネント
  - **IfNode**: IF文を表現するひし形ノード
  - **ForNode**: FOR文を表現する六角形ノード  
  - **WhileNode**: WHILE文を表現する円形ノード
  - **UnknownNode**: 不明な関数を表現する角丸四角形ノード（警告アニメーション付き）
  - **NormalNode**: 通常処理を表現する四角形ノード

- 依存関係にあるファイル
  - `@xyflow/react` - ReactFlowライブラリ（Handle, Position）
  - `../../types/flowchart.ts` - FlowchartNodeData型定義
  - `Node.module.css` - スタイル定義
  - `../FlowchartCanvas.tsx` - ノードタイプマッピング

- propsの型と説明
  ```typescript
  interface NodeProps {
    data: FlowchartNodeData;    // ノードのデータ（label, type）
    selected?: boolean;         // 選択状態（オプショナル）
  }
  
  interface FlowchartNodeData extends Record<string, unknown> {
    label: string;              // ノードに表示されるラベル
    type: FlowchartNodeType;    // ノードタイプ（'if' | 'for' | 'while' | 'unknown' | 'normal'）
  }
  ```

## 実装仕様

### デザイン特徴
- **IF文ノード**: 45度回転したひし形、紫グラデーション、上下にエッジ配置
- **FOR文ノード**: 六角形（clip-path使用）、ピンクグラデーション
- **WHILE文ノード**: 円形、青グラデーション
- **UNKNOWN文ノード**: 角丸四角形、オレンジグラデーション、パルスアニメーション
- **NORMAL文ノード**: 四角形、紫グラデーション

### エッジ配置
- **IF文**: 入力（Left）、出力True（Top）、出力False（Bottom）
- **その他**: 入力（Top）、出力（Bottom）

### スタイル管理
- CSS Modulesを使用してコンポーネント間のスタイル競合を防止
- ホバーエフェクトと選択状態の視覚的フィードバック
- レスポンシブ対応とアクセシビリティ考慮

### ReactFlow統合
- カスタムノードタイプとしてReactFlowに登録
- Handle コンポーネントによるエッジ接続点の定義
- メモ化（memo）によるパフォーマンス最適化