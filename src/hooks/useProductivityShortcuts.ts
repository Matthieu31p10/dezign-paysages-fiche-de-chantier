import { useKeyboardShortcuts, createCommonShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UseProductivityShortcutsProps {
  onNewWorkLog?: () => void;
  onNewWorksheet?: () => void;
  onSearch?: () => void;
  onDuplicate?: () => void;
  onSave?: () => void;
  onTemplateMenu?: () => void;
  enabled?: boolean;
}

export const useProductivityShortcuts = ({
  onNewWorkLog,
  onNewWorksheet,
  onSearch,
  onDuplicate,
  onSave,
  onTemplateMenu,
  enabled = true
}: UseProductivityShortcutsProps) => {
  const navigate = useNavigate();

  const productivityShortcuts = [
    // Navigation rapide
    {
      key: '1',
      ctrlKey: true,
      description: 'Aller au tableau de bord',
      action: () => {
        navigate('/');
        toast.success('Navigation: Tableau de bord');
      }
    },
    {
      key: '2',
      ctrlKey: true,
      description: 'Aller aux projets',
      action: () => {
        navigate('/projects');
        toast.success('Navigation: Projets');
      }
    },
    {
      key: '3',
      ctrlKey: true,
      description: 'Aller aux fiches de suivi',
      action: () => {
        navigate('/work-logs');
        toast.success('Navigation: Fiches de suivi');
      }
    },
    {
      key: '4',
      ctrlKey: true,
      description: 'Aller au personnel',
      action: () => {
        navigate('/personnel');
        toast.success('Navigation: Personnel');
      }
    },
    // Actions rapides
    {
      key: 'w',
      ctrlKey: true,
      description: 'Nouvelle fiche de suivi',
      action: () => {
        if (onNewWorkLog) {
          onNewWorkLog();
        } else {
          navigate('/work-logs/new');
        }
        toast.success('Nouvelle fiche de suivi');
      }
    },
    {
      key: 'b',
      ctrlKey: true,
      description: 'Nouvelle fiche vierge',
      action: () => {
        if (onNewWorksheet) {
          onNewWorksheet();
        } else {
          navigate('/blank-worksheets/new');
        }
        toast.success('Nouvelle fiche vierge');
      }
    },
    {
      key: 'd',
      ctrlKey: true,
      description: 'Dupliquer la fiche actuelle',
      action: () => {
        if (onDuplicate) {
          onDuplicate();
        } else {
          toast.info('Duplication non disponible sur cette page');
        }
      }
    },
    {
      key: 't',
      ctrlKey: true,
      description: 'Ouvrir le menu des templates',
      action: () => {
        if (onTemplateMenu) {
          onTemplateMenu();
        } else {
          toast.info('Templates non disponibles sur cette page');
        }
      }
    },
    // Raccourcis utilitaires
    {
      key: 'F9',
      description: 'Afficher tous les raccourcis',
      action: () => {
        showShortcutsHelp();
      },
      preventDefault: false
    }
  ];

  const commonShortcuts = createCommonShortcuts({
    onSearch,
    onSave,
    onRefresh: () => {
      window.location.reload();
      toast.success('Page actualisée');
    }
  });

  const allShortcuts = [...productivityShortcuts, ...commonShortcuts];

  const { formatShortcut } = useKeyboardShortcuts({
    shortcuts: allShortcuts,
    enabled
  });

  const showShortcutsHelp = () => {
    const helpText = allShortcuts
      .map(shortcut => `${formatShortcut(shortcut)}: ${shortcut.description}`)
      .join('\n');
    
    console.log('🚀 Raccourcis clavier disponibles:\n' + helpText);
    toast.info('Raccourcis affichés dans la console (F12)', {
      description: 'Appuyez sur F12 pour voir tous les raccourcis disponibles'
    });
  };

  return {
    shortcuts: allShortcuts,
    formatShortcut,
    showShortcutsHelp
  };
};