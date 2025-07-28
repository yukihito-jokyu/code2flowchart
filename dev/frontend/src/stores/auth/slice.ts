import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AuthState, User } from './types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;

      // ローカルストレージに保存
      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('userId', action.payload.user.id);
      localStorage.setItem('userEmail', action.payload.user.email);
      localStorage.setItem('userUsername', action.payload.user.username);
    },
    loginFailure: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      // ローカルストレージから削除
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userUsername');
    },
    restoreAuth: (state) => {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      const userEmail = localStorage.getItem('userEmail');
      const userUsername = localStorage.getItem('userUsername');

      if (token && userId && userEmail && userUsername) {
        state.user = { id: userId, email: userEmail, username: userUsername };
        state.isAuthenticated = true;
      }
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, restoreAuth, setLoading } =
  authSlice.actions;

export default authSlice.reducer;
