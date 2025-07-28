import styles from './LoginForm.module.css';

export const LoginForm = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/login`;
  };

  return (
    <div className={styles.form}>
      <h2 className={styles.title}>ログイン</h2>
      <p className={styles.description}>Googleアカウントでログインしてください</p>

      <div className={styles.submitField}>
        <button type="button" onClick={handleGoogleLogin} className={styles.googleButton}>
          Googleでログイン
        </button>
      </div>
    </div>
  );
};
