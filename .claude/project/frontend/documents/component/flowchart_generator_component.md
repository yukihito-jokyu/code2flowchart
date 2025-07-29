# ファイル path

```
src/features/flowchart/components/FlowchartGenerator.tsx
```

# コンポーネントの情報

## FlowchartGenerator

- コンポーネントの説明
  - AIを使用してコードからフローチャートを自動生成するコンポーネント
  - ユーザーがコード入力と言語選択を行い、バックエンドAPIを呼び出してフローチャートを生成
  - 生成されたフローチャートはFlowchartCanvasコンポーネントで表示される
  - ローディング状態、エラーハンドリング、入力バリデーションを含む完全なUI

- 依存関係にあるファイル
  - `../api/flowchart.ts` - フローチャート生成API呼び出し
  - `../utils/flowchartConverter.ts` - APIレスポンスの変換処理
  - `./FlowchartCanvas.tsx` - フローチャート表示コンポーネント
  - `../types/index.ts` - フローチャート関連の型定義
  - `@xyflow/react` - React Flowライブラリ

- propsの型と説明
  ```typescript
  interface FlowchartGeneratorProps {
    className?: string; // オプション：CSSクラス名
  }
  ```

## 内部状態とフック

- `nodes, edges` - React Flowのノードとエッジ状態
- `codeContent` - 入力されたコード内容
- `language` - 選択されたプログラミング言語（デフォルト: 'python'）
- `isLoading` - フローチャート生成中のローディング状態
- `error` - エラーメッセージ

## 主要機能

- **言語選択**: Python, JavaScript, Java, C, C++に対応
- **コード入力**: テキストエリアでコード入力（monospaceフォント）
- **フローチャート生成**: バックエンドAPIを呼び出して自動生成
- **エラーハンドリング**: 入力バリデーションとAPI呼び出しエラーの表示
- **レスポンシブUI**: フレックスレイアウトで上下分割表示