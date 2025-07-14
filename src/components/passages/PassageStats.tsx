import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PassageStatsProps {
  totalPassages: number;
  lastPassageDate: Date | null;
  daysSinceLastPassage: number | null;
}

export const PassageStats: React.FC<PassageStatsProps> = ({
  totalPassages,
  lastPassageDate,
  daysSinceLastPassage
}) => {
  const getDaysBadgeVariant = (days: number) => {
    if (days === 0) return 'default';
    if (days <= 7) return 'secondary';
    if (days <= 30) return 'outline';
    return 'destructive';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-background border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total des passages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalPassages}</div>
        </CardContent>
      </Card>

      <Card className="bg-background border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Dernier passage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {lastPassageDate 
              ? format(lastPassageDate, 'd MMM yyyy', { locale: fr })
              : 'Aucun'
            }
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-background border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Écart depuis le dernier passage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start gap-3">
            {daysSinceLastPassage !== null ? (
              <>
                <div className="flex items-center gap-3">
                  <div className={`text-4xl font-bold ${
                    daysSinceLastPassage === 0 ? 'text-green-600' :
                    daysSinceLastPassage <= 7 ? 'text-blue-600' :
                    daysSinceLastPassage <= 30 ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {daysSinceLastPassage}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-medium text-foreground">
                      jour{daysSinceLastPassage > 1 ? 's' : ''}
                    </span>
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <Badge 
                  variant={getDaysBadgeVariant(daysSinceLastPassage)} 
                  className={`text-sm px-3 py-1 ${
                    daysSinceLastPassage === 0 ? 'bg-green-600 text-white' :
                    daysSinceLastPassage <= 7 ? 'bg-blue-600 text-white' :
                    daysSinceLastPassage <= 30 ? 'bg-orange-600 text-white' :
                    'bg-red-600 text-white'
                  }`}
                >
                  {daysSinceLastPassage === 0 ? "Aujourd'hui" : 
                   daysSinceLastPassage === 1 ? "Hier" : 
                   daysSinceLastPassage <= 7 ? "Récent" :
                   daysSinceLastPassage <= 30 ? "À surveiller" :
                   "Attention requise"}
                </Badge>
              </>
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">-</span>
            )}
          </div>
          {/* Indicateur visuel selon l'urgence */}
          {daysSinceLastPassage !== null && daysSinceLastPassage > 30 && (
            <div className="absolute top-0 right-0 w-2 h-full bg-red-500 opacity-30"></div>
          )}
          {daysSinceLastPassage !== null && daysSinceLastPassage > 7 && daysSinceLastPassage <= 30 && (
            <div className="absolute top-0 right-0 w-2 h-full bg-orange-500 opacity-30"></div>
          )}
          {daysSinceLastPassage !== null && daysSinceLastPassage <= 7 && (
            <div className="absolute top-0 right-0 w-2 h-full bg-green-500 opacity-30"></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};