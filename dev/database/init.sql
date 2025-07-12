-- Initialize flow database
CREATE DATABASE IF NOT EXISTS flow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE flow;

-- Create example table for testing
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert test data
INSERT INTO users (username, email) VALUES
('test_user', 'test@example.com'),
('admin', 'admin@example.com');