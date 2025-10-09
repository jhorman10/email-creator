import { useMemo } from 'react';
import type { GeneratedEmail } from '../types';

interface EmailStatistics {
  total: number;
  withRecipient: number;
  withoutRecipient: number;
  isEmpty: boolean;
}

interface EmailExportData {
  asText: string;
  asCSV: string;
}

interface EmailPreviewData {
  statistics: EmailStatistics;
  exportData: EmailExportData;
  isEmpty: boolean;
}

/**
 * Hook personalizado para procesar datos de emails y generar estadísticas
 * Implementa el principio de Single Responsibility - solo procesa datos de emails
 */
export const useEmailData = (
  emails: GeneratedEmail[],
  onExportText: () => string,
  onExportCSV: () => string
): EmailPreviewData => {
  const statistics = useMemo((): EmailStatistics => {
    const total = emails.length;
    const withRecipient = emails.filter(email => 
      email.recipient && email.recipient.trim() !== ''
    ).length;
    const withoutRecipient = total - withRecipient;

    return {
      total,
      withRecipient,
      withoutRecipient,
      isEmpty: total === 0,
    };
  }, [emails]);

  const exportData = useMemo((): EmailExportData => ({
    asText: onExportText(),
    asCSV: onExportCSV(),
  }), [onExportText, onExportCSV]);

  const isEmpty = useMemo(() => emails.length === 0, [emails.length]);

  return {
    statistics,
    exportData,
    isEmpty,
  };
};