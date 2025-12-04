import React, { memo, useCallback, useMemo } from 'react';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import type { FieldMapping } from '../types';

interface FieldMappingProps {
  detectedFields: string[];
  availableColumns: string[];
  mapping: FieldMapping;
  onMappingChange: (mapping: FieldMapping) => void;
  excelData?: string[][];
}

const FieldMappingComponent: React.FC<FieldMappingProps> = memo(({
  detectedFields,
  availableColumns,
  mapping,
  onMappingChange,
  excelData
}) => {
  const handleFieldMapping = useCallback((field: string, column: string) => {
    const newMapping = { ...mapping };
    if (column === '') {
      delete newMapping[field];
    } else {
      newMapping[field] = column;
    }
    onMappingChange(newMapping);
  }, [mapping, onMappingChange]);

  const autoMapFields = useCallback(() => {
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
  }, [detectedFields, availableColumns, onMappingChange]);

  const { mappedFields, unmappedFields } = useMemo(() => {
    const mapped = detectedFields.filter(field => mapping[field]);
    const unmapped = detectedFields.filter(field => !mapping[field]);
    return { mappedFields: mapped, unmappedFields: unmapped };
  }, [detectedFields, mapping]);

  const getPreviewData = useCallback((columnName: string) => {
    if (!excelData || !columnName) return null;
    
    const columnIndex = availableColumns.indexOf(columnName);
    if (columnIndex === -1) return null;
    
    return excelData.slice(0, 3).map(row => row[columnIndex] || '').filter(val => val);
  }, [excelData, availableColumns]);

  if (detectedFields.length === 0) {
    return (
      /* Estado sin campos detectados: fondo y borde más pálidos */
      <div className="bg-rose-50/40 border border-rose-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-rose-500" />
          <h3 className="font-medium text-rose-700">No se detectaron campos</h3>
        </div>
        <p className="text-rose-600 text-sm">
          Escribe tu plantilla de correo usando campos como &#123;&#123;NOMBRE&#125;&#125;, &#123;&#123;CEDULA&#125;&#125;, etc. 
          para poder mapearlos con las columnas del Excel.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-rose-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Mapeo de Campos</h2>
        <button
          onClick={autoMapFields}
          className="px-4 py-2 bg-violet-600 text-white text-sm rounded-md hover:bg-violet-700 transition-colors"
        >
          Mapeo Automático
        </button>
      </div>

      <div className="space-y-4">
        {detectedFields.map((field) => {
          const selectedColumn = mapping[field];
          const previewData = selectedColumn ? getPreviewData(selectedColumn) : null;
          
          return (
            /* Cada campo mapeable con borde suavizado */
            <div key={field} className="border border-rose-50 rounded-lg p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-rose-50 text-rose-700 text-sm font-mono rounded">
                      {field}
                    </span>
                    {selectedColumn && (
                      <CheckCircle className="h-4 w-4 text-violet-600" />
                    )}
                  </div>
                </div>
                
                <ArrowRight className="h-4 w-4 text-rose-300" />
                
                <div className="flex-1">
                    <select
                    value={selectedColumn || ''}
                    onChange={(e) => handleFieldMapping(field, e.target.value)}
                    className="w-full px-3 py-2 border border-rose-50 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
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
                <div className="mt-3 p-3 bg-rose-50/40 rounded-md">
                  <p className="text-xs font-medium text-rose-700 mb-2">Vista previa de datos:</p>
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
        <div className="p-4 bg-violet-50 rounded-lg border border-violet-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-900">
              Campos mapeados: {mappedFields.length}
            </span>
          </div>
          {mappedFields.length > 0 && (
            <div className="text-xs text-violet-700">
              {mappedFields.join(', ')}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-900">
              Campos sin mapear: {unmappedFields.length}
            </span>
          </div>
          {unmappedFields.length > 0 && (
            <div className="text-xs text-amber-700">
              {unmappedFields.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

FieldMappingComponent.displayName = 'FieldMappingComponent';

export { FieldMappingComponent };