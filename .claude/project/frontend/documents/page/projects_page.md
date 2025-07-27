# ファイル path

```
dev/frontend/src/pages/projects/ProjectsPage.tsx
```

# ページの情報

## ProjectsPage

- プロジェクト管理ページ。プロジェクト一覧表示、作成、編集、削除、復元機能を提供する。アクティブなプロジェクトと削除済みプロジェクトをタブで切り替えて表示する。

- 依存関係にあるファイル
  - React Router (`react-router-dom`) - ナビゲーション
  - Redux Toolkit - 状態管理
  - `@/features/project/components/ProjectCreateModal` - プロジェクト作成モーダル
  - `@/features/project/components/ProjectEditModal` - プロジェクト編集モーダル
  - `@/features/project/types/project` - Project型定義
  - `@/hooks/redux` - Redux hooks
  - `@/hooks/useNotification` - 通知機能
  - `@/stores/project/selectors` - プロジェクト状態セレクター
  - `@/stores/project/slice` - プロジェクト状態管理
  - `./ProjectsPage.module.css` - CSS Modules

- 状態の型と説明
  - `activeTab: TabType` - 現在のタブ（'active' | 'deleted'）
  - `showCreateModal: boolean` - プロジェクト作成モーダルの表示状態
  - `showEditModal: boolean` - プロジェクト編集モーダルの表示状態
  - `editingProject: Project | null` - 編集対象のプロジェクト

## 機能

### タブ機能
- **アクティブタブ**: 有効なプロジェクト一覧
- **削除済みタブ**: 削除されたプロジェクト一覧
- プロジェクト数を括弧内に表示

### プロジェクト操作（アクティブタブ）
1. **新規作成**: ProjectCreateModal を開く
2. **フローチャート**: `/flowchart/${project.uuid}` へリンク
3. **編集**: ProjectEditModal を開く
4. **削除**: 確認ダイアログ後、論理削除を実行

### プロジェクト操作（削除済みタブ）
1. **復元**: 確認ダイアログ後、プロジェクトを復元
2. **完全削除**: 確認ダイアログ後、物理削除を実行

### 表示機能
- **プロジェクト情報**: 名前、説明、作成日時、更新日時
- **エラー表示**: Redux エラー状態を通知で表示
- **ローディング**: スピナーと読み込みメッセージ
- **空状態**: プロジェクト未存在時のメッセージ

## Redux 連携

### 使用セレクター
- `selectProjects` - アクティブなプロジェクト一覧
- `selectDeletedProjects` - 削除済みプロジェクト一覧
- `selectProjectLoading` - ローディング状態
- `selectProjectError` - エラー状態
- `selectHasProjects` - プロジェクト存在状態
- `selectHasDeletedProjects` - 削除済みプロジェクト存在状態

### 使用アクション
- `fetchProjects` - プロジェクト一覧取得
- `fetchDeletedProjects` - 削除済みプロジェクト一覧取得（初期化時に実行）
- `deleteProject` - プロジェクトの論理削除
- `restoreProject` - プロジェクトの復元
- `hardDeleteProject` - プロジェクトの物理削除
- `clearError` - エラー状態のクリア

## ユーザー体験

### 確認ダイアログ
- 削除: 「このプロジェクトを削除しますか？（復元可能）」
- 復元: 「このプロジェクトを復元しますか？」
- 完全削除: 「このプロジェクトを完全に削除しますか？（復元不可能）」

### 通知メッセージ
- 成功時: 操作結果を通知
- 失敗時: エラーメッセージを通知

### 日時表示
- 日本語ロケール形式（年月日）
- `formatDate` 関数で統一的にフォーマット

## スタイリング

- CSS Modules を使用
- レスポンシブなカードレイアウト
- タブ切り替えのUI
- アクションボタンの配置