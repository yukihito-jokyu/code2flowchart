import axios from 'axios';

import {
  ProjectCode,
  ProjectCodeCreate,
  ProjectCodeUpdate,
  ProjectCodeResponse,
} from '../types/projectCode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// APIクライアントの設定
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター（認証トークンの追加）
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log('Request token:', token ? 'Token found' : 'No token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// レスポンスインターセプター（エラーハンドリング）
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401 || error.response?.status === 403) {
      // 認証エラーの場合、ローカルストレージをクリアしてログイン画面にリダイレクト
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const projectCodeApi = {
  // プロジェクトコード作成
  createProjectCode: async (projectCodeData: ProjectCodeCreate): Promise<ProjectCode> => {
    const response = await apiClient.post<ProjectCode>('/project-codes/make', projectCodeData);
    return response.data;
  },

  // プロジェクトのコード一覧取得
  getProjectCodes: async (
    projectUuid: string,
    skip: number = 0,
    limit: number = 100
  ): Promise<ProjectCodeResponse> => {
    const response = await apiClient.get<ProjectCodeResponse>(
      `/project-codes/project/${projectUuid}`,
      {
        params: { skip, limit },
      }
    );
    return response.data;
  },

  // プロジェクトコード詳細取得
  getProjectCode: async (codeUuid: string): Promise<ProjectCode> => {
    const response = await apiClient.get<ProjectCode>(`/project-codes/${codeUuid}`);
    return response.data;
  },

  // プロジェクトコード更新
  updateProjectCode: async (
    codeUuid: string,
    projectCodeData: ProjectCodeUpdate
  ): Promise<ProjectCode> => {
    const response = await apiClient.put<ProjectCode>(
      `/project-codes/${codeUuid}`,
      projectCodeData
    );
    return response.data;
  },

  // プロジェクトコード削除
  deleteProjectCode: async (codeUuid: string): Promise<void> => {
    await apiClient.delete(`/project-codes/${codeUuid}`);
  },
};
