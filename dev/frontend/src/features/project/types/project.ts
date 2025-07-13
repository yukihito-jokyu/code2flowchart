export interface Project {
  uuid: string;
  user_uuid: string;
  name: string;
  description?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
}

export interface ProjectDeleteResponse {
  message: string;
  uuid: string;
}

export interface ProjectState {
  projects: Project[];
  deletedProjects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  total: number;
}
