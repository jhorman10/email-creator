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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
    <div className="text-center p-3 sm:p-4 bg-rose-50/40 rounded-lg">
      <div className="text-xl sm:text-2xl font-bold text-rose-700">{statistics.total}</div>
      <div className="text-xs sm:text-sm text-rose-600">Total de correos</div>
    </div>
    <div className="text-center p-3 sm:p-4 bg-violet-50 rounded-lg">
      <div className="text-xl sm:text-2xl font-bold text-violet-700">{statistics.withRecipient}</div>
      <div className="text-xs sm:text-sm text-violet-600">Con destinatario</div>
    </div>
    <div className="text-center p-3 sm:p-4 bg-amber-50 rounded-lg">
      <div className="text-xl sm:text-2xl font-bold text-amber-700">{statistics.withoutRecipient}</div>
      <div className="text-xs sm:text-sm text-amber-600">Sin destinatario</div>
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
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
    <button
      onClick={onCopyAll}
      className="px-2 sm:px-3 py-2 text-xs sm:text-sm bg-rose-50/40 hover:bg-rose-50 text-rose-700 rounded-md flex items-center justify-center sm:justify-start gap-2 transition-colors"
    >
      <Copy className="h-4 w-4 text-rose-500" />
      <span className="hidden sm:inline">Copiar Todo</span>
      <span className="sm:hidden">Copiar</span>
    </button>
    <button
      onClick={onDownloadText}
      className="px-2 sm:px-3 py-2 text-xs sm:text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-md flex items-center justify-center gap-2 transition-colors"
    >
      <Download className="h-4 w-4" />
      TXT
    </button>
    <button
      onClick={onDownloadCSV}
      className="px-2 sm:px-3 py-2 text-xs sm:text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-md flex items-center justify-center gap-2 transition-colors"
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
  <div className="p-3 sm:p-4 border-b border-rose-50 bg-rose-50/40">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm bg-white hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed border border-rose-50 rounded-md transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <span className="text-xs sm:text-sm font-medium text-rose-700 whitespace-nowrap">
          Correo {currentIndex + 1} de {totalEmails}
        </span>
        
        <div className="w-full sm:w-32 bg-rose-50 rounded-full h-2">
          <div 
            className="bg-rose-200 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <button
          onClick={onCopyCurrentEmail}
          className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md transition-colors"
          title="Copiar este correo"
        >
          <Copy className="h-4 w-4 text-rose-500" />
          Copiar
        </button>
      </div>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm bg-white hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed border border-rose-50 rounded-md transition-colors"
      >
        <span className="hidden sm:inline">Siguiente</span>
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
  <div className="p-4 sm:p-6">
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-rose-50/40 rounded-lg">
        <User className="h-4 sm:h-5 w-4 sm:w-5 text-rose-400 mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-xs sm:text-sm font-medium text-rose-700 mb-1">Para:</div>
          <div className="text-sm sm:text-base text-gray-900 font-medium break-words">
            {email.recipient || (
              <span className="text-amber-700 italic">Sin destinatario definido</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 sm:h-5 w-4 sm:w-5 text-rose-400" />
          <label className="text-xs sm:text-sm font-medium text-rose-700">
            Asunto:
          </label>
        </div>
        <div className="p-3 sm:p-4 bg-violet-50 rounded-lg border-l-4 border-violet-300">
          <div className="text-sm sm:text-base text-gray-900 font-medium break-words">{email.subject}</div>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Mensaje:
        </label>
        <div className="p-4 sm:p-6 bg-white border-2 border-rose-50 rounded-lg min-h-[250px] sm:min-h-[300px] overflow-y-auto">
          <pre className="whitespace-pre-wrap text-gray-900 text-xs sm:text-sm leading-relaxed font-sans">
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
  <div className="bg-rose-50/40 border border-rose-50 rounded-lg p-8 text-center">
    <Mail className="h-12 w-12 text-rose-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-rose-700 mb-2">
      No hay correos generados
    </h3>
    <p className="text-rose-600">
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
    <div className="bg-white rounded-lg shadow-md border border-rose-100">
      {/* Header con estadísticas y botones de exportación */}
      <div className="p-6 border-b border-rose-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-rose-500" />
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
        <div className="flex flex-col sm:flex-row justify-center items-center pt-4 sm:pt-6 pb-6 border-t border-rose-100 gap-2 sm:gap-4">
          <button
            onClick={pagination.goToPrevious}
            disabled={!pagination.hasPrevious}
            className="p-2 text-rose-500 hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Correo anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <span className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-rose-50/40 rounded-md font-medium text-gray-900">
            {pagination.currentIndex + 1} / {emails.length}
          </span>
          
          <button
            onClick={handleCopyCurrentEmail}
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs sm:text-sm bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md transition-colors"
            title="Copiar este correo"
          >
            <Copy className="h-4 w-4 text-rose-500" />
            Copiar
          </button>
          
          <button
            onClick={pagination.goToNext}
            disabled={!pagination.hasNext}
            className="p-2 text-rose-500 hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Correo siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
});

EmailPreview.displayName = 'EmailPreview';

export { EmailPreview };
