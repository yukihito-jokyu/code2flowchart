export interface ProjectCode {
  uuid: string;
  project_uuid: string;
  title: string;
  code_content: string;
  language: string;
  description?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectCodeCreate {
  project_uuid: string;
  title: string;
  code_content: string;
  language: string;
  description?: string;
}

export interface ProjectCodeUpdate {
  title?: string;
  code_content?: string;
  language?: string;
  description?: string;
}

export interface ProjectCodeResponse {
  codes: ProjectCode[];
  total: number;
}

export interface ProjectCodeState {
  codes: ProjectCode[];
  currentCode: ProjectCode | null;
  loading: boolean;
  error: string | null;
  total: number;
}
