import { Node, Edge } from '@xyflow/react';

export type FlowchartNodeType = 'if' | 'for' | 'while' | 'unknown' | 'normal';

export interface FlowchartNodeData extends Record<string, unknown> {
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
