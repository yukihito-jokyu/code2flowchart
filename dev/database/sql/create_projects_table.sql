-- Projects table for managing user projects
CREATE TABLE IF NOT EXISTS projects (
    uuid CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_uuid CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE,
    INDEX idx_user_uuid (user_uuid),
    INDEX idx_created_at (created_at)
);