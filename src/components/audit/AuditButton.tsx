import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { AuditHistoryDialog } from './AuditHistoryDialog';

interface AuditButtonProps {
  entityType: string;
  entityId: string;
  onRestore?: (versionData: Record<string, any>) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export const AuditButton: React.FC<AuditButtonProps> = ({
  entityType,
  entityId,
  onRestore,
  variant = 'outline',
  size = 'sm'
}) => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowHistory(true)}
      >
        <History className="h-4 w-4 mr-1" />
        Historique
      </Button>

      <AuditHistoryDialog
        open={showHistory}
        onOpenChange={setShowHistory}
        entityType={entityType}
        entityId={entityId}
        onRestore={onRestore}
      />
    </>
  );
};