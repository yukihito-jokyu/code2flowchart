# ファイル path

```
dev/frontend/src/features/project/api/project.ts
```

# 関数の情報

## createProject

- 機能
  - 新しいプロジェクトを作成する

- 呼び出している api
  - POST /projects/make

- 引数の型
  - projectData: ProjectCreate

- 戻り値の型
  - Promise<Project>

- 依存関係にあるファイル
  - @/features/project/types/project

## getProjects

- 機能
  - プロジェクト一覧を取得する（削除済みは除外）

- 呼び出している api
  - GET /projects/get

- 引数の型
  - skip: number (default: 0) - スキップ件数
  - limit: number (default: 100) - 取得件数

- 戻り値の型
  - Promise<ProjectListResponse>

- 依存関係にあるファイル
  - @/features/project/types/project

## getDeletedProjects

- 機能
  - 削除済みプロジェクト一覧を取得する

- 呼び出している api
  - GET /projects/deleted

- 引数の型
  - skip: number (default: 0) - スキップ件数
  - limit: number (default: 100) - 取得件数

- 戻り値の型
  - Promise<ProjectListResponse>

- 依存関係にあるファイル
  - @/features/project/types/project

## getProject

- 機能
  - 指定されたUUIDのプロジェクト詳細を取得する

- 呼び出している api
  - GET /projects/{projectUuid}

- 引数の型
  - projectUuid: string

- 戻り値の型
  - Promise<Project>

- 依存関係にあるファイル
  - @/features/project/types/project

## updateProject

- 機能
  - 既存のプロジェクトを更新する

- 呼び出している api
  - PUT /projects/{projectUuid}

- 引数の型
  - projectUuid: string
  - projectData: ProjectUpdate

- 戻り値の型
  - Promise<Project>

- 依存関係にあるファイル
  - @/features/project/types/project

## deleteProject

- 機能
  - 指定されたプロジェクトをソフトデリートする（復元可能）

- 呼び出している api
  - DELETE /projects/{projectUuid}

- 引数の型
  - projectUuid: string

- 戻り値の型
  - Promise<ProjectDeleteResponse>

- 依存関係にあるファイル
  - @/features/project/types/project

## restoreProject

- 機能
  - 削除済みプロジェクトを復元する

- 呼び出している api
  - POST /projects/{projectUuid}/restore

- 引数の型
  - projectUuid: string

- 戻り値の型
  - Promise<Project>

- 依存関係にあるファイル
  - @/features/project/types/project

## hardDeleteProject

- 機能
  - プロジェクトを物理削除する（復元不可能）

- 呼び出している api
  - DELETE /projects/{projectUuid}/hard

- 引数の型
  - projectUuid: string

- 戻り値の型
  - Promise<ProjectDeleteResponse>

- 依存関係にあるファイル
  - @/features/project/types/project

# APIクライアント設定

## 環境変数設定
- `VITE_API_BASE_URL`: APIベースURL
- Viteの環境変数として管理

## 認証機能
- リクエストインターセプターでJWTトークンを自動付与
- localStorage から `authToken` を取得して Authorization ヘッダーに設定

## エラーハンドリング
- レスポンスインターセプターでエラー処理
- 401/403エラー時にローカルストレージのトークンをクリアしてログイン画面にリダイレクト
- コンソールにAPIエラーの詳細を出力

## デバッグ機能
- リクエスト時にトークンの有無をコンソールに出力
- APIエラーの詳細情報をコンソールに出力

## 削除機能の種類
1. **ソフトデリート** (`deleteProject`): データベース上では残し、削除フラグを立てる
2. **復元** (`restoreProject`): ソフトデリートされたプロジェクトを復活
3. **物理削除** (`hardDeleteProject`): データベースから完全に削除、復元不可