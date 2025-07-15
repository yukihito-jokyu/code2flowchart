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

  // ダミーデータ（コメントアウトで無効化可能）
  const dummyData: FlowchartData = {
    nodes: [
      {
        id: '0',
        position: { x: 0, y: 0 },
        data: {
          label: '変数の代入',
          title: '変数の代入',
          code: 'number = 7',
          info: '変数numberに7を代入しています。',
        },
        type: 'normal',
      },
      {
        id: '1',
        position: { x: 0, y: 200 },
        data: {
          label: 'if文の開始',
          title: 'if文の開始',
          code: 'if number > 10:',
          info: 'numberが10より大きい場合の条件分岐です。',
        },
        type: 'if',
      },
      {
        id: '2',
        position: { x: 0, y: 400 },
        data: {
          label: '10より大きい時の出力',
          title: '10より大きい時の出力',
          code: 'print("10より大きいです")',
          info: 'numberが10より大きい場合の出力処理です。',
        },
        type: 'normal',
      },
      {
        id: '3',
        position: { x: 150, y: 400 },
        data: {
          label: 'elif条件',
          title: '10と等しい場合のelif条件',
          code: 'elif number == 10:',
          info: 'numberが10と等しい場合の条件分岐です。',
        },
        type: 'if',
      },
      {
        id: '4',
        position: { x: 150, y: 600 },
        data: {
          label: '10と等しい場合の出力',
          title: '10と等しい場合の出力',
          code: 'print("ちょうど10です")',
          info: 'numberが10と等しい場合の出力処理です。',
        },
        type: 'normal',
      },
      {
        id: '5',
        position: { x: 300, y: 600 },
        data: {
          label: 'else条件',
          title: '10より小さい場合のelse条件',
          code: 'else:',
          info: '上記条件に該当しない場合（numberが10未満）の処理です。',
        },
        type: 'if',
      },
      {
        id: '6',
        position: { x: 300, y: 800 },
        data: {
          label: '10より小さい時の出力',
          title: '10より小さい時の出力',
          code: 'print("10より小さいです")',
          info: 'numberが10より小さい場合の出力処理です。',
        },
        type: 'normal',
      },
      {
        id: '7',
        position: { x: 0, y: 1000 },
        data: {
          label: '出力',
          title: '出力',
          code: 'print("1から5までの数を表示します:")',
          info: '1から5までの数を表示する前のメッセージ出力です。',
        },
        type: 'normal',
      },
      {
        id: '8',
        position: { x: 0, y: 1200 },
        data: {
          label: 'for文の開始',
          title: 'for文の開始',
          code: 'for i in range(1, 6):',
          info: '1から5までの数を繰り返し処理するループの開始です。',
        },
        type: 'forStart',
      },
      {
        id: '9',
        position: { x: 0, y: 1400 },
        data: {
          label: '数値出力',
          title: '数値出力',
          code: 'print(i)',
          info: '現在のiの値を出力します。',
        },
        type: 'normal',
      },
      {
        id: '10',
        position: { x: 0, y: 1600 },
        data: {
          label: 'for文の終了',
          title: 'for文の終了',
          code: '# for文の終了',
          info: 'forループの終了を表します。',
        },
        type: 'forEnd',
      },
      {
        id: '11',
        position: { x: 0, y: 1800 },
        data: {
          label: '出力',
          title: '出力',
          code: 'print("カウントダウンを開始します:")',
          info: 'カウントダウンの開始を示すメッセージを出力します。',
        },
        type: 'normal',
      },
      {
        id: '12',
        position: { x: 0, y: 2000 },
        data: {
          label: '変数の代入',
          title: '変数定義',
          code: 'count = 5',
          info: 'カウントダウン用の変数countを5で初期化します。',
        },
        type: 'normal',
      },
      {
        id: '13',
        position: { x: 0, y: 2200 },
        data: {
          label: 'while文の開始',
          title: 'while文の開始',
          code: 'while count > 0:',
          info: 'countが0より大きい間ループします。',
        },
        type: 'whileStart',
      },
      {
        id: '14',
        position: { x: 0, y: 2400 },
        data: {
          label: 'カウント表示',
          title: 'カウント表示',
          code: 'print(count)',
          info: '現在のcountの値を出力します。',
        },
        type: 'normal',
      },
      {
        id: '15',
        position: { x: 0, y: 2600 },
        data: {
          label: 'カウント減少',
          title: 'カウント減少',
          code: 'count -= 1',
          info: 'countを1減らします。',
        },
        type: 'normal',
      },
      {
        id: '16',
        position: { x: 0, y: 2800 },
        data: {
          label: 'while文の終了',
          title: 'while文の終了',
          code: '# while文の終了',
          info: 'whileループの終了を示します。',
        },
        type: 'whileEnd',
      },
      {
        id: '17',
        position: { x: 0, y: 3000 },
        data: {
          label: '出力',
          title: '出力',
          code: 'print("カウントダウン終了！")',
          info: 'カウントダウンが完了したことを知らせる出力です。',
        },
        type: 'normal',
      },
    ],
    edges: [
      { id: 'e0-1', source: '0', target: '1', type: 'step', animated: true },
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'true', type: 'step', animated: true },
      { id: 'e1-3', source: '1', target: '3', sourceHandle: 'false', type: 'step', animated: true },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'true', type: 'step', animated: true },
      { id: 'e3-5', source: '3', target: '5', sourceHandle: 'false', type: 'step', animated: true },
      { id: 'e5-6', source: '5', target: '6', sourceHandle: 'true', type: 'step', animated: true },
      { id: 'e2-7', source: '2', target: '7', type: 'step', animated: true },
      { id: 'e4-7', source: '4', target: '7', type: 'step', animated: true },
      { id: 'e6-7', source: '6', target: '7', type: 'step', animated: true },
      { id: 'e7-8', source: '7', target: '8', type: 'step', animated: true },
      { id: 'e8-9', source: '8', target: '9', type: 'step', animated: true },
      { id: 'e9-10', source: '9', target: '10', type: 'step', animated: true },
      { id: 'e10-11', source: '10', target: '11', type: 'step', animated: true },
      { id: 'e11-12', source: '11', target: '12', type: 'step', animated: true },
      { id: 'e12-13', source: '12', target: '13', type: 'step', animated: true },
      {
        id: 'e13-14',
        source: '13',
        target: '14',
        sourceHandle: 'true',
        type: 'step',
        animated: true,
      },
      { id: 'e14-15', source: '14', target: '15', type: 'step', animated: true },
      { id: 'e15-16', source: '15', target: '16', type: 'step', animated: true },
      { id: 'e16-17', source: '16', target: '17', type: 'step', animated: true },
    ],
  };

  const [nodes, setNodesState] = useState<FlowchartNode[]>(initialData?.nodes || dummyData.nodes);
  const [edges, setEdgesState] = useState<FlowchartEdge[]>(initialData?.edges || dummyData.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes) as FlowchartNode[];
      setNodesState(updatedNodes);
      setNodes(updatedNodes);
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
      const updatedEdges = addEdge({ ...connection, type: 'step', animated: true }, edges);
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
          title: label,
          code: '',
          info: '',
        },
      };

      const updatedNodes = [...nodes, newNode];
      setNodesState(updatedNodes);
      setNodes(updatedNodes);
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
      setNodes(updatedNodes);
    },
    [nodes, setNodes]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      const updatedNodes = nodes.filter((node) => node.id !== nodeId);
      const updatedEdges = edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);

      setNodesState(updatedNodes);
      setEdgesState(updatedEdges);
      setNodes(updatedNodes);
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
        setNodes(flowchartData.nodes);
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
