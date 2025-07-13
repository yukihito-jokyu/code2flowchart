import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  EdgeChange,
  NodeChange,
  useReactFlow,
} from '@xyflow/react';
import { useCallback, useState } from 'react';

import { FlowchartData, FlowchartNode, FlowchartEdge, FlowchartNodeType } from '../types';

interface UseFlowchartProps {
  projectId: string;
  initialData?: FlowchartData;
}

export const useFlowchart = ({ projectId, initialData }: UseFlowchartProps) => {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nodes, setNodesState] = useState<FlowchartNode[]>(initialData?.nodes || []);
  const [edges, setEdgesState] = useState<FlowchartEdge[]>(initialData?.edges || []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes as Node[]) as FlowchartNode[];
      setNodesState(updatedNodes);
      setNodes(updatedNodes as Node[]);
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      setEdgesState(updatedEdges);
      setEdges(updatedEdges);
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const updatedEdges = addEdge(connection, edges);
      setEdgesState(updatedEdges);
      setEdges(updatedEdges);
    },
    [edges, setEdges]
  );

  const addNode = useCallback(
    (type: FlowchartNodeType, label: string, position: { x: number; y: number }) => {
      const newNode: FlowchartNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label,
          type,
        },
      };

      const updatedNodes = [...nodes, newNode];
      setNodesState(updatedNodes);
      setNodes(updatedNodes as Node[]);
      return newNode.id;
    },
    [nodes, setNodes]
  );

  const updateNodeLabel = useCallback(
    (nodeId: string, label: string) => {
      const updatedNodes = nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                label,
              },
            }
          : node
      );
      setNodesState(updatedNodes);
      setNodes(updatedNodes as Node[]);
    },
    [nodes, setNodes]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      const updatedNodes = nodes.filter((node) => node.id !== nodeId);
      const updatedEdges = edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);

      setNodesState(updatedNodes);
      setEdgesState(updatedEdges);
      setNodes(updatedNodes as Node[]);
      setEdges(updatedEdges);

      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
      }
    },
    [nodes, edges, selectedNodeId, setNodes, setEdges]
  );

  const clearFlowchart = useCallback(() => {
    setNodesState([]);
    setEdgesState([]);
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
  }, [setNodes, setEdges]);

  const saveFlowchart = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const flowchartData: FlowchartData = {
        nodes: getNodes() as FlowchartNode[],
        edges: getEdges(),
      };

      // TODO: APIを使ってサーバーに保存する処理を実装
      console.log('Saving flowchart for project:', projectId, flowchartData);

      // 一時的にローカルストレージに保存
      localStorage.setItem(`flowchart-${projectId}`, JSON.stringify(flowchartData));

      setIsLoading(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save flowchart');
      setIsLoading(false);
      return false;
    }
  }, [projectId, getNodes, getEdges]);

  const loadFlowchart = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: APIを使ってサーバーから読み込む処理を実装
      // 一時的にローカルストレージから読み込み
      const saved = localStorage.getItem(`flowchart-${projectId}`);
      if (saved) {
        const flowchartData: FlowchartData = JSON.parse(saved);
        setNodesState(flowchartData.nodes);
        setEdgesState(flowchartData.edges);
        setNodes(flowchartData.nodes as Node[]);
        setEdges(flowchartData.edges);
      }

      setIsLoading(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load flowchart');
      setIsLoading(false);
      return false;
    }
  }, [projectId, setNodes, setEdges]);

  return {
    nodes,
    edges,
    selectedNodeId,
    isLoading,
    error,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeLabel,
    deleteNode,
    clearFlowchart,
    saveFlowchart,
    loadFlowchart,
    setSelectedNodeId,
  };
};
