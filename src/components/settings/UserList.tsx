
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Users, UserMinus, UserCog, Phone, Mail, Briefcase, Car } from 'lucide-react';
import { UserRole, User as UserType } from '@/types/models';
import AddUserDialog from './AddUserDialog';
import EditUserDialog from './EditUserDialog';

interface UserListProps {
  isAdmin: boolean;
}

const UserList = ({ isAdmin }: UserListProps) => {
  const { settings, deleteUser } = useApp();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const handleDeleteUser = (user: UserType) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.name || user.username} ?`)) {
      deleteUser(user.id);
    }
  };

  const openEditDialog = (user: UserType) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  };

  const getRoleName = (role: UserRole): string => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'manager': return 'Gestionnaire';
      case 'user': return 'Utilisateur';
      default: return 'Inconnu';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Gérez les utilisateurs et leurs prérogatives
          </CardDescription>
        </div>
        {isAdmin && (
          <AddUserDialog 
            isOpen={isAddUserDialogOpen} 
            onOpenChange={setIsAddUserDialogOpen} 
          />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {settings.users && settings.users.length > 0 ? (
            <div className="grid gap-4">
              {settings.users.map((user) => (
                <div key={user.id} className="flex flex-col p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name || user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {getRoleName(user.role)}
                      </span>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditDialog(user)}
                            title="Modifier"
                          >
                            <UserCog className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteUser(user)}
                            title="Supprimer"
                            disabled={user.id === 'admin-default'}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {user.position && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        <span>Poste: {user.position}</span>
                      </div>
                    )}
                    {user.drivingLicense && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Car className="h-4 w-4" />
                        <span>Permis: {user.drivingLicense}</span>
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Users className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {selectedUser && (
        <EditUserDialog
          user={selectedUser}
          isOpen={isEditUserDialogOpen}
          onOpenChange={setIsEditUserDialogOpen}
          onUserChange={setSelectedUser}
        />
      )}
    </Card>
  );
};

export default UserList;
