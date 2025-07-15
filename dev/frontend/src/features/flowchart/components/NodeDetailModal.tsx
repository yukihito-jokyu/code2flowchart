import { Modal } from '@/components/Modal';

import { FlowchartNodeData } from '../types';

import styles from './NodeDetailModal.module.css';

export interface NodeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: FlowchartNodeData | null;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({ isOpen, onClose, nodeData }) => {
  if (!nodeData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ノード詳細" size="medium">
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>タイトル</h3>
          <p className={styles.sectionContent}>{nodeData.title}</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>コード</h3>
          <pre className={styles.codeContent}>{nodeData.code}</pre>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>説明</h3>
          <p className={styles.sectionContent}>{nodeData.info}</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>タイプ</h3>
          <span className={`${styles.typeTag} ${styles[nodeData.type]}`}>{nodeData.type}</span>
        </div>
      </div>
    </Modal>
  );
};
