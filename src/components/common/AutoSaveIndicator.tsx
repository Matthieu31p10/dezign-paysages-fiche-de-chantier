import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface AutoSaveIndicatorProps {
  lastSaved?: Date;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  lastSaved,
  isSaving = false,
  hasUnsavedChanges = false
}) => {
  const { supabaseSettings } = useSettings();
  const [timeSinceLastSave, setTimeSinceLastSave] = useState<string>('');

  useEffect(() => {
    if (!lastSaved) return;

    const updateTime = () => {
      const now = new Date();
      const diff = now.getTime() - lastSaved.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
        setTimeSinceLastSave(`il y a ${hours}h`);
      } else if (minutes > 0) {
        setTimeSinceLastSave(`il y a ${minutes}min`);
      } else if (seconds > 0) {
        setTimeSinceLastSave(`il y a ${seconds}s`);
      } else {
        setTimeSinceLastSave('à l\'instant');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [lastSaved]);

  const getVariant = () => {
    if (isSaving) return 'secondary';
    if (hasUnsavedChanges) return 'destructive';
    return 'default';
  };

  const getIcon = () => {
    if (isSaving) return <Loader2 className="h-3 w-3 animate-spin" />;
    if (hasUnsavedChanges) return <CloudOff className="h-3 w-3" />;
    if (supabaseSettings.auto_save_enabled) return <Cloud className="h-3 w-3" />;
    return <Check className="h-3 w-3" />;
  };

  const getText = () => {
    if (isSaving) return 'Sauvegarde...';
    if (hasUnsavedChanges) return 'Modifications non sauvegardées';
    if (lastSaved) return `Sauvegardé ${timeSinceLastSave}`;
    return 'Auto-sauvegarde activée';
  };

  return (
    <Badge variant={getVariant()} className="flex items-center gap-1 text-xs">
      {getIcon()}
      <span>{getText()}</span>
    </Badge>
  );
};

export default AutoSaveIndicator;