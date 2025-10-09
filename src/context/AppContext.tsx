import React, { createContext, useMemo } from 'react';
import { useAppState } from '../hooks/useAppState';
import { useExcelReader } from '../hooks/useExcelReader';
import { useFieldDetection } from '../hooks/useFieldDetection';
import { useEmailGeneration } from '../hooks/useEmailGeneration';
import { useAppReset } from '../hooks/useAppReset';
import { useStepNavigation } from '../hooks/useStepNavigation';
import { useStepsConfig } from '../hooks/useStepsConfig';
import type { ExcelData, FieldMapping, GeneratedEmail } from '../types';

interface AppContextType {
  // Estado de la aplicación
  activeStep: number;
  emailSubject: string;
  emailBody: string;
  fieldMapping: FieldMapping;
  
  // Datos de Excel
  excelData: ExcelData | null;
  loading: boolean;
  error: string | null;
  progress: number;
  
  // Emails generados
  generatedEmails: GeneratedEmail[];
  statistics: {
    total: number;
    withRecipient: number;
    withoutRecipient: number;
  };
  
  // Campos detectados
  detectedFields: string[];
  
  // Acciones de estado
  setActiveStep: (step: number) => void;
  setEmailSubject: (subject: string) => void;
  setEmailBody: (body: string) => void;
  setFieldMapping: (mapping: FieldMapping) => void;
  resetToDefaults: () => void;
  
  // Acciones de Excel
  readExcelFile: (file: File) => void;
  clearData: () => void;
  
  // Acciones de emails
  getEmailsAsText: () => string;
  getEmailsAsCSV: () => string;
  
  // Acciones de navegación
  canProceedToStep: (step: number) => boolean;
  
  // Acciones de reset
  resetWithConfirmation: (options?: { confirmationMessage?: string; onReset?: () => void }) => void;
  
  // Configuración de pasos
  steps: Array<{
    id: number;
    title: string;
    icon: React.ComponentType;
    description: string;
  }>;
}

const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Hooks centralizados
  const appState = useAppState();
  const excelReader = useExcelReader();
  const { detectedFields } = useFieldDetection(appState.emailBody);
  const emailGeneration = useEmailGeneration(
    excelReader.excelData,
    { subject: appState.emailSubject, body: appState.emailBody },
    appState.fieldMapping
  );
  const { resetWithConfirmation } = useAppReset(appState.resetToDefaults, excelReader.clearData);
  const { canProceedToStep } = useStepNavigation({
    excelData: excelReader.excelData,
    emailBody: appState.emailBody,
    fieldMapping: appState.fieldMapping,
  });
  const steps = useStepsConfig();

  // Valor del contexto memoizado
  const contextValue = useMemo(() => ({
    // Estado de la aplicación
    activeStep: appState.activeStep,
    emailSubject: appState.emailSubject,
    emailBody: appState.emailBody,
    fieldMapping: appState.fieldMapping,
    
    // Datos de Excel
    excelData: excelReader.excelData,
    loading: excelReader.loading,
    error: excelReader.error,
    progress: excelReader.progress,
    
    // Emails generados
    generatedEmails: emailGeneration.generatedEmails,
    statistics: emailGeneration.statistics,
    
    // Campos detectados
    detectedFields,
    
    // Acciones de estado
    setActiveStep: appState.setActiveStep,
    setEmailSubject: appState.setEmailSubject,
    setEmailBody: appState.setEmailBody,
    setFieldMapping: appState.setFieldMapping,
    resetToDefaults: appState.resetToDefaults,
    
    // Acciones de Excel
    readExcelFile: excelReader.readExcelFile,
    clearData: excelReader.clearData,
    
    // Acciones de emails
    getEmailsAsText: emailGeneration.getEmailsAsText,
    getEmailsAsCSV: emailGeneration.getEmailsAsCSV,
    
    // Acciones de navegación
    canProceedToStep,
    
    // Acciones de reset
    resetWithConfirmation,
    
    // Configuración de pasos
    steps,
  }), [
    appState,
    excelReader,
    emailGeneration,
    detectedFields,
    canProceedToStep,
    resetWithConfirmation,
    steps,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;