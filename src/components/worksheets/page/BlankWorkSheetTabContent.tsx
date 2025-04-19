
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';

interface BlankWorkSheetTabContentProps {
  value: string;
  children: React.ReactNode;
}

const BlankWorkSheetTabContent: React.FC<BlankWorkSheetTabContentProps> = ({ value, children }) => {
  return (
    <TabsContent value={value} className="pt-6">
      {children}
    </TabsContent>
  );
};

export default BlankWorkSheetTabContent;
