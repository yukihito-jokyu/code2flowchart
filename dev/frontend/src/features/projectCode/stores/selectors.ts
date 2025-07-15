import { RootState } from '@/stores/store';

export const selectProjectCodeState = (state: RootState) => state.projectCode;

export const selectProjectCodes = (state: RootState) => state.projectCode.codes;

export const selectCurrentCode = (state: RootState) => state.projectCode.currentCode;

export const selectProjectCodeLoading = (state: RootState) => state.projectCode.loading;

export const selectProjectCodeError = (state: RootState) => state.projectCode.error;

export const selectProjectCodeTotal = (state: RootState) => state.projectCode.total;
