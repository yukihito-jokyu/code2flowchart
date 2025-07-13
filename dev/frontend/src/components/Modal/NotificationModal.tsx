import { Modal } from './Modal';
import styles from './NotificationModal.module.css';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: NotificationType;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'error':
      return (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-6 6" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l6 6" />
        </svg>
      );
    case 'warning':
      return (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      );
    case 'info':
      return (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8h.01" />
        </svg>
      );
  }
};

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  confirmText = 'OK',
  onConfirm,
}) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small" showCloseButton={false}>
      <div className={styles.container}>
        <div className={`${styles.iconContainer} ${styles[type]}`}>{getIcon(type)}</div>

        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.actions}>
          <button className={`${styles.button} ${styles[type]}`} onClick={handleConfirm} autoFocus>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
