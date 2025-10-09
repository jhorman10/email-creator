import React from 'react';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import type { FieldMapping } from '../types';

interface FieldMappingProps {
  detectedFields: string[];
  availableColumns: string[];
  mapping: FieldMapping;
  onMappingChange: (mapping: FieldMapping) => void;
  excelData?: string[][];
}

export const FieldMappingComponent: React.FC<FieldMappingProps> = ({
  detectedFields,
  availableColumns,
  mapping,
  onMappingChange,
  excelData
}) => {
  const handleFieldMapping = (field: string, column: string) => {
    const newMapping = { ...mapping };
    if (column === '') {
      delete newMapping[field];
    } else {
      newMapping[field] = column;
    }
    onMappingChange(newMapping);
  };

  const autoMapFields = () => {
    const newMapping: FieldMapping = {};
    
    detectedFields.forEach(field => {
      // Buscar coincidencias exactas o similares
      const exactMatch = availableColumns.find(col => 
        col.toUpperCase() === field.toUpperCase()
      );
      
      if (exactMatch) {
        newMapping[field] = exactMatch;
        return;
      }
      
      // Buscar coincidencias parciales
      const partialMatch = availableColumns.find(col => 
        col.toUpperCase().includes(field.toUpperCase()) ||
        field.toUpperCase().includes(col.toUpperCase())
      );
      
      if (partialMatch) {
        newMapping[field] = partialMatch;
      }
    });
    
    onMappingChange(newMapping);
  };

  const getMappedFields = () => detectedFields.filter(field => mapping[field]);
  const getUnmappedFields = () => detectedFields.filter(field => !mapping[field]);

  const getPreviewData = (columnName: string) => {
    if (!excelData || !columnName) return null;
    
    const columnIndex = availableColumns.indexOf(columnName);
    if (columnIndex === -1) return null;
    
    return excelData.slice(0, 3).map(row => row[columnIndex] || '').filter(val => val);
  };

  if (detectedFields.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <h3 className="font-medium text-yellow-900">No se detectaron campos</h3>
        </div>
        <p className="text-yellow-800 text-sm">
          Escribe tu plantilla de correo usando campos como &#123;&#123;NOMBRE&#125;&#125;, &#123;&#123;CEDULA&#125;&#125;, etc. 
          para poder mapearlos con las columnas del Excel.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Mapeo de Campos</h2>
        <button
          onClick={autoMapFields}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          Mapeo Automático
        </button>
      </div>

      <div className="space-y-4">
        {detectedFields.map((field) => {
          const selectedColumn = mapping[field];
          const previewData = selectedColumn ? getPreviewData(selectedColumn) : null;
          
          return (
            <div key={field} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-mono rounded">
                      {field}
                    </span>
                    {selectedColumn && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
                
                <ArrowRight className="h-4 w-4 text-gray-400" />
                
                <div className="flex-1">
                  <select
                    value={selectedColumn || ''}
                    onChange={(e) => handleFieldMapping(field, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar columna...</option>
                    {availableColumns.map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {previewData && previewData.length > 0 && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-xs font-medium text-gray-600 mb-2">Vista previa de datos:</p>
                  <div className="flex gap-2 flex-wrap">
                    {previewData.map((value, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white text-gray-800 text-xs rounded border"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resumen del mapeo */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              Campos mapeados: {getMappedFields().length}
            </span>
          </div>
          {getMappedFields().length > 0 && (
            <div className="text-xs text-green-700">
              {getMappedFields().join(', ')}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">
              Campos sin mapear: {getUnmappedFields().length}
            </span>
          </div>
          {getUnmappedFields().length > 0 && (
            <div className="text-xs text-orange-700">
              {getUnmappedFields().join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};