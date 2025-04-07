
import React from 'react';
import { useBlankWorksheetList } from './hooks/useBlankWorksheetList';
import BlankWorksheetListContent from './BlankWorksheetListContent';

interface BlankWorkSheetListWrapperProps {
  onCreateNew: () => void;
  onEdit?: (workLogId: string) => void;
}

const BlankWorksheetListWrapper: React.FC<BlankWorkSheetListWrapperProps> = ({ 
  onCreateNew, 
  onEdit 
}) => {
  const state = useBlankWorksheetList();
  
  return (
    <BlankWorksheetListContent
      onCreateNew={onCreateNew}
      onEdit={onEdit}
      state={state}
    />
  );
};

export default BlankWorksheetListWrapper;
