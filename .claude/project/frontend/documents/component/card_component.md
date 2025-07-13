# ファイル path

```
src/components/Card/
├── Card.tsx
├── Card.module.css
└── index.ts
```

# コンポーネントの情報

## Card

- DashboardPageで使用されていたcard要素を再利用可能なコンポーネントとして抽出したコンポーネント

- 依存関係にあるファイル
  - DashboardPage.tsx（使用箇所）
  - components/index.ts（エクスポート）

- props の説明
  - `title`: string - カードのタイトル
  - `description`: string - カードの説明文
  - `buttonText`: string - ボタンのテキスト
  - `onButtonClick`: () => void - ボタンクリック時のイベントハンドラー
  - `variant`: 'default' | 'primary' | 'secondary' | 'danger' - カードのテーマ/色（オプション、デフォルト: 'default'）
  - `disabled`: boolean - ボタンの無効化（オプション、デフォルト: false）