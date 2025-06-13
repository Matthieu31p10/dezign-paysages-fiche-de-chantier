
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

const ScheduleHeader: React.FC = () => {
  const handleGenerateSchedule = () => {
    toast.success("Planning généré avec succès");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agenda des passages</h1>
        <p className="text-gray-600 mt-2">
          Planifiez et visualisez les passages prévus sur vos chantiers
        </p>
      </div>
      
      <Button onClick={handleGenerateSchedule} className="hover:scale-105 transition-transform">
        <CalendarIcon className="mr-2 h-4 w-4" />
        Générer le planning
      </Button>
    </div>
  );
};

export default ScheduleHeader;
