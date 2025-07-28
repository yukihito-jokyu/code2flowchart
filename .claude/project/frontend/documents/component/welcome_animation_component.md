# ファイル path

```
src/components/ui/WelcomeAnimation/WelcomeAnimation.tsx
src/components/ui/WelcomeAnimation/WelcomeAnimation.module.css
src/components/ui/WelcomeAnimation/index.ts
```

# コンポーネントの情報

## WelcomeAnimation

- ログイン成功時にDashboardページで表示される「c2fへようこそ」アニメーションコンポーネント
- URLパラメータクリア後の再レンダリング時にのみ動作する制御ロジック付きアニメーション
- グラッシュモーフィズムデザインを適用したモダンなUI
- フェードイン → 3秒表示 → フェードアウトの段階的アニメーション効果
- スパークルエフェクト付きのウェルカムメッセージを表示

- 依存関係にあるファイル
  - React 19 hooks (useState, useEffect)
  - CSS Modules

- propsの型と説明
  - `isVisible: boolean` - アニメーションの表示状態を制御するフラグ
  - `onAnimationComplete: () => void` - アニメーション完了時に実行されるコールバック関数