import { useState, useCallback, useMemo } from 'react';
import type { GeneratedEmail } from '../types';

interface EmailPaginationState {
  currentIndex: number;
  currentEmail: GeneratedEmail | null;
  hasNext: boolean;
  hasPrevious: boolean;
  progress: number;
}

interface EmailPaginationActions {
  goToNext: () => void;
  goToPrevious: () => void;
  goToIndex: (index: number) => void;
}

/**
 * Hook personalizado para manejar la paginación de emails
 * Implementa el principio de Single Responsibility - solo maneja paginación
 */
export const useEmailPagination = (
  emails: GeneratedEmail[]
): EmailPaginationState & EmailPaginationActions => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentEmail = useMemo(() => 
    emails.length > 0 ? emails[currentIndex] : null, 
    [emails, currentIndex]
  );

  const hasNext = useMemo(() => 
    currentIndex < emails.length - 1, 
    [currentIndex, emails.length]
  );

  const hasPrevious = useMemo(() => 
    currentIndex > 0, 
    [currentIndex]
  );

  const progress = useMemo(() => 
    emails.length > 0 ? ((currentIndex + 1) / emails.length) * 100 : 0,
    [currentIndex, emails.length]
  );

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(emails.length - 1, prev + 1));
  }, [emails.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  }, []);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < emails.length) {
      setCurrentIndex(index);
    }
  }, [emails.length]);

  return {
    currentIndex,
    currentEmail,
    hasNext,
    hasPrevious,
    progress,
    goToNext,
    goToPrevious,
    goToIndex,
  };
};