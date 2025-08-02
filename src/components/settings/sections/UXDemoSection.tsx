import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import SaveIndicator from '@/components/ui/save-indicator';
import SettingsSection from '@/components/settings/components/SettingsSection';
import ToastManager from '@/components/common/ToastManager';
import { useSaveStatus } from '@/hooks/useSaveStatus';
import { Trash2, RefreshCw, Download, Shield } from 'lucide-react';

/**
 * Section de démonstration des améliorations UX
 */
const UXDemoSection = () => {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'delete' | 'archive' | 'reset';
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: 'delete',
    title: '',
    description: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    saveStatus,
    hasUnsavedChanges,
    markAsChanged,
    saveNow
  } = useSaveStatus({
    successMessage: 'Démonstration sauvegardée',
    showToasts: true
  });

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Simuler une sauvegarde réussie
  };

  const handleDelete = () => {
    setConfirmDialog({
      isOpen: true,
      type: 'delete',
      title: 'Supprimer les données',
      description: 'Cette action est irréversible. Toutes les données seront définitivement supprimées.'
    });
  };

  const handleReset = () => {
    setConfirmDialog({
      isOpen: true,
      type: 'reset',
      title: 'Réinitialiser les paramètres',
      description: 'Les paramètres seront remis à leurs valeurs par défaut.'
    });
  };

  const confirmAction = async () => {
    setIsLoading(true);
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
    
    try {
      // Simuler une action qui prend du temps
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (confirmDialog.type === 'delete') {
        ToastManager.delete.success('Données');
      } else if (confirmDialog.type === 'reset') {
        ToastManager.generic.success('Paramètres réinitialisés');
      }
    } catch (error) {
      ToastManager.generic.error('Erreur lors de l\'action');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    const exportPromise = new Promise((resolve) => {
      setTimeout(() => resolve('Export terminé'), 3000);
    });

    await ToastManager.promise(exportPromise, {
      loading: 'Export en cours...',
      success: 'Export terminé avec succès',
      error: 'Erreur lors de l\'export'
    });
  };

  const showNetworkDemo = () => {
    ToastManager.network.offline();
    setTimeout(() => {
      ToastManager.network.online();
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <SettingsSection 
        title="Démonstration UX"
        description="Testez les nouvelles fonctionnalités d'expérience utilisateur"
        onSave={handleSave}
        showSaveIndicator={true}
      >
        <div className="space-y-6">
          {/* Section État de sauvegarde */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Indicateurs de sauvegarde
            </h4>
            <div className="flex flex-wrap gap-2">
              <SaveIndicator status="idle" showText={true} />
              <SaveIndicator status="saving" showText={true} />
              <SaveIndicator status="saved" showText={true} />
              <SaveIndicator status="error" showText={true} />
              <SaveIndicator status="idle" hasUnsavedChanges={true} showText={true} />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAsChanged}
              >
                Marquer comme modifié
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => saveNow(handleSave)}
                disabled={saveStatus === 'saving'}
              >
                Sauvegarder maintenant
              </Button>
            </div>
          </div>

          {/* Section Notifications */}
          <div className="space-y-3">
            <h4 className="font-medium">Notifications Toast</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => ToastManager.generic.success('Succès !', 'Opération réussie')}
              >
                Toast Succès
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => ToastManager.generic.error('Erreur !', 'Quelque chose a mal tourné')}
              >
                Toast Erreur
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => ToastManager.user.permissionDenied()}
              >
                Permission refusée
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={showNetworkDemo}
              >
                Simulation réseau
              </Button>
            </div>
          </div>

          {/* Section Actions dangereuses */}
          <div className="space-y-3">
            <h4 className="font-medium">Actions avec confirmation</h4>
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleReset}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Réinitialiser
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
                disabled={isLoading}
              >
                <Download className="h-4 w-4 mr-1" />
                Export avec progress
              </Button>
            </div>
          </div>

          {/* Affichage du statut actuel */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm space-y-1">
              <div>Statut sauvegarde: <strong>{saveStatus}</strong></div>
              <div>Modifications non sauvegardées: <strong>{hasUnsavedChanges ? 'Oui' : 'Non'}</strong></div>
              <div>Action en cours: <strong>{isLoading ? 'Oui' : 'Non'}</strong></div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Dialog de confirmation */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmAction}
        title={confirmDialog.title}
        description={confirmDialog.description}
        type={confirmDialog.type === 'delete' ? 'delete' : 'warning'}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UXDemoSection;