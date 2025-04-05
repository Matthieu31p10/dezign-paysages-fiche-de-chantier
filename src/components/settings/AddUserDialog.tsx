import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { UserRole } from '@/types/models';
import { toast } from 'sonner';

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddUserDialog = ({ isOpen, onOpenChange }: AddUserDialogProps) => {
  const { addUser } = useApp();
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'user' as UserRole,
    name: '',
    email: '',
    phone: '',
    position: '',
    drivingLicense: '',
  });

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password) {
      toast.error('Identifiant et mot de passe sont requis');
      return;
    }

    addUser(newUser);
    onOpenChange(false);
    setNewUser({
      username: '',
      password: '',
      role: 'user',
      name: '',
      email: '',
      phone: '',
      position: '',
      drivingLicense: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="ml-auto">
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
          <DialogDescription>
            Créez un nouvel utilisateur et définissez ses accès
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-username" className="text-right">
              Identifiant
            </Label>
            <Input
              id="new-username"
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-password" className="text-right">
              Mot de passe
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-name" className="text-right">
              Nom & Prénom
            </Label>
            <Input
              id="new-name"
              value={newUser.name || ''}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-position" className="text-right">
              Poste
            </Label>
            <Input
              id="new-position"
              value={newUser.position || ''}
              onChange={(e) => setNewUser({...newUser, position: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-license" className="text-right">
              Permis
            </Label>
            <Input
              id="new-license"
              value={newUser.drivingLicense || ''}
              onChange={(e) => setNewUser({...newUser, drivingLicense: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-phone" className="text-right">
              Téléphone
            </Label>
            <Input
              id="new-phone"
              type="tel"
              value={newUser.phone || ''}
              onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-email" className="text-right">
              Email
            </Label>
            <Input
              id="new-email"
              type="email"
              value={newUser.email || ''}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-role" className="text-right">
              Rôle
            </Label>
            <Select
              value={newUser.role}
              onValueChange={(value: UserRole) => setNewUser({...newUser, role: value})}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleAddUser}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
