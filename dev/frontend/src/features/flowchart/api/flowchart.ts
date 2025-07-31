import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface FlowchartGenerateRequest {
  code_content: string;
  language?: string;
}

export interface FlowchartNodeResponse {
  id: number;
  title: string;
  code?: string;
  info?: string;
  type: string;
  position: { x: number; y: number };
}

export interface FlowchartEdgeResponse {
  source: number;
  target: number;
  source_handle: string;
}

export interface FlowchartGenerateResponse {
  nodes: FlowchartNodeResponse[];
  edges: FlowchartEdgeResponse[];
}

export const flowchartApi = {
  generateFlowchart: async (
    request: FlowchartGenerateRequest
  ): Promise<FlowchartGenerateResponse> => {
    const response = await apiClient.post<FlowchartGenerateResponse>(
      '/flowchart/generate',
      request,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },
};
