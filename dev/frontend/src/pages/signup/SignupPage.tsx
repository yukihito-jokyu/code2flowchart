import { SignupForm } from '@/features/auth';

import styles from './SignupPage.module.css';

export const SignupPage = () => {
  const handleSignupSuccess = () => {
    alert('新規登録が完了しました！');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <SignupForm onSuccess={handleSignupSuccess} />
      </div>
    </div>
  );
};