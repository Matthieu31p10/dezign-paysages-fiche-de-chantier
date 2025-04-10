
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AdditionalInfoSectionProps {
  additionalInfo: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  additionalInfo,
  onInputChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="additionalInfo">Informations complémentaires</Label>
      <Textarea
        id="additionalInfo"
        name="additionalInfo"
        value={additionalInfo}
        onChange={onInputChange}
      />
    </div>
  );
};

export default AdditionalInfoSection;
