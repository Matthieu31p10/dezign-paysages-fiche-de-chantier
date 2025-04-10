
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProjectInfo } from '@/types/models';

interface ContractSectionProps {
  contract: ProjectInfo['contract'];
  onContractChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ContractSection: React.FC<ContractSectionProps> = ({
  contract,
  onContractChange,
}) => {
  return (
    <div className="space-y-2">
      <Label>Contrat</Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contractDetails">Détails du contrat</Label>
          <Textarea
            id="contractDetails"
            name="details"
            value={contract.details}
            onChange={onContractChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contractDocumentUrl">URL du document</Label>
          <Input
            id="contractDocumentUrl"
            name="documentUrl"
            type="url"
            value={contract.documentUrl || ''}
            onChange={onContractChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ContractSection;
