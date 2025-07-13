import { Link } from 'react-router-dom';

import { useAuth } from '@/features/auth';

import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>ダッシュボード</h1>
        <p className={styles.welcome}>ようこそ、{user?.email} さん</p>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>アカウント管理</h2>
          <p className={styles.cardDescription}>アカウント設定やログアウトができます。</p>
          <div className={styles.actions}>
            <Link to="/logout" className={styles.logoutButton}>
              ログアウト
            </Link>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>プロジェクト管理</h2>
          <p className={styles.cardDescription}>プロジェクトの作成、編集、削除ができます。</p>
          <div className={styles.actions}>
            <Link to="/projects" className={styles.projectButton}>
              プロジェクト管理
            </Link>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>その他の機能</h2>
          <p className={styles.cardDescription}>その他のアプリケーション機能にアクセスできます。</p>
          <div className={styles.actions}>
            <button className={styles.featureButton} disabled>
              機能準備中
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
