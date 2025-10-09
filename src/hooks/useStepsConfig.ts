import { Upload, FileText, Mail, Send } from 'lucide-react';

export interface Step {
  id: number;
  title: string;
  icon: typeof Upload;
  description: string;
}

/**
 * Hook personalizado para la configuración de pasos
 * Implementa el principio de Single Responsibility - solo maneja configuración de pasos
 */
export const useStepsConfig = (): Step[] => {
  return [
    { 
      id: 1, 
      title: 'Cargar Excel', 
      icon: Upload, 
      description: 'Sube tu archivo Excel con los datos' 
    },
    { 
      id: 2, 
      title: 'Crear Plantilla', 
      icon: FileText, 
      description: 'Escribe tu plantilla de correo' 
    },
    { 
      id: 3, 
      title: 'Mapear Campos', 
      icon: Mail, 
      description: 'Conecta los campos con las columnas' 
    },
    { 
      id: 4, 
      title: 'Generar Correos', 
      icon: Send, 
      description: 'Revisa y exporta tus correos' 
    }
  ];
};