# ファイル path

```
dev/frontend/src/components/CodeInput/CodeInput.tsx
dev/frontend/src/components/CodeInput/CodeInput.module.css
dev/frontend/src/components/CodeInput/index.ts
```

# コンポーネントの情報

## CodeInput

- コンポーネントの説明
  - プロジェクトに関連するコードを入力・編集・管理するためのコンポーネント
  - コードの作成、更新、一覧表示、編集機能を提供
  - Redux状態管理と連携してプロジェクトコードのCRUD操作を実行
  - 表示/非表示の切り替えが可能なモーダル風インターフェース

- 依存関係にあるファイル
  - @/hooks/redux (Redux hooks)
  - @/stores/projectCode/selectors (Redux selectors)
  - @/stores/projectCode/slice (Redux actions)
  - @/types/projectCode (TypeScript型定義)
  - ./CodeInput.module.css (スタイルシート)

- props の型と説明
  - projectUuid: string
    - 説明: コードを管理するプロジェクトのUUID
    - 必須: ○
  - isVisible: boolean
    - 説明: コンポーネントの表示状態を制御
    - 必須: ○
  - onToggle: () => void
    - 説明: 表示/非表示を切り替えるコールバック関数
    - 必須: ○

# 主要な機能

## 状態管理
- React useState でフォームデータ（title, code_content, language, description）を管理
- Redux で全体的なプロジェクトコード状態を管理
- 編集中のコードUUIDを追跡

## CRUD操作
- 新規コード作成（createProjectCode）
- コード一覧取得（fetchProjectCodes）
- コード編集（updateProjectCode）
- コード削除（実装予定）

## UI機能
- プログラミング言語の選択（Python, JavaScript, TypeScript, Java, C++, C, Go, Rust）
- リアルタイムフォームバリデーション
- 保存中のローディング状態表示
- エラーメッセージ表示
- 保存済みコードの一覧表示と編集機能

## フューチャー機能
- フローチャート生成機能（TODO: 実装予定）