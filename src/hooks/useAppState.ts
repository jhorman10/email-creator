import { useState } from 'react';
import type { FieldMapping } from '../types';

interface AppState {
  activeStep: number;
  emailSubject: string;
  emailBody: string;
  fieldMapping: FieldMapping;
}

interface AppStateActions {
  setActiveStep: (step: number) => void;
  setEmailSubject: (subject: string) => void;
  setEmailBody: (body: string) => void;
  setFieldMapping: (mapping: FieldMapping) => void;
  resetToDefaults: () => void;
}

const DEFAULT_EMAIL_TEMPLATE = `Señor {{NOMBRE}} con C.C. {{CEDULA}} le solicito comedidamente realizar el curso SARLAF CICLO 5 del cual se realiza a través de la página https://colegiosura.com/ con fecha máxima hasta el 10 de Octubre del 2025 para desarrollarlo.



Se hace activación a través de colegios sura con un correo que les llega de Zalvadora donde deben crear contraseña.



Quedo atenta,



Cordialmente

Carolina Barrera Jiménez`;

/**
 * Hook personalizado para manejar el estado de la aplicación
 * Implementa el principio de Single Responsibility - solo maneja el estado
 */
export const useAppState = (): AppState & AppStateActions => {
  const [activeStep, setActiveStep] = useState(1);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState(DEFAULT_EMAIL_TEMPLATE);
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({});

  const resetToDefaults = () => {
    setActiveStep(1);
    setEmailSubject('');
    setEmailBody(DEFAULT_EMAIL_TEMPLATE);
    setFieldMapping({});
  };

  return {
    // State
    activeStep,
    emailSubject,
    emailBody,
    fieldMapping,
    // Actions
    setActiveStep,
    setEmailSubject,
    setEmailBody,
    setFieldMapping,
    resetToDefaults,
  };
};