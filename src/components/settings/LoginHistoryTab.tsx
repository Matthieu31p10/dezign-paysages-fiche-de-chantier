import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLoginHistory } from '@/hooks/useLoginHistory';
import { History, Trash2, Search, Calendar, User, Clock, Monitor } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const LoginHistoryTab: React.FC = () => {
  const { loginHistory, isLoading, clearHistory, refetch } = useLoginHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'login_time' | 'user_name' | 'user_email'>('login_time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedHistory = React.useMemo(() => {
    let filtered = loginHistory.filter(record =>
      record.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.user_email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (sortBy === 'login_time') {
        const aTime = new Date(aVal).getTime();
        const bTime = new Date(bVal).getTime();
        return sortOrder === 'desc' ? bTime - aTime : aTime - bTime;
      }
      
      const comparison = aVal.localeCompare(bVal);
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [loginHistory, searchTerm, sortBy, sortOrder]);

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      toast.success('Historique des connexions supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'historique');
    }
  };

  const formatLoginTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'PPp', { locale: fr });
  };

  const getBrowserInfo = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Autre';
  };

  const getOSInfo = (userAgent: string) => {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'Mac';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Autre';
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
        <CardTitle className="flex items-center text-blue-800">
          <History className="h-5 w-5 mr-2 text-blue-600" />
          Historique des connexions
        </CardTitle>
        <CardDescription>
          Consultez l'historique des connexions des utilisateurs avec options de tri et de recherche
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="login_time">Date</SelectItem>
                  <SelectItem value="user_name">Nom</SelectItem>
                  <SelectItem value="user_email">Email</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Décroissant</SelectItem>
                  <SelectItem value="asc">Croissant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={refetch} disabled={isLoading}>
              Actualiser
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={loginHistory.length === 0}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vider l'historique
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer tout l'historique des connexions ? 
                    Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearHistory} className="bg-destructive text-destructive-foreground">
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total connexions</p>
                <p className="text-2xl font-bold text-blue-800">{loginHistory.length}</p>
              </div>
              <History className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Utilisateurs uniques</p>
                <p className="text-2xl font-bold text-green-800">
                  {new Set(loginHistory.map(r => r.user_id)).size}
                </p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Dernière connexion</p>
                <p className="text-sm font-semibold text-purple-800">
                  {loginHistory.length > 0 
                    ? format(new Date(loginHistory[0].login_time), 'PPp', { locale: fr })
                    : 'Aucune'
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="border rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Chargement...</div>
          ) : filteredAndSortedHistory.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'Aucun résultat trouvé' : 'Aucune connexion enregistrée'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date et heure
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Système
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {record.user_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.user_email}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {formatLoginTime(record.login_time)}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-gray-400" />
                            <Badge variant="outline" className="text-xs">
                              {getBrowserInfo(record.user_agent)}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {getOSInfo(record.user_agent)}
                            </Badge>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {filteredAndSortedHistory.length > 0 && (
          <div className="text-sm text-gray-500 text-center">
            {filteredAndSortedHistory.length} connexion(s) affichée(s)
            {searchTerm && ` sur ${loginHistory.length} au total`}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginHistoryTab;