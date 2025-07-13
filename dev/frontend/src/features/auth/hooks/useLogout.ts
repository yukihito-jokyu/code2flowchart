import { useState } from 'react';

import { useAppDispatch } from '../../../hooks/redux';
import { logout as logoutAction } from '../../../stores';
import { authApi } from '../api';

import type { AuthError } from '../types';

interface UseLogoutReturn {
  isLoading: boolean;
  error: AuthError | null;
  logout: () => Promise<boolean>;
}

export const useLogout = (): UseLogoutReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const dispatch = useAppDispatch();

  const logout = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await authApi.logout();

      // Reduxストアからログアウト状態を削除
      dispatch(logoutAction());

      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      if (err instanceof Error) {
        setError({ message: err.message });
      } else {
        setError({ message: 'ログアウトに失敗しました' });
      }
      // APIエラーでもローカルからは削除
      dispatch(logoutAction());
      return false;
    }
  };

  return {
    isLoading,
    error,
    logout,
  };
};
