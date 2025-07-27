import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NotificationModal } from '@/components';
import { useNotification } from '@/hooks';

import { useLogin } from '../hooks';
import { validateLoginForm } from '../utils';

import styles from './LoginForm.module.css';

import type { LoginFormData, LoginFormErrors } from '../types';

interface LoginFormProps {
  onSuccess?: () => void;
  onSignupClick?: () => void;
}

export const LoginForm = ({ onSuccess, onSignupClick }: LoginFormProps) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } = useNotification();

  const { login, isLoading, error } = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name as keyof LoginFormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateLoginForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const success = await login(formData);
    if (success) {
      showNotification('success', 'ログイン成功', 'ダッシュボードに移動します', {
        confirmText: 'OK',
        onConfirm: () => {
          onSuccess?.();
          navigate('/dashboard');
        },
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>ログイン</h2>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            placeholder="example@email.com"
          />
          {formErrors.email && <p className={styles.error}>{formErrors.email}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            パスワード
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            placeholder="パスワードを入力してください"
          />
          {formErrors.password && <p className={styles.error}>{formErrors.password}</p>}
        </div>

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error.message}</p>
          </div>
        )}

        <div className={styles.submitField}>
          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
        </div>

        {onSignupClick && (
          <div className={styles.linkField}>
            <div className={styles.divider}>
              <span className={styles.dividerText}>または</span>
            </div>
            <button
              type="button"
              onClick={() => (window.location.href = `${API_BASE_URL}/auth/login`)}
              className={styles.googleButton}
            >
              Googleでログイン
            </button>
            <p className={styles.linkText}>アカウントをお持ちでない方はこちら</p>
            <button type="button" onClick={onSignupClick} className={styles.navButton}>
              新規登録
            </button>
          </div>
        )}
      </form>

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
