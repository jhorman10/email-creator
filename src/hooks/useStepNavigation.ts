import { useMemo, useCallback } from 'react';
import type { ExcelData, FieldMapping } from '../types';

interface StepValidationRules {
  excelData: ExcelData | null;
  emailBody: string;
  fieldMapping: FieldMapping;
}

interface StepNavigationActions {
  canProceedToStep: (step: number) => boolean;
  goToNextStep: (currentStep: number) => number | null;
  goToPreviousStep: (currentStep: number) => number | null;
  getStepStatus: (step: number, currentStep: number) => 'active' | 'completed' | 'available' | 'disabled';
}

/**
 * Hook personalizado para manejar navegación y validación de pasos
 * Implementa el principio de Single Responsibility - solo maneja lógica de navegación
 */
export const useStepNavigation = (
  validationRules: StepValidationRules
): StepNavigationActions => {
  
  const { excelData, emailBody, fieldMapping } = validationRules;

  const canProceedToStep = useMemo(() => {
    return (step: number): boolean => {
      switch (step) {
        case 1: 
          return true;
        case 2: 
          return !!excelData;
        case 3: 
          return !!excelData && emailBody.trim() !== '';
        case 4: 
          return !!excelData && emailBody.trim() !== '' && Object.keys(fieldMapping).length > 0;
        default: 
          return false;
      }
    };
  }, [excelData, emailBody, fieldMapping]);

  const goToNextStep = useCallback((step: number): number | null => {
    const nextStep = step + 1;
    if (nextStep <= 4 && canProceedToStep(nextStep)) {
      return nextStep;
    }
    return null;
  }, [canProceedToStep]);

  const goToPreviousStep = useCallback((step: number): number | null => {
    const previousStep = step - 1;
    if (previousStep >= 1) {
      return previousStep;
    }
    return null;
  }, []);

  const getStepStatus = useCallback((step: number, activeStep: number): 'active' | 'completed' | 'available' | 'disabled' => {
    if (step === activeStep) return 'active';
    if (step < activeStep) return 'completed';
    if (canProceedToStep(step)) return 'available';
    return 'disabled';
  }, [canProceedToStep]);

  return {
    canProceedToStep,
    goToNextStep,
    goToPreviousStep,
    getStepStatus,
  };
};