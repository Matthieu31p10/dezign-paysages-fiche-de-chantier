
import React from 'react';
import { ProjectInfo } from '@/types/models';
import { WorkLog } from '@/types/models';
import { Clock, AlertCircle } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface ProjectInfoCardProps {
  project: ProjectInfo;
  timeDeviation: string;
  timeDeviationClass: string;
}

const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({ 
  project, 
  timeDeviation, 
  timeDeviationClass 
}) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Informations sur le chantier</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Durée prévue</h4>
              <p className="text-lg font-bold">{project.visitDuration} heures</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Écart du temps de passage</h4>
              <p className={`text-lg font-bold ${timeDeviationClass}`}>
                {timeDeviation}
              </p>
              <p className="text-xs text-muted-foreground">
                Durée prévue - (heures effectuées / nombre de passages)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfoCard;
