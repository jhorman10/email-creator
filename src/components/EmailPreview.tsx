import React, { memo, useCallback } from 'react';
import { Mail, Copy, Download, ChevronLeft, ChevronRight, User, MessageSquare } from 'lucide-react';
import type { GeneratedEmail } from '../types';
import { useEmailPagination } from '../hooks/useEmailPagination';
import { useClipboard } from '../hooks/useClipboard';
import { useFileDownload } from '../hooks/useFileDownload';
import { useEmailData } from '../hooks/useEmailData';

interface EmailPreviewProps {
  emails: GeneratedEmail[];
  statistics: {
    total: number;
    withRecipient: number;
    withoutRecipient: number;
  };
  onExportText: () => string;
  onExportCSV: () => string;
}

/**
 * Componente puro para mostrar estadísticas de emails
 * Implementa el principio de Single Responsibility - solo renderiza estadísticas
 */
const EmailStatistics: React.FC<{ statistics: { total: number; withRecipient: number; withoutRecipient: number } }> = memo(({ statistics }) => (
  <div className="grid grid-cols-3 gap-4">
    <div className="text-center p-3 bg-blue-50 rounded-lg">
      <div className="text-2xl font-bold text-blue-600">{statistics.total}</div>
      <div className="text-sm text-blue-700">Total de correos</div>
    </div>
    <div className="text-center p-3 bg-green-50 rounded-lg">
      <div className="text-2xl font-bold text-green-600">{statistics.withRecipient}</div>
      <div className="text-sm text-green-700">Con destinatario</div>
    </div>
    <div className="text-center p-3 bg-orange-50 rounded-lg">
      <div className="text-2xl font-bold text-orange-600">{statistics.withoutRecipient}</div>
      <div className="text-sm text-orange-700">Sin destinatario</div>
    </div>
  </div>
));

EmailStatistics.displayName = 'EmailStatistics';

/**
 * Componente puro para botones de exportación
 * Implementa el principio de Single Responsibility - solo renderiza botones de exportación
 */
const ExportButtons: React.FC<{
  onCopyAll: () => void;
  onDownloadText: () => void;
  onDownloadCSV: () => void;
}> = memo(({ onCopyAll, onDownloadText, onDownloadCSV }) => (
  <div className="flex gap-2">
    <button
      onClick={onCopyAll}
      className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center gap-2 transition-colors"
    >
      <Copy className="h-4 w-4" />
      Copiar Todo
    </button>
    <button
      onClick={onDownloadText}
      className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors"
    >
      <Download className="h-4 w-4" />
      TXT
    </button>
    <button
      onClick={onDownloadCSV}
      className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-2 transition-colors"
    >
      <Download className="h-4 w-4" />
      CSV
    </button>
  </div>
));

ExportButtons.displayName = 'ExportButtons';

/**
 * Componente puro para controles de paginación
 * Implementa el principio de Single Responsibility - solo renderiza controles de paginación
 */
const PaginationControls: React.FC<{
  currentIndex: number;
  totalEmails: number;
  progress: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onCopyCurrentEmail: () => void;
}> = memo(({ 
  currentIndex, 
  totalEmails, 
  progress, 
  hasNext, 
  hasPrevious, 
  onNext, 
  onPrevious, 
  onCopyCurrentEmail 
}) => (
  <div className="p-4 border-b border-gray-200 bg-gray-50">
    <div className="flex items-center justify-between">
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded-md transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </button>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">
          Correo {currentIndex + 1} de {totalEmails}
        </span>
        
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <button
          onClick={onCopyCurrentEmail}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
          title="Copiar este correo"
        >
          <Copy className="h-4 w-4" />
          Copiar
        </button>
      </div>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded-md transition-colors"
      >
        Siguiente
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  </div>
));

PaginationControls.displayName = 'PaginationControls';

/**
 * Componente puro para mostrar el contenido de un email
 * Implementa el principio de Single Responsibility - solo renderiza el contenido del email
 */
const EmailContent: React.FC<{ email: GeneratedEmail }> = memo(({ email }) => (
  <div className="p-6">
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <User className="h-5 w-5 text-gray-500 mt-1" />
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-700 mb-1">Para:</div>
          <div className="text-gray-900 font-medium">
            {email.recipient || (
              <span className="text-orange-600 italic">Sin destinatario definido</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-500" />
          <label className="text-sm font-medium text-gray-700">
            Asunto:
          </label>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <div className="text-gray-900 font-medium">{email.subject}</div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Mensaje:
        </label>
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg min-h-[300px]">
          <pre className="whitespace-pre-wrap text-gray-900 text-sm leading-relaxed font-sans">
            {email.body}
          </pre>
        </div>
      </div>
    </div>
  </div>
));

EmailContent.displayName = 'EmailContent';

/**
 * Componente puro para mostrar estado vacío
 * Implementa el principio de Single Responsibility - solo renderiza estado vacío
 */
const EmptyState: React.FC = memo(() => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No hay correos generados
    </h3>
    <p className="text-gray-600">
      Carga un archivo Excel, escribe una plantilla y mapea los campos para generar correos personalizados.
    </p>
  </div>
));

EmptyState.displayName = 'EmptyState';

/**
 * Componente principal de vista previa de emails
 * Implementa el principio de Single Responsibility - solo orquesta la presentación
 * Toda la lógica de negocio está delegada a hooks personalizados
 */
const EmailPreview: React.FC<EmailPreviewProps> = memo(({
  emails,
  statistics,
  onExportText,
  onExportCSV
}) => {
  // Hooks para lógica de negocio (Dependency Inversion Principle)
  const emailData = useEmailData(emails, onExportText, onExportCSV);
  const pagination = useEmailPagination(emails);
  const clipboard = useClipboard();
  const fileDownload = useFileDownload();

  // Handlers memoizados para optimizar performance
  const handleCopyAll = useCallback(() => {
    clipboard.copyToClipboard(emailData.exportData.asText);
  }, [clipboard, emailData.exportData.asText]);

  const handleDownloadText = useCallback(() => {
    fileDownload.downloadTextFile(emailData.exportData.asText, 'correos.txt');
  }, [fileDownload, emailData.exportData.asText]);

  const handleDownloadCSV = useCallback(() => {
    fileDownload.downloadCSVFile(emailData.exportData.asCSV, 'correos.csv');
  }, [fileDownload, emailData.exportData.asCSV]);

  const handleCopyCurrentEmail = useCallback(() => {
    if (pagination.currentEmail) {
      clipboard.copyEmailToClipboard({
        recipient: pagination.currentEmail.recipient,
        subject: pagination.currentEmail.subject,
        body: pagination.currentEmail.body,
      });
    }
  }, [clipboard, pagination.currentEmail]);

  // Renderizado condicional basado en estado
  if (emailData.isEmpty) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header con estadísticas y botones de exportación */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Correos Generados</h2>
          </div>
          
          <ExportButtons
            onCopyAll={handleCopyAll}
            onDownloadText={handleDownloadText}
            onDownloadCSV={handleDownloadCSV}
          />
        </div>

        <EmailStatistics statistics={statistics} />
      </div>

      {/* Controles de paginación */}
      <PaginationControls
        currentIndex={pagination.currentIndex}
        totalEmails={emails.length}
        progress={pagination.progress}
        hasNext={pagination.hasNext}
        hasPrevious={pagination.hasPrevious}
        onNext={pagination.goToNext}
        onPrevious={pagination.goToPrevious}
        onCopyCurrentEmail={handleCopyCurrentEmail}
      />

      {/* Contenido del email actual */}
      {pagination.currentEmail && (
        <EmailContent email={pagination.currentEmail} />
      )}

      {/* Navegación adicional en la parte inferior */}
      {emails.length > 1 && (
        <div className="flex justify-center pt-4 pb-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={pagination.goToPrevious}
              disabled={!pagination.hasPrevious}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Correo anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <span className="px-4 py-2 text-sm bg-gray-100 rounded-md font-medium">
              {pagination.currentIndex + 1} / {emails.length}
            </span>
            
            <button
              onClick={pagination.goToNext}
              disabled={!pagination.hasNext}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Correo siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

EmailPreview.displayName = 'EmailPreview';

export { EmailPreview };
