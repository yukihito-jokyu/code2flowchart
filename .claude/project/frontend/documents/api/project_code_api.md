# ファイル path

```
dev/frontend/src/features/projectCode/api/projectCode.ts
```

# 関数の情報

## createProjectCode

- 機能
  - 新しいプロジェクトコードを作成する

- 呼び出している api
  - POST /project-codes/make

- 引数の型
  - projectCodeData: ProjectCodeCreate

- 戻り値の型
  - Promise<ProjectCode>

- 依存関係にあるファイル
  - @/features/projectCode/types/projectCode

## getProjectCodes

- 機能
  - 指定されたプロジェクトのコード一覧を取得する

- 呼び出している api
  - GET /project-codes/project/{projectUuid}

- 引数の型
  - projectUuid: string
  - skip: number (default: 0)
  - limit: number (default: 100)

- 戻り値の型
  - Promise<ProjectCodeResponse>

- 依存関係にあるファイル
  - @/features/projectCode/types/projectCode

## getProjectCode

- 機能
  - 指定されたUUIDのプロジェクトコード詳細を取得する

- 呼び出している api
  - GET /project-codes/{codeUuid}

- 引数の型
  - codeUuid: string

- 戻り値の型
  - Promise<ProjectCode>

- 依存関係にあるファイル
  - @/features/projectCode/types/projectCode

## updateProjectCode

- 機能
  - 既存のプロジェクトコードを更新する

- 呼び出している api
  - PUT /project-codes/{codeUuid}

- 引数の型
  - codeUuid: string
  - projectCodeData: ProjectCodeUpdate

- 戻り値の型
  - Promise<ProjectCode>

- 依存関係にあるファイル
  - @/features/projectCode/types/projectCode

## deleteProjectCode

- 機能
  - 指定されたUUIDのプロジェクトコードを削除する

- 呼び出している api
  - DELETE /project-codes/{codeUuid}

- 引数の型
  - codeUuid: string

- 戻り値の型
  - Promise<void>

- 依存関係にあるファイル
  - なし

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