import { Node, Edge } from '@xyflow/react';

export type FlowchartNodeType = 'start' | 'process' | 'decision' | 'end';

export interface FlowchartNodeData {
  label: string;
  type: FlowchartNodeType;
}

export interface FlowchartNode extends Node {
  data: FlowchartNodeData;
}

export type FlowchartEdge = Edge;

export interface FlowchartData {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
}

export interface FlowchartState {
  projectId: string;
  flowchart: FlowchartData;
  selectedNodeId: string | null;
  isLoading: boolean;
  error: string | null;
}
