
import React from 'react';
import BlankWorksheetListWrapper from './list/BlankWorksheetListWrapper';

interface BlankWorkSheetListProps {
  onCreateNew: () => void;
  onEdit?: (workLogId: string) => void;
}

const BlankWorkSheetList: React.FC<BlankWorkSheetListProps> = ({ onCreateNew, onEdit }) => {
  return <BlankWorksheetListWrapper onCreateNew={onCreateNew} onEdit={onEdit} />;
};

export default BlankWorkSheetList;
