# ファイル path

```
dev/frontend/src/features/projectCode/components/CodeInput/CodeInput.tsx
dev/frontend/src/features/projectCode/components/CodeInput/CodeInput.module.css
dev/frontend/src/features/projectCode/components/CodeInput/index.ts
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
  - @/hooks/useNotification (通知機能)
  - @/features/flowchart/api (フローチャート生成API)
  - @/features/flowchart/utils (フローチャート変換ユーティリティ)
  - @/features/flowchart/types (フローチャート型定義)
  - ../../stores/selectors (Redux selectors)
  - ../../stores/slice (Redux actions)
  - ../../types/projectCode (TypeScript型定義)
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
  - onFlowchartGenerated?: (nodes: FlowchartNode[], edges: FlowchartEdge[]) => void
    - 説明: フローチャート生成完了時のコールバック関数
    - 必須: ×（オプション）

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

## Feature統合による改善点
- **インポート**: `@/features/projectCode`からの統一インポートに変更
- **保守性**: projectCode機能に関連するすべてのコンポーネントが1箇所に集約
- **再利用性**: feature内でのコンポーネント再利用が容易

## フローチャート生成機能（Issue #74で実装完了）
- **handleGenerateFlowchart関数**: コード内容からフローチャートを自動生成
- **API連携**: `/api/flowchart/generate`エンドポイントとの通信
- **エラーハンドリング**: 生成失敗時の適切なエラー表示
- **ローディング状態**: 生成中の視覚的フィードバック（isGeneratingFlowchart）
- **コールバック統合**: 生成完了時にonFlowchartGeneratedでフローチャートページに結果を送信
- **自動モーダル閉じ**: 生成成功時に自動的にモーダルを閉じる
- **通知機能**: 成功・失敗の通知メッセージ表示

## フューチャー機能
- feature内でのカスタムフック抽象化
- より多くのプログラミング言語への対応