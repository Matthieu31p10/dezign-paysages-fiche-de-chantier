
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CancelButtonProps {
  onClick: () => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick }) => {
  return (
    <Button 
      type="button" 
      variant="outline" 
      onClick={onClick}
      className="flex items-center gap-1"
    >
      <X className="h-4 w-4" />
      <span>Annuler</span>
    </Button>
  );
};

export default CancelButton;
