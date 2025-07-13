import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

import styles from './Node.module.css';

import type { FlowchartNodeData } from '../../types/flowchart';

interface NormalNodeProps {
  data: FlowchartNodeData;
  selected?: boolean;
}

const NormalNode = memo(({ data, selected }: NormalNodeProps) => {
  return (
    <div className={`${styles.normalNode} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className={styles.normalNodeContent}>
        <div className={styles.nodeIcon}>📋</div>
        <div className={styles.nodeLabel}>{data.label}</div>
        <div className={styles.nodeType}>NORMAL</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

NormalNode.displayName = 'NormalNode';

export default NormalNode;
