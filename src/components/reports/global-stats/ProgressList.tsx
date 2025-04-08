
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface ProgressListItem {
  key: string;
  label: string;
  value: string | number;
  progress: number;
}

interface ProgressListProps {
  title: ReactNode;
  icon?: ReactNode;
  items: ProgressListItem[];
  emptyMessage?: string;
}

const ProgressList = ({ title, icon, items, emptyMessage = "Aucune donnée disponible" }: ProgressListProps) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          {icon && <span className="mr-2 text-primary">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.key} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm truncate max-w-[70%]">{item.label}</span>
                  <Badge variant="outline" className="bg-brand-50 text-brand-700">
                    {item.value}
                  </Badge>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, item.progress)}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              {emptyMessage}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressList;
