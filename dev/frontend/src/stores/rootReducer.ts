import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './auth/slice';
import projectReducer from './project/slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
});
