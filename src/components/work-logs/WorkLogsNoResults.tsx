
import React from 'react';
import { Calendar } from 'lucide-react';

interface WorkLogsNoResultsProps {
  message?: string;
  title?: string;
}

const WorkLogsNoResults: React.FC<WorkLogsNoResultsProps> = ({
  title = "Aucune fiche trouvée",
  message = "Aucune fiche de suivi ne correspond aux critères sélectionnés."
}) => {
  return (
    <div className="text-center py-12">
      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h2 className="text-xl font-medium mb-2">{title}</h2>
      <p className="text-muted-foreground">
        {message}
      </p>
    </div>
  );
};

export default WorkLogsNoResults;
