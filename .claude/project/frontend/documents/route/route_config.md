# ファイル path

```
dev/frontend/src/routes/config.ts
```

# ルーティング の情報

## router

- React Router v6のブラウザルーターを使用したアプリケーションのルーティング設定

- ルーティングと参照しているコンポーネント

| パス | コンポーネント | 機能 |
|------|----------------|------|
| `/` | LoginPage | ルートパス、ログインページ |
| `/dashboard` | DashboardPage | ダッシュボード画面 |
| `/projects` | ProjectsPage | プロジェクト管理画面 |
| `/flowchart/:projectId` | FlowchartPage | フローチャート編集画面（プロジェクトID指定） |
| `/login` | LoginPage | ログイン画面 |
| `/logout` | LogoutPage | ログアウト処理画面 |
| `/signup` | SignupPage | ユーザー登録画面 |

- 依存関係にあるファイル
  - react-router-dom - ルーティングライブラリ
  - @/pages/dashboard - DashboardPage
  - @/pages/flowchart - FlowchartPage  
  - @/pages/login - LoginPage
  - @/pages/logout - LogoutPage
  - @/pages/projects - ProjectsPage
  - @/pages/signup - SignupPage

## ルーティング特徴

### パス設計
- ルートパス（`/`）はログインページに設定
- 認証後は `/dashboard` にリダイレクト
- プロジェクト管理は `/projects` で一元化
- フローチャート編集は `/flowchart/:projectId` で個別プロジェクト指定

### 動的ルーティング
- `/flowchart/:projectId` - プロジェクトIDをパラメータとして受け取る
- React Router v6の `useParams` フックでパラメータを取得可能

### 認証フロー
1. ルートアクセス時はログインページ表示
2. 認証成功後はダッシュボードへ遷移
3. ログアウト時は専用ページで処理後ログインページへ