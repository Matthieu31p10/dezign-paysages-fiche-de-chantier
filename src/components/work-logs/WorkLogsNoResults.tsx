
import { Calendar } from 'lucide-react';

const WorkLogsNoResults = () => {
  return (
    <div className="text-center py-12">
      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h2 className="text-xl font-medium mb-2">Aucune fiche trouvée</h2>
      <p className="text-muted-foreground">
        Aucune fiche de suivi ne correspond aux critères sélectionnés.
      </p>
    </div>
  );
};

export default WorkLogsNoResults;
