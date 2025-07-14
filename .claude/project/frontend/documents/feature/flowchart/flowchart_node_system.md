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

## フローチャートノードシステム（Flowchart Node System）

- フローチャートで使用される5種類のカスタムノードコンポーネント群。各ノードは異なる処理タイプを視覚的に表現し、@xyflow/reactと統合されている。

- 依存関係にあるファイル
  - `@xyflow/react` - Handle, Position, NodeProps 
  - `React` - memo化によるパフォーマンス最適化
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
- **形状**: 45度回転したダイアモンド (100px × 100px)
- **スタイル**: 青紫グラデーション背景、45度回転
- **ハンドル**: 左側入力、上部出力(true)、下部出力(false)
- **アイコン**: 💎
- **用途**: 条件分岐処理

### 3. ForNode（繰り返しノード）
- **形状**: 六角形 (clip-path使用)
- **スタイル**: ピンクグラデーション背景
- **ハンドル**: 上部入力、下部出力
- **アイコン**: 🔄
- **用途**: For文による繰り返し処理

### 4. WhileNode（While繰り返しノード）
- **形状**: 円形 (100px × 100px)
- **スタイル**: 青水色グラデーション背景
- **ハンドル**: 上部入力、下部出力
- **アイコン**: ⭕
- **用途**: While文による繰り返し処理

### 5. UnknownNode（不明ノード）
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
- **背景**: linear-gradientを使用したグラデーション
- **境界線**: 2px solid、各ノードタイプごとに異なる色
- **影**: box-shadowによる立体感
- **遷移**: 0.3s easeのトランジション効果
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
export type FlowchartNodeType = 'if' | 'for' | 'while' | 'unknown' | 'normal';
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

## React Flow統合

### ノードタイプ登録
```typescript
const nodeTypes = {
  if: IfNode,
  for: ForNode,
  while: WhileNode,
  unknown: UnknownNode,
  normal: NormalNode,
};
```

### NodeToolbarでの管理
```typescript
const nodeTypes = [
  { type: 'if', label: 'IF文', icon: '💎' },
  { type: 'for', label: 'FOR文', icon: '🔄' },
  { type: 'while', label: 'WHILE文', icon: '⭕' },
  { type: 'unknown', label: '不明', icon: '⚠️' },
  { type: 'normal', label: '通常', icon: '📋' },
];
```

## 技術的特徴

### パフォーマンス最適化
- React.memoによるコンポーネントの再レンダリング防止
- CSS Modulesによるスタイルの分離
- handle位置の最適化

### アクセシビリティ
- displayNameの設定
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

## 使用例

```typescript
// ノードの作成
const newNode: FlowchartNode = {
  id: 'node-1',
  type: 'if',
  position: { x: 100, y: 100 },
  data: {
    label: '条件判定',
    type: 'if',
  },
};

// React Flowでの使用
<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  // その他のprops
/>
```