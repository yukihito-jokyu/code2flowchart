# ファイル path

```
dev/frontend/src/stores/projectCode/slice.ts
dev/frontend/src/stores/projectCode/selectors.ts
dev/frontend/src/stores/projectCode/types.ts
```

# ストア の情報

## projectCode

- ストアの説明
  - プロジェクトコード機能の状態管理を担当するRedux slice
  - プロジェクトコードのCRUD操作とローディング状態、エラー状態を管理
  - 非同期アクション（createAsyncThunk）を使用してAPIとの通信を処理

- 保持している情報の説明
  - codes: ProjectCode[]
    - プロジェクトに関連するコードの配列
    - 取得済みのコード一覧を保持
  - currentCode: ProjectCode | null
    - 現在編集中または選択中のコード
    - 編集フォームの初期値として使用
  - loading: boolean
    - API通信中のローディング状態
    - UI上でのローディング表示制御に使用
  - error: string | null
    - API通信エラーメッセージ
    - エラー発生時のユーザー通知に使用
  - total: number
    - プロジェクトコードの総件数
    - ページネーション実装時に使用

# 非同期アクション

## createProjectCode
- 新しいプロジェクトコードを作成
- APIエンドポイント: POST /api/project-codes/
- 成功時: codes配列の先頭に新しいコードを追加、total数を増加

## fetchProjectCodes
- プロジェクトのコード一覧を取得
- APIエンドポイント: GET /api/project-codes/project/{projectUuid}
- 成功時: codes配列とtotal数を更新

## fetchProjectCode
- 指定されたUUIDのコード詳細を取得
- APIエンドポイント: GET /api/project-codes/{codeUuid}
- 成功時: currentCodeを更新

## updateProjectCode
- 既存のプロジェクトコードを更新
- APIエンドポイント: PUT /api/project-codes/{codeUuid}
- 成功時: codes配列内の該当コードを更新、currentCodeも同期更新

## deleteProjectCode
- プロジェクトコードを削除
- APIエンドポイント: DELETE /api/project-codes/{codeUuid}
- 成功時: codes配列から削除、total数を減少、currentCodeをクリア

# 同期アクション

## clearError
- エラー状態をクリア

## clearCurrentCode
- 現在選択中のコードをクリア

## setCurrentCode
- 指定されたコードを現在選択中として設定

## clearCodes
- コード一覧と総件数をクリア

# セレクター

## selectProjectCodes
- プロジェクトコード一覧を取得

## selectCurrentCode
- 現在選択中のコードを取得

## selectProjectCodeLoading
- ローディング状態を取得

## selectProjectCodeError
- エラー状態を取得