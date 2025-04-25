
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TimeFilterTabsProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeFilterTabs: React.FC<TimeFilterTabsProps> = ({ value, onChange }) => {
  return (
    <Tabs
      value={value}
      onValueChange={onChange}
      className="w-full"
    >
      <TabsList className="grid grid-cols-4">
        <TabsTrigger value="all">Toutes</TabsTrigger>
        <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
        <TabsTrigger value="week">Cette semaine</TabsTrigger>
        <TabsTrigger value="month">Ce mois</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TimeFilterTabs;
