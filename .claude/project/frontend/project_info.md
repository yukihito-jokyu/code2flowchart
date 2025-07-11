# Frontend プロジェクト情報

## 概要

React 19 + TypeScript + Vite を使用したモダンなフロントエンドプロジェクトです。

## 技術スタック

- **フレームワーク**: React 19.0.0
- **TypeScript**: ~5.7.2
- **ビルドツール**: Vite 6.3.1 (SWC プラグイン使用)
- **HTTP クライアント**: axios 1.9.0
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
