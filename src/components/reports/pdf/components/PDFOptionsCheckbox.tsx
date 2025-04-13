
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface PDFOptionsCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const PDFOptionsCheckbox = ({ id, label, checked, onCheckedChange }: PDFOptionsCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
      />
      <label 
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
};

export default PDFOptionsCheckbox;
