import { useEffect } from 'react';

import { useAppDispatch } from '../hooks/redux';
import { restoreAuth } from '../stores';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // アプリケーション起動時に認証状態を復元
    dispatch(restoreAuth());
  }, [dispatch]);

  return <>{children}</>;
};
