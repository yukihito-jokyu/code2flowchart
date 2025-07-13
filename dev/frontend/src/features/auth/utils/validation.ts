import type { FormErrors, LoginFormData, LoginFormErrors, SignupFormData } from '../types';

export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return 'メールアドレスは必須です';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return '有効なメールアドレスを入力してください';
  }
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'パスワードは必須です';
  }
  if (password.length < 8) {
    return 'パスワードは8文字以上で入力してください';
  }
  return undefined;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | undefined => {
  if (!confirmPassword) {
    return 'パスワード確認は必須です';
  }
  if (password !== confirmPassword) {
    return 'パスワードが一致しません';
  }
  return undefined;
};

export const validateSignupForm = (data: SignupFormData): FormErrors => {
  const errors: FormErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateConfirmPassword(data.password, data.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return errors;
};

export const validateLoginForm = (data: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};
