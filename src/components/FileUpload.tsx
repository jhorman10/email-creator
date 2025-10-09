import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import type { ExcelData } from '../types';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
  excelData: ExcelData | null;
  error: string | null;
  onClearData: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  loading,
  excelData,
  error,
  onClearData
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    }
  });

  if (excelData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <File className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-900">Archivo cargado exitosamente</span>
          </div>
          <button
            onClick={onClearData}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            title="Eliminar archivo"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-md p-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Columnas encontradas:</strong> {excelData.headers.length}
          </p>
          <p className="text-sm text-gray-600 mb-3">
            <strong>Filas de datos:</strong> {excelData.rows.length}
          </p>
          
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Columnas:</p>
            <div className="flex flex-wrap gap-2">
              {excelData.headers.map((header, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md font-medium"
                >
                  {header}
                </span>
              ))}
            </div>
          </div>
          
          {excelData.rows.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Vista previa (primera fila):</p>
              <div className="bg-white rounded border p-3">
                {excelData.headers.map((header, index) => (
                  <div key={index} className="flex justify-between py-1 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-600 text-xs">{header}:</span>
                    <span className="text-gray-900 text-xs">
                      {excelData.rows[0][index] || '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={loading} />
        
        <div className="flex flex-col items-center gap-4">
          <Upload className={`h-12 w-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          
          <div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {loading 
                ? 'Procesando archivo...' 
                : isDragActive 
                  ? 'Suelta el archivo aquí' 
                  : 'Arrastra y suelta tu archivo Excel'
              }
            </p>
            <p className="text-sm text-gray-500">
              {loading 
                ? 'Por favor espera mientras procesamos tu archivo' 
                : 'o haz clic para seleccionar un archivo'
              }
            </p>
          </div>
          
          <div className="flex gap-2 text-xs text-gray-400">
            <span className="px-2 py-1 bg-gray-200 rounded">XLSX</span>
            <span className="px-2 py-1 bg-gray-200 rounded">XLS</span>
            <span className="px-2 py-1 bg-gray-200 rounded">CSV</span>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}
    </div>
  );
};