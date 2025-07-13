import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

import styles from './Node.module.css';

import type { FlowchartNodeData } from '../../types/flowchart';

interface ForNodeProps {
  data: FlowchartNodeData;
  selected?: boolean;
}

const ForNode = memo(({ data, selected }: ForNodeProps) => {
  return (
    <div className={`${styles.forNode} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className={styles.forNodeContent}>
        <div className={styles.nodeIcon}>🔄</div>
        <div className={styles.nodeLabel}>{data.label}</div>
        <div className={styles.nodeType}>FOR</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

ForNode.displayName = 'ForNode';

export default ForNode;
