import { useMemo, useCallback } from 'react';
import type { ExcelData, FieldMapping, GeneratedEmail } from '../types';

export const useEmailGeneration = (
  excelData: ExcelData | null,
  template: { subject: string; body: string },
  mapping: FieldMapping
) => {
  // Memoizar la lógica de reemplazo de placeholders para evitar recálculos innecesarios
  const replacePlaceholders = useCallback((text: string, rowData: { [key: string]: string }) => {
    let result = text;
    Object.entries(mapping).forEach(([placeholder, columnName]) => {
      const value = rowData[columnName] || '';
      const patterns = [
        new RegExp(`\\{\\{${placeholder}\\}\\}`, 'gi'),
        new RegExp(`\\{${placeholder}\\}`, 'gi'),
        new RegExp(`\\[${placeholder}\\]`, 'gi'),
        new RegExp(`<${placeholder}>`, 'gi'),
        new RegExp(`\\b${placeholder}\\b`, 'gi')
      ];
      
      patterns.forEach(pattern => {
        result = result.replace(pattern, value);
      });
    });
    return result;
  }, [mapping]);

  const generatedEmails = useMemo((): GeneratedEmail[] => {
    if (!excelData || !template.body.trim()) {
      return [];
    }

    return excelData.rows.map((row, index) => {
      // Crear un objeto con los datos de la fila
      const rowData: { [key: string]: string } = {};
      excelData.headers.forEach((header, headerIndex) => {
        rowData[header] = row[headerIndex] || '';
      });

      // Reemplazar placeholders usando la función memoizada
      const personalizedSubject = replacePlaceholders(template.subject, rowData);
      const personalizedBody = replacePlaceholders(template.body, rowData);

      // Obtener el correo del destinatario
      const emailColumn = excelData.headers.find(header => 
        header.toLowerCase().includes('email') || 
        header.toLowerCase().includes('correo') ||
        header.toLowerCase().includes('mail')
      );
      
      const recipient = emailColumn ? rowData[emailColumn] : '';

      return {
        id: index + 1,
        recipient,
        subject: personalizedSubject,
        body: personalizedBody,
        rowData
      };
    });
  }, [excelData, template, replacePlaceholders]);

  const statistics = useMemo(() => {
    const total = generatedEmails.length;
    const withRecipient = generatedEmails.filter(email => email.recipient.trim()).length;
    const withoutRecipient = total - withRecipient;
    
    return {
      total,
      withRecipient,
      withoutRecipient
    };
  }, [generatedEmails]);

  const getEmailsAsText = () => {
    return generatedEmails.map((email) => {
      const separator = '='.repeat(80);
      return `${separator}
CORREO #${email.id}
Para: ${email.recipient || 'Sin destinatario'}
Asunto: ${email.subject}

${email.body}
${separator}`;
    }).join('\n\n');
  };

  const getEmailsAsCSV = () => {
    const headers = ['ID', 'Destinatario', 'Asunto', 'Cuerpo'];
    const csvRows = [headers.join(',')];
    
    generatedEmails.forEach(email => {
      const row = [
        email.id,
        `"${email.recipient.replace(/"/g, '""')}"`,
        `"${email.subject.replace(/"/g, '""')}"`,
        `"${email.body.replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  };

  return {
    generatedEmails,
    statistics,
    getEmailsAsText,
    getEmailsAsCSV
  };
};