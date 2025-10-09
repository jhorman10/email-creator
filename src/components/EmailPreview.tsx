import React, { useState } from 'react';
import { Mail, Eye, Copy, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GeneratedEmail } from '../types';

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

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  emails,
  statistics,
  onExportText,
  onExportCSV
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRawData, setShowRawData] = useState(false);

  const currentEmail = emails[currentIndex];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Aquí podrías mostrar una notificación de éxito
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (emails.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay correos generados
        </h3>
        <p className="text-gray-600">
          Carga un archivo Excel, escribe una plantilla y mapea los campos para generar correos personalizados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header con estadísticas */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Correos Generados</h2>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => copyToClipboard(onExportText())}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center gap-2 transition-colors"
            >
              <Copy className="h-4 w-4" />
              Copiar Todo
            </button>
            <button
              onClick={() => downloadFile(onExportText(), 'correos.txt', 'text/plain')}
              className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors"
            >
              <Download className="h-4 w-4" />
              Descargar TXT
            </button>
            <button
              onClick={() => downloadFile(onExportCSV(), 'correos.csv', 'text/csv')}
              className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-2 transition-colors"
            >
              <Download className="h-4 w-4" />
              Descargar CSV
            </button>
          </div>
        </div>

        {/* Estadísticas */}
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
      </div>

      {/* Navegación entre correos */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Correo {currentIndex + 1} de {emails.length}
          </span>
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <Eye className="h-4 w-4" />
            {showRawData ? 'Vista Normal' : 'Ver Datos'}
          </button>
        </div>

        <button
          onClick={() => setCurrentIndex(Math.min(emails.length - 1, currentIndex + 1))}
          disabled={currentIndex === emails.length - 1}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Contenido del correo */}
      <div className="p-6">
        {showRawData ? (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Datos de la fila #{currentEmail.id}</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(currentEmail.rowData).map(([key, value]) => (
                <div key={key} className="border border-gray-200 rounded p-3">
                  <div className="text-sm font-medium text-gray-600">{key}</div>
                  <div className="text-gray-900">{value || '-'}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Información del destinatario */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-700">Para:</div>
                <div className="text-gray-900">
                  {currentEmail.recipient || (
                    <span className="text-orange-600 italic">Sin destinatario definido</span>
                  )}
                </div>
              </div>
            </div>

            {/* Asunto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asunto:
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-900">{currentEmail.subject}</div>
              </div>
              <button
                onClick={() => copyToClipboard(currentEmail.subject)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Copy className="h-3 w-3" />
                Copiar asunto
              </button>
            </div>

            {/* Cuerpo del correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje:
              </label>
              <div className="p-4 bg-gray-50 rounded-lg min-h-[200px]">
                <pre className="whitespace-pre-wrap text-gray-900 text-sm leading-relaxed">
                  {currentEmail.body}
                </pre>
              </div>
              <button
                onClick={() => copyToClipboard(currentEmail.body)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Copy className="h-3 w-3" />
                Copiar mensaje
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};