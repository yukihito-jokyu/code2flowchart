import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

import styles from './Node.module.css';

import type { FlowchartNodeData } from '../../types/flowchart';

interface WhileStartNodeProps {
  data: FlowchartNodeData;
  selected?: boolean;
}

const WhileStartNode = memo(({ data, selected }: WhileStartNodeProps) => {
  return (
    <div className={`${styles.whileStartNode} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className={styles.whileStartNodeContent}>
        <div className={styles.nodeIcon}>🔄</div>
        <div className={styles.nodeLabel}>{data.label}</div>
        <div className={styles.nodeType}>WHILE START</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

WhileStartNode.displayName = 'WhileStartNode';

export default WhileStartNode;
