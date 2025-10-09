import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Cargando..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-3" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

export default LoadingSpinner;