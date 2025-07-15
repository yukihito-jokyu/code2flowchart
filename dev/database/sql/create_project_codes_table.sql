-- Project codes table for storing project-level code (not associated with specific nodes)
CREATE TABLE IF NOT EXISTS project_codes (
    uuid CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_uuid CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    code_content TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'python',
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_uuid) REFERENCES projects(uuid) ON DELETE CASCADE,
    INDEX idx_project_codes_project_uuid (project_uuid),
    INDEX idx_project_codes_created_at (created_at),
    INDEX idx_project_codes_is_deleted (is_deleted),
    INDEX idx_project_codes_language (language)
);