import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ProjectCreateModal } from '@/features/project/components/ProjectCreateModal';
import { ProjectEditModal } from '@/features/project/components/ProjectEditModal';
import { Project } from '@/features/project/types/project';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useNotification } from '@/hooks/useNotification';
import {
  selectProjects,
  selectDeletedProjects,
  selectProjectLoading,
  selectProjectError,
  selectHasProjects,
  selectHasDeletedProjects,
} from '@/stores/project/selectors';
import {
  fetchProjects,
  fetchDeletedProjects,
  deleteProject,
  restoreProject,
  hardDeleteProject,
  clearError,
} from '@/stores/project/slice';

import styles from './ProjectsPage.module.css';

type TabType = 'active' | 'deleted';

export const ProjectsPage = () => {
  const dispatch = useAppDispatch();
  const { showNotification } = useNotification();

  const projects = useAppSelector(selectProjects);
  const deletedProjects = useAppSelector(selectDeletedProjects);
  const loading = useAppSelector(selectProjectLoading);
  const error = useAppSelector(selectProjectError);
  const hasProjects = useAppSelector(selectHasProjects);
  const hasDeletedProjects = useAppSelector(selectHasDeletedProjects);

  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    dispatch(fetchProjects({}));
    dispatch(fetchDeletedProjects({}));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showNotification('error', 'エラー', error);
      dispatch(clearError());
    }
  }, [error, showNotification, dispatch]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  const handleDeleteProject = async (projectUuid: string) => {
    if (window.confirm('このプロジェクトを削除しますか？（復元可能）')) {
      try {
        await dispatch(deleteProject(projectUuid)).unwrap();
        showNotification('success', '成功', 'プロジェクトが削除されました');
        dispatch(fetchDeletedProjects({})); // 削除済み一覧を更新
      } catch {
        showNotification('error', 'エラー', 'プロジェクトの削除に失敗しました');
      }
    }
  };

  const handleRestoreProject = async (projectUuid: string) => {
    if (window.confirm('このプロジェクトを復元しますか？')) {
      try {
        await dispatch(restoreProject(projectUuid)).unwrap();
        showNotification('success', '成功', 'プロジェクトが復元されました');
      } catch {
        showNotification('error', 'エラー', 'プロジェクトの復元に失敗しました');
      }
    }
  };

  const handleHardDeleteProject = async (projectUuid: string) => {
    if (window.confirm('このプロジェクトを完全に削除しますか？（復元不可能）')) {
      try {
        await dispatch(hardDeleteProject(projectUuid)).unwrap();
        showNotification('success', '成功', 'プロジェクトが完全に削除されました');
      } catch {
        showNotification('error', 'エラー', 'プロジェクトの完全削除に失敗しました');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const currentProjects = activeTab === 'active' ? projects : deletedProjects;
  const hasCurrentProjects = activeTab === 'active' ? hasProjects : hasDeletedProjects;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/dashboard" className={styles.backButton}>
            ← ダッシュボード
          </Link>
          <h1 className={styles.title}>プロジェクト管理</h1>
        </div>
        {activeTab === 'active' && (
          <button className={styles.createButton} onClick={handleCreateProject}>
            ＋ 新規プロジェクト
          </button>
        )}
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'active' ? styles.active : ''}`}
          onClick={() => handleTabChange('active')}
        >
          アクティブ ({projects.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'deleted' ? styles.active : ''}`}
          onClick={() => handleTabChange('deleted')}
        >
          削除済み ({deletedProjects.length})
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          読み込み中...
        </div>
      ) : !hasCurrentProjects ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📁</div>
          <p>
            {activeTab === 'active'
              ? 'プロジェクトがありません。新規作成してください。'
              : '削除済みプロジェクトはありません。'}
          </p>
        </div>
      ) : (
        <div className={styles.projectGrid}>
          {currentProjects.map((project) => (
            <div key={project.uuid} className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <h3 className={styles.projectName}>{project.name}</h3>
                <div className={styles.projectActions}>
                  {activeTab === 'active' ? (
                    <>
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => handleEditProject(project)}
                        title="編集"
                      >
                        ✏️
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleDeleteProject(project.uuid)}
                        title="削除"
                      >
                        🗑️
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={`${styles.actionButton} ${styles.restoreButton}`}
                        onClick={() => handleRestoreProject(project.uuid)}
                        title="復元"
                      >
                        ↻
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleHardDeleteProject(project.uuid)}
                        title="完全削除"
                      >
                        ❌
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className={styles.projectDescription}>{project.description || '説明なし'}</p>

              <div className={styles.projectMeta}>
                <span>作成: {formatDate(project.created_at)}</span>
                <span>更新: {formatDate(project.updated_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* モーダル */}
      {showCreateModal && (
        <ProjectCreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            dispatch(fetchProjects({}));
          }}
        />
      )}

      {showEditModal && editingProject && (
        <ProjectEditModal
          isOpen={showEditModal}
          project={editingProject}
          onClose={() => {
            setShowEditModal(false);
            setEditingProject(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setEditingProject(null);
            dispatch(fetchProjects({}));
          }}
        />
      )}
    </div>
  );
};
