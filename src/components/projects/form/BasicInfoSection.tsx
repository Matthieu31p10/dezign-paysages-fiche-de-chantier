
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BasicInfoSectionProps {
  name: string;
  address: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  name,
  address,
  onInputChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du chantier</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={onInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          name="address"
          value={address}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
