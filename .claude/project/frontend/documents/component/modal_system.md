# ファイル path

```
src/components/Modal/
├ Modal.tsx                   # ベースモーダルコンポーネント
├ Modal.module.css           # ベースモーダルのスタイル
├ NotificationModal.tsx      # 通知用モーダルコンポーネント
├ NotificationModal.module.css # 通知モーダルのスタイル
└ index.ts                   # エクスポート用ファイル

src/hooks/
└ useNotification.ts         # 通知管理フック
```

# コンポーネントの情報

## モーダルシステム

- モダンで再利用可能なモーダルコンポーネントシステム
- ベースモーダルと通知専用モーダルの2層構造
- アニメーション効果とアクセシビリティ機能を完備

- 依存関係にあるファイル

### Modal (ベースコンポーネント)
- **React Portal**: document.bodyにレンダリング
- **keyboard navigation**: ESCキーでの閉じる機能
- **click outside**: オーバーレイクリックで閉じる
- **size variants**: small, medium, large対応
- **scroll handling**: ボディスクロール制御

### NotificationModal
- **4つの通知タイプ**: success, error, warning, info
- **アイコン表示**: 各タイプに対応したSVGアイコン
- **カスタマイズ可能**: タイトル、メッセージ、ボタンテキスト
- **アニメーション**: アイコンのバウンス効果

### useNotification Hook
- **showNotification**: 通知モーダル表示
- **hideNotification**: 通知モーダル非表示
- **onConfirm**: 確認ボタンコールバック対応

- plops の説明

レスポンシブデザインに対応し、モバイル環境でも最適な表示を提供。アクセシビリティガイドラインに準拠し、スクリーンリーダーやキーボードナビゲーションをサポート。