import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

import styles from './Node.module.css';

import type { FlowchartNodeData } from '../../types/flowchart';

interface ForStartNodeProps {
  data: FlowchartNodeData;
  selected?: boolean;
}

const ForStartNode = memo(({ data, selected }: ForStartNodeProps) => {
  return (
    <div className={`${styles.forStartNode} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className={styles.forStartNodeContent}>
        <div className={styles.nodeIcon}>🔁</div>
        <div className={styles.nodeLabel}>{data.label}</div>
        <div className={styles.nodeType}>FOR START</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

ForStartNode.displayName = 'ForStartNode';

export default ForStartNode;
