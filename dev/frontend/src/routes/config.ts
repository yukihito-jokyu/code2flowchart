import { createBrowserRouter } from 'react-router-dom';

import { LoginPage } from '@/pages/login';
import { SignupPage } from '@/pages/signup';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/signup',
    Component: SignupPage,
  },
]);