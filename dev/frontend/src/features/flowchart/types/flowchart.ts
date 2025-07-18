import { Node, Edge } from '@xyflow/react';

export type FlowchartNodeType =
  | 'if'
  | 'whileStart'
  | 'whileEnd'
  | 'forStart'
  | 'forEnd'
  | 'unknown'
  | 'normal';

export interface FlowchartNodeData extends Record<string, unknown> {
  label: string;
  title: string;
  code: string;
  info: string;
}

export interface FlowchartNode extends Node {
  id: string;
  position: { x: number; y: number };
  type: FlowchartNodeType;
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
