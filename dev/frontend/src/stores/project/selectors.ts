import { RootState } from '../store';

export const selectProjects = (state: RootState) => state.project.projects;
export const selectDeletedProjects = (state: RootState) => state.project.deletedProjects;
export const selectCurrentProject = (state: RootState) => state.project.currentProject;
export const selectProjectLoading = (state: RootState) => state.project.loading;
export const selectProjectError = (state: RootState) => state.project.error;
export const selectProjectTotal = (state: RootState) => state.project.total;

// プロジェクトをUUIDで検索
export const selectProjectByUuid = (state: RootState, uuid: string) =>
  state.project.projects.find((project) => project.uuid === uuid);

// 削除済みプロジェクトをUUIDで検索
export const selectDeletedProjectByUuid = (state: RootState, uuid: string) =>
  state.project.deletedProjects.find((project) => project.uuid === uuid);

// プロジェクトの存在確認
export const selectHasProjects = (state: RootState) => state.project.projects.length > 0;
export const selectHasDeletedProjects = (state: RootState) =>
  state.project.deletedProjects.length > 0;
