import { TrendingUp, Calendar, FileBarChart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReportsHeaderProps {
  totalProjects: number;
  totalWorkLogs: number;
  currentPeriod: string;
}

const ReportsHeader = ({ totalProjects, totalWorkLogs, currentPeriod }: ReportsHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
          <FileBarChart className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Bilans & Rapports
          </h1>
          <p className="text-muted-foreground">
            Analysez les performances et statistiques de vos chantiers
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chantiers actifs</p>
                <p className="text-2xl font-bold text-primary">{totalProjects}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-chart-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fiches de suivi</p>
                <p className="text-2xl font-bold text-chart-2">{totalWorkLogs}</p>
              </div>
              <FileBarChart className="h-8 w-8 text-chart-2/60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-chart-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Période</p>
                <Badge variant="secondary" className="mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {currentPeriod}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsHeader;