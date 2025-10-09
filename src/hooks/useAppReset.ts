import { useCallback } from 'react';

interface ResetOptions {
  confirmationMessage?: string;
  onReset?: () => void;
}

interface ResetActions {
  resetAllData: () => void;
  resetWithConfirmation: (options?: ResetOptions) => void;
}

/**
 * Hook personalizado para manejar operaciones de reset
 * Implementa el principio de Single Responsibility - solo maneja reset operations
 */
export const useAppReset = (
  onResetCallback: () => void,
  clearExcelData: () => void
): ResetActions => {
  
  const resetAllData = useCallback(() => {
    clearExcelData();
    onResetCallback();
  }, [clearExcelData, onResetCallback]);

  const resetWithConfirmation = useCallback((options: ResetOptions = {}) => {
    const {
      confirmationMessage = '¿Estás seguro de que quieres empezar desde cero? Se perderán todos los datos y configuraciones actuales.',
      onReset
    } = options;

    const confirmed = window.confirm(confirmationMessage);
    
    if (confirmed) {
      resetAllData();
      onReset?.();
    }
  }, [resetAllData]);

  return {
    resetAllData,
    resetWithConfirmation,
  };
};