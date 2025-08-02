import { toast } from 'sonner';

/**
 * Gestionnaire centralisé des notifications avec des méthodes prêtes à l'emploi
 */
export class ToastManager {
  /**
   * Notifications de sauvegarde
   */
  static save = {
    success: (item: string = 'Élément') => 
      toast.success(`${item} sauvegardé avec succès`, {
        description: 'Vos modifications ont été enregistrées',
      }),
    
    error: (item: string = 'Élément') => 
      toast.error(`Erreur lors de la sauvegarde de ${item.toLowerCase()}`, {
        description: 'Veuillez réessayer dans quelques instants',
      }),
    
    loading: (item: string = 'élément') => 
      toast.loading(`Sauvegarde de ${item.toLowerCase()}...`),
  };

  /**
   * Notifications CRUD
   */
  static create = {
    success: (item: string) => 
      toast.success(`${item} créé avec succès`),
    
    error: (item: string) => 
      toast.error(`Erreur lors de la création de ${item.toLowerCase()}`),
  };

  static update = {
    success: (item: string) => 
      toast.success(`${item} mis à jour avec succès`),
    
    error: (item: string) => 
      toast.error(`Erreur lors de la mise à jour de ${item.toLowerCase()}`),
  };

  static delete = {
    success: (item: string) => 
      toast.success(`${item} supprimé avec succès`),
    
    error: (item: string) => 
      toast.error(`Erreur lors de la suppression de ${item.toLowerCase()}`),
    
    confirm: (item: string, onConfirm: () => void) => 
      toast('Confirmation de suppression', {
        description: `Êtes-vous sûr de vouloir supprimer ${item.toLowerCase()} ?`,
        action: {
          label: 'Supprimer',
          onClick: onConfirm
        },
        cancel: {
          label: 'Annuler',
          onClick: () => {}
        }
      }),
  };

  /**
   * Notifications spécifiques aux utilisateurs
   */
  static user = {
    loginSuccess: (name?: string) => 
      toast.success(`Connexion réussie${name ? ` - Bienvenue ${name}` : ''}`),
    
    loginError: () => 
      toast.error('Erreur de connexion', {
        description: 'Vérifiez vos identifiants et réessayez',
      }),
    
    logoutSuccess: () => 
      toast.success('Déconnexion réussie'),
    
    permissionDenied: () => 
      toast.error('Accès refusé', {
        description: 'Vous n\'avez pas les permissions nécessaires',
      }),
  };

  /**
   * Notifications de fichiers
   */
  static file = {
    uploadSuccess: (filename?: string) => 
      toast.success(`Fichier téléchargé${filename ? ` : ${filename}` : ''}`),
    
    uploadError: (filename?: string) => 
      toast.error(`Erreur de téléchargement${filename ? ` : ${filename}` : ''}`),
    
    downloadStart: (filename?: string) => 
      toast.loading(`Téléchargement en cours${filename ? ` : ${filename}` : ''}...`),
    
    exportSuccess: (type: string) => 
      toast.success(`Export ${type} réussi`),
  };

  /**
   * Notifications réseau
   */
  static network = {
    offline: () => 
      toast.error('Connexion perdue', {
        description: 'Vérifiez votre connexion internet',
      }),
    
    online: () => 
      toast.success('Connexion rétablie'),
    
    syncSuccess: () => 
      toast.success('Synchronisation réussie'),
    
    syncError: () => 
      toast.error('Erreur de synchronisation'),
  };

  /**
   * Notifications génériques
   */
  static generic = {
    success: (message: string, description?: string) => 
      toast.success(message, { description }),
    
    error: (message: string, description?: string) => 
      toast.error(message, { description }),
    
    info: (message: string, description?: string) => 
      toast.info(message, { description }),
    
    warning: (message: string, description?: string) => 
      toast.warning(message, { description }),
    
    loading: (message: string) => 
      toast.loading(message),
  };

  /**
   * Notifications avec actions
   */
  static withAction = (
    message: string,
    actionLabel: string,
    onAction: () => void,
    description?: string
  ) => {
    toast(message, {
      description,
      action: {
        label: actionLabel,
        onClick: onAction
      }
    });
  };

  /**
   * Notifications avec promesse
   */
  static promise = async <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ): Promise<T> => {
    return await toast.promise(promise, messages) as T;
  };
}

export default ToastManager;