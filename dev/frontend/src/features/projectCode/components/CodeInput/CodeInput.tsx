import React, { useState, useEffect } from 'react';

import { flowchartApi } from '@/features/flowchart/api';
import { convertApiResponseToFlowchart } from '@/features/flowchart/utils';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useNotification } from '@/hooks/useNotification';

import {
  selectProjectCodes,
  selectCurrentCode,
  selectProjectCodeLoading,
  selectProjectCodeError,
} from '../../stores/selectors';
import {
  createProjectCode,
  updateProjectCode,
  fetchProjectCodes,
  clearError,
  clearCurrentCode,
  setCurrentCode,
} from '../../stores/slice';
import { ProjectCode, ProjectCodeCreate, ProjectCodeUpdate } from '../../types/projectCode';

import styles from './CodeInput.module.css';

import type { FlowchartNode, FlowchartEdge } from '@/features/flowchart/types';

interface CodeInputProps {
  projectUuid: string;
  isVisible: boolean;
  onToggle: () => void;
  onFlowchartGenerated?: (nodes: FlowchartNode[], edges: FlowchartEdge[]) => void;
}

export const CodeInput: React.FC<CodeInputProps> = ({
  projectUuid,
  isVisible,
  onToggle,
  onFlowchartGenerated,
}) => {
  const dispatch = useAppDispatch();
  const codes = useAppSelector(selectProjectCodes);
  const currentCode = useAppSelector(selectCurrentCode);
  const loading = useAppSelector(selectProjectCodeLoading);
  const error = useAppSelector(selectProjectCodeError);

  const [formData, setFormData] = useState({
    title: '',
    code_content: '',
    language: 'python',
    description: '',
  });
  const [editingCodeUuid, setEditingCodeUuid] = useState<string | null>(null);
  const [isGeneratingFlowchart, setIsGeneratingFlowchart] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (projectUuid) {
      dispatch(fetchProjectCodes({ projectUuid }));
    }
  }, [dispatch, projectUuid]);

  useEffect(() => {
    if (currentCode) {
      setFormData({
        title: currentCode.title,
        code_content: currentCode.code_content,
        language: currentCode.language,
        description: currentCode.description || '',
      });
      setEditingCodeUuid(currentCode.uuid);
    }
  }, [currentCode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.code_content.trim()) {
      return;
    }

    try {
      if (editingCodeUuid) {
        // 更新
        const updateData: ProjectCodeUpdate = {
          title: formData.title,
          code_content: formData.code_content,
          language: formData.language,
          description: formData.description,
        };
        await dispatch(
          updateProjectCode({ codeUuid: editingCodeUuid, projectCodeData: updateData })
        );
      } else {
        // 新規作成
        const createData: ProjectCodeCreate = {
          project_uuid: projectUuid,
          title: formData.title,
          code_content: formData.code_content,
          language: formData.language,
          description: formData.description,
        };
        await dispatch(createProjectCode(createData));
      }
      handleClear();
    } catch (error) {
      console.error('コード保存に失敗しました:', error);
    }
  };

  const handleClear = () => {
    setFormData({
      title: '',
      code_content: '',
      language: 'python',
      description: '',
    });
    setEditingCodeUuid(null);
    dispatch(clearCurrentCode());
  };

  const handleEdit = (code: ProjectCode) => {
    dispatch(setCurrentCode(code));
  };

  const handleGenerateFlowchart = async () => {
    if (!formData.code_content.trim()) {
      showNotification('error', 'エラー', 'コードを入力してください');
      return;
    }

    setIsGeneratingFlowchart(true);

    try {
      const response = await flowchartApi.generateFlowchart({
        code_content: formData.code_content,
        language: formData.language,
      });

      const { nodes, edges } = convertApiResponseToFlowchart(response);

      if (onFlowchartGenerated) {
        onFlowchartGenerated(nodes, edges);
      }

      showNotification('success', '成功', 'フローチャートが生成されました');
      onToggle(); // モーダルを閉じる
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'フローチャート生成に失敗しました';
      showNotification('error', 'エラー', errorMessage);
    } finally {
      setIsGeneratingFlowchart(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>コード入力エリア</h3>
        <button className={styles.toggleButton} onClick={onToggle}>
          ×
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => dispatch(clearError())}>×</button>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.inputSection}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>タイトル</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="コードタイトルを入力"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>言語</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>説明 (オプション)</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="コードの説明を入力"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>コード</label>
            <textarea
              name="code_content"
              value={formData.code_content}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="コードを入力してください"
              rows={15}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              onClick={handleSave}
              disabled={loading || !formData.title.trim() || !formData.code_content.trim()}
              className={`${styles.button} ${styles.saveButton}`}
            >
              {loading ? '保存中...' : editingCodeUuid ? '更新' : '保存'}
            </button>
            <button onClick={handleClear} className={`${styles.button} ${styles.clearButton}`}>
              クリア
            </button>
            <button
              onClick={handleGenerateFlowchart}
              disabled={isGeneratingFlowchart || !formData.code_content.trim()}
              className={`${styles.button} ${styles.generateButton}`}
            >
              {isGeneratingFlowchart ? 'フローチャート生成中...' : 'フローチャート生成'}
            </button>
          </div>
        </div>

        <div className={styles.codeList}>
          <h4 className={styles.listTitle}>保存されたコード</h4>
          {codes.length === 0 ? (
            <p className={styles.noData}>保存されたコードはありません</p>
          ) : (
            <div className={styles.codeItems}>
              {codes.map((code) => (
                <div key={code.uuid} className={styles.codeItem}>
                  <div className={styles.codeInfo}>
                    <h5 className={styles.codeTitle}>{code.title}</h5>
                    <p className={styles.codeLanguage}>{code.language}</p>
                    {code.description && (
                      <p className={styles.codeDescription}>{code.description}</p>
                    )}
                  </div>
                  <button onClick={() => handleEdit(code)} className={styles.editButton}>
                    編集
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
