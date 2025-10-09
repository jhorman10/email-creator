import { useCallback } from 'react';

interface FileDownloadActions {
  downloadFile: (content: string, filename: string, mimeType: string) => void;
  downloadTextFile: (content: string, filename: string) => void;
  downloadCSVFile: (content: string, filename: string) => void;
}

/**
 * Hook personalizado para manejar descargas de archivos
 * Implementa el principio de Single Responsibility - solo maneja descargas
 */
export const useFileDownload = (): FileDownloadActions => {
  const downloadFile = useCallback((content: string, filename: string, mimeType: string) => {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar el objeto URL para liberar memoria
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al descargar archivo:', err);
      throw new Error('No se pudo descargar el archivo');
    }
  }, []);

  const downloadTextFile = useCallback((content: string, filename: string) => {
    downloadFile(content, filename, 'text/plain');
  }, [downloadFile]);

  const downloadCSVFile = useCallback((content: string, filename: string) => {
    downloadFile(content, filename, 'text/csv');
  }, [downloadFile]);

  return {
    downloadFile,
    downloadTextFile,
    downloadCSVFile,
  };
};