import { ReactFlowProvider, Node } from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  FlowchartCanvas,
  NodeToolbar,
  NodeDetailModal,
  useFlowchart,
  FlowchartNodeType,
} from '@/features/flowchart';
import { CodeInput } from '@/features/projectCode';
import { useNotification } from '@/hooks/useNotification';

import styles from './FlowchartPage.module.css';

export const FlowchartPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { showNotification } = useNotification();
  const [showInstructions, setShowInstructions] = useState(true);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showNodeDetail, setShowNodeDetail] = useState(false);

  if (!projectId) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>プロジェクトIDが指定されていません。</div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <FlowchartPageContent
        projectId={projectId}
        showNotification={showNotification}
        showInstructions={showInstructions}
        setShowInstructions={setShowInstructions}
        showCodeInput={showCodeInput}
        setShowCodeInput={setShowCodeInput}
        showNodeDetail={showNodeDetail}
        setShowNodeDetail={setShowNodeDetail}
      />
    </ReactFlowProvider>
  );
};

interface FlowchartPageContentProps {
  projectId: string;
  showNotification: (type: 'success' | 'error', title: string, message: string) => void;
  showInstructions: boolean;
  setShowInstructions: (show: boolean) => void;
  showCodeInput: boolean;
  setShowCodeInput: (show: boolean) => void;
  showNodeDetail: boolean;
  setShowNodeDetail: (show: boolean) => void;
}

const FlowchartPageContent = ({
  projectId,
  showNotification,
  showInstructions,
  setShowInstructions,
  showCodeInput,
  setShowCodeInput,
  showNodeDetail,
  setShowNodeDetail,
}: FlowchartPageContentProps) => {
  const {
    nodes,
    edges,
    selectedNodeId,
    isLoading,
    error,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
    clearFlowchart,
    saveFlowchart,
    loadFlowchart,
    setSelectedNodeId,
  } = useFlowchart({ projectId });

  useEffect(() => {
    loadFlowchart();
  }, [loadFlowchart]);

  useEffect(() => {
    if (error) {
      showNotification('error', 'エラー', error);
    }
  }, [error, showNotification]);

  const handleAddNode = (type: FlowchartNodeType) => {
    const centerX = 250;
    const centerY = 150;
    const randomOffset = () => Math.random() * 100 - 50;

    const position = {
      x: centerX + randomOffset(),
      y: centerY + randomOffset(),
    };

    const labelMap = {
      if: 'IF文',
      whileStart: 'WHILE開始',
      whileEnd: 'WHILE終了',
      forStart: 'FOR開始',
      forEnd: 'FOR終了',
      unknown: '不明な関数',
      normal: '通常処理',
    };

    addNode(type, labelMap[type], position);
    setShowInstructions(false);
  };

  const handleSave = async () => {
    const success = await saveFlowchart();
    if (success) {
      showNotification('success', '保存完了', 'フローチャートが保存されました');
    }
  };

  const handleClear = () => {
    if (window.confirm('フローチャートをクリアしますか？この操作は取り消せません。')) {
      clearFlowchart();
      showNotification('success', 'クリア完了', 'フローチャートがクリアされました');
    }
  };

  const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setShowNodeDetail(true);
  };

  const handlePaneClick = () => {
    setSelectedNodeId(null);
  };

  const handleCloseNodeDetail = () => {
    setShowNodeDetail(false);
  };

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Delete' && selectedNodeId) {
        deleteNode(selectedNodeId);
      }
    },
    [selectedNodeId, deleteNode]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/projects" className={styles.backButton}>
            ← プロジェクト一覧
          </Link>
          <h1 className={styles.title}>フローチャート作成</h1>
          <div className={styles.projectInfo}>
            <span>プロジェクトID: {projectId}</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button
            onClick={() => setShowCodeInput(!showCodeInput)}
            className={styles.codeToggleButton}
          >
            📝 コード入力
          </button>
        </div>
      </header>

      {showInstructions && (
        <div className={styles.instructions}>
          <h3>📝 フローチャート作成の使い方</h3>
          <ul>
            <li>上部のボタンからノード（要素）を追加できます</li>
            <li>ノードをドラッグして移動できます</li>
            <li>ノードの端点をドラッグして他のノードと接続できます</li>
            <li>ノードを選択してDeleteキーで削除できます</li>
            <li>右下のミニマップで全体表示を確認できます</li>
            <li>保存ボタンでフローチャートを保存できます</li>
          </ul>
          <button
            onClick={() => setShowInstructions(false)}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            }}
          >
            閉じる
          </button>
        </div>
      )}

      <div className={styles.content}>
        <NodeToolbar
          onAddNode={handleAddNode}
          onSave={handleSave}
          onClear={handleClear}
          isLoading={isLoading}
        />

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.flowchartContainer}>
          <FlowchartCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            className={styles.flowchartContainer}
          />
        </div>
      </div>

      <CodeInput
        projectUuid={projectId}
        isVisible={showCodeInput}
        onToggle={() => setShowCodeInput(false)}
      />

      <NodeDetailModal
        isOpen={showNodeDetail}
        onClose={handleCloseNodeDetail}
        nodeData={selectedNode?.data || null}
      />
    </div>
  );
};
