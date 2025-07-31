# ファイル path

```
src/features/flowchart/
├── api/
│   ├── flowchart.ts
│   └── index.ts
├── components/
│   ├── FlowchartCanvas.tsx
│   ├── FlowchartGenerator.tsx
│   ├── NodeToolbar.tsx
│   ├── NodeDetailModal.tsx
│   ├── NodeDetailModal.module.css
│   ├── devTools/
│   │   ├── DevTools.tsx
│   │   ├── ChangeLogger.tsx
│   │   ├── NodeInspector.tsx
│   │   ├── ViewportLogger.tsx
│   │   └── DevTools.css
│   ├── nodes/
│   │   ├── IfNode.tsx
│   │   ├── ForNode.tsx
│   │   ├── WhileNode.tsx
│   │   ├── UnknownNode.tsx
│   │   ├── NormalNode.tsx
│   │   ├── Node.module.css
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── useFlowchart.ts
│   └── index.ts
├── types/
│   ├── flowchart.ts
│   └── index.ts
├── utils/
│   ├── flowchartConverter.ts
│   └── index.ts
└── index.ts
```

# コンポーネントの情報

## フローチャート機能（Flowchart Feature）

- **概要**: React Flowライブラリを使用したフローチャート描画機能を提供するfeatureモジュール

- **主要コンポーネント**:
  - `FlowchartCanvas`: フローチャートの描画キャンバス（ReactFlow コンポーネントのラッパー）
  - `FlowchartGenerator`: AIによるフローチャート自動生成コンポーネント
  - `NodeToolbar`: ノード追加・保存・クリア機能を提供するツールバー
  - `NodeDetailModal`: ノードクリック時の詳細情報表示モーダル
  - **開発用デバッグツール**:
    - `DevTools`: 開発時のデバッグツール群を管理（ノード監視、変更ログ、ビューポート情報）
    - `ChangeLogger`: ノード変更をリアルタイムで記録・表示
    - `NodeInspector`: ノード詳細情報の表示
    - `ViewportLogger`: ビューポートの変換情報を表示
  - **カスタムノードコンポーネント**:
    - `IfNode`: IF文を表現するひし形ノード
    - `ForNode`: FOR文を表現する六角形ノード
    - `WhileNode`: WHILE文を表現する円形ノード
    - `UnknownNode`: 不明な関数を表現する警告ノード
    - `NormalNode`: 通常処理を表現する四角形ノード

- **カスタムフック**:
  - `useFlowchart`: フローチャートの状態管理と操作機能を提供
    - **Props**: `projectId` (プロジェクトID), `initialData` (初期データ)
    - **戻り値**: ノード・エッジ操作、保存・読み込み、状態管理の各種関数と状態
    - **Issue #74追加機能**: `setFlowchartData` - 外部からフローチャートデータを直接設定

- **型定義**:
  - `FlowchartNodeType`: ノードの種類（'if' | 'whileStart' | 'whileEnd' | 'forStart' | 'forEnd' | 'unknown' | 'normal'）
  - `FlowchartNodeData`: ノードのデータ構造（Record<string, unknown>を継承）
    - `label: string`: ノードのラベル
    - `type: FlowchartNodeType`: ノードの種類
    - `title: string`: ノードのタイトル（詳細表示用）
    - `code: string`: ノードのコード（詳細表示用）
    - `info: string`: ノードの説明（詳細表示用）
  - `FlowchartNode`: React Flowのノードを拡張したフローチャート用ノード
  - `FlowchartEdge`: React Flowのエッジ型のエイリアス
  - `FlowchartData`: フローチャート全体のデータ構造
  - `FlowchartState`: フローチャート機能の状態管理用型

- **機能詳細**:
  - **ノード操作**: 7種類のカスタムノード（IF・WHILE開始・WHILE終了・FOR開始・FOR終了・不明・通常）の追加・削除・移動
    - `addNode`: 指定した位置に新しいノードを追加（拡張されたFlowchartNodeDataに対応）
    - `updateNodeLabel`: ノードのラベルを更新
    - `deleteNode`: ノードと関連するエッジを削除
  - **エッジ操作**: ノード間の接続線の描画・削除
    - `onConnect`: ノード間の接続を作成
    - `onEdgesChange`: エッジの変更を処理
  - **ノード詳細表示**: 
    - ノードクリック時にNodeDetailModalを表示
    - title、code、infoの詳細情報を表示
    - ノードタイプに応じた色分け表示
  - **ダミーデータ機能**: 
    - 開発・テスト用のダミーデータをuseFlowchart.tsにハードコーディング
    - コメントアウトで簡単に無効化可能
    - 17個のノードと対応するエッジのサンプルデータ
  - **保存・読み込み機能**: 
    - `saveFlowchart`: 現在のフローチャートデータを保存（一時的にローカルストレージ使用）
    - `loadFlowchart`: 保存されたフローチャートデータを読み込み
    - **TODO**: API連携による サーバーへの保存・読み込み機能の実装が必要
  - **状態管理**: 
    - `selectedNodeId`: 選択中のノードID
    - `isLoading`: 保存・読み込み処理中の状態
    - `error`: エラー状態の管理
  - **Issue #74追加機能**: 
    - `setFlowchartData`: 外部からフローチャートデータ（ノード・エッジ）を直接設定
    - CodeInputコンポーネントからのフローチャート生成結果を受信して即座に反映
    - APIレスポンスからの変換済みデータを効率的に設定
  - **UI機能**: ミニマップ、コントロールパネル、背景グリッド
  - **開発支援機能**: 
    - DevToolsコンポーネントによる開発時のデバッグ支援
    - ChangeLoggerによるノード変更の追跡
    - NodeInspectorによるノード情報のリアルタイム表示
    - ViewportLoggerによるビューポート状態の監視
  - **カスタムデザイン**: 各ノードタイプに応じた独自の形状とスタイル

- **API機能**:
  - `flowchartApi.generateFlowchart`: バックエンドAPIを呼び出してフローチャートを生成
  - 認証トークンを含むHTTPリクエスト送信
  - エラーハンドリングとレスポンス変換

- **ユーティリティ機能**:
  - `convertApiResponseToFlowchart`: APIレスポンスをReact Flow形式に変換
  - バックエンドのノードタイプとフロントエンドのノードタイプのマッピング
  - ノード位置とエッジの変換処理

- **最新の機能追加 (feature/#26)**:
  - **AI フローチャート生成機能**: 
    - コード入力からの自動フローチャート生成
    - 複数のプログラミング言語対応（Python, JavaScript, Java, C, C++）
    - Azure OpenAI APIとの連携による高精度な解析
    - フォールバック機能による確実な動作保証

- **依存関係にあるファイル**:
  - `@xyflow/react`: React Flow ライブラリ
  - `@/hooks/useNotification`: 通知機能
  - `axios`: HTTP通信ライブラリ（API呼び出し用）
  - プロジェクト固有の型定義やユーティリティは含まない独立したfeature

- **技術特徴**:
  - TypeScript完全対応
  - メタリックデザインのスタイリング
  - React Hook による状態管理
  - コンポーネント分離による再利用性
  - CSS Modules によるスタイル管理
  - カスタムノードのReactFlow統合
  - memo化によるパフォーマンス最適化