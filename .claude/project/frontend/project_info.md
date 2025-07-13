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

## ドキュメント

### 認証機能

- **Auth Feature**: `.claude/project/frontend/documents/auth_feature.md`
- **Signup Page**: `.claude/project/frontend/documents/signup_page.md`
- **Login Page**: `.claude/project/frontend/documents/login_page.md`
- **Auth Routing**: `.claude/project/frontend/documents/auth_routing.md`
- **Auth Navigation**: `.claude/project/frontend/documents/auth_navigation.md`
- **Login API**: `.claude/project/frontend/documents/api/login_api.md`
- **Auth Modal Integration**: `.claude/project/frontend/documents/feature/auth_modal_integration.md`

### Redux 状態管理

- **Redux Architecture**: `.claude/project/frontend/documents/store/redux_architecture.md`

### フィーチャー

- **Flowchart Feature**: `.claude/project/frontend/documents/flowchart_feature.md`

### コンポーネント

- **Modal System**: `.claude/project/frontend/documents/component/modal_system.md`
- **Card Component**: `.claude/project/frontend/documents/card_component.md`

### ページ

- **Dashboard Page**: `.claude/project/frontend/documents/page/dashboard_page.md`
- **Flowchart Page**: `.claude/project/frontend/documents/page/flowchart_page.md`

### ルーティング

- **Flowchart Route**: `.claude/project/frontend/documents/route/flowchart_route.md`

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
