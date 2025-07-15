import { Modal } from '@/components/Modal';

import { FlowchartNode } from '../types';

import styles from './NodeDetailModal.module.css';

export interface NodeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: FlowchartNode | null;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({ isOpen, onClose, node }) => {
  if (!node) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ノード詳細" size="medium">
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>タイトル</h3>
          <p className={styles.sectionContent}>{node.data.title}</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>コード</h3>
          <pre className={styles.codeContent}>{node.data.code}</pre>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>説明</h3>
          <p className={styles.sectionContent}>{node.data.info}</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>タイプ</h3>
          <span className={`${styles.typeTag} ${styles[node.type]}`}>{node.type}</span>
        </div>
      </div>
    </Modal>
  );
};
