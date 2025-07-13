import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

import styles from './Node.module.css';

import type { FlowchartNodeData } from '../../types/flowchart';

interface WhileNodeProps {
  data: FlowchartNodeData;
  selected?: boolean;
}

const WhileNode = memo(({ data, selected }: WhileNodeProps) => {
  return (
    <div className={`${styles.whileNode} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className={styles.whileNodeContent}>
        <div className={styles.nodeIcon}>⭕</div>
        <div className={styles.nodeLabel}>{data.label}</div>
        <div className={styles.nodeType}>WHILE</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

WhileNode.displayName = 'WhileNode';

export default WhileNode;
