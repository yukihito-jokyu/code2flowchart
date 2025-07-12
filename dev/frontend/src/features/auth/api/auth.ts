import axios from 'axios';

import type { SignupRequest, SignupResponse } from '../types';

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
};