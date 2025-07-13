import { useAppSelector } from '../../../hooks/redux';
import { selectAuth } from '../../../stores';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useAppSelector(selectAuth);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
};
