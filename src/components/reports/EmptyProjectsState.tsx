
import { Card, CardContent } from '@/components/ui/card';

const EmptyProjectsState = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-center text-muted-foreground">
          Aucun chantier trouvé pour cette équipe
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyProjectsState;
