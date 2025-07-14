import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

import styles from './Node.module.css';

import type { FlowchartNodeData } from '../../types/flowchart';

interface WhileEndNodeProps {
  data: FlowchartNodeData;
  selected?: boolean;
}

const WhileEndNode = memo(({ data, selected }: WhileEndNodeProps) => {
  return (
    <div className={`${styles.whileEndNode} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className={styles.whileEndNodeContent}>
        <div className={styles.nodeIcon}>🔄</div>
        <div className={styles.nodeLabel}>{data.label}</div>
        <div className={styles.nodeType}>WHILE END</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

WhileEndNode.displayName = 'WhileEndNode';

export default WhileEndNode;
