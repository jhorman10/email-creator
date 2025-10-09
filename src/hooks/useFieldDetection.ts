import { useMemo } from 'react';

export const useFieldDetection = (template: string) => {
  const detectedFields = useMemo(() => {
    // Detectar campos en diferentes formatos:
    // {{CAMPO}}, {CAMPO}, [CAMPO], <CAMPO>, CAMPO (palabras en mayúsculas)
    const patterns = [
      /\{\{([^}]+)\}\}/g,  // {{CAMPO}}
      /\{([^}]+)\}/g,      // {CAMPO}
      /\[([^\]]+)\]/g,     // [CAMPO]
      /<([^>]+)>/g,        // <CAMPO>
      /\b([A-Z_]{2,})\b/g  // CAMPO (palabras en mayúsculas de 2+ caracteres)
    ];

    const fields = new Set<string>();
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(template)) !== null) {
        const field = match[1].trim().toUpperCase();
        if (field && field.length > 1) {
          fields.add(field);
        }
      }
    });

    return Array.from(fields).sort();
  }, [template]);

  const suggestions = useMemo(() => {
    const commonFields = [
      'NOMBRE', 'CEDULA', 'CORREO', 'EMAIL', 'APELLIDO', 'TELEFONO',
      'DIRECCION', 'CIUDAD', 'FECHA', 'CURSO', 'EMPRESA', 'CARGO'
    ];
    
    return commonFields.filter(field => !detectedFields.includes(field));
  }, [detectedFields]);

  const getFieldFormat = (field: string) => {
    // Devuelve diferentes formatos para mostrar al usuario
    return [
      `{{${field}}}`,
      `{${field}}`,
      `[${field}]`,
      field
    ];
  };

  return {
    detectedFields,
    suggestions,
    getFieldFormat
  };
};