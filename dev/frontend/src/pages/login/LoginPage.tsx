import { LoginForm } from '@/features/auth';

import styles from './LoginPage.module.css';

export const LoginPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <LoginForm />
      </div>
    </div>
  );
};
