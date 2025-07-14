import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

import styles from './Node.module.css';

import type { FlowchartNodeData } from '../../types/flowchart';

interface ForEndNodeProps {
  data: FlowchartNodeData;
  selected?: boolean;
}

const ForEndNode = memo(({ data, selected }: ForEndNodeProps) => {
  return (
    <div className={`${styles.forEndNode} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className={styles.forEndNodeContent}>
        <div className={styles.nodeIcon}>🔁</div>
        <div className={styles.nodeLabel}>{data.label}</div>
        <div className={styles.nodeType}>FOR END</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

ForEndNode.displayName = 'ForEndNode';

export default ForEndNode;
