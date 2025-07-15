# プロジェクト管理機能実装

## 概要

プロジェクト管理機能は、ユーザーがプロジェクトの作成、編集、削除、復元を行える Web アプリケーション機能です。React + TypeScript + Redux Toolkit を使用して実装されており、ソフトデリート機能により安全なデータ管理を実現しています。

## 技術スタック

### 主要技術

- **React 19.0.0**: UI コンポーネント
- **TypeScript**: 型安全性
- **Redux Toolkit 2.8.2**: 状態管理
- **React Router DOM 7.6.3**: ルーティング
- **Axios 1.9.0**: HTTP 通信

### 設計パターン

- **Feature-based Architecture**: 機能別ディレクトリ構造
- **CSS Modules**: スタイル管理
- **Compound Components**: 再利用可能なコンポーネント

## アーキテクチャ

### ディレクトリ構造

```
src/
├── features/project/
│   ├── api/project.ts           # API通信
│   ├── components/              # プロジェクト関連コンポーネント
│   │   ├── ProjectCreateModal.tsx
│   │   ├── ProjectCreateModal.module.css
│   │   ├── ProjectEditModal.tsx
│   │   └── ProjectEditModal.module.css
│   └── types/project.ts         # 型定義
├── pages/projects/
│   ├── ProjectsPage.tsx         # メインページ
│   └── ProjectsPage.module.css  # スタイル
└── stores/project/
    ├── slice.ts                 # Redux slice
    ├── selectors.ts             # セレクタ
    └── types.ts                 # 状態型定義
```

### データフロー

```
UI Components → Redux Actions → API Client → Backend
     ↑                                           ↓
State Selectors ← Redux Store ← Response Handler
```

## 状態管理（Redux）

### ProjectState

```typescript
interface ProjectState {
  projects: Project[];
  deletedProjects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  total: number;
}
```

### 非同期アクション

- `createProject`: 新規プロジェクト作成
- `fetchProjects`: アクティブプロジェクト一覧取得
- `fetchDeletedProjects`: 削除済みプロジェクト一覧取得
- `updateProject`: プロジェクト更新
- `deleteProject`: ソフトデリート
- `restoreProject`: プロジェクト復元
- `hardDeleteProject`: 完全削除

### セレクタ

```typescript
export const selectProjects = (state: RootState) => state.project.projects;
export const selectDeletedProjects = (state: RootState) =>
  state.project.deletedProjects;
export const selectProjectLoading = (state: RootState) => state.project.loading;
export const selectProjectError = (state: RootState) => state.project.error;
```

## API 通信

### API クライアント設定

```typescript
const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
```

### 認証インターセプター

```typescript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### エラーハンドリング

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

## UI コンポーネント

### ProjectsPage

メインのプロジェクト管理画面

**主要機能**:

- プロジェクト一覧表示（アクティブ/削除済み）
- タブ切り替え
- プロジェクト作成ボタン
- CRUD 操作

**状態管理**:

```typescript
const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
const [showCreateModal, setShowCreateModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [editingProject, setEditingProject] = useState<Project | null>(null);
```

### ProjectCreateModal

新規プロジェクト作成モーダル

**フォームフィールド**:

- プロジェクト名（必須）
- 説明（任意）

**バリデーション**:

- プロジェクト名の入力チェック
- リアルタイムフォーム状態管理

### ProjectEditModal

プロジェクト編集モーダル

**機能**:

- 既存データの読み込み
- 変更検知
- 更新処理

## デザインシステム

### カラーパレット

```css
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--button-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
--card-background: white;
--text-primary: #2d3748;
--text-secondary: #4a5568;
--border-color: #e2e8f0;
```

### デザイン原則

- **統一性**: ダッシュボードとの色調統一
- **可読性**: 高コントラスト設計
- **レスポンシブ**: モバイルファーストアプローチ
- **アクセシビリティ**: フォーカス状態の明確化

### コンポーネントスタイリング

#### プロジェクトカード

```css
.projectCard {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.projectCard:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}
```

#### モーダルフォーム

```css
.input {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: border-color 0.2s ease;
}

.input:focus {
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
}
```

## ナビゲーション

### ルーティング

```typescript
{
  path: '/projects',
  Component: ProjectsPage,
}
```

### ページ遷移

- ダッシュボード → プロジェクト管理: `/dashboard` → `/projects`
- プロジェクト管理 → ダッシュボード: 戻るボタン
