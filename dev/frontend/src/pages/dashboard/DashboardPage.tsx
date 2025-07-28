import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Card, WelcomeAnimation } from '@/components';
import { useAuth } from '@/features/auth';
import { useAppDispatch } from '@/hooks';
import { loginSuccess } from '@/stores';

import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);

  const handleLogout = () => {
    navigate('/logout');
  };

  const handleProjectManagement = () => {
    navigate('/projects');
  };

  const handleOtherFeatures = () => {
    // 機能準備中のため、何もしない
  };

  const handleAnimationComplete = () => {
    setShowWelcomeAnimation(false);
    // セッションストレージからフラグをクリア
    sessionStorage.removeItem('showWelcomeAnimation');
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const id = params.get('id');
    const email = params.get('email');
    const username = params.get('username');

    if (token && id && email && username) {
      // Reduxストアにログイン状態を保存
      dispatch(
        loginSuccess({
          user: { id, email, username },
          token,
        })
      );

      // ウェルカムアニメーション表示フラグを設定
      sessionStorage.setItem('showWelcomeAnimation', 'true');

      // URLをきれいにする（クエリ削除）
      navigate('/dashboard', { replace: true });
    }
  }, [location, navigate, dispatch]);

  useEffect(() => {
    // パラメータクリア後のレンダリング時にアニメーション表示チェック
    const shouldShowAnimation = sessionStorage.getItem('showWelcomeAnimation') === 'true';
    if (shouldShowAnimation && !location.search) {
      setShowWelcomeAnimation(true);
    }
  }, [location.search]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>ダッシュボード</h1>
          <p className={styles.welcome}>ようこそ、{user?.username} さん</p>
        </div>

        <div className={styles.content}>
          <Card
            title="アカウント管理"
            description="アカウント設定やログアウトができます。"
            buttonText="ログアウト"
            onButtonClick={handleLogout}
            variant="danger"
          />

          <Card
            title="プロジェクト管理"
            description="プロジェクトの作成、編集、削除ができます。"
            buttonText="プロジェクト管理"
            onButtonClick={handleProjectManagement}
            variant="primary"
          />

          <Card
            title="その他の機能"
            description="その他のアプリケーション機能にアクセスできます。"
            buttonText="機能準備中"
            onButtonClick={handleOtherFeatures}
            variant="default"
            disabled={true}
          />
        </div>
      </div>

      <WelcomeAnimation
        isVisible={showWelcomeAnimation}
        onAnimationComplete={handleAnimationComplete}
      />
    </>
  );
};
