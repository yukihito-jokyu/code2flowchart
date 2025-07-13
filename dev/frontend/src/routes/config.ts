import { createBrowserRouter } from 'react-router-dom';

import { DashboardPage } from '@/pages/dashboard';
import { LoginPage } from '@/pages/login';
import { LogoutPage } from '@/pages/logout';
import { SignupPage } from '@/pages/signup';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: DashboardPage,
  },
  {
    path: '/dashboard',
    Component: DashboardPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/logout',
    Component: LogoutPage,
  },
  {
    path: '/signup',
    Component: SignupPage,
  },
]);
