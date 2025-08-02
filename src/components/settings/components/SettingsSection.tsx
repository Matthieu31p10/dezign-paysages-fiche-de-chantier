import React, { ReactNode, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SaveIndicator from '@/components/ui/save-indicator';
import { useSaveStatus } from '@/hooks/useSaveStatus';
import { usePerformance } from '@/context/PerformanceContext';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  onSave?: () => Promise<void>;
  className?: string;
  showSaveIndicator?: boolean;
  autoSave?: boolean;
}

/**
 * Section de paramètres avec indicateur de sauvegarde intégré
 */
const SettingsSection = ({
  title,
  description,
  children,
  onSave,
  className,
  showSaveIndicator = true,
  autoSave = true
}: SettingsSectionProps) => {
  const {
    saveStatus,
    hasUnsavedChanges,
    markAsChanged,
    saveNow,
    scheduleAutoSave
  } = useSaveStatus({
    successMessage: `${title} sauvegardé`,
    autoSaveDelay: autoSave ? 2000 : 0
  });

  const { measureRender } = usePerformance();

  // Mesure des performances de rendu
  useEffect(() => {
    const endMeasure = measureRender(`SettingsSection-${title}`);
    return endMeasure;
  });

  const handleChange = () => {
    markAsChanged();
    if (onSave && autoSave) {
      scheduleAutoSave(onSave);
    }
  };

  const handleManualSave = () => {
    if (onSave) {
      saveNow(onSave);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {title}
              {showSaveIndicator && (
                <SaveIndicator 
                  status={saveStatus} 
                  hasUnsavedChanges={hasUnsavedChanges}
                  size="sm"
                />
              )}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          onChange={handleChange}
          onBlur={handleChange}
          onClick={handleChange}
        >
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsSection;