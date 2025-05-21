
import React from 'react';
import ThemeSelector from '@/components/reports/pdf/components/ThemeSelector';

interface StyleTabProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

const StyleTab: React.FC<StyleTabProps> = ({ selectedTheme, onThemeChange }) => {
  return (
    <div className="py-4">
      <ThemeSelector 
        selectedTheme={selectedTheme} 
        onThemeChange={onThemeChange}
      />
    </div>
  );
};

export default StyleTab;
