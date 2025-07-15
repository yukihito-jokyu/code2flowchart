# Frontend プロジェクト情報

## 概要

React 19 + TypeScript + Vite を使用したモダンなフロントエンドプロジェクトです。

## 技術スタック

- **フレームワーク**: React 19.0.0
- **TypeScript**: ~5.7.2
- **ビルドツール**: Vite 6.3.1 (SWC プラグイン使用)
- **HTTP クライアント**: axios 1.9.0
- **状態管理**: Redux Toolkit 2.8.2, React Redux 9.2.0
- **ルーティング**: React Router DOM 7.6.3
- **フローチャート**: @xyflow/react (React Flow)
- **コード品質ツール**: ESLint 9.22.0, Prettier 3.6.2

## 設定詳細

### package.json 主要スクリプト

- `dev`: 開発サーバー起動 (vite)
- `build`: TypeScript コンパイル + Vite ビルド
- `lint-check`: ESLint チェック
- `lint-fix`: ESLint 自動修正
- `format-write`: Prettier フォーマット
- `format-check`: Prettier チェック
- `preview`: ビルド結果のプレビュー

### TypeScript 設定

- **ターゲット**: ES2020
- **JSX**: react-jsx
- **モジュール解決**: bundler モード
- **厳密な型チェック**: 有効
- **パスエイリアス**:
  - `@/*` → `src/*`

### Vite 設定

- **プラグイン**: @vitejs/plugin-react-swc (SWC 使用)
- **パスエイリアス**: TypeScript 設定と同期

### ESLint 設定

- **ベース**: @eslint/js + typescript-eslint
- **プラグイン**:
  - import (インポート順序管理)
  - react-hooks
  - react-refresh
- **特別ルール**: インポート文のアルファベット順ソート

### Prettier 設定

- **タブ幅**: 2 スペース
- **クォート**: シングルクォート
- **セミコロン**: 有効
- **行幅**: 100 文字
- **末尾カンマ**: ES5 準拠

## アプリケーション構成

### メインエントリーポイント

- **index.html**: Vite + React + TS のテンプレート
- **main.tsx**: React StrictMode でアプリケーション起動

### 主要機能

- **認証システム**: ログイン・サインアップ・ログアウト機能
- **プロジェクト管理**: プロジェクト作成・編集・削除・復元機能
- **プロジェクトコード機能**: プログラムコードの作成・編集・保存・管理機能（多言語対応）
- **フローチャート機能**: 7 種類のノード（IF・WHILE開始・WHILE終了・FOR開始・FOR終了・通常・不明）による視覚的フローチャート作成
- **ダッシュボード**: プロジェクト一覧表示とナビゲーション

### 技術的特徴

- **型安全性**: TypeScript による完全な型チェック
- **モダン UI**: CSS Modules + グラッシュモーフィズムデザイン
- **状態管理**: Redux Toolkit による集中的な状態管理
- **Feature指向アーキテクチャ**: `src/features/`配下での機能別コード整理
- **パフォーマンス**: React.memo、useMemo、useCallback による最適化
- **開発体験**: ESLint + Prettier による一貫したコード品質

## ドキュメント

### コーディング規約

- `.claude/project/frontend/coding_role.md`

### Redux 状態管理

- Redux Architecture
  - `.claude/project/frontend/documents/store/redux_architecture.md`
- Project Code Store
  - `.claude/project/frontend/documents/store/project_code_store.md`

### フィーチャー

- Auth Feature
  - `.claude/project/frontend/documents/feature/auth/auth_feature.md`
  - `.claude/project/frontend/documents/feature/auth/auth_modal_integration.md`
  - `.claude/project/frontend/documents/feature/auth/login_api.md`
- Flowchart Feature
  - `.claude/project/frontend/documents/feature/flowchart/flowchart_feature.md`
  - `.claude/project/frontend/documents/feature/flowchart/flowchart_node_system.md`
  - `.claude/project/frontend/documents/feature/flowchart/NodeToolbar.md`
  - `.claude/project/frontend/documents/feature/flowchart/custom_node_components.md`
- Project Management Feature
  - `.claude/project/frontend/documents/feature/project/project_management_feature.md`
- Project Code Feature
  - `.claude/project/frontend/documents/feature/project_code/project_code_feature.md`

### コンポーネント

- Modal System
  - `.claude/project/frontend/documents/component/modal_system.md`
- Card Component
  - `.claude/project/frontend/documents/component/card_component.md`
- Code Input Component
  - `.claude/project/frontend/documents/component/code_input_component.md`
- Node Detail Modal Component
  - `.claude/project/frontend/documents/component/node_detail_modal.md`

### ページ

- Signup Page
  - `.claude/project/frontend/documents/page/signup_page.md`
- Login Page
  - `.claude/project/frontend/documents/page/login_page.md`
- Dashboard Page
  - `.claude/project/frontend/documents/page/dashboard_page.md`
- Flowchart Page
  - `.claude/project/frontend/documents/page/flowchart_page.md`
- Projects Page
  - `.claude/project/frontend/documents/page/projects_page.md`

### ルーティング

- Auth Routing
  - `.claude/project/frontend/documents/route/auth_routing.md`
- Flowchart Route
  - `.claude/project/frontend/documents/route/flowchart_route.md`

### API

- Project Code API
  - `.claude/project/frontend/documents/api/project_code_api.md`

### その他

- Auth Navigation
  - `.claude/project/frontend/documents/auth_navigation.md`

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# lint + format チェック
npm run lint-check
npm run format-check

# lint + format 自動修正
npm run lint-fix
npm run format-write

# プレビュー
npm run preview
```
