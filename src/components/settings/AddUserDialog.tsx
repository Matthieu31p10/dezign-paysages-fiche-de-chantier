
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ isOpen, onOpenChange }) => {
  const { settings, updateSettings } = useApp();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    drivingLicense: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      username: formData.email,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      drivingLicense: formData.drivingLicense,
      role: 'user' as const,
      password: 'password123', // Adding default password
      createdAt: new Date() // Adding current date for createdAt
    };

    const updatedUsers = [...(settings.users || []), newUser];
    updateSettings({ ...settings, users: updatedUsers });
    
    toast.success("Utilisateur ajouté avec succès");
    onOpenChange(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      drivingLicense: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Prénom"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Nom"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@exemple.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="06 XX XX XX XX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Poste</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              placeholder="Poste occupé"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="drivingLicense">Permis</Label>
            <Input
              id="drivingLicense"
              value={formData.drivingLicense}
              onChange={(e) => setFormData(prev => ({ ...prev, drivingLicense: e.target.value }))}
              placeholder="Type de permis"
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              <UserPlus className="w-4 h-4 mr-2" />
              Ajouter l'utilisateur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
