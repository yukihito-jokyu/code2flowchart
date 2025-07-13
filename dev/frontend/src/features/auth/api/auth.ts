import axios, { AxiosError } from 'axios';

import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  LogoutResponse,
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

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
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>('/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

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
