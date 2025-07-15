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

## フローチャートノードシステム（Flowchart Node System）

- フローチャートで使用される 7 種類のカスタムノードコンポーネント群。各ノードは異なる処理タイプを視覚的に表現し、@xyflow/react と統合されている。

- 依存関係にあるファイル

  - `@xyflow/react` - Handle, Position, NodeProps
  - `React` - memo 化によるパフォーマンス最適化
  - `../types` - FlowchartNodeData 型定義
  - `./Node.module.css` - 共通スタイル

- props の型と説明
  - `data: FlowchartNodeData` - ノードのデータ（label, type を含む）
  - `selected?: boolean` - ノードの選択状態
  - その他 NodeProps に準拠

## ノードタイプ別仕様

### 1. NormalNode（通常処理ノード）

- **形状**: 角丸四角形 (120px × 80px)
- **スタイル**: 青紫グラデーション背景
- **ハンドル**: 上部入力、下部出力
- **アイコン**: 📋
- **用途**: 通常の処理ステップ

### 2. IfNode（条件分岐ノード）

- **形状**: 45 度回転したダイアモンド (100px × 100px)
- **スタイル**: 青紫グラデーション背景、45 度回転
- **ハンドル**: 左側入力、上部出力(true)、下部出力(false)
- **アイコン**: 💎
- **用途**: 条件分岐処理

### 3. WhileStartNode（While 開始ノード）

- **形状**: 台形（下辺が広い、120px × 80px）
- **スタイル**: 青水色グラデーション背景（#4facfe → #00f2fe）
- **ハンドル**: 上部入力、下部出力
- **アイコン**: 🔄
- **用途**: While 文の開始点

### 4. WhileEndNode（While 終了ノード）

- **形状**: 台形（上辺が広い、120px × 80px）
- **スタイル**: 青水色グラデーション背景（#4facfe → #00f2fe）
- **ハンドル**: 上部入力、下部出力
- **アイコン**: 🔄
- **用途**: While 文の終了点

### 5. ForStartNode（For 開始ノード）

- **形状**: 台形（下辺が広い、120px × 80px）
- **スタイル**: ピンクグラデーション背景（#f093fb → #f5576c）
- **ハンドル**: 上部入力、下部出力
- **アイコン**: 🔁
- **用途**: For 文の開始点

### 6. ForEndNode（For 終了ノード）

- **形状**: 台形（上辺が広い、120px × 80px）
- **スタイル**: ピンクグラデーション背景（#f093fb → #f5576c）
- **ハンドル**: 上部入力、下部出力
- **アイコン**: 🔁
- **用途**: For 文の終了点

### 7. UnknownNode（不明ノード）

- **形状**: 角丸四角形 (100px × 100px)
- **スタイル**: オレンジグラデーション背景、パルスアニメーション
- **ハンドル**: 上部入力、下部出力
- **アイコン**: ⚠️
- **用途**: 不明な処理タイプ

## 共通スタイル仕様

### 基本構造

```typescript
<div className="nodeContent">
  <div className="nodeIcon">アイコン</div>
  <div className="nodeLabel">ラベル</div>
  <div className="nodeType">ノードタイプ</div>
</div>
```

### 共通スタイル要素

- **背景**: linear-gradient を使用したグラデーション
- **境界線**: 2px solid、各ノードタイプごとに異なる色
- **影**: box-shadow による立体感
- **遷移**: 0.3s ease のトランジション効果
- **ホバー効果**: スケール変更、影の拡大、色の変更

### 選択状態

```css
.selected {
  border-color: #ff6b6b;
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}
```

## 型定義システム

### FlowchartNodeType

```typescript
export type FlowchartNodeType =
  | "if"
  | "whileStart"
  | "whileEnd"
  | "forStart"
  | "forEnd"
  | "unknown"
  | "normal";
```

### FlowchartNodeData

```typescript
export interface FlowchartNodeData extends Record<string, unknown> {
  label: string;
  type: FlowchartNodeType;
}
```

### FlowchartNode

```typescript
export interface FlowchartNode extends Node {
  data: FlowchartNodeData;
}
```

## React Flow 統合

### ノードタイプ登録

```typescript
const nodeTypes = {
  if: IfNode,
  whileStart: WhileStartNode,
  whileEnd: WhileEndNode,
  forStart: ForStartNode,
  forEnd: ForEndNode,
  unknown: UnknownNode,
  normal: NormalNode,
};
```

### NodeToolbar での管理

```typescript
const nodeTypes = [
  { type: "if", label: "IF文", icon: "💎" },
  { type: "whileStart", label: "WHILE開始", icon: "🔄" },
  { type: "whileEnd", label: "WHILE終了", icon: "🔄" },
  { type: "forStart", label: "FOR開始", icon: "🔁" },
  { type: "forEnd", label: "FOR終了", icon: "🔁" },
  { type: "unknown", label: "不明", icon: "⚠️" },
  { type: "normal", label: "通常", icon: "📋" },
];
```

## 台形ノードの実装詳細

### CSS clip-path による台形形状

```css
/* 開始ノード（下辺が広い） */
.whileStartNode,
.forStartNode {
  clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%);
}

/* 終了ノード（上辺が広い） */
.whileEndNode,
.forEndNode {
  clip-path: polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%);
}
```

### ループ構造の視覚化

- **設計思想**: 従来の単一ノードから開始・終了ペアへの変更
- **視覚的効果**: 台形の向きでループの範囲を明確に表現
- **色分け**: While（青系統）、For（ピンク系統）での種類区別
- **サイズ最適化**: 横幅を 120px に拡張し、視認性を向上

## 技術的特徴

### パフォーマンス最適化

- React.memo によるコンポーネントの再レンダリング防止
- CSS Modules によるスタイルの分離
- handle 位置の最適化

### アクセシビリティ

- displayName の設定
- 適切なコントラスト比の色使用
- ホバー・フォーカス状態の視覚的フィードバック

### 拡張性

新しいノードタイプの追加手順：

1. 新しいノードコンポーネントを作成
2. `FlowchartNodeType` に新しいタイプを追加
3. `index.ts` にエクスポートを追加
4. `FlowchartCanvas.tsx` の `nodeTypes` に登録
5. `NodeToolbar.tsx` のツールバーに追加
6. `Node.module.css` に対応するスタイルを追加
