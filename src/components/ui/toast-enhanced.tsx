import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

// Enhanced toast with semantic design tokens
export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      icon: <CheckCircle className="h-4 w-4" />,
      classNames: {
        toast: "border-l-4 border-l-passage-success bg-passage-success/10",
        title: "text-passage-success font-medium",
        description: "text-muted-foreground",
        icon: "text-passage-success"
      }
    });
  },

  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      icon: <AlertCircle className="h-4 w-4" />,
      classNames: {
        toast: "border-l-4 border-l-destructive bg-destructive/10",
        title: "text-destructive font-medium",
        description: "text-muted-foreground",
        icon: "text-destructive"
      }
    });
  },

  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      icon: <AlertTriangle className="h-4 w-4" />,
      classNames: {
        toast: "border-l-4 border-l-passage-warning bg-passage-warning/10",
        title: "text-passage-warning font-medium",
        description: "text-muted-foreground",
        icon: "text-passage-warning"
      }
    });
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      icon: <Info className="h-4 w-4" />,
      classNames: {
        toast: "border-l-4 border-l-primary bg-primary/10",
        title: "text-primary font-medium",
        description: "text-muted-foreground",
        icon: "text-primary"
      }
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
      classNames: {
        toast: "border-l-4",
        title: "font-medium"
      }
    });
  },

  // Action toast with buttons
  action: (
    message: string,
    action: {
      label: string;
      onClick: () => void;
    },
    options?: {
      description?: string;
      cancel?: {
        label: string;
        onClick?: () => void;
      };
    }
  ) => {
    sonnerToast(message, {
      description: options?.description,
      action: {
        label: action.label,
        onClick: action.onClick,
      },
      cancel: options?.cancel ? {
        label: options.cancel.label,
        onClick: options.cancel.onClick,
      } : undefined,
      classNames: {
        toast: "border-l-4 border-l-primary bg-primary/10",
        title: "text-primary font-medium",
        description: "text-muted-foreground",
        actionButton: "bg-primary text-primary-foreground hover:bg-primary/90",
        cancelButton: "bg-muted text-muted-foreground hover:bg-muted/80"
      }
    });
  },

  // Loading state that can be updated
  loading: (message: string, id?: string) => {
    return sonnerToast.loading(message, {
      id,
      classNames: {
        toast: "border-l-4 border-l-primary bg-primary/10",
        title: "text-primary font-medium"
      }
    });
  },

  // Update existing toast
  update: (id: string | number, message: string, options?: Parameters<typeof sonnerToast>[1]) => {
    sonnerToast(message, { ...options, id });
  },

  // Dismiss toast
  dismiss: (id?: string | number) => {
    sonnerToast.dismiss(id);
  },

  // Custom toast with full control
  custom: (jsx: (id: string | number) => React.ReactElement, options?: Parameters<typeof sonnerToast>[1]) => {
    return sonnerToast.custom(jsx, options);
  }
};

// Convenience methods for common patterns
export const ToastManager = {
  // Auth related toasts
  auth: {
    loginSuccess: () => toast.success("Connexion réussie", "Vous êtes maintenant connecté"),
    loginError: () => toast.error("Erreur de connexion", "Vérifiez vos identifiants"),
    logoutSuccess: () => toast.success("Déconnexion réussie", "À bientôt !"),
    sessionExpired: () => toast.warning("Session expirée", "Veuillez vous reconnecter"),
  },

  // Data operations
  data: {
    saveSuccess: (item: string) => toast.success(`${item} sauvegardé`, "Les modifications ont été enregistrées"),
    saveError: (item: string) => toast.error(`Erreur de sauvegarde`, `Impossible de sauvegarder ${item.toLowerCase()}`),
    deleteSuccess: (item: string) => toast.success(`${item} supprimé`, "L'élément a été supprimé avec succès"),
    deleteError: (item: string) => toast.error(`Erreur de suppression`, `Impossible de supprimer ${item.toLowerCase()}`),
  },

  // Network related
  network: {
    offline: () => toast.warning("Connexion perdue", "Vous êtes actuellement hors ligne"),
    online: () => toast.success("Connexion rétablie", "Vous êtes de nouveau en ligne"),
    timeout: () => toast.error("Délai d'attente dépassé", "La requête a pris trop de temps"),
  },

  // Generic operations
  generic: {
    success: (message: string, description?: string) => toast.success(message, description),
    error: (message: string, description?: string) => toast.error(message, description),
    warning: (message: string, description?: string) => toast.warning(message, description),
    info: (message: string, description?: string) => toast.info(message, description),
  },

  // Permissions
  permission: {
    denied: () => toast.error("Permission refusée", "Vous n'avez pas les droits nécessaires"),
    granted: () => toast.success("Permission accordée", "Vous pouvez maintenant accéder à cette fonctionnalité"),
  }
};