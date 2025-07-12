-- Initialize flow database
CREATE DATABASE IF NOT EXISTS flow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE flow;

-- Users table for authentication and user management
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Codes table for storing user's code and associated metadata
CREATE TABLE IF NOT EXISTS codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    code_content TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'python',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- Nodes table for storing flowchart nodes
CREATE TABLE IF NOT EXISTS nodes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_id INT NOT NULL,
    node_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    code_snippet TEXT,
    info TEXT,
    type ENUM('if', 'for', 'while', 'unknown', 'normal') DEFAULT 'normal',
    position_x INT DEFAULT 0,
    position_y INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (code_id) REFERENCES codes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_node_per_code (code_id, node_id),
    INDEX idx_code_id (code_id),
    INDEX idx_node_type (type)
);

-- Edges table for storing connections between nodes
CREATE TABLE IF NOT EXISTS edges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_id INT NOT NULL,
    source_node_id INT NOT NULL,
    target_node_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (code_id) REFERENCES codes(id) ON DELETE CASCADE,
    INDEX idx_code_id (code_id),
    INDEX idx_source_node (source_node_id),
    INDEX idx_target_node (target_node_id),
    UNIQUE KEY unique_edge_per_code (code_id, source_node_id, target_node_id)
);

-- Insert test data
INSERT INTO users (username, email, password_hash) VALUES
('test_user', 'test@example.com', '$2b$12$dummy.hash.for.testing.purposes.only'),
('admin', 'admin@example.com', '$2b$12$dummy.hash.for.testing.purposes.only');