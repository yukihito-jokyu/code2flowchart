import axios, { AxiosError } from 'axios';

import type { LogoutResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Axiosインスタンスを作成してエラーハンドリングを統一
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// レスポンスインターセプターでエラーハンドリング
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.data) {
      const errorData = error.response.data as { detail?: string; message?: string };
      const message = errorData.detail || errorData.message || 'エラーが発生しました';
      throw new Error(message);
    }
    throw new Error('ネットワークエラーが発生しました');
  }
);

// 認証ヘッダーを取得する関数
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authApi = {
  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>(
      '/auth/logout',
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },
};
