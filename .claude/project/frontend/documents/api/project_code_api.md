# ファイル path

```
dev/frontend/src/api/projectCode.ts
```

# 関数の情報

## createProjectCode

- 機能
  - 新しいプロジェクトコードを作成する

- 呼び出している api
  - POST /api/project-codes/

- 引数の型
  - projectCodeData: ProjectCodeCreate

- 戻り値の型
  - Promise<ProjectCode>

- 依存関係にあるファイル
  - @/types/projectCode

## getProjectCodes

- 機能
  - 指定されたプロジェクトのコード一覧を取得する

- 呼び出している api
  - GET /api/project-codes/project/{projectUuid}

- 引数の型
  - projectUuid: string
  - skip: number (default: 0)
  - limit: number (default: 100)

- 戻り値の型
  - Promise<ProjectCodeResponse>

- 依存関係にあるファイル
  - @/types/projectCode

## getProjectCode

- 機能
  - 指定されたUUIDのプロジェクトコード詳細を取得する

- 呼び出している api
  - GET /api/project-codes/{codeUuid}

- 引数の型
  - codeUuid: string

- 戻り値の型
  - Promise<ProjectCode>

- 依存関係にあるファイル
  - @/types/projectCode

## updateProjectCode

- 機能
  - 既存のプロジェクトコードを更新する

- 呼び出している api
  - PUT /api/project-codes/{codeUuid}

- 引数の型
  - codeUuid: string
  - projectCodeData: ProjectCodeUpdate

- 戻り値の型
  - Promise<ProjectCode>

- 依存関係にあるファイル
  - @/types/projectCode

## deleteProjectCode

- 機能
  - 指定されたUUIDのプロジェクトコードを削除する

- 呼び出している api
  - DELETE /api/project-codes/{codeUuid}

- 引数の型
  - codeUuid: string

- 戻り値の型
  - Promise<void>

- 依存関係にあるファイル
  - なし

# APIクライアント設定

## 認証機能
- リクエストインターセプターでJWTトークンを自動付与
- レスポンスインターセプターで認証エラー時の自動リダイレクト処理

## エラーハンドリング
- 401/403エラー時にローカルストレージのトークンをクリアしてログイン画面にリダイレクト
- API エラーの詳細をコンソールに出力