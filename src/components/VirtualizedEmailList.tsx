import React, { memo, useMemo } from 'react';
import type { GeneratedEmail } from '../types';

interface EmailItemProps {
  email: GeneratedEmail;
}

const EmailItem = memo<EmailItemProps>(({ email }) => {
  return (
    <div className="px-1 mb-4">
      {/* Hice los bordes más pálidos: border-rose-100 -> border-rose-50 */}
      <div className="bg-white rounded-lg border border-rose-50 p-4 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              Para: {email.recipient || 'No especificado'}
            </p>
            <p className="text-xs text-rose-600">Email #{email.id}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-rose-700 mb-1">Asunto:</p>
            {/* Fondo más tenue y borde más pálido: bg-rose-50/40 reduce intensidad visual, border-rose-50 es menos saturado */}
            <p className="text-sm text-gray-900 bg-rose-50/40 p-2 rounded border border-rose-50">
              {email.subject || 'Sin asunto'}
            </p>
          </div>
          
          <div>
            <p className="text-xs font-medium text-rose-700 mb-1">Mensaje:</p>
            {/* Igual que arriba: fondo más pálido con menor opacidad y borde suavizado */}
            <div className="text-sm text-gray-900 bg-rose-50/40 p-3 rounded border border-rose-50 max-h-32 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {email.body}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

EmailItem.displayName = 'EmailItem';

interface VirtualizedEmailListProps {
  emails: GeneratedEmail[];
  height: number;
}

const VirtualizedEmailList: React.FC<VirtualizedEmailListProps> = memo(({
  emails,
  height = 400
}) => {
  const emailChunks = useMemo(() => {
    // Para optimización, mostrar solo los primeros 100 emails en vista de lista
    // En una implementación real, usaríamos infinite scroll
    return emails.slice(0, 100);
  }, [emails]);

  if (emails.length === 0) {
    return (
      <div className="text-center py-8 text-rose-600">
        No hay emails generados
      </div>
    );
  }

  return (
    <div className="border border-rose-100 rounded-lg bg-white">
      <div 
        className="overflow-y-auto p-4"
        style={{ height: `${height}px` }}
      >
        <div className="text-sm text-rose-700 mb-4">
          Mostrando {Math.min(emailChunks.length, 100)} de {emails.length} emails
          {emails.length > 100 && ' (primeros 100 para optimización)'}
        </div>
        
        {emailChunks.map((email) => (
          <EmailItem key={email.id} email={email} />
        ))}
        
        {emails.length > 100 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            Para ver todos los emails, usa las opciones de exportación
          </div>
        )}
      </div>
    </div>
  );
});

VirtualizedEmailList.displayName = 'VirtualizedEmailList';

export { VirtualizedEmailList };