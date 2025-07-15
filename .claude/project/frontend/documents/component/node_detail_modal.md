# ファイル path

```
dev/frontend/src/features/flowchart/components/NodeDetailModal.tsx
dev/frontend/src/features/flowchart/components/NodeDetailModal.module.css
```

# コンポーネントの情報

## NodeDetailModal

- フローチャートのノードをクリックした際に表示される詳細情報モーダルコンポーネント
- FlowchartNodeDataの拡張された型（title、code、info）の情報を視覚的に表示
- Modalコンポーネントをベースとしたモーダルダイアログ

- 依存関係にあるファイル
  - `@/components/Modal` - ベースとなるモーダルコンポーネント
  - `../types` - FlowchartNode型定義
  - `./NodeDetailModal.module.css` - スタイル定義

- props の型と説明
  - `isOpen: boolean` - モーダルの表示状態
  - `onClose: () => void` - モーダルを閉じる際のコールバック関数
  - `node: FlowchartNode | null` - 表示するノード全体のデータ

## 機能詳細

### 表示内容
- **タイトル**: node.data.title
- **コード**: node.data.code（等幅フォントで表示）
- **説明**: node.data.info
- **タイプ**: node.type（色付きタグで表示）

### スタイル特徴
- グラッシュモーフィズムデザインに準拠
- ノードタイプに応じた色分け表示
- レスポンシブ対応
- スクロール可能なコンテンツ領域

### 使用例
```tsx
<NodeDetailModal
  isOpen={showNodeDetail}
  onClose={handleCloseNodeDetail}
  node={selectedNode || null}
/>
```