
import React from 'react';
import { Button } from '@/components/ui/button';

interface CancelButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <Button 
      type="button" 
      variant="outline" 
      onClick={onClick}
      disabled={disabled}
    >
      Annuler
    </Button>
  );
};

export default CancelButton;
