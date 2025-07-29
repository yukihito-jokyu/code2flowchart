# ファイル path

```
src/features/flowchart/api/flowchart.ts
```

# 関数の情報

## generateFlowchart

- 機能
  - 入力されたコードをバックエンドAPIに送信してフローチャートを生成する
  - 認証トークンを含むHTTPリクエストを送信
  - APIレスポンスのエラーハンドリングを行い、適切なエラーメッセージを返す

- 呼び出している api
  - `POST /flowchart/generate` - フローチャート生成エンドポイント

- 引数の型
  ```typescript
  interface FlowchartGenerateRequest {
    code_content: string;  // 解析対象のコード（必須）
    language?: string;     // プログラミング言語（オプション、デフォルト: python）
  }
  ```

- 戻り値の型
  ```typescript
  interface FlowchartGenerateResponse {
    nodes: FlowchartNodeResponse[];  // フローチャートノード配列
    edges: FlowchartEdgeResponse[];  // フローチャートエッジ配列
  }

  interface FlowchartNodeResponse {
    id: number;                      // ノードID
    title: string;                   // ノードタイトル
    code?: string;                   // コードスニペット（オプション）
    info?: string;                   // ノード説明（オプション）
    type: string;                    // ノードタイプ
    position: { x: number; y: number }; // ノード位置座標
  }

  interface FlowchartEdgeResponse {
    source: number;  // ソースノードID
    target: number;  // ターゲットノードID
  }
  ```

- 依存関係にあるファイル
  - `axios` - HTTP通信ライブラリ
  - 環境変数 `VITE_API_BASE_URL` - APIベースURL設定
  - `localStorage` - 認証トークン取得

## API設定詳細

- **Base URL**: 環境変数から取得（`import.meta.env.VITE_API_BASE_URL`）
- **認証**: Bearer token（localStorage から取得）
- **Content-Type**: `application/json`
- **エラーハンドリング**: レスポンスインターセプターでカスタムエラーメッセージ生成