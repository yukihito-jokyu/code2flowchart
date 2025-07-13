import { useNavigate } from 'react-router-dom';

import { LoginForm } from '@/features/auth';

import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    alert('ログインが完了しました！');
    navigate('/');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <LoginForm onSuccess={handleLoginSuccess} onSignupClick={handleSignupClick} />
      </div>
    </div>
  );
};
