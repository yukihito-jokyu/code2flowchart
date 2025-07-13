import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NotificationModal } from '@/components';
import { useAuth, useLogout } from '@/features/auth';
import { useNotification } from '@/hooks';

import styles from './LogoutPage.module.css';

export const LogoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { logout, isLoading, error } = useLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    // 未認証の場合はログインページにリダイレクト
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const success = await logout();

    if (success) {
      showNotification(
        'success',
        'ログアウト完了',
        'ログアウトしました。ログインページに移動します。',
        {
          confirmText: 'ログインページへ',
          onConfirm: () => {
            navigate('/login', { replace: true });
          },
        }
      );
    } else {
      setIsLoggingOut(false);
      if (error) {
        showNotification(
          'error',
          'ログアウトエラー',
          error.message || 'ログアウトに失敗しました。'
        );
      }
    }
  };

  const handleCancel = () => {
    navigate(-1); // 前のページに戻る
  };

  if (!isAuthenticated) {
    return null; // リダイレクト中は何も表示しない
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>ログアウト</h1>
          </div>

          <div className={styles.content}>
            <div className={styles.userInfo}>
              <p className={styles.message}>{user?.email} としてログインしています</p>
              <p className={styles.confirmMessage}>本当にログアウトしますか？</p>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
                disabled={isLoading || isLoggingOut}
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className={styles.logoutButton}
                disabled={isLoading || isLoggingOut}
              >
                {isLoading || isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={hideNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        confirmText={notification.confirmText}
        onConfirm={notification.onConfirm}
      />
    </>
  );
};
