# ファイル path

```
dev/frontend/src/features/flowchart/components/devTools/DevTools.tsx
dev/frontend/src/features/flowchart/components/devTools/ChangeLogger.tsx
dev/frontend/src/features/flowchart/components/devTools/NodeInspector.tsx
dev/frontend/src/features/flowchart/components/devTools/ViewportLogger.tsx
dev/frontend/src/features/flowchart/components/devTools/DevTools.css
```

# コンポーネントの情報

## DevTools

- フローチャート開発時のデバッグ用ツール群を管理するメインコンポーネント
- 開発者が React Flow の状態を視覚的に確認できる機能を提供

- 依存関係にあるファイル
  - @xyflow/react（Panel）
  - React（useState, types）
  - ./ChangeLogger
  - ./NodeInspector
  - ./ViewportLogger
  - ./DevTools.css

- props の型と説明
  - props なし（内部で状態管理）

## ChangeLogger

- ノードの変更（追加・削除・移動・選択など）をリアルタイムで記録・表示するコンポーネント
- React Flow の onNodesChange をインターセプトして変更履歴を追跡

- 依存関係にあるファイル
  - @xyflow/react（useStore, useStoreApi, OnNodesChange, NodeChange）
  - React（useEffect, useRef, useState）

- props の型と説明
  - color?: string - 表示色（オプション）
  - limit?: number - 表示する変更履歴の上限（デフォルト: 20）

## NodeInspector

- 現在のノードの詳細情報（ID、タイプ、位置、サイズ、データなど）を表示するコンポーネント
- ViewportPortal を使用してビューポート内にノード情報を重ねて表示

- 依存関係にあるファイル
  - @xyflow/react（useNodes, ViewportPortal, useReactFlow, XYPosition）

- props の型と説明
  - props なし（内部でノード情報を取得）

## ViewportLogger

- 現在のビューポートの変換情報（x, y, zoom）を表示するコンポーネント
- React Flow の transform 状態をリアルタイムで監視

- 依存関係にあるファイル
  - @xyflow/react（Panel, useStore）

- props の型と説明
  - props なし（内部でビューポート情報を取得）

## DevToolButton

- DevTools 内で使用される汎用ボタンコンポーネント
- 各デバッグツールの有効/無効を切り替える

- 依存関係にあるファイル
  - React（Dispatch, SetStateAction, ReactNode, HTMLAttributes）

- props の型と説明
  - active: boolean - ボタンのアクティブ状態
  - setActive: Dispatch<SetStateAction<boolean>> - アクティブ状態を変更する関数
  - children: ReactNode - ボタンのラベル
  - ...rest: HTMLAttributes<HTMLButtonElement> - その他のHTML属性