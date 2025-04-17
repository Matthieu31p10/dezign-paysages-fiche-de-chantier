
import React from 'react';
import { ProjectInfo } from '@/types/models';
import { WorkLog } from '@/types/models';
import { Clock, AlertCircle, CheckSquare } from 'lucide-react';
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
    <Card className="bg-gradient-to-r from-green-50 to-white border-green-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-green-800">Informations sur le chantier</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Clock className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-700">Durée prévue</h4>
              <p className="text-lg font-bold text-green-800">{project.visitDuration} heures</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <CheckSquare className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-700">Visites annuelles</h4>
              <p className="text-lg font-bold text-green-800">{project.annualVisits}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-700">Écart du temps de passage</h4>
              <p className={`text-lg font-bold ${timeDeviationClass}`}>
                {timeDeviation}
              </p>
              <p className="text-xs text-green-600">
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
