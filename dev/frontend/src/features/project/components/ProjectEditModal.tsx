import { useState, useEffect } from 'react';

import { Modal } from '@/components/Modal';
import { useAppDispatch } from '@/hooks/redux';
import { useNotification } from '@/hooks/useNotification';
import { updateProject } from '@/stores/project/slice';

import { Project, ProjectUpdate } from '../types/project';

import styles from './ProjectEditModal.module.css';

interface ProjectEditModalProps {
  isOpen: boolean;
  project: Project;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProjectEditModal = ({
  isOpen,
  project,
  onClose,
  onSuccess,
}: ProjectEditModalProps) => {
  const dispatch = useAppDispatch();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState<ProjectUpdate>({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || '',
      });
    }
  }, [project]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      showNotification('error', 'エラー', 'プロジェクト名を入力してください');
      return;
    }

    // 変更がない場合は何もしない
    if (formData.name === project.name && formData.description === (project.description || '')) {
      showNotification('info', '情報', '変更がありません');
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        updateProject({
          projectUuid: project.uuid,
          projectData: formData,
        })
      ).unwrap();
      showNotification('success', '成功', 'プロジェクトが更新されました');
      onSuccess();
    } catch {
      showNotification('error', 'エラー', 'プロジェクトの更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="プロジェクト編集">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            プロジェクト名 *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            placeholder="プロジェクト名を入力"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            説明
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            placeholder="プロジェクトの説明を入力（任意）"
            rows={4}
            className={styles.textarea}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className={styles.cancelButton}
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.name?.trim()}
            className={styles.submitButton}
          >
            {isSubmitting ? '更新中...' : '更新'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
