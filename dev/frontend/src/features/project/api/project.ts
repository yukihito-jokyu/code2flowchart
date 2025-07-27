import axios from 'axios';

import {
  Project,
  ProjectCreate,
  ProjectUpdate,
  ProjectListResponse,
  ProjectDeleteResponse,
} from '../types/project';

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

export const projectApi = {
  // プロジェクト作成
  createProject: async (projectData: ProjectCreate): Promise<Project> => {
    const response = await apiClient.post<Project>('/projects/make', projectData);
    return response.data;
  },

  // プロジェクト一覧取得
  getProjects: async (skip: number = 0, limit: number = 100): Promise<ProjectListResponse> => {
    const response = await apiClient.get<ProjectListResponse>('/projects/get', {
      params: { skip, limit },
    });
    return response.data;
  },

  // 削除済みプロジェクト一覧取得
  getDeletedProjects: async (
    skip: number = 0,
    limit: number = 100
  ): Promise<ProjectListResponse> => {
    const response = await apiClient.get<ProjectListResponse>('/projects/deleted', {
      params: { skip, limit },
    });
    return response.data;
  },

  // プロジェクト詳細取得
  getProject: async (projectUuid: string): Promise<Project> => {
    const response = await apiClient.get<Project>(`/projects/${projectUuid}`);
    return response.data;
  },

  // プロジェクト更新
  updateProject: async (projectUuid: string, projectData: ProjectUpdate): Promise<Project> => {
    const response = await apiClient.put<Project>(`/projects/${projectUuid}`, projectData);
    return response.data;
  },

  // プロジェクト削除（ソフトデリート）
  deleteProject: async (projectUuid: string): Promise<ProjectDeleteResponse> => {
    const response = await apiClient.delete<ProjectDeleteResponse>(`/projects/${projectUuid}`);
    return response.data;
  },

  // プロジェクト復元
  restoreProject: async (projectUuid: string): Promise<Project> => {
    const response = await apiClient.post<Project>(`/projects/${projectUuid}/restore`);
    return response.data;
  },

  // プロジェクト完全削除
  hardDeleteProject: async (projectUuid: string): Promise<ProjectDeleteResponse> => {
    const response = await apiClient.delete<ProjectDeleteResponse>(`/projects/${projectUuid}/hard`);
    return response.data;
  },
};
