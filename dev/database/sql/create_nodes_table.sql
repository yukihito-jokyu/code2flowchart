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