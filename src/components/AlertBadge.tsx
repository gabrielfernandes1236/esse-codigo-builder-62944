
import React from 'react';
import { CheckSquare } from 'lucide-react';

interface AlertBadgeProps {
  count?: number;
  type?: string;
  message?: string;
  onClick?: () => void;
}

export const AlertBadge = ({ count = 0, type, message, onClick }: AlertBadgeProps) => {
  // If no count is provided but type/message exists, show a simple alert indicator
  if (count === 0 && !type) return null;

  const getTitle = () => {
    if (message) return message;
    if (count > 0) return `${count} tarefa${count > 1 ? 's' : ''} pendente${count > 1 ? 's' : ''}`;
    return 'Alerta';
  };

  return (
    <div 
      className="relative cursor-pointer animate-pulse" 
      onClick={onClick}
      title={getTitle()}
    >
      <CheckSquare className="w-6 h-6 text-orange-500" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
          {count}
        </span>
      )}
      {count === 0 && (type || message) && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center animate-bounce">
        </span>
      )}
    </div>
  );
};
