import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  NodeChange,
  EdgeChange,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { FlowchartNode, FlowchartEdge } from '../types';

import {
  IfNode,
  UnknownNode,
  NormalNode,
  WhileStartNode,
  WhileEndNode,
  ForStartNode,
  ForEndNode,
} from './nodes';

interface FlowchartCanvasProps {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  onPaneClick?: (event: React.MouseEvent) => void;
  className?: string;
}

const nodeTypes = {
  if: IfNode,
  unknown: UnknownNode,
  normal: NormalNode,
  whileStart: WhileStartNode,
  whileEnd: WhileEndNode,
  forStart: ForStartNode,
  forEnd: ForEndNode,
};

export const FlowchartCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  className,
}: FlowchartCanvasProps) => {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        attributionPosition="top-right"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
