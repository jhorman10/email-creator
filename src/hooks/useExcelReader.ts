import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import type { ExcelData } from '../types';

export const useExcelReader = () => {
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readExcelFile = useCallback((file: File) => {
    setLoading(true);
    setError(null);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Obtener la primera hoja
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convertir a JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        
        if (jsonData.length === 0) {
          throw new Error('El archivo Excel está vacío');
        }
        
        // La primera fila son los headers
        const headers = jsonData[0].map(header => header?.toString() || '');
        const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ''));
        
        setExcelData({
          headers,
          rows: rows.map(row => row.map(cell => cell?.toString() || ''))
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al leer el archivo Excel');
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Error al leer el archivo');
      setLoading(false);
    };

    reader.readAsBinaryString(file);
  }, []);

  const clearData = useCallback(() => {
    setExcelData(null);
    setError(null);
  }, []);

  return {
    excelData,
    loading,
    error,
    readExcelFile,
    clearData
  };
};