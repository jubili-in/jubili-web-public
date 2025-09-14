import { useToast } from '../contexts/ToastContext';
import { useCallback } from 'react';

export const useToastActions = () => {
  const { addToast } = useToast();

  const showSuccess = useCallback((title: string, message?: string, duration: number = 4000) => {
    addToast({
      type: 'success',
      title,
      message,
      duration,
    });
  }, [addToast]);

  const showError = useCallback((title: string, message?: string, duration: number = 4000) => {
    addToast({
      type: 'error',
      title,
      message,
      duration,
    });
  }, [addToast]);

  const showWarning = useCallback((title: string, message?: string, duration: number = 4000) => {
    addToast({
      type: 'warning',
      title,
      message,
      duration,
    });
  }, [addToast]);

  const showInfo = useCallback((title: string, message?: string, duration: number = 4000) => {
    addToast({
      type: 'info',
      title,
      message,
      duration,
    });
  }, [addToast]);

  const showToastWithAction = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string,
    actionLabel?: string,
    actionCallback?: () => void,
    duration: number = 4000
  ) => {
    addToast({
      type,
      title,
      message,
      duration,
      action: actionLabel && actionCallback ? {
        label: actionLabel,
        onClick: actionCallback,
      } : undefined,
    });
  }, [addToast]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showToastWithAction,
  };
};
