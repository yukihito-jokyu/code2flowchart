# ファイル path

```
dev/frontend/src/api/projectCode.ts
dev/frontend/src/components/CodeInput/
dev/frontend/src/stores/projectCode/
dev/frontend/src/types/projectCode.ts
```

# プロジェクトコード機能の情報

## ProjectCode Feature

- 機能の説明
  - プロジェクトに関連するソースコードの管理機能
  - コードの作成、編集、保存、一覧表示機能を提供
  - 複数のプログラミング言語に対応
  - フローチャート生成機能への統合予定
  - ReactとReduxを使用したフロントエンド実装

- 依存関係にあるファイル
  - バックエンドAPI
    - POST /api/project-codes/ (作成)
    - GET /api/project-codes/project/{projectUuid} (一覧取得)
    - GET /api/project-codes/{codeUuid} (詳細取得)
    - PUT /api/project-codes/{codeUuid} (更新)
    - DELETE /api/project-codes/{codeUuid} (削除)
  - フロントエンド
    - @/hooks/redux (Redux hooks)
    - axios (HTTP クライアント)
    - React (UI フレームワーク)

- 主要な型定義
  - ProjectCode
    - uuid: string (プロジェクトコードの一意識別子)
    - project_uuid: string (関連するプロジェクトのUUID)
    - title: string (コードタイトル)
    - code_content: string (コード内容)
    - language: string (プログラミング言語)
    - description?: string (オプション説明)
    - is_deleted: boolean (削除フラグ)
    - created_at: string (作成日時)
    - updated_at: string (更新日時)
  - ProjectCodeCreate
    - project_uuid: string
    - title: string
    - code_content: string
    - language: string
    - description?: string
  - ProjectCodeUpdate
    - title?: string
    - code_content?: string
    - language?: string
    - description?: string

# アーキテクチャ概要

## レイヤー構成
1. **API Layer** (api/projectCode.ts)
   - RESTful API との通信を担当
   - 認証トークンの自動付与
   - エラーハンドリング

2. **State Management Layer** (stores/projectCode/)
   - Redux Toolkit を使用した状態管理
   - 非同期アクションの処理
   - 正規化されたデータ構造

3. **Component Layer** (components/CodeInput/)
   - ユーザーインターフェース
   - フォーム管理とバリデーション
   - ユーザーアクションの処理

4. **Type Layer** (types/projectCode.ts)
   - TypeScript 型定義
   - API レスポンス型
   - コンポーネントプロパティ型

## データフロー
1. ユーザーアクション → Component
2. Component → Redux Action
3. Redux Action → API Call
4. API Response → Redux State Update
5. State Update → Component Re-render

# 統合ポイント

## FlowchartPage との統合
- FlowchartPage.tsx でCodeInputコンポーネントを使用
- プロジェクトUUIDを共有してコード管理
- フローチャート生成機能への連携予定

## 今後の拡張予定
- コードからフローチャートの自動生成
- シンタックスハイライト機能
- コード実行・デバッグ機能
- バージョン管理機能