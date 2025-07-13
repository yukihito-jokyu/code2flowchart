import { useState } from 'react';

import { Modal } from '@/components/Modal';
import { useAppDispatch } from '@/hooks/redux';
import { useNotification } from '@/hooks/useNotification';
import { createProject } from '@/stores/project/slice';

import { ProjectCreate } from '../types/project';

import styles from './ProjectCreateModal.module.css';

interface ProjectCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProjectCreateModal = ({ isOpen, onClose, onSuccess }: ProjectCreateModalProps) => {
  const dispatch = useAppDispatch();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState<ProjectCreate>({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showNotification('error', 'エラー', 'プロジェクト名を入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(createProject(formData)).unwrap();
      showNotification('success', '成功', 'プロジェクトが作成されました');
      onSuccess();
      setFormData({ name: '', description: '' });
    } catch {
      showNotification('error', 'エラー', 'プロジェクトの作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', description: '' });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="新規プロジェクト作成">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            プロジェクト名 *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
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
            value={formData.description}
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
            disabled={isSubmitting || !formData.name.trim()}
            className={styles.submitButton}
          >
            {isSubmitting ? '作成中...' : '作成'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
