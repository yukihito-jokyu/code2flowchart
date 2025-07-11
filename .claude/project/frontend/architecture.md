# プロジェクト構造

- frontend の src ディレクトリ内のアーキテクチャと説明

```
src/
├ api           // 共通の機能に関連する、エクスポートされたAPIリクエストとapi hooks
├ assets        // 画像やフォントなどの静的ファイル
├ components    // アプリケーション全体で使用される共有コンポーネント
├ config        // すべての設定、環境変数
├ features      // 機能ベースのモジュール
├ hooks         // アプリケーション全体で使用される共有フック
├ i18n          // 多言語対応のための国際化（Internationalization）設定を管理する
├ lib           // アプリケーション用に事前に設定された異なるライブラリ
├ pages         // ページの定義
├ plop          // ストリーブック作成のツール
├ routes        // ルート設定
├ stores        // global状態管理
├ storybook     // コンポーネントを個別に開発・テスト・ドキュメント化するためのUIカタログツール
├ test          // テストユーティリティとmockサーバー
├ types         // アプリケーション全体で使用される基本型
└ utils         // 共通のユーティリティ
```

- api ディレクトリについて
  このディレクトリは API リクエスト関数などを格納するディレクトリです。

```
api/
├ client.ts                 // APIクライアントの設定
├ endpoints.ts              // APIエンドポイントの設定
└ modules/
    ├ auth/                 // 認証（ログイン・ログアウトなど）
    │   └ auth.ts
    └ user/                 // ユーザー情報の取得・更新など
        └ user.ts
```

- components ディレクトリについて
  このディレクトリは状態を持たない UI 単位を管理するコンポーネントを格納するディレクトリです。

```

components/
├─ ui/                                // UIコンポーネントを格納するディレクトリ
│   ├─ Button/                        // 例：ボタンコンポーネントを格納するディレクトリ
│   │   ├─ Button.tsx
│   │   └─ index.ts
│   ├─ Modal/                         // 例：モーダルコンポーネントを格納するディレクトリ
│   │   ├─ Modal.tsx
│   │   └─ index.ts
│   ├─ Avatar/                        // 例：アバターコンポーネントを格納するディレクトリ
│   │   ├─ Avatar.tsx
│   │   └─ index.ts
│   └── xxx/
│       ├─ xxx.tsx                    // コンポーネントの実装
│       └─ index.ts                   // 将来的に複数の export に対応できるようにするためのファイル
│
├─ form/                              // フォームコンポーネントを格納するディレクトリ
│   ├─ Input/                         // 入力コンポーネントを格納するディレクトリ
│   │   ├─ Input.tsx
│   │   └─ index.ts
│   ├─ Select/                        // セレクトコンポーネントを格納するディレクトリ
│   │   ├─ Select.tsx
│   │   └─ index.ts
│   ├─ Xxx/                           // 必要に応じて作成
│   │   ├─ Xxx.tsx
│   │   └─ index.ts
│   └─ FormField/                     // フォームフィールドコンポーネントを格納するディレクトリ
│       ├─ FormField.tsx
│       └─ index.ts
└─ index.ts
```

- features ディレクトリについて
  コンポーネント・フック・型・API を機能ごとに閉じ込めるディレクトリです。

```
features/xxx/
├─ api/          // APIリクエスト
├─ assets/       // 画像やフォントなどの静的ファイル
├─ components/   // コンポーネント
├─ hooks/        // カスタムフック
├─ stores/       // 状態管理
├─ types/        // 型定義
├─ utils/        // ユーティリティ関数
└─ index.tsx     // エクスポート用のファイル
```

- hooks ディレクトリについて
  アプリ全体で再利用されるカスタムフックを格納するディレクトリです。

- i18n ディレクトリについて
  多言語設定と翻訳ファイルの管理を行うディレクトリです。

```
i18n/
├─ locales/          // 各言語の翻訳ファイル
│   └─ <page>/
│       ├─ en.ts   // 英語の翻訳ファイル
│       └─ ja.ts   // 日本語の翻訳ファイル
└─ config.ts         // i18nの設定ファイル
```

- pages ディレクトリについて
  アプリケーションのページを定義するディレクトリです。

```
pages/
├─ home/                  // 例：ホームページ
│   ├─ HomePage.tsx
│   └─ index.ts           // エクスポート用のファイル
└─ login/                 // 例：ログインページ
    ├─ LoginPage.tsx
    └─ index.ts
```

- routes ディレクトリについて
  ページごとの route を設定するディレクトリです。

```
routes/
├ Layout                // レイアウトを記述したtsxファイルを配置するディレクトリ
│   └ Default           // レイアウトごとにディレクトリを分ける
│       └ Default.tsx   // デフォルトのレイアウト
│
└ config.ts             // route関連の設定ファイル
```

- stores ディレクトリについて
  プロジェクト全体の状態管理を定義するディレクトリです。

```
stores
├ services
│   └ userApi.ts        // API 通信を Redux に統合するファイル
│
├ users
│   ├ types.ts          // 状態の型を定義するファイル
│   ├ reducers.ts       // リデューサーを定義するファイル
│   ├ slice.ts          // スライスを定義するファイル
│   └ selectors.ts      // セレクタを定義するファイル
│
├ rootReducer.ts        // リデューサーを一つにまとめるファイル
├ apiCollection.ts      // reducers/middleware をまとめるファイル
└ store.ts              // アプリケーション全体のストアを作成するファイル
```

- test ディレクトリについて
  ユニットテストや統合テストなどを整理して格納するディレクトリです。

```
test/
├── components/
│   ├── Button
│   │   ├── Button.test.tsx
│   │   └── __snapshots__/             // スナップショットを格納するフォルダ（自動生成）
│   │       └── Button.test.tsx.snap   // スナップショットファイル（自動生成）
│   └── Xxx/                           // 必要に応じて作成
│       └── Xxx.test.tsx
├── hooks/
│   └── useAuth.test.ts
├── xxx/                               // 必要に応じて作成
│   └── xxx.test.ts
└── __mocks__/                         // APIレスポンスや外部依存をモックするためのフォルダ
    └── server.test.ts
```

- types ディレクトリについて
  アプリケーション全体で使用されるグローバル型定義を格納するディレクトリです。

- utils ディレクトリについて
  汎用関数を格納するディレクトリです。
