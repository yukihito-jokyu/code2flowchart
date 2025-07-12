import { useState } from 'react';

import { authApi } from '../api';
import type { AuthError, LoginFormData, LoginRequest } from '../types';

interface UseLoginReturn {
  isLoading: boolean;
  error: AuthError | null;
  login: (data: LoginFormData) => Promise<boolean>;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const login = async (data: LoginFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const loginData: LoginRequest = {
        email: data.email,
        password: data.password,
      };

      const response = await authApi.login(loginData);
      
      // ローカルストレージにトークンを保存
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userEmail', response.email);
      }

      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      if (err instanceof Error) {
        setError({ message: err.message });
      } else {
        setError({ message: 'ログインに失敗しました' });
      }
      return false;
    }
  };

  return {
    isLoading,
    error,
    login,
  };
};