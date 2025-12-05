import React, { Suspense } from 'react';
import { Mail, RotateCcw, FileText, Send } from 'lucide-react';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy loading para componentes pesados
const FileUpload = React.lazy(() => import('./components/FileUpload').then(module => ({ default: module.FileUpload })));
const EmailTemplate = React.lazy(() => import('./components/EmailTemplate').then(module => ({ default: module.EmailTemplate })));
const FieldMappingComponent = React.lazy(() => import('./components/FieldMapping').then(module => ({ default: module.FieldMappingComponent })));
const EmailPreview = React.lazy(() => import('./components/EmailPreview').then(module => ({ default: module.EmailPreview })));

// Hooks
import { useExcelReader } from './hooks/useExcelReader';
import { useFieldDetection } from './hooks/useFieldDetection';
import { useEmailGeneration } from './hooks/useEmailGeneration';
import { useAppState } from './hooks/useAppState';
import { useAppReset } from './hooks/useAppReset';
import { useStepNavigation } from './hooks/useStepNavigation';
import { useStepsConfig } from './hooks/useStepsConfig';

function App() {
  // Hooks para manejar el estado y lógica de negocio
  const appState = useAppState();
  const { excelData, loading, error, progress, readExcelFile, clearData } = useExcelReader();
  const { detectedFields } = useFieldDetection(appState.emailBody);
  const { generatedEmails, statistics, getEmailsAsText, getEmailsAsCSV } = useEmailGeneration(
    excelData,
    { subject: appState.emailSubject, body: appState.emailBody },
    appState.fieldMapping
  );
  
  const { resetWithConfirmation } = useAppReset(appState.resetToDefaults, clearData);
  const { canProceedToStep } = useStepNavigation({
    excelData,
    emailBody: appState.emailBody,
    fieldMapping: appState.fieldMapping,
  });
  const steps = useStepsConfig();

  // Determinar si mostrar el botón de reset
  const shouldShowResetButton = excelData || 
    appState.emailBody.trim() || 
    Object.keys(appState.fieldMapping).length > 0;

  return (
    <div className="min-h-screen bg-rose-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <Mail className="h-6 sm:h-8 w-6 sm:w-8 text-rose-500" />
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Generador de Correos Personalizados
              </h1>
            </div>
            
            {/* Botón para empezar desde cero - responsivo */}
            {shouldShowResetButton && (
              <button
                onClick={() => resetWithConfirmation()}
                className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium"
                title="Empezar desde cero"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Empezar desde cero</span>
                <span className="sm:hidden">Reiniciar</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Steps Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <nav className="flex justify-center mb-6 sm:mb-8 overflow-x-auto">
          <ol className="flex items-center gap-2 sm:gap-6 whitespace-nowrap sm:whitespace-normal">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = appState.activeStep === step.id;
              const isCompleted = appState.activeStep > step.id;
              const canAccess = canProceedToStep(step.id);
              
              return (
                <li key={step.id} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => canAccess && appState.setActiveStep(step.id)}
                    disabled={!canAccess}
                    className={`
                      flex items-center gap-1 sm:gap-3 px-2 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm
                      ${isActive 
                        ? 'bg-violet-600 text-white' 
                        : isCompleted 
                          ? 'bg-violet-100 text-violet-700 hover:bg-violet-200' 
                          : canAccess
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    <Icon className="h-4 sm:h-5 w-4 sm:w-5 flex-shrink-0" />
                    <div className="hidden md:block text-left">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-xs opacity-75">{step.description}</div>
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="hidden sm:block w-4 sm:w-6 h-px bg-rose-200 mx-1 sm:mx-3" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Step Content */}
        <div className="space-y-4 sm:space-y-6">
          {appState.activeStep === 1 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Paso 1: Cargar archivo Excel</h2>
              <Suspense fallback={<LoadingSpinner message="Cargando componente de carga..." />}>
                <FileUpload
                  onFileUpload={readExcelFile}
                  loading={loading}
                  excelData={excelData}
                  error={error}
                  progress={progress}
                  onClearData={clearData}
                />
              </Suspense>
              {excelData && (
                <div className="mt-4 sm:mt-6 flex justify-end">
                  <button
                    onClick={() => appState.setActiveStep(2)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base"
                  >
                    Siguiente: Crear Plantilla
                    <FileText className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {appState.activeStep === 2 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Paso 2: Crear plantilla de correo</h2>
              <Suspense fallback={<LoadingSpinner message="Cargando editor de plantillas..." />}>
                <EmailTemplate
                  subject={appState.emailSubject}
                  body={appState.emailBody}
                  onSubjectChange={appState.setEmailSubject}
                  onBodyChange={appState.setEmailBody}
                  availableColumns={excelData?.headers || []}
                />
              </Suspense>
              {appState.emailBody.trim() && (
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 justify-between">
                  <button
                    onClick={() => appState.setActiveStep(1)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-rose-300 text-white rounded-lg hover:bg-rose-400 transition-colors text-sm sm:text-base"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => appState.setActiveStep(3)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    Siguiente: Mapear Campos
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {appState.activeStep === 3 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Paso 3: Mapear campos</h2>
              <Suspense fallback={<LoadingSpinner message="Cargando mapeo de campos..." />}>
                <FieldMappingComponent
                  detectedFields={detectedFields}
                  availableColumns={excelData?.headers || []}
                  mapping={appState.fieldMapping}
                  onMappingChange={appState.setFieldMapping}
                  excelData={excelData?.rows}
                />
              </Suspense>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 justify-between">
                <button
                  onClick={() => appState.setActiveStep(2)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-rose-300 text-white rounded-lg hover:bg-rose-400 transition-colors text-sm sm:text-base"
                >
                  Anterior
                </button>
                {Object.keys(appState.fieldMapping).length > 0 && (
                  <button
                    onClick={() => appState.setActiveStep(4)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    Generar Correos
                    <Send className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {appState.activeStep === 4 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Paso 4: Correos generados</h2>
              <Suspense fallback={<LoadingSpinner message="Cargando vista previa de correos..." />}>
                <EmailPreview
                  emails={generatedEmails}
                  statistics={statistics}
                  onExportText={getEmailsAsText}
                  onExportCSV={getEmailsAsCSV}
                />
              </Suspense>
              <div className="mt-4 sm:mt-6 flex justify-start">
                <button
                  onClick={() => appState.setActiveStep(3)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-rose-300 text-white rounded-lg hover:bg-rose-400 transition-colors text-sm sm:text-base"
                >
                  Anterior
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
