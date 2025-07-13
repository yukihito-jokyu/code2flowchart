import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

import styles from './Node.module.css';

import type { FlowchartNodeData } from '../../types/flowchart';

interface IfNodeProps {
  data: FlowchartNodeData;
  selected?: boolean;
}

const IfNode = memo(({ data, selected }: IfNodeProps) => {
  return (
    <div className={`${styles.ifNode} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className={styles.ifNodeContent}>
        <div className={styles.nodeIcon}>💎</div>
        <div className={styles.nodeLabel}>{data.label}</div>
        <div className={styles.nodeType}>IF</div>
      </div>
      <Handle type="source" position={Position.Top} id="true" />
      <Handle type="source" position={Position.Bottom} id="false" />
    </div>
  );
});

IfNode.displayName = 'IfNode';

export default IfNode;
