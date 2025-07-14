# ファイル path

```
dev/frontend/src/features/flowchart/components/nodes/
├── IfNode.tsx
├── WhileStartNode.tsx
├── WhileEndNode.tsx
├── ForStartNode.tsx
├── ForEndNode.tsx
├── UnknownNode.tsx
├── NormalNode.tsx
├── Node.module.css
└── index.ts
```

# コンポーネントの情報

## カスタムノードコンポーネント

- フローチャート機能で使用される7種類のカスタムノードUIコンポーネント
  - **IfNode**: IF文を表現するひし形ノード
  - **WhileStartNode**: WHILE開始を表現する台形ノード（下辺が広い）
  - **WhileEndNode**: WHILE終了を表現する台形ノード（上辺が広い）
  - **ForStartNode**: FOR開始を表現する台形ノード（下辺が広い）
  - **ForEndNode**: FOR終了を表現する台形ノード（上辺が広い）
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
    type: FlowchartNodeType;    // ノードタイプ（'if' | 'whileStart' | 'whileEnd' | 'forStart' | 'forEnd' | 'unknown' | 'normal'）
  }
  ```

## 実装仕様

### デザイン特徴
- **IF文ノード**: 45度回転したひし形、紫グラデーション、上下にエッジ配置
- **WHILE開始ノード**: 台形（下辺が広い、120px×80px）、青グラデーション（#4facfe → #00f2fe）
- **WHILE終了ノード**: 台形（上辺が広い、120px×80px）、青グラデーション（#4facfe → #00f2fe）
- **FOR開始ノード**: 台形（下辺が広い、120px×80px）、ピンクグラデーション（#f093fb → #f5576c）
- **FOR終了ノード**: 台形（上辺が広い、120px×80px）、ピンクグラデーション（#f093fb → #f5576c）
- **UNKNOWN文ノード**: 角丸四角形、オレンジグラデーション、パルスアニメーション
- **NORMAL文ノード**: 四角形、紫グラデーション

### エッジ配置
- **IF文**: 入力（Left）、出力True（Top）、出力False（Bottom）
- **台形ノード（WHILE/FOR開始・終了）**: 入力（Top）、出力（Bottom）
- **その他**: 入力（Top）、出力（Bottom）

### 台形ノードの実装詳細
- **CSS clip-path**: 台形形状を実現
  - 開始ノード: `polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)`
  - 終了ノード: `polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)`
- **色分け**: While（青系統）、For（ピンク系統）で視覚的に区別
- **サイズ**: 120px × 80px（従来の100px × 100pxより横幅を拡張）
- **アイコン**: 🔄（While）、🔁（For）で種類を区別

### スタイル管理
- CSS Modulesを使用してコンポーネント間のスタイル競合を防止
- ホバーエフェクトと選択状態の視覚的フィードバック
- レスポンシブ対応とアクセシビリティ考慮

### ReactFlow統合
- カスタムノードタイプとしてReactFlowに登録
- Handle コンポーネントによるエッジ接続点の定義
- メモ化（memo）によるパフォーマンス最適化