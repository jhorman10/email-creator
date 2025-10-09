import { useCallback } from 'react';

interface ClipboardActions {
  copyToClipboard: (text: string) => Promise<void>;
  copyEmailToClipboard: (email: { recipient: string; subject: string; body: string }) => Promise<void>;
}

/**
 * Hook personalizado para manejar operaciones del portapapeles
 * Implementa el principio de Single Responsibility - solo maneja clipboard
 */
export const useClipboard = (): ClipboardActions => {
  const copyToClipboard = useCallback(async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
      throw new Error('No se pudo copiar al portapapeles');
    }
  }, []);

  const copyEmailToClipboard = useCallback(async (email: { 
    recipient: string; 
    subject: string; 
    body: string;
  }): Promise<void> => {
    const emailText = `Para: ${email.recipient || 'Sin destinatario'}
Asunto: ${email.subject}

${email.body}`;
    
    await copyToClipboard(emailText);
  }, [copyToClipboard]);

  return {
    copyToClipboard,
    copyEmailToClipboard,
  };
};