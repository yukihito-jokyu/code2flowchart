import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { projectCodeApi } from '../api/projectCode';
import {
  ProjectCode,
  ProjectCodeCreate,
  ProjectCodeUpdate,
  ProjectCodeState,
} from '../types/projectCode';

// 初期状態
const initialState: ProjectCodeState = {
  codes: [],
  currentCode: null,
  loading: false,
  error: null,
  total: 0,
};

// 非同期アクション: プロジェクトコード作成
export const createProjectCode = createAsyncThunk(
  'projectCode/createProjectCode',
  async (projectCodeData: ProjectCodeCreate, { rejectWithValue }) => {
    try {
      const projectCode = await projectCodeApi.createProjectCode(projectCodeData);
      return projectCode;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.detail || 'プロジェクトコードの作成に失敗しました'
        );
      }
      return rejectWithValue('予期せぬエラーが発生しました');
    }
  }
);

// 非同期アクション: プロジェクトコード一覧取得
export const fetchProjectCodes = createAsyncThunk(
  'projectCode/fetchProjectCodes',
  async (
    { projectUuid, skip = 0, limit = 100 }: { projectUuid: string; skip?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await projectCodeApi.getProjectCodes(projectUuid, skip, limit);
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.detail || 'プロジェクトコード一覧の取得に失敗しました'
        );
      }
      return rejectWithValue('予期せぬエラーが発生しました');
    }
  }
);

// 非同期アクション: プロジェクトコード詳細取得
export const fetchProjectCode = createAsyncThunk(
  'projectCode/fetchProjectCode',
  async (codeUuid: string, { rejectWithValue }) => {
    try {
      const projectCode = await projectCodeApi.getProjectCode(codeUuid);
      return projectCode;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.detail || 'プロジェクトコードの取得に失敗しました'
        );
      }
      return rejectWithValue('予期せぬエラーが発生しました');
    }
  }
);

// 非同期アクション: プロジェクトコード更新
export const updateProjectCode = createAsyncThunk(
  'projectCode/updateProjectCode',
  async (
    { codeUuid, projectCodeData }: { codeUuid: string; projectCodeData: ProjectCodeUpdate },
    { rejectWithValue }
  ) => {
    try {
      const projectCode = await projectCodeApi.updateProjectCode(codeUuid, projectCodeData);
      return projectCode;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.detail || 'プロジェクトコードの更新に失敗しました'
        );
      }
      return rejectWithValue('予期せぬエラーが発生しました');
    }
  }
);

// 非同期アクション: プロジェクトコード削除
export const deleteProjectCode = createAsyncThunk(
  'projectCode/deleteProjectCode',
  async (codeUuid: string, { rejectWithValue }) => {
    try {
      await projectCodeApi.deleteProjectCode(codeUuid);
      return codeUuid;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.detail || 'プロジェクトコードの削除に失敗しました'
        );
      }
      return rejectWithValue('予期せぬエラーが発生しました');
    }
  }
);

const projectCodeSlice = createSlice({
  name: 'projectCode',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCode: (state) => {
      state.currentCode = null;
    },
    setCurrentCode: (state, action: PayloadAction<ProjectCode>) => {
      state.currentCode = action.payload;
    },
    clearCodes: (state) => {
      state.codes = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // プロジェクトコード作成
      .addCase(createProjectCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProjectCode.fulfilled, (state, action) => {
        state.loading = false;
        state.codes.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createProjectCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // プロジェクトコード一覧取得
      .addCase(fetchProjectCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.codes = action.payload.codes;
        state.total = action.payload.total;
      })
      .addCase(fetchProjectCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // プロジェクトコード詳細取得
      .addCase(fetchProjectCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectCode.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCode = action.payload;
      })
      .addCase(fetchProjectCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // プロジェクトコード更新
      .addCase(updateProjectCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProjectCode.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.codes.findIndex((code) => code.uuid === action.payload.uuid);
        if (index !== -1) {
          state.codes[index] = action.payload;
        }
        if (state.currentCode?.uuid === action.payload.uuid) {
          state.currentCode = action.payload;
        }
      })
      .addCase(updateProjectCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // プロジェクトコード削除
      .addCase(deleteProjectCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProjectCode.fulfilled, (state, action) => {
        state.loading = false;
        state.codes = state.codes.filter((code) => code.uuid !== action.payload);
        state.total -= 1;
        if (state.currentCode?.uuid === action.payload) {
          state.currentCode = null;
        }
      })
      .addCase(deleteProjectCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentCode, setCurrentCode, clearCodes } =
  projectCodeSlice.actions;
export default projectCodeSlice.reducer;
