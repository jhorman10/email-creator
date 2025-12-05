import React, { memo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import type { ExcelData } from '../types';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
  excelData: ExcelData | null;
  error: string | null;
  progress: number;
  onClearData: () => void;
}

const FileUpload: React.FC<FileUploadProps> = memo(({
  onFileUpload,
  loading,
  excelData,
  error,
  progress,
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
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-rose-200 ring-1 ring-rose-50/40">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <File className="h-5 w-5 text-violet-600" />
            <span className="font-medium text-gray-900 text-sm sm:text-base">Archivo cargado exitosamente</span>
          </div>
          <button
            onClick={onClearData}
            className="p-1 hover:bg-rose-50/40 rounded-full transition-colors"
            title="Eliminar archivo"
          >
            <X className="h-4 w-4 text-rose-500" />
          </button>
        </div>
        
        <div className="bg-rose-50/40 rounded-md p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-rose-700 mb-2">
            <strong>Columnas encontradas:</strong> {excelData.headers.length}
          </p>
          <p className="text-xs sm:text-sm text-rose-700 mb-3">
            <strong>Filas de datos:</strong> {excelData.rows.length}
          </p>
          
          <div className="mb-3">
            <p className="text-xs sm:text-sm font-medium text-rose-700 mb-2">Columnas:</p>
            <div className="flex flex-wrap gap-2">
              {excelData.headers.map((header, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-violet-100 text-violet-800 text-xs rounded-md font-medium"
                >
                  {header}
                </span>
              ))}
            </div>
          </div>
          
          {excelData.rows.length > 0 && (
            <div>
              <p className="text-xs sm:text-sm font-medium text-rose-700 mb-2">Vista previa (primera fila):</p>
              <div className="bg-white rounded border p-2 sm:p-3">
                {excelData.headers.map((header, index) => (
                  <div key={index} className="flex justify-between py-1 border-b border-rose-50 last:border-b-0">
                    <span className="font-medium text-rose-600 text-xs">{header}:</span>
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
          border-2 border-dashed rounded-lg p-4 sm:p-8 text-center cursor-pointer transition-colors
          ring-1 ring-rose-50/30
          ${isDragActive 
            ? 'border-violet-400 bg-violet-50 ring-2 ring-violet-50/30' 
            : 'border-rose-200 hover:border-rose-300 bg-rose-50/40 hover:bg-rose-50'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={loading} />
        
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <Upload className={`h-8 sm:h-12 w-8 sm:w-12 ${isDragActive ? 'text-violet-500' : 'text-rose-300'}`} />
          
          <div>
            <p className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              {loading 
                ? 'Procesando archivo...' 
                : isDragActive 
                  ? 'Suelta el archivo aquí' 
                  : 'Arrastra y suelta tu archivo Excel'
              }
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              {loading 
                ? 'Por favor espera mientras procesamos tu archivo' 
                : 'o haz clic para seleccionar un archivo'
              }
            </p>
            
            {loading && progress > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progreso</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full sm:w-64 bg-rose-50 rounded-full h-2">
                  <div 
                    className="bg-rose-200 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 text-xs text-rose-600">
            <span className="px-2 py-1 bg-rose-50 rounded">XLSX</span>
            <span className="px-2 py-1 bg-rose-50 rounded">XLS</span>
            <span className="px-2 py-1 bg-rose-50 rounded">CSV</span>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-xs sm:text-sm">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}
    </div>
  );
});

FileUpload.displayName = 'FileUpload';

export { FileUpload };