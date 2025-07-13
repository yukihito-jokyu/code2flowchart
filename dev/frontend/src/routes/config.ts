import { createBrowserRouter } from 'react-router-dom';

import { DashboardPage } from '@/pages/dashboard';
import { FlowchartPage } from '@/pages/flowchart';
import { LoginPage } from '@/pages/login';
import { LogoutPage } from '@/pages/logout';
import { ProjectsPage } from '@/pages/projects';
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
    path: '/projects',
    Component: ProjectsPage,
  },
  {
    path: '/flowchart/:projectId',
    Component: FlowchartPage,
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
