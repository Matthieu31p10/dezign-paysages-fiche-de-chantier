import { toast } from 'sonner';

export const useToastService = () => {
  const showSuccess = (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  };

  const showError = (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 6000,
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  };

  const showWarning = (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 5000,
    });
  };

  const showLoading = (message: string, description?: string) => {
    return toast.loading(message, {
      description,
    });
  };

  const dismiss = (toastId: string | number) => {
    toast.dismiss(toastId);
  };

  // Messages prédéfinis pour les actions CRUD
  const workLogMessages = {
    created: () => showSuccess('Fiche créée', 'La fiche a été créée avec succès'),
    updated: () => showSuccess('Fiche modifiée', 'Les modifications ont été sauvegardées'),
    deleted: () => showSuccess('Fiche supprimée', 'La fiche a été supprimée définitivement'),
    error: (action: string) => showError('Erreur', `Impossible de ${action} la fiche`),
  };

  const projectMessages = {
    created: () => showSuccess('Projet créé', 'Le projet a été ajouté avec succès'),
    updated: () => showSuccess('Projet modifié', 'Les modifications ont été sauvegardées'),
    deleted: () => showSuccess('Projet supprimé', 'Le projet a été supprimé définitivement'),
    archived: () => showSuccess('Projet archivé', 'Le projet et ses fiches ont été archivés'),
    unarchived: () => showSuccess('Projet désarchivé', 'Le projet et ses fiches sont actifs'),
    error: (action: string) => showError('Erreur', `Impossible de ${action} le projet`),
  };

  const teamMessages = {
    created: () => showSuccess('Équipe créée', 'L\'équipe a été ajoutée avec succès'),
    updated: () => showSuccess('Équipe modifiée', 'Les modifications ont été sauvegardées'),
    deleted: () => showSuccess('Équipe supprimée', 'L\'équipe a été supprimée définitivement'),
    error: (action: string) => showError('Erreur', `Impossible de ${action} l'équipe`),
  };

  const personnelMessages = {
    created: () => showSuccess('Personnel ajouté', 'Le membre du personnel a été ajouté'),
    updated: () => showSuccess('Personnel modifié', 'Les informations ont été mises à jour'),
    deleted: () => showSuccess('Personnel supprimé', 'Le membre a été retiré de l\'équipe'),
    error: (action: string) => showError('Erreur', `Impossible de ${action} le personnel`),
  };

  const scheduleMessages = {
    updated: () => showSuccess('Planning mis à jour', 'Les modifications ont été sauvegardées'),
    distributed: () => showSuccess('Distribution appliquée', 'Le planning a été généré automatiquement'),
    error: (action: string) => showError('Erreur planning', `Impossible de ${action} le planning`),
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismiss,
    workLogMessages,
    projectMessages,
    teamMessages,
    personnelMessages,
    scheduleMessages,
  };
};