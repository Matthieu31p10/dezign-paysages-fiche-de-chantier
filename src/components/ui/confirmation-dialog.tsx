import React, { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, Archive, UserX } from 'lucide-react';

export type ConfirmationType = 'delete' | 'archive' | 'destructive' | 'warning' | 'info';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
  isLoading?: boolean;
  children?: ReactNode;
}

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = 'Annuler',
  type = 'warning',
  isLoading = false,
  children
}: ConfirmationDialogProps) => {
  const getConfig = () => {
    switch (type) {
      case 'delete':
        return {
          icon: <Trash2 className="h-6 w-6 text-red-600" />,
          confirmText: confirmText || 'Supprimer',
          confirmVariant: 'destructive' as const,
          iconBg: 'bg-red-100'
        };
      
      case 'archive':
        return {
          icon: <Archive className="h-6 w-6 text-orange-600" />,
          confirmText: confirmText || 'Archiver',
          confirmVariant: 'default' as const,
          iconBg: 'bg-orange-100'
        };
      
      case 'destructive':
        return {
          icon: <UserX className="h-6 w-6 text-red-600" />,
          confirmText: confirmText || 'Confirmer',
          confirmVariant: 'destructive' as const,
          iconBg: 'bg-red-100'
        };
      
      case 'warning':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
          confirmText: confirmText || 'Continuer',
          confirmVariant: 'default' as const,
          iconBg: 'bg-yellow-100'
        };
      
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6 text-blue-600" />,
          confirmText: confirmText || 'Confirmer',
          confirmVariant: 'default' as const,
          iconBg: 'bg-blue-100'
        };
    }
  };

  const config = getConfig();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${config.iconBg}`}>
              {config.icon}
            </div>
            <div className="flex-1">
              <AlertDialogTitle>{title}</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="mt-3">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {children && (
          <div className="py-4">
            {children}
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={config.confirmVariant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Traitement...</span>
              </div>
            ) : (
              config.confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;