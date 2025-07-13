import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

import styles from './Node.module.css';

import type { FlowchartNodeData } from '../../types/flowchart';

interface UnknownNodeProps {
  data: FlowchartNodeData;
  selected?: boolean;
}

const UnknownNode = memo(({ data, selected }: UnknownNodeProps) => {
  return (
    <div className={`${styles.unknownNode} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className={styles.unknownNodeContent}>
        <div className={styles.nodeIcon}>⚠️</div>
        <div className={styles.nodeLabel}>{data.label}</div>
        <div className={styles.nodeType}>UNKNOWN</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

UnknownNode.displayName = 'UnknownNode';

export default UnknownNode;
