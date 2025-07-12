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