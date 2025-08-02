import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Save, AlertCircle, Loader2 } from 'lucide-react';
import { SaveStatus } from '@/hooks/useSaveStatus';

interface SaveIndicatorProps {
  status: SaveStatus;
  hasUnsavedChanges?: boolean;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SaveIndicator = ({ 
  status, 
  hasUnsavedChanges = false, 
  className,
  showText = true,
  size = 'md'
}: SaveIndicatorProps) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const getContent = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <Loader2 className={cn(sizeClasses[size], 'animate-spin text-blue-500')} />,
          text: 'Sauvegarde...',
          className: 'text-blue-600 bg-blue-50 border-blue-200'
        };
      
      case 'saved':
        return {
          icon: <Check className={cn(sizeClasses[size], 'text-green-500')} />,
          text: 'Sauvegardé',
          className: 'text-green-600 bg-green-50 border-green-200'
        };
      
      case 'error':
        return {
          icon: <AlertCircle className={cn(sizeClasses[size], 'text-red-500')} />,
          text: 'Erreur',
          className: 'text-red-600 bg-red-50 border-red-200'
        };
      
      default:
        if (hasUnsavedChanges) {
          return {
            icon: <Save className={cn(sizeClasses[size], 'text-orange-500')} />,
            text: 'Non sauvegardé',
            className: 'text-orange-600 bg-orange-50 border-orange-200'
          };
        }
        return null;
    }
  };

  const content = getContent();
  
  if (!content) return null;

  return (
    <div 
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium transition-all',
        content.className,
        className
      )}
    >
      {content.icon}
      {showText && <span>{content.text}</span>}
    </div>
  );
};

export default SaveIndicator;