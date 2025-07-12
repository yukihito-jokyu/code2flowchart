import { useState } from 'react';

import { authApi } from '../api';
import type { AuthError, SignupFormData, SignupRequest } from '../types';

interface UseSignupReturn {
  isLoading: boolean;
  error: AuthError | null;
  signup: (data: SignupFormData) => Promise<boolean>;
}

export const useSignup = (): UseSignupReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const signup = async (data: SignupFormData): Promise<boolean> => {
    if (data.password !== data.confirmPassword) {
      setError({ message: 'パスワードが一致しません' });
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const signupData: SignupRequest = {
        email: data.email,
        password: data.password,
      };

      await authApi.signup(signupData);
      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      if (err instanceof Error) {
        setError({ message: err.message });
      } else {
        setError({ message: '新規登録に失敗しました' });
      }
      return false;
    }
  };

  return {
    isLoading,
    error,
    signup,
  };
};