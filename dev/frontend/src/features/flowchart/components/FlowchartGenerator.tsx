import {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import { useState, useCallback } from 'react';


import { flowchartApi, FlowchartGenerateRequest } from '../api';
import { convertApiResponseToFlowchart } from '../utils';

import { FlowchartCanvas } from './FlowchartCanvas';

import type { FlowchartNode, FlowchartEdge } from '../types';

interface FlowchartGeneratorProps {
  className?: string;
}

export const FlowchartGenerator = ({ className }: FlowchartGeneratorProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowchartNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowchartEdge>([]);
  const [codeContent, setCodeContent] = useState('');
  const [language, setLanguage] = useState('python');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleGenerateFlowchart = async () => {
    if (!codeContent.trim()) {
      setError('コードを入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: FlowchartGenerateRequest = {
        code_content: codeContent,
        language,
      };

      const response = await flowchartApi.generateFlowchart(request);
      const { nodes: newNodes, edges: newEdges } = convertApiResponseToFlowchart(response);
      
      setNodes(newNodes);
      setEdges(newEdges);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'フローチャート生成に失敗しました';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid #e1e5e9' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="language-select" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            プログラミング言語:
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="code-input" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            コード:
          </label>
          <textarea
            id="code-input"
            value={codeContent}
            onChange={(e) => setCodeContent(e.target.value)}
            placeholder="フローチャートを生成したいコードを入力してください..."
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'monospace',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={handleGenerateFlowchart}
            disabled={isLoading || !codeContent.trim()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: isLoading || !codeContent.trim() ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading || !codeContent.trim() ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {isLoading ? 'フローチャート生成中...' : 'フローチャート生成'}
          </button>
          
          {error && (
            <div style={{ color: '#dc3545', fontSize: '14px' }}>
              {error}
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: '400px' }}>
        {nodes.length > 0 ? (
          <FlowchartCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange as (changes: NodeChange[]) => void}
            onEdgesChange={onEdgesChange as (changes: EdgeChange[]) => void}
            onConnect={onConnect}
          />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#6c757d',
            fontSize: '16px',
          }}>
            コードを入力してフローチャートを生成してください
          </div>
        )}
      </div>
    </div>
  );
};