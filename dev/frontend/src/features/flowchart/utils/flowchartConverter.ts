import type { FlowchartGenerateResponse, FlowchartNodeResponse, FlowchartEdgeResponse } from '../api';
import type { FlowchartNode, FlowchartEdge, FlowchartNodeType } from '../types';

const mapNodeTypeFromBackend = (backendType: string): FlowchartNodeType => {
  const typeMapping: Record<string, FlowchartNodeType> = {
    'if': 'if',
    'for_start': 'forStart',
    'for_end': 'forEnd',
    'while_start': 'whileStart',
    'while_end': 'whileEnd',
    'unknown': 'unknown',
    'normal': 'normal',
  };
  
  return typeMapping[backendType] || 'normal';
};

export const convertApiResponseToFlowchart = (
  apiResponse: FlowchartGenerateResponse
): { nodes: FlowchartNode[]; edges: FlowchartEdge[] } => {
  const nodes: FlowchartNode[] = apiResponse.nodes.map((node: FlowchartNodeResponse) => ({
    id: node.id.toString(),
    position: node.position,
    type: mapNodeTypeFromBackend(node.type),
    data: {
      label: node.title,
      title: node.title,
      code: node.code || '',
      info: node.info || '',
    },
  }));

  const edges: FlowchartEdge[] = apiResponse.edges.map((edge: FlowchartEdgeResponse) => ({
    id: `e${edge.source}-${edge.target}`,
    source: edge.source.toString(),
    target: edge.target.toString(),
    type: 'smoothstep',
  }));

  return { nodes, edges };
};