import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import type { ExcelData } from '../types';

const CHUNK_SIZE = 1000; // Procesar archivos en chunks de 1000 filas

export const useExcelReader = () => {
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const processDataInChunks = useCallback((jsonData: string[][]) => {
    return new Promise<string[][]>((resolve) => {
      const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ''));
      const processedRows: string[][] = [];
      let currentIndex = 0;

      const processChunk = () => {
        const endIndex = Math.min(currentIndex + CHUNK_SIZE, rows.length);
        const chunk = rows.slice(currentIndex, endIndex);
        
        // Procesar chunk actual
        const processedChunk = chunk.map(row => row.map(cell => cell?.toString() || ''));
        processedRows.push(...processedChunk);
        
        currentIndex = endIndex;
        const progressPercent = Math.round((currentIndex / rows.length) * 100);
        setProgress(progressPercent);

        if (currentIndex < rows.length) {
          // Programar el siguiente chunk para el siguiente frame
          requestAnimationFrame(processChunk);
        } else {
          resolve(processedRows);
        }
      };

      processChunk();
    });
  }, []);

  const readExcelFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const data = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
        reader.onerror = () => reject(new Error('Error al leer el archivo'));
        reader.readAsArrayBuffer(file);
      });

      const workbook = XLSX.read(data, { type: 'array' });
      
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
      
      // Procesar datos en chunks para archivos grandes
      const processedRows = await processDataInChunks(jsonData);
      
      setExcelData({
        headers,
        rows: processedRows
      });
      
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al leer el archivo Excel');
    } finally {
      setLoading(false);
    }
  }, [processDataInChunks]);

  const clearData = useCallback(() => {
    setExcelData(null);
    setError(null);
    setProgress(0);
  }, []);

  return {
    excelData,
    loading,
    error,
    progress,
    readExcelFile,
    clearData
  };
};