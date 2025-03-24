
import { useApp } from '@/context/AppContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, UserRole } from '@/types/models';

interface EditUserDialogProps {
  user: User;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserChange: (user: User) => void;
}

const EditUserDialog = ({ user, isOpen, onOpenChange, onUserChange }: EditUserDialogProps) => {
  const { updateUser } = useApp();

  const handleEditUser = () => {
    updateUser(user);
    onOpenChange(false);
    onUserChange(null as any);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier un utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations et les prérogatives de l'utilisateur
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
              Nom
            </Label>
            <Input
              id="edit-name"
              value={user.name || ''}
              onChange={(e) => onUserChange({...user, name: e.target.value})}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleEditUser}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
