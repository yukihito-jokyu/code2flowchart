import { useState } from 'react';

import { useSignup } from '../hooks';
import type { FormErrors, SignupFormData } from '../types';
import { validateSignupForm } from '../utils';
import styles from './SignupForm.module.css';

interface SignupFormProps {
  onSuccess?: () => void;
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const { signup, isLoading, error } = useSignup();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateSignupForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const success = await signup(formData);
    if (success) {
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>新規登録</h2>

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
          placeholder="8文字以上で入力してください"
        />
        {formErrors.password && <p className={styles.error}>{formErrors.password}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="confirmPassword" className={styles.label}>
          パスワード確認
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={styles.input}
          placeholder="パスワードを再入力してください"
        />
        {formErrors.confirmPassword && <p className={styles.error}>{formErrors.confirmPassword}</p>}
      </div>

      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error.message}</p>
        </div>
      )}

      <div className={styles.submitField}>
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? '登録中...' : '新規登録'}
        </button>
      </div>
    </form>
  );
};