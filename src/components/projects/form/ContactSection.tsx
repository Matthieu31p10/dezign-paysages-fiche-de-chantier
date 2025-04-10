
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ProjectInfo } from '@/types/models';

interface ContactSectionProps {
  contact: ProjectInfo['contact'];
  onContactChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  contact,
  onContactChange,
}) => {
  return (
    <div className="space-y-2">
      <Label>Contact</Label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactName">Nom du contact</Label>
          <Input
            id="contactName"
            name="name"
            value={contact.name || ''}
            onChange={onContactChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Téléphone</Label>
          <Input
            id="contactPhone"
            name="phone"
            type="tel"
            value={contact.phone}
            onChange={onContactChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email</Label>
          <Input
            id="contactEmail"
            name="email"
            type="email"
            value={contact.email}
            onChange={onContactChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
