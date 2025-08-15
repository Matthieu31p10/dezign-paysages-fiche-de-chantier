import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Plus,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Users
} from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Nouveau projet',
      description: 'Créer un nouveau chantier',
      icon: Plus,
      color: 'bg-primary text-primary-foreground',
      onClick: () => navigate('/projects/new')
    },
    {
      title: 'Fiche de suivi',
      description: 'Enregistrer une intervention',
      icon: FileText,
      color: 'bg-secondary text-secondary-foreground',
      onClick: () => navigate('/worklogs/new')
    },
    {
      title: 'Planning',
      description: 'Voir le planning',
      icon: Calendar,
      color: 'bg-blue-500 text-white',
      onClick: () => navigate('/schedule')
    },
    {
      title: 'Rapports',
      description: 'Analyser les performances',
      icon: BarChart3,
      color: 'bg-green-500 text-white',
      onClick: () => navigate('/reports')
    },
    {
      title: 'Équipes',
      description: 'Gérer les équipes',
      icon: Users,
      color: 'bg-purple-500 text-white',
      onClick: () => navigate('/teams')
    },
    {
      title: 'Paramètres',
      description: 'Configuration',
      icon: Settings,
      color: 'bg-gray-500 text-white',
      onClick: () => navigate('/settings')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
        <CardDescription>
          Accès direct aux fonctionnalités principales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover-scale"
              onClick={action.onClick}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.color}`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;