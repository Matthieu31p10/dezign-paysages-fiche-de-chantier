
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

const TabsHeader: React.FC = () => {
  return (
    <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-6 gap-1">
      <TabsTrigger value="planning" className="text-sm">Planning</TabsTrigger>
      <TabsTrigger value="passages" className="text-sm">Passages</TabsTrigger>
      <TabsTrigger value="distribution" className="text-sm">Répartition</TabsTrigger>
      <TabsTrigger value="teams" className="text-sm">Équipes</TabsTrigger>
      <TabsTrigger value="last-visits" className="text-sm">Derniers passages</TabsTrigger>
      <TabsTrigger value="configuration" className="text-sm">Configuration</TabsTrigger>
    </TabsList>
  );
};

export default TabsHeader;
