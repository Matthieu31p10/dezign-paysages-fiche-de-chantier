
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  progress?: number;
  supplementalValue?: string;
}

const StatCard = ({ title, value, subtitle, progress, supplementalValue }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">
          {value}
          {supplementalValue && (
            <span className="text-xs font-normal text-muted-foreground ml-2">
              / {supplementalValue}
            </span>
          )}
        </div>
        {progress !== undefined && (
          <div className="w-full bg-secondary rounded-full h-1 mt-2">
            <div
              className="bg-primary h-1 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
