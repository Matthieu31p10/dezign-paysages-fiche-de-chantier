
import React from 'react';
import { List, Plus } from 'lucide-react';

interface BlankWorkSheetTabContentProps {
  value: string;
  isEditing?: boolean;
}

const BlankWorkSheetTabContent: React.FC<BlankWorkSheetTabContentProps> = ({ 
  value, 
  isEditing = false 
}) => {
  if (value === 'list') {
    return (
      <>
        <List className="w-4 h-4 mr-2" />
        Liste des fiches
      </>
    );
  }
  
  if (value === 'new') {
    return (
      <>
        <Plus className="w-4 h-4 mr-2" />
        {isEditing ? "Modifier la fiche" : "Nouvelle fiche"}
      </>
    );
  }
  
  return null;
};

export default BlankWorkSheetTabContent;
