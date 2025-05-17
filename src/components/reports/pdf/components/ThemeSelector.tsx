
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

const ThemeSelector = ({ selectedTheme, onThemeChange }: ThemeSelectorProps) => {
  const themes = [
    { id: 'default', name: 'Default', colorClass: 'bg-blue-500' },
    { id: 'modern', name: 'Modern', colorClass: 'bg-indigo-500' },
    { id: 'professional', name: 'Professional', colorClass: 'bg-slate-800' },
    { id: 'nature', name: 'Nature', colorClass: 'bg-green-700' },
  ];

  return (
    <div className="space-y-3">
      <Label>Style du document</Label>
      <RadioGroup 
        value={selectedTheme} 
        onValueChange={onThemeChange}
        className="grid grid-cols-2 gap-4"
      >
        {themes.map((theme) => (
          <div key={theme.id} className="flex items-center space-x-2">
            <RadioGroupItem value={theme.id} id={`theme-${theme.id}`} className="sr-only" />
            <Label
              htmlFor={`theme-${theme.id}`}
              className={cn(
                "flex items-center gap-2 rounded-lg border-2 p-3 w-full cursor-pointer transition-all",
                selectedTheme === theme.id 
                  ? "border-primary bg-primary/5" 
                  : "border-muted hover:border-muted-foreground/20"
              )}
            >
              <span className={cn("h-4 w-4 rounded-full", theme.colorClass)} />
              <span>{theme.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ThemeSelector;
