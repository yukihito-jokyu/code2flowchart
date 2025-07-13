import { useNavigate } from 'react-router-dom';

import { Card } from '@/components';
import { useAuth } from '@/features/auth';

import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout');
  };

  const handleProjectManagement = () => {
    navigate('/projects');
  };

  const handleOtherFeatures = () => {
    // 機能準備中のため、何もしない
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>ダッシュボード</h1>
        <p className={styles.welcome}>ようこそ、{user?.email} さん</p>
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
  );
};
