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
          type: 'normal',
        },
        type: 'normal',
      },
      {
        id: '1',
        position: { x: 0, y: 100 },
        data: {
          label: '条件分岐 if',
          title: '条件分岐 if',
          code: 'if number > 10:',
          info: 'numberが10より大きいかどうかを判定します。',
          type: 'if',
        },
        type: 'if',
      },
      {
        id: '2',
        position: { x: 0, y: 200 },
        data: {
          label: '10より大きい場合の出力',
          title: '10より大きい場合の出力',
          code: 'print("10より大きいです")',
          info: '条件number > 10が真の場合、文字列を出力します。',
          type: 'normal',
        },
        type: 'normal',
      },
      {
        id: '3',
        position: { x: 150, y: 200 },
        data: {
          label: '10と等しいかの判定',
          title: '10と等しいかの判定',
          code: 'elif number == 10:',
          info: 'numberが10と等しいかどうかを判定します。',
          type: 'if',
        },
        type: 'if',
      },
      {
        id: '4',
        position: { x: 150, y: 300 },
        data: {
          label: '10と等しい場合の出力',
          title: '10と等しい場合の出力',
          code: 'print("ちょうど10です")',
          info: '条件number == 10が真の場合、文字列を出力します。',
          type: 'normal',
        },
        type: 'normal',
      },
      {
        id: '5',
        position: { x: 300, y: 300 },
        data: {
          label: 'それ以外の場合の出力',
          title: 'それ以外の場合の出力',
          code: 'print("10より小さいです")',
          info: 'numberが10より大きくも等しくもない場合の出力です。',
          type: 'normal',
        },
        type: 'normal',
      },
      {
        id: '6',
        position: { x: 0, y: 300 },
        data: {
          label: '範囲表示メッセージ',
          title: '範囲表示メッセージ',
          code: 'print("1から5までの数を表示します:")',
          info: '1〜5の数を表示することをユーザーに知らせる出力です。',
          type: 'normal',
        },
        type: 'normal',
      },
      {
        id: '7',
        position: { x: 0, y: 400 },
        data: {
          label: 'for文の開始',
          title: 'for文の開始',
          code: 'for i in range(1, 6):',
          info: '1から5までの範囲でループします。',
          type: 'forStart',
        },
        type: 'forStart',
      },
      {
        id: '8',
        position: { x: 0, y: 500 },
        data: {
          label: 'iの出力',
          title: 'iの出力',
          code: 'print(i)',
          info: 'ループ中のiの値を出力します。',
          type: 'normal',
        },
        type: 'normal',
      },
      {
        id: '9',
        position: { x: 0, y: 600 },
        data: {
          label: 'for文の終了',
          title: 'for文の終了',
          code: '# for文終了',
          info: 'for文の終了を示すダミーノードです。',
          type: 'forEnd',
        },
        type: 'forEnd',
      },
      {
        id: '10',
        position: { x: 0, y: 700 },
        data: {
          label: 'カウントダウン開始メッセージ',
          title: 'カウントダウン開始メッセージ',
          code: 'print("カウントダウンを開始します:")',
          info: 'カウントダウン処理の開始を通知します。',
          type: 'normal',
        },
        type: 'normal',
      },
      {
        id: '11',
        position: { x: 0, y: 800 },
        data: {
          label: '変数countの初期化',
          title: '変数countの初期化',
          code: 'count = 5',
          info: '変数countを5で初期化します。',
          type: 'normal',
        },
        type: 'normal',
      },
      {
        id: '12',
        position: { x: 0, y: 900 },
        data: {
          label: 'while文の開始',
          title: 'while文の開始',
          code: 'while count > 0:',
          info: 'countが0より大きい間ループを実行します。',
          type: 'whileStart',
        },
        type: 'whileStart',
      },
      {
        id: '13',
        position: { x: 0, y: 1000 },
        data: {
          label: 'countの出力',
          title: 'countの出力',
          code: 'print(count)',
          info: '現在のcountの値を出力します。',
          type: 'normal',
        },
        type: 'normal',
      },
      {
        id: '14',
        position: { x: 0, y: 1100 },
        data: {
          label: 'countのデクリメント',
          title: 'countのデクリメント',
          code: 'count -= 1',
          info: 'countの値を1減らします。',
          type: 'normal',
        },
        type: 'normal',
      },
      {
        id: '15',
        position: { x: 0, y: 1200 },
        data: {
          label: 'while文の終了',
          title: 'while文の終了',
          code: '# while文終了',
          info: 'while文の終了を示すダミーノードです。',
          type: 'whileEnd',
        },
        type: 'whileEnd',
      },
      {
        id: '16',
        position: { x: 0, y: 1300 },
        data: {
          label: 'カウントダウン終了メッセージ',
          title: 'カウントダウン終了メッセージ',
          code: 'print("カウントダウン終了！")',
          info: 'ループ終了後の終了メッセージ出力です。',
          type: 'normal',
        },
        type: 'normal',
      },
    ],
    edges: [
      { id: 'e0-1', source: '0', target: '1' },
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e1-3', source: '1', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e3-5', source: '3', target: '5' },
      { id: 'e2-6', source: '2', target: '6' },
      { id: 'e4-6', source: '4', target: '6' },
      { id: 'e5-6', source: '5', target: '6' },
      { id: 'e6-7', source: '6', target: '7' },
      { id: 'e7-8', source: '7', target: '8' },
      { id: 'e8-9', source: '8', target: '9' },
      { id: 'e9-10', source: '9', target: '10' },
      { id: 'e10-11', source: '10', target: '11' },
      { id: 'e11-12', source: '11', target: '12' },
      { id: 'e12-13', source: '12', target: '13' },
      { id: 'e13-14', source: '13', target: '14' },
      { id: 'e14-15', source: '14', target: '15' }, // whileループの最終処理→終了へ
      { id: 'e15-16', source: '15', target: '16' }, // while終了後の処理
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
          type,
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
