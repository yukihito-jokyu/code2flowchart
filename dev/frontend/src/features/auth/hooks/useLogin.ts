import { useState } from 'react';

import { useAppDispatch } from '../../../hooks/redux';
import { loginStart, loginSuccess, loginFailure } from '../../../stores';
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
  const dispatch = useAppDispatch();

  const login = async (data: LoginFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    dispatch(loginStart());

    try {
      const loginData: LoginRequest = {
        email: data.email,
        password: data.password,
      };

      const response = await authApi.login(loginData);

      // Reduxストアにログイン状態を保存
      if (response.token) {
        dispatch(
          loginSuccess({
            user: { id: response.id, email: response.email },
            token: response.token,
          })
        );
      }

      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      dispatch(loginFailure());
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
