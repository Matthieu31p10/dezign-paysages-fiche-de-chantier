
import { useApp } from '@/context/AppContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, UserRole } from '@/types/models';
import { useState } from 'react';
import { toast } from 'sonner';

interface EditUserDialogProps {
  user: User;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserChange: (user: User | null) => void;
}

const EditUserDialog = ({ user, isOpen, onOpenChange, onUserChange }: EditUserDialogProps) => {
  const { updateUser } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const handleEditUser = () => {
    setValidationError('');
    
    if (!user.username.trim()) {
      setValidationError('L\'identifiant est requis');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      updateUser(user);
      onOpenChange(false);
      onUserChange(null);
      toast.success('Utilisateur mis à jour avec succès');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Erreur lors de la mise à jour de l\'utilisateur');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier un utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations et les prérogatives de l'utilisateur
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {validationError && (
            <div className="text-red-500 text-sm">{validationError}</div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-username" className="text-right">
              Identifiant
            </Label>
            <Input
              id="edit-username"
              value={user.username}
              onChange={(e) => onUserChange({...user, username: e.target.value})}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-password" className="text-right">
              Mot de passe
            </Label>
            <Input
              id="edit-password"
              type="password"
              value={user.password}
              onChange={(e) => onUserChange({...user, password: e.target.value})}
              className="col-span-3"
              placeholder="Laisser vide pour ne pas changer"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Nom & Prénom
            </Label>
            <Input
              id="edit-name"
              value={user.name || ''}
              onChange={(e) => onUserChange({...user, name: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-position" className="text-right">
              Poste
            </Label>
            <Input
              id="edit-position"
              value={user.position || ''}
              onChange={(e) => onUserChange({...user, position: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-license" className="text-right">
              Permis
            </Label>
            <Input
              id="edit-license"
              value={user.drivingLicense || ''}
              onChange={(e) => onUserChange({...user, drivingLicense: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-phone" className="text-right">
              Téléphone
            </Label>
            <Input
              id="edit-phone"
              type="tel"
              value={user.phone || ''}
              onChange={(e) => onUserChange({...user, phone: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-email" className="text-right">
              Email
            </Label>
            <Input
              id="edit-email"
              type="email"
              value={user.email || ''}
              onChange={(e) => onUserChange({...user, email: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-role" className="text-right">
              Rôle
            </Label>
            <Select
              value={user.role}
              onValueChange={(value: UserRole) => onUserChange({...user, role: value})}
              disabled={user.id === 'admin-default'}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="manager">Gestionnaire</SelectItem>
                <SelectItem value="user">Utilisateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleEditUser} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
