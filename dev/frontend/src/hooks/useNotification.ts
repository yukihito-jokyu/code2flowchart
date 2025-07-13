import { useState, useCallback } from 'react';

import type { NotificationType } from '@/components/Modal';

interface NotificationState {
  isOpen: boolean;
  type: NotificationType;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
}

interface UseNotificationReturn {
  notification: NotificationState;
  showNotification: (
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      confirmText?: string;
      onConfirm?: () => void;
    }
  ) => void;
  hideNotification: () => void;
}

export const useNotification = (): UseNotificationReturn => {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      options?: {
        confirmText?: string;
        onConfirm?: () => void;
      }
    ) => {
      setNotification({
        isOpen: true,
        type,
        title,
        message,
        confirmText: options?.confirmText,
        onConfirm: options?.onConfirm,
      });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  return {
    notification,
    showNotification,
    hideNotification,
  };
};
