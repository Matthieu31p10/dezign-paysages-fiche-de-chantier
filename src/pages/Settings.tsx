
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image, Upload, X, UserPlus, User, Users, UserMinus, Lock, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { User as UserType, UserRole } from '@/types/models';

const Settings = () => {
  const { settings, updateSettings, auth, addUser, updateUser, deleteUser, canUserAccess } = useApp();
  const [logoPreview, setLogoPreview] = useState<string | undefined>(settings.companyLogo);
  
  // User management state
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<Omit<UserType, 'id' | 'createdAt'>>({
    username: '',
    password: '',
    role: 'user',
    name: '',
    email: '',
  });
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Le logo ne doit pas dépasser 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    updateSettings({
      companyLogo: logoPreview
    });
    toast.success('Logo enregistré avec succès');
  };

  const handleRemoveLogo = () => {
    setLogoPreview(undefined);
    updateSettings({
      companyLogo: undefined
    });
    toast.success('Logo supprimé');
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password) {
      toast.error('Identifiant et mot de passe sont requis');
      return;
    }

    const result = addUser(newUser);
    if (result) {
      setIsAddUserDialogOpen(false);
      setNewUser({
        username: '',
        password: '',
        role: 'user',
        name: '',
        email: '',
      });
    }
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    updateUser(selectedUser);
    setIsEditUserDialogOpen(false);
    setSelectedUser(null);
  };

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

  const isAdmin = canUserAccess('admin');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres de votre application
        </p>
      </div>
      
      <Tabs defaultValue="logo" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="users" disabled={!isAdmin}>Utilisateurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logo" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Logo de l'entreprise</CardTitle>
              <CardDescription>
                Ajoutez votre logo d'entreprise pour l'afficher sur les documents et rapports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                {logoPreview ? (
                  <div className="relative w-64 h-64 border rounded-lg overflow-hidden flex items-center justify-center p-4">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={handleRemoveLogo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <img 
                      src={logoPreview} 
                      alt="Logo de l'entreprise" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-64 h-64 border rounded-lg flex flex-col items-center justify-center gap-4 bg-muted/30">
                    <Image className="h-16 w-16 text-muted-foreground" />
                    <p className="text-muted-foreground text-center px-6">
                      Aucun logo n'a été téléchargé. Veuillez ajouter votre logo d'entreprise.
                    </p>
                  </div>
                )}
                
                <div className="space-y-2 w-full max-w-md">
                  <Label htmlFor="logo">Télécharger un logo</Label>
                  <div className="flex gap-2">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="cursor-pointer"
                    />
                    <Button 
                      onClick={handleSaveSettings} 
                      disabled={logoPreview === settings.companyLogo}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Formats supportés: PNG, JPG, GIF. Taille maximale: 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>
                  Gérez les utilisateurs et leurs prérogatives
                </CardDescription>
              </div>
              {isAdmin && (
                <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
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
                          Nom
                        </Label>
                        <Input
                          id="new-name"
                          value={newUser.name || ''}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
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
                      <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleAddUser}>Ajouter</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.users && settings.users.length > 0 ? (
                  <div className="grid gap-4">
                    {settings.users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-md">
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
          </Card>
          
          {/* Edit User Dialog */}
          <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier un utilisateur</DialogTitle>
                <DialogDescription>
                  Modifiez les informations et les prérogatives de l'utilisateur
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-username" className="text-right">
                      Identifiant
                    </Label>
                    <Input
                      id="edit-username"
                      value={selectedUser.username}
                      onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
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
                      value={selectedUser.password}
                      onChange={(e) => setSelectedUser({...selectedUser, password: e.target.value})}
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
                      value={selectedUser.name || ''}
                      onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
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
                      value={selectedUser.email || ''}
                      onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-role" className="text-right">
                      Rôle
                    </Label>
                    <Select
                      value={selectedUser.role}
                      onValueChange={(value: UserRole) => setSelectedUser({...selectedUser, role: value})}
                      disabled={selectedUser.id === 'admin-default'}
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
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleEditUser}>Enregistrer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
