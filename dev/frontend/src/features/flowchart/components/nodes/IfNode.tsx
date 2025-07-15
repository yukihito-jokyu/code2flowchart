import { Handle, Position } from '@xyflow/react';
import { memo, useState } from 'react';

import styles from './Node.module.css';

import type { FlowchartNodeData } from '../../types/flowchart';

interface IfNodeProps {
  data: FlowchartNodeData;
  selected?: boolean;
}

const IfNode = memo(({ data, selected }: IfNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className={`${styles.ifNodeWrapper} ${isHovered ? styles.hovered : ''}`}>
      <div
        className={`${styles.ifNode} ${selected ? styles.selected : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.ifNodeContent}>
          <div className={styles.nodeIcon}>💎</div>
          <div className={styles.nodeLabel}>{data.label}</div>
          <div className={styles.nodeType}>IF</div>
        </div>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Right} id="false" />
      <Handle type="source" position={Position.Bottom} id="true" />
    </div>
  );
});

IfNode.displayName = 'IfNode';

export default IfNode;
