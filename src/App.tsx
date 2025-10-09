import { Mail, RotateCcw, FileText, Send } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { EmailTemplate } from './components/EmailTemplate';
import { FieldMappingComponent } from './components/FieldMapping';
import { EmailPreview } from './components/EmailPreview';
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
  const { excelData, loading, error, readExcelFile, clearData } = useExcelReader();
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Generador de Correos Personalizados
              </h1>
            </div>
            
            {/* Botón para empezar desde cero */}
            {shouldShowResetButton && (
              <button
                onClick={() => resetWithConfirmation()}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                title="Empezar desde cero"
              >
                <RotateCcw className="h-4 w-4" />
                Empezar desde cero
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Steps Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex justify-center mb-8">
          <ol className="flex items-center space-x-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = appState.activeStep === step.id;
              const isCompleted = appState.activeStep > step.id;
              const canAccess = canProceedToStep(step.id);
              
              return (
                <li key={step.id} className="flex items-center">
                  <button
                    onClick={() => canAccess && appState.setActiveStep(step.id)}
                    disabled={!canAccess}
                    className={`
                      flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-blue-600 text-white' 
                        : isCompleted 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : canAccess
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-xs opacity-75">{step.description}</div>
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="w-6 h-px bg-gray-300 mx-3" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Step Content */}
        <div className="space-y-6">
          {appState.activeStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Paso 1: Cargar archivo Excel</h2>
              <FileUpload
                onFileUpload={readExcelFile}
                loading={loading}
                excelData={excelData}
                error={error}
                onClearData={clearData}
              />
              {excelData && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => appState.setActiveStep(2)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Paso 2: Crear plantilla de correo</h2>
              <EmailTemplate
                subject={appState.emailSubject}
                body={appState.emailBody}
                onSubjectChange={appState.setEmailSubject}
                onBodyChange={appState.setEmailBody}
                availableColumns={excelData?.headers || []}
              />
              {appState.emailBody.trim() && (
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => appState.setActiveStep(1)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => appState.setActiveStep(3)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Paso 3: Mapear campos</h2>
              <FieldMappingComponent
                detectedFields={detectedFields}
                availableColumns={excelData?.headers || []}
                mapping={appState.fieldMapping}
                onMappingChange={appState.setFieldMapping}
                excelData={excelData?.rows}
              />
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => appState.setActiveStep(2)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Anterior
                </button>
                {Object.keys(appState.fieldMapping).length > 0 && (
                  <button
                    onClick={() => appState.setActiveStep(4)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Paso 4: Correos generados</h2>
              <EmailPreview
                emails={generatedEmails}
                statistics={statistics}
                onExportText={getEmailsAsText}
                onExportCSV={getEmailsAsCSV}
              />
              <div className="mt-6 flex justify-start">
                <button
                  onClick={() => appState.setActiveStep(3)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
