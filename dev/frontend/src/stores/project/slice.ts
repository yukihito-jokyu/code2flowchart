import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { projectApi } from '@/features/project/api/project';
import {
  Project,
  ProjectCreate,
  ProjectUpdate,
  ProjectState,
} from '@/features/project/types/project';

// 初期状態
const initialState: ProjectState = {
  projects: [],
  deletedProjects: [],
  currentProject: null,
  loading: false,
  error: null,
  total: 0,
};

// 非同期アクション: プロジェクト作成
export const createProject = createAsyncThunk(
  'project/createProject',
  async (projectData: ProjectCreate, { rejectWithValue }) => {
    try {
      const project = await projectApi.createProject(projectData);
      return project;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.detail || 'プロジェクトの作成に失敗しました');
      }
      return rejectWithValue('予期せぬエラーが発生しました');
    }
  }
);

// 非同期アクション: プロジェクト一覧取得
export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (
    { skip = 0, limit = 100 }: { skip?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await projectApi.getProjects(skip, limit);
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.detail || 'プロジェクト一覧の取得に失敗しました'
        );
      }
      return rejectWithValue('予期せぬエラーが発生しました');
    }
  }
);

// 非同期アクション: 削除済みプロジェクト一覧取得
export const fetchDeletedProjects = createAsyncThunk(
  'project/fetchDeletedProjects',
  async (
    { skip = 0, limit = 100 }: { skip?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await projectApi.getDeletedProjects(skip, limit);
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.detail || '削除済みプロジェクト一覧の取得に失敗しました'
        );
      }
      return rejectWithValue('予期せぬエラーが発生しました');
    }
  }
);

// 非同期アクション: プロジェクト詳細取得
export const fetchProject = createAsyncThunk(
  'project/fetchProject',
  async (projectUuid: string, { rejectWithValue }) => {
    try {
      const project = await projectApi.getProject(projectUuid);
      return project;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.detail || 'プロジェクトの取得に失敗しました');
      }
      return rejectWithValue('予期せぬエラーが発生しました');
    }
  }
);

// 非同期アクション: プロジェクト更新
export const updateProject = createAsyncThunk(
  'project/updateProject',
  async (
    { projectUuid, projectData }: { projectUuid: string; projectData: ProjectUpdate },
    { rejectWithValue }
  ) => {
    try {
      const project = await projectApi.updateProject(projectUuid, projectData);
      return project;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.detail || 'プロジェクトの更新に失敗しました');
      }
      return rejectWithValue('予期せぬエラーが発生しました');
    }
  }
);

// 非同期アクション: プロジェクト削除
export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (projectUuid: string, { rejectWithValue }) => {
    try {
      await projectApi.deleteProject(projectUuid);
      return projectUuid;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.detail || 'プロジェクトの削除に失敗しました');
      }
      return rejectWithValue('予期せぬエラーが発生しました');
    }
  }
);

// 非同期アクション: プロジェクト復元
export const restoreProject = createAsyncThunk(
  'project/restoreProject',
  async (projectUuid: string, { rejectWithValue }) => {
    try {
      const project = await projectApi.restoreProject(projectUuid);
      return project;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.detail || 'プロジェクトの復元に失敗しました');
      }
      return rejectWithValue('予期せぬエラーが発生しました');
    }
  }
);

// 非同期アクション: プロジェクト完全削除
export const hardDeleteProject = createAsyncThunk(
  'project/hardDeleteProject',
  async (projectUuid: string, { rejectWithValue }) => {
    try {
      await projectApi.hardDeleteProject(projectUuid);
      return projectUuid;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.detail || 'プロジェクトの完全削除に失敗しました'
        );
      }
      return rejectWithValue('予期せぬエラーが発生しました');
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    setCurrentProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // プロジェクト作成
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // プロジェクト一覧取得
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects;
        state.total = action.payload.total;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 削除済みプロジェクト一覧取得
      .addCase(fetchDeletedProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeletedProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedProjects = action.payload.projects;
      })
      .addCase(fetchDeletedProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // プロジェクト詳細取得
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // プロジェクト更新
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex((project) => project.uuid === action.payload.uuid);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.uuid === action.payload.uuid) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // プロジェクト削除
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter((project) => project.uuid !== action.payload);
        state.total -= 1;
        if (state.currentProject?.uuid === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // プロジェクト復元
      .addCase(restoreProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreProject.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedProjects = state.deletedProjects.filter(
          (project) => project.uuid !== action.payload.uuid
        );
        state.projects.unshift(action.payload);
        state.total += 1;
      })
      .addCase(restoreProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // プロジェクト完全削除
      .addCase(hardDeleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hardDeleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedProjects = state.deletedProjects.filter(
          (project) => project.uuid !== action.payload
        );
      })
      .addCase(hardDeleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentProject, setCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
