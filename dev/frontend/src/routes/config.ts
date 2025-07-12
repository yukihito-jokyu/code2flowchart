import { createBrowserRouter } from 'react-router-dom';

import { SignupPage } from '@/pages/signup';
import App from '@/sections/App/App';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
  {
    path: '/signup',
    Component: SignupPage,
  },
]);