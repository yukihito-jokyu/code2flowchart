import axios from 'axios';

import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

export const authApi = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await axios.post<SignupResponse>(
      `${API_BASE_URL}/auth/signup`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/login`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  },
};