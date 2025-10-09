import React, { memo, useCallback } from 'react';
import { Mail, Info, Plus } from 'lucide-react';
import { useFieldDetection } from '../hooks/useFieldDetection';

interface EmailTemplateProps {
  subject: string;
  body: string;
  onSubjectChange: (subject: string) => void;
  onBodyChange: (body: string) => void;
  availableColumns: string[];
}

const EmailTemplate: React.FC<EmailTemplateProps> = memo(({
  subject,
  body,
  onSubjectChange,
  onBodyChange,
  availableColumns
}) => {
  const { detectedFields, suggestions } = useFieldDetection(body);

  const insertField = useCallback((field: string) => {
    const textarea = document.getElementById('email-body') as HTMLTextAreaElement;
    const cursorPos = textarea?.selectionStart || body.length;
    const beforeCursor = body.substring(0, cursorPos);
    const afterCursor = body.substring(cursorPos);
    onBodyChange(beforeCursor + `{{${field}}}` + afterCursor);
  }, [body, onBodyChange]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Plantilla de Correo</h2>
      </div>

      {/* Campo de Asunto */}
      <div className="mb-6">
        <label htmlFor="email-subject" className="block text-sm font-medium text-gray-700 mb-2">
          Asunto del correo
        </label>
        <input
          id="email-subject"
          type="text"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="Ej: Solicitud para realizar curso {{CURSO}}"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Campo de Cuerpo del Email */}
      <div className="mb-6">
        <label htmlFor="email-body" className="block text-sm font-medium text-gray-700 mb-2">
          Cuerpo del correo
        </label>
        <textarea
          id="email-body"
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          placeholder="Escriba su mensaje aquí. Use {{CAMPO}} para insertar datos del Excel..."
          rows={12}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        />
      </div>

      {/* Campos Detectados */}
      {detectedFields.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-medium text-blue-900">Campos detectados en la plantilla</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {detectedFields.map((field) => (
              <span
                key={field}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md font-mono"
              >
                {field}
              </span>
            ))}
          </div>
          <p className="text-xs text-blue-700 mt-2">
            Estos campos serán reemplazados con los datos del Excel cuando generes los correos.
          </p>
        </div>
      )}

      {/* Campos Disponibles del Excel */}
      {availableColumns.length > 0 && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-900 mb-3">
            Columnas disponibles en el Excel
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableColumns.map((column) => (
              <button
                key={column}
                onClick={() => insertField(column.toUpperCase())}
                className="px-2 py-1 bg-green-100 hover:bg-green-200 text-green-800 text-xs rounded-md font-mono transition-colors flex items-center gap-1"
                title={`Insertar {{${column.toUpperCase()}}}`}
              >
                <Plus className="h-3 w-3" />
                {column}
              </button>
            ))}
          </div>
          <p className="text-xs text-green-700 mt-2">
            Haz clic en una columna para insertarla en el cursor del cuerpo del correo.
          </p>
        </div>
      )}

      {/* Sugerencias de Campos Comunes */}
      {suggestions.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Campos comunes que puedes usar
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 8).map((field) => (
              <button
                key={field}
                onClick={() => insertField(field)}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded-md font-mono transition-colors flex items-center gap-1"
                title={`Insertar {{${field}}}`}
              >
                <Plus className="h-3 w-3" />
                {field}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

EmailTemplate.displayName = 'EmailTemplate';

export { EmailTemplate };