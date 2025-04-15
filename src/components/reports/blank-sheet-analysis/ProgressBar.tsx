
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  value: number;
  label?: string;
  count?: number;
  total?: number;
  className?: string;
}

const ProgressBar = ({ value, label, count, total, className = "h-2 mt-1" }: ProgressBarProps) => {
  return (
    <div className="space-y-1">
      {(label || (count !== undefined && total !== undefined)) && (
        <div className="flex justify-between text-xs text-muted-foreground">
          {label && <span>{label}</span>}
          {count !== undefined && total !== undefined && (
            <span>{count} {total > 0 ? `(${Math.round((count / total) * 100)}%)` : ''}</span>
          )}
        </div>
      )}
      <Progress value={value} className={className} />
    </div>
  );
};

export default ProgressBar;
