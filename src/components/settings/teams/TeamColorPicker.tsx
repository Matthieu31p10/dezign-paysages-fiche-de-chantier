
import React from 'react';
import { TEAM_COLORS } from './teamColors';

interface TeamColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  size?: 'sm' | 'md';
}

const TeamColorPicker: React.FC<TeamColorPickerProps> = ({
  selectedColor,
  onColorSelect,
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';

  return (
    <div className="grid grid-cols-10 gap-1">
      {TEAM_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={`${sizeClasses} rounded-full border-2 hover:scale-110 transition-transform ${
            selectedColor === color ? 'border-gray-400 ring-2 ring-gray-300' : 'border-gray-200'
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
        />
      ))}
    </div>
  );
};

export default TeamColorPicker;
