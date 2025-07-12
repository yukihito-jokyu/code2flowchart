import { useNavigate } from 'react-router-dom';

import { SignupForm } from '@/features/auth';

import styles from './SignupPage.module.css';

export const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignupSuccess = () => {
    alert('新規登録が完了しました！');
    navigate('/login');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <SignupForm onSuccess={handleSignupSuccess} onLoginClick={handleLoginClick} />
      </div>
    </div>
  );
};